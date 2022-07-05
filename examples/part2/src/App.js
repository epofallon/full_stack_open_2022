const App = (props) => {
  const { notes } = props;

  return (
    <>
      <h1>Notes</h1>
      <ul>
        {notes.map(({content, id}) => <li key={id}>{content}</li>)}
      </ul>
    </>
  );
};

export default App;