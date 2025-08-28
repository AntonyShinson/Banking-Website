// state/store.js
const STORAGE_KEY = "nova_bank_db_v2"

const seed = () => ({
  users: [],
  sessions: { currentUserId: null },
  transactions: []
})

const load = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : seed()
  } catch {
    return seed()
  }
}

const save = (db) => localStorage.setItem(STORAGE_KEY, JSON.stringify(db))
let db = load()

const uid = () => Math.random().toString(36).slice(2, 10)
const now = () => new Date().toISOString()

export const auth = {
  state: {
    user: null,
    transactions: [],
    balances: {},
    categoryTotals: {   // persists chart totals
      Food: 0,
      Travel: 0,
      Shopping: 0,
      Bills: 0,
      EMI: 0,
      Others: 0
    },
    recurringTransactions: [   // 5 default recurring payments
      {
        id: uid(),
        name: "Netflix Subscription",
        amount: 499,
        category: "Bills",
        nextPayment: "2025-09-01T00:00:00Z"
      },
      {
        id: uid(),
        name: "Amazon Prime",
        amount: 1499,
        category: "Bills",
        nextPayment: "2025-09-05T00:00:00Z"
      },
      {
        id: uid(),
        name: "Spotify Premium",
        amount: 199,
        category: "Entertainment",
        nextPayment: "2025-09-03T00:00:00Z"
      },
      {
        id: uid(),
        name: "Gym Membership",
        amount: 999,
        category: "Health",
        nextPayment: "2025-09-07T00:00:00Z"
      },
      {
        id: uid(),
        name: "Monthly Rent",
        amount: 10000,
        category: "Bills",
        nextPayment: "2025-09-01T00:00:00Z"
      },
    ],
  },



  addRecurringTransaction(tx) {
    if (!this.state.recurringTransactions) this.state.recurringTransactions = []
    this.state.recurringTransactions.push(tx)
    localStorage.setItem('recurringTransactions', JSON.stringify(this.state.recurringTransactions))
  },

  cancelRecurringTransaction(id) {
    this.state.recurringTransactions = this.state.recurringTransactions.filter(r => r.id !== id)
    localStorage.setItem('recurringTransactions', JSON.stringify(this.state.recurringTransactions))
  },

  loadRecurringTransactions() {
    const saved = localStorage.getItem('recurringTransactions')
    if (saved) {
      this.state.recurringTransactions = JSON.parse(saved)
    }
  },

  loadCategoryTotals() {
    const saved = localStorage.getItem('categoryTotals')
    if (saved) {
      this.state.categoryTotals = JSON.parse(saved)
    }
  },

  me() {
    return this.state.user
  },

  login(user) {
    this.state.user = user
  },

  logout() {
    this.state.user = null
  },

  addTransaction(tx) {
    this.state.transactions.push(tx)

    if (!this.state.categoryTotals) {
      this.state.categoryTotals = {
        Food: 0,
        Travel: 0,
        Shopping: 0,
        Bills: 0,
        EMI: 0,
        Others: 0
      }
    }

    // Only add to categoryTotals if it's a debit transaction
    if (tx.type === "debit") {
      const cat = tx.category in this.state.categoryTotals ? tx.category : "Others"
      this.state.categoryTotals[cat] += tx.amount
      localStorage.setItem('categoryTotals', JSON.stringify(this.state.categoryTotals))
    }

    save(db)
  },

  getTransactions() {
    return this.state.transactions
  },

  updateCategoryTotals() {
    const totals = {
      Food: 0,
      Travel: 0,
      Shopping: 0,
      Bills: 0,
      EMI: 0,
      Others: 0
    }

    this.state.transactions.forEach(tx => {
      if (tx.type === "debit") {
        const cat = totals.hasOwnProperty(tx.category) ? tx.category : "Others"
        totals[cat] += tx.amount
      }
    })

    this.state.categoryTotals = totals
    localStorage.setItem('categoryTotals', JSON.stringify(this.state.categoryTotals))
  },

  getBalance(userId) {
    return this.state.balances[userId] || 0
  },

  updateBalance(userId, amount) {
    this.state.balances[userId] = (this.state.balances[userId] || 0) + amount
  },

  loginOrRegister: ({ name, phone, email, pin }) => {
    let user = db.users.find(u => u.phone === phone)
    if (user) {
      if (user.pin !== pin) throw new Error("Incorrect PIN")
    } else {
      user = {
        id: uid(),
        name,
        phone,
        email,
        pin,
        balance: 5000,
        theme: "theme-blue"
      }
      db.users.push(user)
    }
    db.sessions.currentUserId = user.id
    save(db)
    return user
  },

  logout: () => {
    db.sessions.currentUserId = null
    save(db)
  },

  me: () => db.users.find(u => u.id === db.sessions.currentUserId) || null
}

// initialize categoryTotals from localStorage
auth.loadCategoryTotals()

export const account = {
  balance: () => auth.me()?.balance ?? 0,
  setTheme: (theme) => {
    const me = auth.me()
    if (!me) return
    me.theme = theme
    save(db)
  },
  recent: (limit = 5) => {
    const me = auth.me()
    return db.transactions
      .filter(t => t.userId === me?.id)
      .sort((a, b) => b.ts.localeCompare(a.ts))
      .slice(0, limit)
  },
}

export const tx = {
  all: () => {
    const me = auth.me()
    return db.transactions
      .filter(t => t.userId === me?.id)
      .sort((a, b) => b.ts.localeCompare(a.ts))
  },

  sendMoney: ({ to, amount, note, category = "Others" }) => {
    const me = auth.me()
    amount = Number(amount)
    if (!me) throw new Error("Not logged in")
    if (amount <= 0) throw new Error("Enter a valid amount")
    if (me.balance < amount) throw new Error("Insufficient balance")

    me.balance -= amount
    const transaction = {
      id: uid(),
      userId: me.id,
      type: "debit",
      amount,
      note: note || "Transfer",
      counterparty: to,
      category,
      ts: now(),
    }

    db.transactions.push(transaction)
    auth.addTransaction(transaction)   // updates categoryTotals + localStorage
    save(db)
    return me.balance
  },

  receiveMoney: ({ from, amount, note, category = "Others" }) => {
    const me = auth.me()
    amount = Number(amount)
    if (!me) throw new Error("Not logged in")
    if (amount <= 0) throw new Error("Enter a valid amount")

    me.balance += amount
    const transaction = {
      id: uid(),
      userId: me.id,
      type: "credit",
      amount,
      note: note || "Received",
      counterparty: from,
      category,
      ts: now(),
    }

    db.transactions.push(transaction)
    auth.addTransaction(transaction)   // updates categoryTotals + localStorage
    save(db)
    return me.balance
  },

  payBill: ({ biller, amount, note, category = "Bills" }) => {
    return tx.sendMoney({
      to: biller,
      amount,
      note: note || "Bill Payment",
      category
    })
  },
}
