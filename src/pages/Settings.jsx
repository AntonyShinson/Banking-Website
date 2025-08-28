
import React from 'react'
import Navbar from '../components/Navbar.jsx'
import { auth, account } from '../state/store.js'
import { useNavigate } from 'react-router-dom'

export default function Settings() {
  const me = auth.me()
  const navigate = useNavigate()
  React.useEffect(()=>{ if (!me) navigate('/') }, [me])

  const [pin, setPin] = React.useState(me?.pin || '')

  const savePin = (e) => {
    e.preventDefault()
    if (!/^[0-9]{4}$/.test(pin)) return alert('PIN must be 4 digits')
    me.pin = pin
    alert('PIN updated')
  }

  return (
    <>
      <Navbar />
      <div className="container grid" style={{gridTemplateColumns:'1fr 1fr', gap:18}}>
        <div className="card">
          <h3>Profile</h3>
          <div className="grid">
            <label>Name</label>
            <input className="input" value={me.name} onChange={e=>{me.name=e.target.value}} />
            <label>Phone</label>
            <input className="input" value={me.phone} onChange={e=>{me.phone=e.target.value}} />
            <label>Email</label>
            <input className="input" value={me.email} onChange={e=>{me.email=e.target.value}} />
            <button className="btn primary" onClick={()=>alert('Saved (demo)')}>Save</button>
          </div>
        </div>
        <div className="card">
          <h3>Security</h3>
          <form className="grid" onSubmit={savePin}>
            <label>PIN (4 digits)</label>
            <input className="input" value={pin} onChange={e=>setPin(e.target.value)} maxLength={4} />
            <button className="btn">Update PIN</button>
          </form>
          <div className="section-title">Theme</div>
          <div className="row">
            <button className="btn" onClick={()=>{account.setTheme('theme-blue'); document.body.className='theme-blue'}}>Blue</button>
            <button className="btn" onClick={()=>{account.setTheme('theme-violet'); document.body.className='theme-violet'}}>Violet</button>
            <button className="btn" onClick={()=>{account.setTheme('theme-teal'); document.body.className='theme-teal'}}>Teal</button>
            <button className="btn" onClick={()=>{account.setTheme('theme-rose'); document.body.className='theme-rose'}}>Rose</button>
          </div>
        </div>
      </div>
    </>
  )
}
