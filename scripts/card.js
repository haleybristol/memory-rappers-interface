import React from 'react'

const Card = ({ rapper, onClick, cardKey, checked, matched }) => (
  <input
    onClick={f => (matched ? f : onClick(cardKey))}
    type="checkbox"
    id={rapper}
    checked={matched ? true : checked}
  />
)

export default Card
