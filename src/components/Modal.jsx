
export default function Modal({ open, onClose, title, children, footer }) {
  if (!open) return null
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <div className="row" style={{justifyContent:'space-between', alignItems:'center', marginBottom:8}}>
          <h3 style={{margin:0}}>{title}</h3>
          <button onClick={onClose}>✕</button>
        </div>
        <div>{children}</div>
        {footer && <div style={{marginTop:12}}>{footer}</div>}
      </div>
    </div>
  )
}
