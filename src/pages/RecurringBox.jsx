import { useNavigate } from "react-router-dom"
import { auth } from "../state/store"

export default function RecurringBox() {
  const navigate = useNavigate()
  const recurring = auth.state.recurringTransactions || []

  const handleCancel = (id) => {
    auth.cancelRecurringTransaction(id)
  }

  return (
    <div className="recurring-box">
      <h3>Recurring Payments</h3>
      {recurring.length === 0 ? (
        <p className="no-payments">No recurring payments</p>
      ) : (
        <ul className="recurring-list">
          {recurring.slice(0, 3).map(r => (
            <li key={r.id} className="recurring-item">
              <div className="payment-info">
                <span className="payment-name">{r.name}</span>
                <span className="payment-amount">₹{r.amount}</span>
              </div>
              <div className="payment-date">
                Next: {new Date(r.nextPayment).toLocaleDateString()}
              </div>
            </li>
          ))}
        </ul>
      )}
      <button className="view-all-btn" onClick={() => navigate("/recurring-payments")}>
        Manage Payments
      </button>
    </div>
  )
}
