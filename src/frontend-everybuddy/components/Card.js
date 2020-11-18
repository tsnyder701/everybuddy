import React, { useState, useEffect } from "react";
import { useSpring, animated as a } from "react-spring";

function imgName(cardId) {
    return "cards/front%20"+("00"+cardId).substr(-2,2)+".png"
}

function Card({
    id,
    game,
    shown,
    setShown,
    selectedCount,
    setSelectedCount,
    selectedIndexes,
    setSelectedIndexes,
    flippedIndexes,
    setFlippedIndexes,
    topOfDeck,
    setTopOfDeck,
}) {
    const [selected, setSelect] = useState(false)
    const [flipped, setFlip] = useState(false)
    const {transform, opacity} = useSpring({
        opacity: flipped ? 0 : 1,
        transform: `perspective(600px) rotateX(${flipped ? 0 : 180}deg) scale(${selected ? 1.2 : 1}) `,
        config: {mass: 5, tension: 500, friction: 80},
    })

    useEffect(() => {
        if (selectedIndexes[3] === true && selectedIndexes.indexOf(id) > -1) {
            setTimeout(() => {
                setSelect(state => !state)
                setSelectedCount(0)
                setSelectedIndexes([])
            }, 1000)
        } else if (selectedIndexes[3] === false && selectedIndexes.indexOf(id) > -1) {
            setFlip(flip => !flip)
            setSelectedCount(0)
            setSelectedIndexes([])
            setTimeout(() => {
                if (topOfDeck < 63) {
                    let sii = selectedIndexes.indexOf(id)
                    console.log(`TOD @ ${sii}: ` + topOfDeck)
                    shown[id].cardId = game[topOfDeck+sii].cardId
                    setShown(shown)
                    if (sii == 0) {
                        setTopOfDeck(topOfDeck + 3)
                    }
                    setFlip(flip => !flip)
                    setSelect(state => !state)
                } else {
                    setSelect(state => !state)
                }
            }, 1000)
        }
    }, [selectedIndexes])
    
    const onCardClick = () => {
        if (!flipped && selectedCount < 3) {
            if (!shown[id].selected) {
                setSelect(state => !state)
                setSelectedCount(selectedCount + 1)
                const newIndexes = [...selectedIndexes]
                newIndexes.push(id)
                setSelectedIndexes(newIndexes)
            } else {
                let idx = selectedIndexes.indexOf(id)
                setSelect(state => !state)
                setSelectedCount(selectedCount - 1)
                const newIndexes = selectedIndexes.filter(i => i != idx)
                setSelectedIndexes(newIndexes)
            }
        }
    }

  return (
    <div onClick={onCardClick}>
      <a.div
        className="c back"
        style={{
          opacity: opacity.interpolate(o => 1 - o),
          transform,
        }}
      />
      <a.div
        className="c front"
        style={{
            opacity,
            transform: transform.interpolate(t => `${t} rotateX(180deg)`),
            "backgroundImage": "url(" + imgName(shown[id].cardId, true) + ")",
        }}
          />
    </div>
  )
}

export default Card;
