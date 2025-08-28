
export const formatINR = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(n)
export const shortDateTime = (iso) => new Date(iso).toLocaleString()
