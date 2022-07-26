import { useState } from 'react';

// const History = ({allClicks}) => {
//   if (allClicks.length === 0) {
//     return (<p>The app is used by pressing the buttons.</p>);
//   } else {
//     return (<p>Button press history: {allClicks.join(' ')}</p>);
//   }
// };

// const Display = ({value}) => <>{value}</>;

// const Button = ({onClick, text}) => <button onClick={onClick}>{text}</button>;

const useCounter = () => {
  const [value, setValue] = useState(0);

  const increase = () => setValue(value + 1);
  const decrease = () => setValue(value - 1);
  const zero = () => setValue(0);

  return { value, increase, decrease, zero };
};

const App = () => {
  // const [left, setLeft] = useState(0);
  // const [right, setRight] = useState(0);
  // const [allClicks, setAll] = useState([]);

  // const incrementOnClick = (value, setValue, type) => {
  //   return () => {
  //     setAll(allClicks.concat(type));
  //     setValue(value + 1);
  //   };
  // };

  // return (
  //   <>
  //     {left}
  //     <Button onClick={incrementOnClick(left, setLeft, 'L')} text='left' />
  //     <Button onClick={incrementOnClick(right, setRight, 'R')} text='right' />
  //     {right}
  //     <History allClicks={allClicks} />
  //   </>
  // );
  // const [value, setValue] = useState(10)
  
  // const setToValue = (newValue) => () => setValue(newValue);

  const counter = useCounter();
  
  return (
    <div>
      <div>{counter.value}</div>
      <button onClick={counter.increase}>plus</button>
      <button onClick={counter.decrease}>minus</button>      
      <button onClick={counter.zero}>zero</button>
    </div>
    // <div>
    //   <Display value={value} />
    //   <Button onClick={setToValue(1000)} text='thousand' />
    //   <Button onClick={setToValue(0)} text='reset' />
    //   <Button onClick={setToValue(value + 1)} text='increment' />
    // </div>
  )
};

export default App