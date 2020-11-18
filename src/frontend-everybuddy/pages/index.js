import React, { useState, useEffect } from "react";
import { useSpring, animated as a } from "react-spring";
import EveryBuddyGame from "../components/EveryBuddyGame";

export default function App() {
  const [options, setOptions] = useState(null)
  const [highScore, setHighScore] = useState(0)

  useEffect(() => {
    // Loads when the game starts
  }, [])

  return (
    <div>
      <div className="container">
        <h1>EveryBuddy</h1>
        <div>High Score: {highScore}</div>
        <div>
          {options === null ? (
            <>
              <button onClick={() => setOptions(5)}>Easy</button>
              <button onClick={() => setOptions(4)}>Medium</button>
              <button onClick={() => setOptions(3)}>Hard</button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  const prevOptions = options
                  setOptions(null)
                  setTimeout(() => {
                    setOptions(prevOptions)
                  }, 5)
                }}
              >
                Start Over
              </button>
              <button onClick={() => setOptions(null)}>Main Menu</button>
            </>
          )}
        </div>
      </div>

      {options ? (
        <EveryBuddyGame
          options={options}
          setOptions={setOptions}
          highScore={highScore}
          setHighScore={setHighScore}
        />
      ) : (
        <h2>Choose a difficulty to begin!</h2>
      )}
          <style jsx global>
  {`
    body {
      text-align: center;
      font-family: -apple-system, sans-serif;
    }
    .container {
      width: 1060px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    button {
      background: #00ad9f;
      border-radius: 4px;
      font-weight: 700;
      color: #fff;
      border: none;
      padding: 7px 15px;
      margin-left: 8px;
      cursor: pointer;
    }
    button:hover {
      background: #008378;
    }
    button:focus {
      outline: 0;
    }
    #cards {
      width: ${175+195*(options-1)}px;
      margin: 0 auto;
      display: flex;
      flex-wrap: wrap;
    }
    .card {
      width: 175px;
      height: 125px;
      margin-bottom: 20px;
    }
    .card:not(:nth-child(${options}n)) {
      margin-right: 20px;
    }

    .c {
      position: absolute;
      max-width: 175px;
      max-height: 125px;
      width: 50ch;
      height: 50ch;
      cursor: pointer;
      border-radius: 12px;
      box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
      will-change: transform, opacity;
    }

    .front,
    .back {
      background-size: cover;
    }

    .back {
      background-image: url(cards/back.png);
    }

    .front {
      background-image: url(cards/front%2001.png);
      background-color: white;
    }
  `}
      </style>
          </div>
  )
}
