import React, { useState } from 'react'
import { HomeIcon, UsersIcon, FolderOpenIcon, Squares2X2Icon } from '@heroicons/react/24/outline'

const items = [
  'Dashboard','Employees','User Management','Projects','Opportunities','Certifications','Product Assignments','Product Specialists','Asset Management','Mini POCs','Leave Management','Task Management','Knowledge Base','Forum Chat'
]

export default function Sidebar(){
  const [collapsed,setCollapsed] = useState(false)
  return (
    <aside className={`h-screen ${collapsed? 'w-20':'w-64'} p-4 card flex flex-col justify-between`}>
      <div>
        <div className="mb-6 px-2 flex items-center gap-2">
          <div className="bg-indigo-600 w-8 h-8 rounded flex items-center justify-center">T</div>
          {!collapsed && <div className="text-lg font-semibold">TOMODACHI</div>}
        </div>

        <nav className="space-y-1">
          {items.map((it)=> (
            <div key={it} className={`flex items-center gap-3 p-2 rounded hover:bg-gray-800 ${it==='Asset Management' ? 'bg-gray-800' : ''}`}>
              <Squares2X2Icon className="w-5 h-5 text-gray-300" />
              {!collapsed && <div className="text-sm">{it}</div>}
            </div>
          ))}
        </nav>
      </div>

      <div className="mt-4">
        <div className="p-2 rounded flex items-center gap-3 hover:bg-gray-800">
          <div className="w-10 h-10 bg-gray-700 rounded flex items-center justify-center">A</div>
          <div className="flex-1">
            <div className="text-sm">Aris Tito</div>
            <div className="text-xs muted">System Administrator</div>
          </div>
          <button className="text-red-500 text-sm">Logout</button>
        </div>
        <div className="mt-3 text-xs muted text-center">
          <button onClick={()=>setCollapsed(!collapsed)} className="px-2 py-1 bg-gray-800 rounded">{collapsed ? 'Expand':'Collapse'}</button>
        </div>
      </div>
    </aside>
  )
}
