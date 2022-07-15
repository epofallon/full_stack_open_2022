import { useState, useEffect } from 'react';
import personServices from './services/persons';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState(null);
  const [messageClass, setMessageClass] = useState('');
  
  const handleNameChange = event => setNewName(event.target.value);
  const handleNumberChange = event => setNewNumber(event.target.value);
  const handleSearch = event => setSearchTerm(event.target.value.toLowerCase());

  useEffect(() => {
    personServices.getAll().then(data => setPersons(data));
  }, []);

  const addName = event => {
    event.preventDefault();
    if (uniqueName(newName)) {
      let newPerson = { name: newName, number: newNumber };
      personServices.create(newPerson).then(data => {
        setPersons(persons.concat(data));
        setMessage(`Added ${data.name}`);
        setMessageClass('success');
        resetMessage();
      })
      .catch(error => {
        setMessage(error.response.data.error);
        setMessageClass('error');
        resetMessage();
      });
      
    } else {
      let message = `${newName} is in your phonebook. Replace their number?`;
      let goAhead = window.confirm(message);
      if (goAhead) updatePerson();
    }
    setNewName('');
    setNewNumber('');
  };

  const resetMessage = () => {
    setTimeout(() => {
      setMessage(null);
      setMessageClass('');
    }, 3000);
  }

  const updatePerson = () => {
    let person = persons.find(({name}) => name === newName);
    let updated = { ...person, number: newNumber };
    personServices.update(updated.id, updated).then(data => {
      setPersons(persons.map(p => p.id !== data.id ? p : data));
      setMessage(`Updated ${data.name}`);
      setMessageClass('success');
      resetMessage();
    }).catch(error => {
      if (error.name === 'TypeError') {
        setPersons(persons.filter(p => p.id !== person.id));
        setMessage(`${person.name}'s info wasn't found on the server.`);
        setMessageClass('error');
        resetMessage();
      } else {
        setMessage(error.response.data.error);
        setMessageClass('error');
        resetMessage();
      }
    });
    
  }

  const deletePerson = id => {
    let person = persons.find(person => person.id === id);
    let goAhead = window.confirm(`Delete ${person.name}?`);
    if (goAhead) {
      personServices.deletePerson(id);
      setPersons(persons.filter(person => person.id !== id));
    }
  }
  
  const uniqueName = newName => !persons.some(({name}) => name === newName);

  const filterPeople = (people, search) => {
    return people.filter(({name}) => name.toLowerCase().includes(search));
  };

  return (
    <>
      <h1>Phonebook</h1>
      <Notification message={message} className={messageClass}/>
      <Search value={searchTerm} handler={handleSearch} />
      <h2>Add new Contact</h2>
      <NewContact addName={addName} newName={newName} handleName={handleNameChange} newNum={newNumber} handleNum={handleNumberChange} />
      <h2>Numbers</h2>
      <ContactList persons={filterPeople(persons, searchTerm)}
        handleDelete={deletePerson} />
    </>
  );
};

const Search = ({value, handler}) => {
  return <div>filter shown with <input value={value} onChange={handler}/></div>
};

const NewContact = props => {
  return (
    <form onSubmit={props.addName}>
      <div>
        name: <input value={props.newName} onChange={props.handleName} />
      </div>
      <div>
        number: <input value={props.newNum} onChange={props.handleNum} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

const ContactList = ({persons, handleDelete }) => {
  return persons.map((person) => {
    return (
      <Contact key={person.id} person={person} handleDelete={handleDelete}/>
    );
  });
}

const Contact = ({person: {name, number, id}, handleDelete}) => {
  return (
    <p>
      {name} {number} 
      <button onClick={() => handleDelete(id)}>delete</button>
    </p>
  );
};

const Notification = ({message, className}) => {
  if (message === null) return null;

  return (
    <div className={className}>
      {message}
    </div>
  );
};

export default App;