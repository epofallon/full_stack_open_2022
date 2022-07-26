import { useState, useEffect, useRef } from 'react';
import noteService from './services/notes';
import Note from './components/Note';
import loginService from './services/login';
import LoginForm from './components/LoginForm';
import NoteForm from './components/NoteForm';
import Togglable from './components/Togglable';

const Notification = ({ message }) => {
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
  );
};

const App = () => {
  const [notes, setNotes] = useState([]);
  const [showAll, setShowAll] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    noteService.getAll().then(notes => setNotes(notes));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      noteService.setToken(user.token);
    }
  }, []);

  const notesToShow = showAll ? notes : notes.filter(note => note.important);

  const addNote = async (noteObj) => {
    noteFormRef.current.toggleVisibility();
    let returnedNote = await noteService.create(noteObj);
    setNotes(notes.concat(returnedNote));
  };

  const toggleImportance = id => {
    const note = notes.find(note => note.id === id);
    const changedNote = { ...note, important: !note.important };

    noteService
      .update(id, changedNote)
      .then(updatedNote => {
        setNotes(notes.map(note => note.id !== id ? note : updatedNote));
      })
      .catch(() => {
        setErrorMessage(`'${note.content}' wasn't found on the server.`);
        setTimeout(() => setErrorMessage(null), 5000);
        setNotes(notes.filter(note => note.id !== id));
      });
  };

  const handleLogin = async (loginObj) => {
    try {
      const user = await loginService.login(loginObj);
      window.localStorage.setItem(
        'loggedNoteappUser', JSON.stringify(user)
      );
      noteService.setToken(user.token);
      setUser(user);
    } catch (exception) {
      setErrorMessage('Wrong credentials');
      setTimeout(() => setErrorMessage(null), 5000);
    }
  };

  const loginForm = () => (
    <Togglable buttonLabel='log in'>
      <LoginForm handleLogin={handleLogin} />
    </Togglable>
  );

  const noteFormRef = useRef();

  const noteForm = () => (
    <Togglable buttonLabel='new note' ref={noteFormRef}>
      <NoteForm createNote={addNote} />
    </Togglable>
  );

  return (
    <>
      <h1>Notes</h1>
      <Notification message={errorMessage} />

      {user === null
        ? loginForm() :
        <div>
          <p>{user.name} logged in</p>
          {noteForm()}
        </div>
      }

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

      <Footer />
    </>
  );
};

export default App;