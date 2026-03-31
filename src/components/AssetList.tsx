import React, { useMemo, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import AssetCard from './AssetCard'

async function fetchAssets(){
  const res = await axios.get('http://localhost:4000/api/assets')
  return res.data
}

export default function AssetList({query='', typeFilter='All', statusFilter='All', onEdit}:any){
  const queryClient = useQueryClient()
  const {data,isLoading} = useQuery(['assets'], fetchAssets)
  const [page, setPage] = useState(1)
  const perPage = 5

  const all = data || []
  const filtered = useMemo(()=> all.filter((a:any)=>{
    if(typeFilter!=='All' && a.type !== typeFilter) return false
    if(statusFilter!=='All' && a.status !== statusFilter) return false
    if(query && !(a.name.toLowerCase().includes(query.toLowerCase()) || a.description.toLowerCase().includes(query.toLowerCase()) || a.techStack.join(' ').toLowerCase().includes(query.toLowerCase()))) return false
    return true
  }),[all,query,typeFilter,statusFilter])

  const start = (page-1)*perPage
  const pageItems = filtered.slice(start, start+perPage)
  const total = filtered.length

  async function handleDelete(asset:any){
    if(!confirm('Delete asset?')) return
    await axios.delete(`http://localhost:4000/api/assets/${asset.id}`)
    await queryClient.invalidateQueries(['assets'])
  }

  return (
    <div>
      <div className="text-sm muted">Showing {(start+1)} to {Math.min(start+perPage,total)} of {total} assets</div>
      <div className="mt-3 space-y-3">
        {isLoading ? <div>Loading...</div> : pageItems.map((a:any)=> (
          <AssetCard key={a.id} asset={a} onView={()=>{}} onEdit={()=>onEdit && onEdit(a)} onDelete={handleDelete} />
        ))}
      </div>

      <div className="mt-4 flex items-center gap-2">
        <button onClick={()=>setPage(p=>Math.max(1,p-1))} className="px-3 py-1 bg-gray-800 rounded">Prev</button>
        <div className="muted">Page {page}</div>
        <button onClick={()=>setPage(p=>p+1)} className="px-3 py-1 bg-gray-800 rounded">Next</button>
      </div>
    </div>
  )
}
