import Note from './components/Note';

const App = ({ notes }) => {
  return (
    <>
      <h1>Notes</h1>
      <ul>
        {notes.map(({content, id}) => <Note key={id} text={content} />)}
      </ul>
    </>
  );
};

export default App;