import React from "react"
import Navbar from "../components/Navbar.jsx"
import { auth, tx } from "../state/store.js"
import { useNavigate } from "react-router-dom"
import { formatINR } from "../utils/format.js"

const billers = ["Electricity Board", "Water Supply", "Mobile Recharge", "Internet Provider", "Credit Card", "DTH TV"]
const categories = ["Bills", "Utilities", "Shopping", "EMI", "Others"]

export default function OnlineBanking() {
  const me = auth.me()
  const navigate = useNavigate()
  React.useEffect(() => { if (!me) navigate("/") }, [me])

  const [form, setForm] = React.useState({ biller: billers[0], amount:"", note:"", category:categories[0] })
  const [msg, setMsg] = React.useState(null)

  const submit = (e) => {
    e.preventDefault()
    setMsg(null)
    try {
      const bal = tx.payBill(form)
      setMsg({ type:"ok", text:`Paid ${formatINR(form.amount)} to ${form.biller}. New balance: ${formatINR(bal)}` })
      setForm({ biller: billers[0], amount:"", note:"", category:categories[0] })
    } catch (err) {
      setMsg({ type:"err", text: err.message })
    }
  }

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="card" style={{maxWidth:520, margin:"0 auto"}}>
          <h3>Online Banking — Bill Pay</h3>
          <p className="sub">Pay utilities and services securely.</p>

          {msg && <div className={"alert " + (msg.type === "ok" ? "ok" : "err")}>{msg.text}</div>}

          <form onSubmit={submit} className="grid">
            <label>Biller</label>
            <select className="input" value={form.biller} onChange={e=>setForm({...form, biller:e.target.value})}>
              {billers.map(b => <option key={b}>{b}</option>)}
            </select>

            <label>Amount (INR)</label>
            <input className="input" type="number" min="1" value={form.amount} onChange={e=>setForm({...form, amount:e.target.value})} required />

            <label>Purpose / Category</label>
            <select className="input" value={form.category} onChange={e=>setForm({...form, category:e.target.value})}>
              {categories.map(c => <option key={c}>{c}</option>)}
            </select>

            <label>Note (optional)</label>
            <input className="input" value={form.note} onChange={e=>setForm({...form, note:e.target.value})} placeholder="Account number / remarks" />

            <button className="btn primary" type="submit">Pay →</button>
          </form>
        </div>
      </div>
    </>
  )
}
