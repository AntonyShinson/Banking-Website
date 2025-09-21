import React from "react"
import Navbar from "../components/Navbar.jsx"
import { auth, tx } from "../state/store.js"
import { useNavigate } from "react-router-dom"
import { formatINR } from "../utils/format.js"

const categories = ["Food", "Shopping", "Travel", "Bills", "EMI", "Others"]

export default function SendMoney() {
  const me = auth.me()
  const navigate = useNavigate()
  React.useEffect(() => { if (!me) navigate("/") }, [me])

  const [form, setForm] = React.useState({ to:"", amount:"", note:"", category:categories[0] })
  const [msg, setMsg] = React.useState(null)

  const submit = (e) => {
    e.preventDefault()
    setMsg(null)
    try {
      const bal = tx.sendMoney(form)
      setMsg({ type:"ok", text:`Sent ${formatINR(form.amount)} to ${form.to}. New balance: ${formatINR(bal)}` })
      setForm({ to:"", amount:"", note:"", category:categories[0] })
    } catch (err) {
      setMsg({ type:"err", text: err.message })
    }
  }

  return (
    <>
      <Navbar />
      <div className="sendmoney-wrapper">
        <div className="sendmoney-card">
          <h2 className="sendmoney-title">Send Money</h2>
          <p className="sendmoney-sub">Instant transfer to anyone, anytime.</p>

          {msg && <div className={`sendmoney-alert ${msg.type === "ok" ? "sendmoney-ok" : "sendmoney-err"}`}>{msg.text}</div>}

          <form onSubmit={submit} className="sendmoney-form">
            <div className="sendmoney-field">
              <label>Recipient</label>
              <input 
                value={form.to} 
                onChange={e=>setForm({...form, to:e.target.value})} 
                placeholder="Name or phone number"
                required 
              />
            </div>

            <div className="sendmoney-field">
              <label>Amount (INR)</label>
              <input 
                type="number" 
                min="1"
                value={form.amount} 
                onChange={e=>setForm({...form, amount:e.target.value})} 
                placeholder="₹ 0.00"
                required 
              />
            </div>

            <div className="sendmoney-field">
              <label>Purpose / Category</label>
              <select 
                value={form.category} 
                onChange={e=>setForm({...form, category:e.target.value})} 
              >
                {categories.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>

            <div className="sendmoney-field">
              <label>Note (optional)</label>
              <input 
                value={form.note} 
                onChange={e=>setForm({...form, note:e.target.value})} 
                placeholder="Dinner split, rent, etc."
              />
            </div>

            <button type="submit" className="sendmoney-btn">SEND →</button>
          </form>
        </div>
      </div>
    </>
  )
}
