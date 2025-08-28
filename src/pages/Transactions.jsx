import React from 'react'
import Navbar from '../components/Navbar.jsx'
import { auth, tx } from '../state/store.js'
import { useNavigate } from 'react-router-dom'
import { formatINR, shortDateTime } from '../utils/format.js'

export default function Transactions() {
  const me = auth.me()
  const navigate = useNavigate()
  React.useEffect(() => { if (!me) navigate('/') }, [me])

  const [filter, setFilter] = React.useState('all')
  const [query, setQuery] = React.useState('')

  const all = tx.all().filter(t => 
    (filter === 'all' ? true : t.type === filter) && (
      !query ||
      t.note?.toLowerCase().includes(query.toLowerCase()) ||
      (t.counterparty || '').toLowerCase().includes(query.toLowerCase()) ||
      (t.category || '').toLowerCase().includes(query.toLowerCase())
    )
  )

  const exportCSV = () => {
    const headers = ['When','Type','Amount','Note','Counterparty','Category']
    const rows = all.map(t => [shortDateTime(t.ts), t.type, t.amount, t.note || '', t.counterparty || '', t.category || ''])
    const csv = [headers, ...rows].map(r => r.map(x => '"' + String(x).replaceAll('"','""') + '"').join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'transactions.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="card">
          <div className="row" style={{justifyContent:'space-between', alignItems:'center'}}>
            <h3 style={{margin:0}}>Transactions</h3>
            <div className="row">
              <select className="input" value={filter} onChange={e=>setFilter(e.target.value)}>
                <option value="all">All</option>
                <option value="credit">Credits</option>
                <option value="debit">Debits</option>
              </select>
              <input className="input" placeholder="Search note, name, or category..." value={query} onChange={e=>setQuery(e.target.value)} />
              <button className="btn" onClick={exportCSV}>Export CSV</button>
            </div>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>When</th>
                <th>Type</th>
                <th>Note</th>
                <th>Counterparty</th>
                <th>Category</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {all.length === 0 && (
                <tr>
                  <td colSpan={6} style={{color:'var(--muted)'}}>No transactions</td>
                </tr>
              )}
              {all.map(t => (
                <tr key={t.id}>
                  <td>{shortDateTime(t.ts)}</td>
                  <td style={{textTransform:'capitalize'}}>{t.type}</td>
                  <td>{t.note}</td>
                  <td>{t.counterparty || '-'}</td>
                  <td>{t.category || '-'}</td>
                  <td className={t.type === 'credit' ? 'amount pos' : 'amount neg'}>
                    {t.type === 'credit' ? '+' : '-'}{formatINR(t.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
