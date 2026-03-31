import React from 'react'

export default function Modal({open, onClose, title, children}:any){
  if(!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose}></div>
      <div className="relative w-[720px] max-w-full p-4">
        <div className="card p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="font-semibold">{title}</div>
            <button onClick={onClose} className="text-gray-400">Close</button>
          </div>
          <div>{children}</div>
        </div>
      </div>
    </div>
  )
}
