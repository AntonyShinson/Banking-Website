import imag from "../components/bank logo.png";
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { auth } from '../state/store.js'

export default function Login() {
  const navigate = useNavigate()
  const [form, setForm] = React.useState({ name: '', phone: '', email: '', pin: '' })
  const [msg, setMsg] = React.useState(null)

  const submit = (e) => {
    e.preventDefault()
    setMsg(null)
    try {
      if (!/^[0-9]{4}$/.test(form.pin)) throw new Error('PIN must be 4 digits')
      const user = auth.loginOrRegister(form)
      document.body.className = user.theme
      setMsg({ type: 'ok', text: 'Welcome ' + user.name })
      setTimeout(() => navigate('/dashboard'), 300)
    } catch (err) {
      setMsg({ type: 'err', text: err.message })
    }
  }

  return (
    <div className="auth-hero">
      <div className="auth-side">
        <div style={{ maxWidth: 480 }}>
          <div>
            <img src={imag} style={{maxWidth:400}}/>
          </div>
          <h1 style={{ fontSize: 36, margin: '0 0 10px' }}>Welcome to Nova Bank</h1>
          <div className="pills" style={{ marginTop: 18 }}>
            <span className="pill">Send Money</span><span className="pill">Receive</span><span className="pill">Bill Pay</span><span className="pill">Transactions</span><span className="pill">Export CSV</span><span className="pill">Theme</span>
          </div>
        </div>
      </div>
      <form className="auth-form" onSubmit={submit}>
        <h2 style={{ margin: 0 }}>Login / Register</h2>
        <p style={{ margin: '0 0 10px', color: 'var(--muted)' }}>Use your phone + PIN to sign in. New users get a starting balance of ₹5000.</p>
        {msg && <div className={'alert ' + (msg.type === 'ok' ? 'ok' : 'err')}>{msg.text}</div>}
        <label>Full Name</label>
        <input className="input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required placeholder="Enter name" />
        <label>Phone Number</label>
        <input className="input" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} required placeholder="9876543210" />
        <label>Email</label>
        <input type="email" className="input" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required placeholder="you@example.com" />
        <label>4-digit PIN</label>
        <input className="input" value={form.pin} onChange={e => setForm({ ...form, pin: e.target.value })} required placeholder="1234" maxLength={4} />
        <button className="btn primary" type="submit">Enter Nova Bank →</button>
        <small style={{ color: 'var(--muted)' }}>Demo app: no server, no real money. Everything is stored in your browser.</small>
      </form>
    </div>
  )
}
