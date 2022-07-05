const Header = (props) => {
  return (
    <h2>{props.course}</h2>
  )
};

const Content = ({ parts }) => {
  return (
    parts.map(({ id, name, exercises }) => {
      return <Part key={id} part={name} exercises={exercises} />
    })
  );
};

const Part = (props) => {
  return (
    <p>{props.part} {props.exercises}</p>
  );
};

const Total = (props) => {
  let sum = props.exercises.reduce((sum, {exercises: num}) => sum + num, 0);
  return (
    <p><strong>Total of {sum} exercises</strong></p>
  );
};

const Course = ({ course }) => {
  return (
    <>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total exercises={course.parts}/>
    </>
  );
};

export default Course;