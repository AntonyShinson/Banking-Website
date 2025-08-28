
import React from 'react'
import { auth, account } from '../state/store.js'

const themes = [
  { id: 'theme-blue', name: 'Blue' },
  { id: 'theme-violet', name: 'Violet' },
  { id: 'theme-teal', name: 'Teal' },
  { id: 'theme-rose', name: 'Rose' },
]

export default function ThemeToggle() {
  const me = auth.me()

  const onChange = (e) => {
    account.setTheme(e.target.value)
    document.body.className = e.target.value
  }

  React.useEffect(()=>{
    if (me?.theme) document.body.className = me.theme
  }, [me?.theme])

  return (
    <select className="input" style={{width:140}} onChange={onChange} value={me?.theme || 'theme-blue'}>
      {themes.map(t => <option key={t.id} value={t.id}>{t.name} theme</option>)}
    </select>
  )
}
