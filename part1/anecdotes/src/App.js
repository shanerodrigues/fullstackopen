import React, { useState } from "react"
import "./App.css"

const MostVoted = ({ arr, quotes }) => {
  let maxQuoteVotes = arr[0]
  let quotePos = 0
  let i = 0
  for (i = 0; i < arr.length - 1; i++) {
    if (arr[i] > maxQuoteVotes) {
      maxQuoteVotes = arr[i]
      quotePos = i
    }
  }
  return (
    <div className="mostVoted">
      <div>{quotes[parseInt(quotePos)]}</div>
      <div>has {maxQuoteVotes} votes</div>
    </div>
  )
}

const App = () => {
  const anecdotes = [
    "If it hurts, do it more often",
    "Adding manpower to a late software project makes it later!",
    "The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    "Premature optimization is the root of all evil.",
    "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
    "Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients",
  ]

  const [selected, setSelected] = useState(0)
  const [random, setRandom] = useState(0)
  // const points = [0, 0, 0, 0, 0, 0, 0]
  const [points, setPoints] = useState(new Array(anecdotes.length).fill(0))
  const copy = [...points]

  const changeQuote = () => {
    const rndom = Math.floor(Math.random() * anecdotes.length)
    setRandom(rndom)
    setSelected(random)
  }

  const upvote = () => {
    copy[selected] += 1
    setPoints(copy)
  }

  return (
    <div className="container">
      <div>
        <h1>Anecdote of the day</h1>
        {anecdotes[selected]}
        <div>has {points[selected]} votes</div>
        <div className="btns">
          <button onClick={upvote}>vote</button>
          <button onClick={changeQuote}>next anecdote</button>
        </div>
      </div>
      <div>
        <h1>Anecdote with most votes</h1>
        <MostVoted arr={copy} quotes={anecdotes} />
      </div>
    </div>
  )
}

export default App
