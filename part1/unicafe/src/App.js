import React, { useState } from "react";

//Button component
const Button = (props) => (
  <button onClick={props.handleClick}>{props.name}</button>
);

const StatisticLine = (props) => {
  return (
    <td>
      {props.text} {props.value}
    </td>
  );
};

const Statistics = ({ good, bad, neutral, all, average, positive }) => {
  if (all < 1) {
    return <div>No feedback given</div>;
  }
  return (
    <table>
      <tbody>
        <tr>
          <StatisticLine text="good" value={good} />
        </tr>
        <tr>
          <StatisticLine text="neutral" value={neutral} />
        </tr>
        <tr>
          <StatisticLine text="bad" value={bad} />
        </tr>
        <tr>
          <StatisticLine text="all" value={all} />
        </tr>
        <tr>
          <StatisticLine text="average" value={average} />
        </tr>
        <tr>
          <StatisticLine text="positive" value={positive} />
        </tr>
      </tbody>
    </table>
  );
};

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);
  const [allScores, setAll] = useState(0);

  const handleGood = () => {
    setAll(allScores + 1);
    setGood(good + 1);
  };
  const handleNeutral = () => {
    setAll(allScores + 1);
    setNeutral(neutral + 1);
  };
  const handleBad = () => {
    setAll(allScores + 1);
    setBad(bad + 1);
  };

  const average = (good - bad) / allScores;
  const positive = (good / allScores) * 100 + "%";

  return (
    <div>
      <h1>give feedback</h1>
      <Button name="good" handleClick={handleGood} />
      <Button name="neutral" handleClick={handleNeutral} />
      <Button name="bad" handleClick={handleBad} />

      <div>
        <h1>statistics</h1>
        <Statistics
          good={good}
          bad={bad}
          neutral={neutral}
          all={allScores}
          average={average}
          positive={positive}
        />
      </div>
    </div>
  );
};

export default App;
