
import React from 'react'
import Navbar from '../components/Navbar.jsx'
import { auth, tx } from '../state/store.js'
import { useNavigate } from 'react-router-dom'
import { formatINR } from '../utils/format.js'

export default function ReceiveMoney() {
  const me = auth.me()
  const navigate = useNavigate()
  React.useEffect(()=>{ if (!me) navigate('/') }, [me])

  const [form, setForm] = React.useState({ from:'', amount:'', note:'' })
  const [msg, setMsg] = React.useState(null)

  const submit = (e) => {
    e.preventDefault()
    setMsg(null)
    try {
      const bal = tx.receiveMoney(form)
      setMsg({ type:'ok', text:`Received ${formatINR(form.amount)} from ${form.from}. New balance: ${formatINR(bal)}` })
      setForm({ from:'', amount:'', note:'' })
    } catch (err) {
      setMsg({ type:'err', text: err.message })
    }
  }

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="card" style={{maxWidth:520, margin:'0 auto'}}>
          <h3>Receive Money</h3>
          <p className="sub">Add funds to your wallet.</p>
          {msg && <div className={'alert ' + (msg.type === 'ok' ? 'ok' : 'err')}>{msg.text}</div>}
          <form onSubmit={submit} className="grid">
            <label>From (name or phone)</label>
            <input className="input" value={form.from} onChange={e=>setForm({...form, from:e.target.value})} required />
            <label>Amount (INR)</label>
            <input className="input" value={form.amount} onChange={e=>setForm({...form, amount:e.target.value})} type="number" min="1" required />
            <label>Note (optional)</label>
            <input className="input" value={form.note} onChange={e=>setForm({...form, note:e.target.value})} placeholder="Refund, gift etc." />
            <button className="btn primary" type="submit">Add →</button>
          </form>
        </div>
      </div>
    </>
  )
}
