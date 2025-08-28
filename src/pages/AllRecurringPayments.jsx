import { useState } from "react"
import { auth } from "../state/store"
import Navbar from "../components/Navbar"

export default function AllRecurringPayments() {
  const [recurring, setRecurring] = useState(auth.state.recurringTransactions || [])
  const [name, setName] = useState("")
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState("Bills")
  const [nextPayment, setNextPayment] = useState("")

  const handleCancel = (id) => {
    auth.cancelRecurringTransaction(id)
    setRecurring(auth.state.recurringTransactions)
  }

  const handleAdd = () => {
    if (!name || !amount || !category || !nextPayment) return
    const tx = {
      id: Math.random().toString(36).slice(2, 10),
      name,
      amount: Number(amount),
      category,
      nextPayment: new Date(nextPayment).toISOString()
    }
    auth.addRecurringTransaction(tx)
    setRecurring(auth.state.recurringTransactions)
    setName(""); setAmount(""); setCategory("Bills"); setNextPayment("")
  }

  return (
    <>
      <Navbar />
      <div className="all-recurring-container">
        <h2>All Recurring Payments</h2>

        <div className="add-recurring-form">
          <h3>Add Recurring Payment</h3>
          <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
          <input type="number" placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} />
          <input type="text" placeholder="Category" value={category} onChange={e => setCategory(e.target.value)} />
          <input type="date" value={nextPayment} onChange={e => setNextPayment(e.target.value)} />
          <button onClick={handleAdd}>Add</button>
        </div>

        {recurring.length === 0 ? (
          <p className="no-payments">No recurring payments</p>
        ) : (
          <div className="recurring-list">
            {recurring.map(r => (
              <div className="recurring-card" key={r.id}>
                <h4>{r.name}</h4>
                <p>Amount: ₹{r.amount}</p>
                <p>Category: {r.category}</p>
                <p>Next Payment: {new Date(r.nextPayment).toLocaleDateString()}</p>
                <button className="cancel-btn" onClick={() => handleCancel(r.id)}>Cancel</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
