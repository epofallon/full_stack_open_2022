const express = require('express');
const morgan = require('morgan');
const app = express();

app.use(express.json());

morgan.token('json', (req) => {
  return req.method === 'POST' ? JSON.stringify(req.body) : '';
});

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :json'));

let persons = [
  { id: 1, name: "John Piper", number: "040-123-4565" },
  { id: 2, name: "David Platt", number: "394-453-2352" },
  { id: 3, name: "Tim Keller", number: "124-323-4345" },
  { id: 4, name: "Brad Andrews", number: "392-364-2312" },
];

app.get('/info', (req, res) => {
  res.send(`<p>Phonebook has info for ${persons.length} people.</p>
  <p>${new Date()}</p>`);
});

app.get('/api/persons', (req, res) => {
  res.json(persons);
});

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  let person = persons.find(person => person.id === id);
  person ? res.json(person) : res.status(404).end();
});

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter(person => person.id !== id);
  res.status(204).end();
});

const generateId = (() => {
  const ids = persons.map(({id}) => id);

  return () => {
    let id = 0;
    while (ids.includes(id) || id === 0) {
      id = Math.floor(Math.random() * 1000 + 1);
    }
    ids.push(id);
    return id;
  };
})();

const nameExists = name => {
  return persons.some(person => {
    return person.name.toLowerCase() === name.toLowerCase()
  });
};

app.post('/api/persons', (req, res) => {
  const body = req.body;
  
  if (!body.name || !body.number) {
    return res.status(400).json({ error: 'name or number missing' });
  } else if (nameExists(body.name)) {
    return res.status(422).json({ error: 'name must be unique' });
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  };

  persons = persons.concat(person);
  res.json(person);
});

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' });
};

app.use(unknownEndpoint);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});