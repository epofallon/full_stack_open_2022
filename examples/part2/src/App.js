import { useState, useEffect } from 'react';
import noteService from './services/notes';
import Note from './components/Note';

const Notification = ({message}) => {
  if (message === null) return null;

  return (
    <div className='error'>
      {message}
    </div>
  );
};

const Footer = () => {
  const footerStyle = {
    color: '#49562A',
    fontStyle: 'italic',
    fontSize: 16,
  };

  return (
    <div style={footerStyle}>
      <br />
      Notes App by Gene
    </div>
  )
}

const App = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('a new note...');
  const [showAll, setShowAll] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    noteService.getAll().then(notes => setNotes(notes));
  }, []);
  
  const notesToShow = showAll ? notes : notes.filter(note => note.important);

  const addNote = (event) => {
    event.preventDefault();
    const noteObj = {
      content: newNote,
      date: new Date().toISOString(),
      important: Math.random() < 0.5,
    };

    noteService.create(noteObj).then(data => {
      setNotes(notes.concat(data));
      setNewNote('')
    });
  };

  const handleNoteChange = (event) => setNewNote(event.target.value);

  const toggleImportance = id => {
    const note = notes.find(note => note.id === id);
    const changedNote = { ...note, important: !note.important };

    noteService
      .update(id, changedNote)
      .then(updatedNote => {
        setNotes(notes.map(note => note.id !== id ? note : updatedNote));
      })
      .catch(error => {
        setErrorMessage(`'${note.content}' wasn't found on the server.`);
        setTimeout(() => setErrorMessage(null), 5000);
        setNotes(notes.filter(note => note.id !== id));
      });
  }
  
  return (
    <>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      <button onClick={() => setShowAll(!showAll)}>
        {showAll ? 'important' : 'all'}
      </button>
      <ul>
        {notesToShow.map((note) => 
          <Note
            key={note.id}
            note={note}
            toggleImportance={() => toggleImportance(note.id)}
          />
        )}
      </ul>
      <form onSubmit={addNote}>
        <input onChange={handleNoteChange} value={newNote} />
        <button type='submit'>save</button>
      </form>
      <Footer />
    </>
  );
};

export default App;