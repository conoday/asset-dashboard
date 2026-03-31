import React from 'react'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

async function fetchAssets(){
  const res = await axios.get('http://localhost:4000/api/assets')
  return res.data
}

export default function SummaryCards({query='', typeFilter='All', statusFilter='All'}:any){
  const {data} = useQuery(['assets'], fetchAssets)
  const assets = data || []

  const filtered = assets.filter((a:any)=>{
    if(typeFilter!=='All' && a.type !== typeFilter) return false
    if(statusFilter!=='All' && a.status !== statusFilter) return false
    if(query && !(a.name.toLowerCase().includes(query.toLowerCase()) || a.description.toLowerCase().includes(query.toLowerCase()) || a.techStack.join(' ').toLowerCase().includes(query.toLowerCase()))) return false
    return true
  })

  const total = filtered.length
  const active = filtered.filter((a:any)=>a.status==='Active').length
  const indev = filtered.filter((a:any)=>a.status==='In Development').length
  const deprecated = filtered.filter((a:any)=>a.status==='Deprecated').length

  const cards = [
    {title:'Total Assets', value:total, color:'bg-blue-600'},
    {title:'Active', value:active, color:'bg-green-600'},
    {title:'In Development', value:indev, color:'bg-yellow-500'},
    {title:'Deprecated', value:deprecated, color:'bg-red-600'}
  ]

  return (
    <div className="grid grid-cols-4 gap-4">
      {cards.map(c=> (
        <div key={c.title} className="p-4 card flex items-center gap-4">
          <div className={`w-12 h-12 rounded flex items-center justify-center ${c.color}`}></div>
          <div>
            <div className="text-xs muted">{c.title}</div>
            <div className="text-xl font-semibold">{c.value}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
