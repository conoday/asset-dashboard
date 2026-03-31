import React from 'react'

type Props = {
  title: string
  subtitle?: string
  onSearch?: (q:string)=>void
  onTypeFilter?: (t:string)=>void
  onStatusFilter?: (s:string)=>void
}

export default function Header({title,subtitle,onSearch,onTypeFilter,onStatusFilter, onExport, onAdd}:any){
  return (
    <div className="flex items-start justify-between">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        {subtitle && <div className="muted">{subtitle}</div>}
      </div>

      <div className="flex items-center gap-3">
        <input onChange={(e)=>onSearch?.(e.target.value)} placeholder="Search assets..." className="px-3 py-2 rounded bg-gray-900 border border-gray-800" />
        <select onChange={(e)=>onTypeFilter?.(e.target.value)} className="px-3 py-2 rounded bg-gray-900 border border-gray-800">
          <option>All</option>
          <option>POC</option>
          <option>Demo</option>
          <option>Document</option>
        </select>
        <select onChange={(e)=>onStatusFilter?.(e.target.value)} className="px-3 py-2 rounded bg-gray-900 border border-gray-800">
          <option>All</option>
          <option>Active</option>
          <option>In Development</option>
          <option>Deprecated</option>
        </select>

        <button onClick={onExport} className="px-4 py-2 bg-green-600 rounded">Export CSV</button>
        <button onClick={onAdd} className="px-4 py-2 bg-indigo-600 rounded">Add New Asset</button>
      </div>
    </div>
  )
}
