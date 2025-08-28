import AllRecurringPayments from './pages/AllRecurringPayments.jsx'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import SendMoney from './pages/SendMoney.jsx'
import ReceiveMoney from './pages/ReceiveMoney.jsx'
import Transactions from './pages/Transactions.jsx'
import OnlineBanking from './pages/OnlineBanking.jsx'
import Settings from './pages/Settings.jsx'
import NotFound from './pages/NotFound.jsx'
import { auth } from './state/store.js'
import ManageCards from './pages/ManageCards.jsx'

const RequireAuth = ({ children }) => auth.me() ? children : <Navigate to="/" />

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
      <Route path="/send" element={<RequireAuth><SendMoney /></RequireAuth>} />
      <Route path="/receive" element={<RequireAuth><ReceiveMoney /></RequireAuth>} />
      <Route path="/transactions" element={<RequireAuth><Transactions /></RequireAuth>} />
      <Route path="/online" element={<RequireAuth><OnlineBanking /></RequireAuth>} />
      <Route path="/settings" element={<RequireAuth><Settings /></RequireAuth>} />
      <Route path="*" element={<NotFound />} />
      <Route path="/cards" element={<RequireAuth><ManageCards /></RequireAuth>} />
      <Route path="/recurring-payments" element={<AllRecurringPayments />} />
    </Routes>
  )
}
