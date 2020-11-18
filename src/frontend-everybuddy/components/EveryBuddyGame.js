import React, { useState, useEffect } from "react";
import { useSpring, animated as a } from "react-spring";
import Card from "./Card.js";

function EveryBuddyGame({options, setOptions, highScore, setHighScore}) {
    const [game, setGame] = useState([])
    const [selectedCount, setSelectedCount] = useState(0)
    const [selectedIndexes, setSelectedIndexes] = useState([])
    const [shown, setShown] = useState([])
    const [topOfDeck, setTopOfDeck] = useState(0)
    const [score, setScore] = useState(0)
    
    let cardIds = [];
    for (let i = 1; i <= 63; i++) {
        cardIds.push(i);
    }

    useEffect(() => {
        const newGame = []
        for (let i = 1; i < 64; i++) {
            const c = {
                cardId: i,
                selected: false,
            }
            newGame.push(c)
        }

        const shuffledGame = newGame.sort(() => Math.random() - 0.5)
        setGame(shuffledGame)
        setShown(shuffledGame.slice(0, 5*options))
        setTopOfDeck(5*options)
  }, [])

  useEffect(() => {
      if (score > highScore) {
          setHighScore(score)
      }
  }, [game])

    if (selectedIndexes.length === 3) {
        const match = ((game[selectedIndexes[0]].cardId ^ game[selectedIndexes[1]].cardId ^ game[selectedIndexes[2]].cardId) === 0)
        
        if (match) {
            setScore(x => x + 1)
            const newGame = [...game]
            newGame[selectedIndexes[0]].selected = true
            newGame[selectedIndexes[1]].selected = true
            setGame(newGame)

            const newIndexes = [...selectedIndexes]
            newIndexes.push(false)
            setSelectedIndexes(newIndexes)
        } else {
            const newIndexes = [...selectedIndexes]
            newIndexes.push(true)
            setSelectedIndexes(newIndexes)
        }
    }

  if (game.length === 0) return <div>loading...</div>
  else {
    return (
            <div id="game">
              <h1>Score: {score}</h1>
            <div id="cards">
              {shown.map((card, index) => (
                      <div className="card" key={index}>
                      <Card
                  id={index}
                  cardId={card.cardId}
                  game={game}
                  shown={shown}
                  setShown={setShown}
                  selectedCount={selectedCount}
                  setSelectedCount={setSelectedCount}
                  selectedIndexes={selectedIndexes}
                  setSelectedIndexes={setSelectedIndexes}
                  topOfDeck={topOfDeck}
                  setTopOfDeck={setTopOfDeck}
                      />
                      </div>
              ))}
            </div>
        </div>
    )
  }
}

export default EveryBuddyGame;
