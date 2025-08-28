import React, { useState } from 'react'
import Navbar from '../components/Navbar.jsx'
import { useCards } from './useCards.js'

export default function ManageCards() {
  const [cards, setCards] = useState([
    { id: 1, type: 'Debit Card', number: '1234567812345678', blocked: false },
    { id: 2, type: 'Credit Card', number: '9876543210987654', blocked: true },
  ])

  const toggleBlock = (id) => {
    setCards(cards.map(c => c.id === id ? { ...c, blocked: !c.blocked } : c))
  }

  return (
    <>
      <Navbar />
      <div className="container">
        <h2>Manage Cards</h2>
        <div className="cards-section">
          {cards.map(card => (
            <div key={card.id} className="card-box">
              {/* Card image */}
              <div className="card-image">
                <img src="../icons/cards.png" alt="Card" />
              </div>

              {/* Card details */}
              <div className="card-details">
                <div className="card-header">
                  <h4 className="card-title">{card.type === "Debit Card" ? "NovaCard Visa" : "NovaCard Credit"}</h4>
                  <label className="switch">
                    <input 
                      type="checkbox" 
                      checked={!card.blocked} 
                      onChange={() => toggleBlock(card.id)} 
                    />
                    <span className="slider"></span>
                  </label>
                </div>
                <p className="card-type">{card.type}</p>
                <p className="card-number">**** **** **** {card.number.slice(-4)}</p>
                <p className="card-expiry">Expiry: 12/28</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
