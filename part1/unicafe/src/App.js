import { useState } from 'react'

const Button = ({onClick, text}) => <button onClick={onClick}>{text}</button>;

const Statistics = ({good, bad, neutral}) => {
  let all = good + neutral + bad;
  if (all > 0) {
    let average = (good - bad) / all;
    let positive = (good / all) * 100;
    return (
      <>
        <h2>Statistics</h2>
        <table>
          <tbody>
            <StatisticLine text='Good' value={good} />
            <StatisticLine text='Neutral' value={neutral} />
            <StatisticLine text='Bad' value={bad}/>
            <StatisticLine text='All' value={all}/>
            <StatisticLine text='Average' value={average}/>
            <StatisticLine text='Positive' value={String(positive) + ' %'}/>
          </tbody>
        </table>
      </>
    );
  } else {
    return (<p>No feedback given</p>);
  }
};

const StatisticLine = ({text, value}) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  );
};

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const setToValue = (setState, newValue) => () => setState(newValue);

  return (
    <>
      <h1>Give Feedback</h1>
      <Button onClick={setToValue(setGood, good + 1)} text='good' />
      <Button onClick={setToValue(setNeutral, neutral + 1)} text='neutral' />
      <Button onClick={setToValue(setBad, bad + 1)} text='bad' />
      <Statistics good={good} neutral={neutral}  bad={bad}/>
    </>
  )
}

export default App

