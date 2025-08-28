import React from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import { auth, account } from '../state/store.js'
import { formatINR, shortDateTime } from '../utils/format.js'
import { useCards } from './useCards.js'
import creditImg from '../icons/credit-card.png'
import debitImg from '../icons/debit-card.png'
import SpendingChart from './SpendingChart.jsx'
import RecurringBox from './RecurringBox.jsx'

export default function Dashboard() {
  const me = auth.me()
  const navigate = useNavigate()
  React.useEffect(() => { if (!me) navigate('/') }, [me])

  const recent = account.recent(5)
  const balance = account.balance()

  // 👇 useCards() instead of account.cards()
  const { cards, toggleBlock, updateLimit } = useCards()

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'start' }}>

          {/* Left Side */}
          <div className="grid" style={{ gap: 20 }}>

            {/* Balance & User Info */}
            <div className="card">
              <h3>Account Overview</h3>
              <div className="kpi">
                <div>
                  <div className="sub" >Current Balance</div>
                  <div className="value">{formatINR(balance)}</div>
                </div>
                <div className="pills">
                  <span className="pill">{me?.name}</span>
                  <span className="pill">{me?.phone}</span>
                  <span className="pill">{me?.email}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card">
              <h3>Quick Actions</h3>
              <div className="grid" style={{ gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                <button className="btn primary" onClick={() => navigate('/send')}>Send</button>
                <button className="btn" onClick={() => navigate('/receive')}>Receive</button>
                <button className="btn" onClick={() => navigate('/online')}>Pay Bill</button>
              </div>
            </div>

            {/* My Cards */}
            <div className="cards-section">
              <h3 style={{ marginBottom: "0px" }}>My Cards</h3>
              {cards.length === 0 && <p className="no-cards">No cards linked</p>}
              {cards.map(card => (
                <div key={card.id} className="card-box">
                  <div className="card-image">
                    <img src={card.type === "Debit Card" ? debitImg : creditImg} alt="Card" />
                  </div>

                  <div className="card-details">
                    <div className="card-header">
                      <h4 className="card-title">
                        {card.type === "Debit Card" ? "NovaCard Platinum" : "NovaCard Plus"}
                      </h4>

                      {/* Toggle switch */}
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
                  </div>
                </div>
              ))}
            </div>

            <RecurringBox/>


          </div>

          {/* Right Side */}
          <div className="grid" style={{ gap: 20 }}>

            {/* Recent Activity */}
            <div className="card">
              <h3>Recent Activity</h3>
              <table className="table">
                <thead>
                  <tr>
                    <th>When</th>
                    <th>Category</th>
                    <th>With</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.length === 0 && (
                    <tr>
                      <td colSpan={4} style={{ color: 'var(--muted)', textAlign: 'center' }}>
                        No activity yet
                      </td>
                    </tr>
                  )}
                  {recent.map(r => (
                    <tr key={r.id}>
                      <td>{shortDateTime(r.ts)}</td>
                      <td>{r.category || '-'}</td>
                      <td>{r.counterparty || '-'}</td>
                      <td className={'amount ' + (r.type === 'credit' ? 'pos' : 'neg')}>
                        {r.type === 'credit' ? '+' : '-'}{formatINR(r.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="dashboard">
              <SpendingChart />
            </div>
            {/* Security Tips */}
            <div className="card">
              <h3>Security Tips</h3>
              <ul style={{ lineHeight: '1.6' }}>
                <li>Never share your PIN or OTP with anyone.</li>
                <li>Verify recipient details before sending money.</li>
                <li>Enable 2FA and keep your browser updated.</li>
                <li>Use strong passwords and change them regularly.</li>
                <li>Log out after using shared devices.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
