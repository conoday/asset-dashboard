import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function AssetForm({asset, onClose, onSaved}:any){
  const [form, setForm] = useState<any>({
    name:'', description:'', type:'POC', status:'Active', version:'v1', techStack:'', category:'', repoCount:0, docCount:0
  })

  useEffect(()=>{
    if(asset){
      setForm({
        ...asset,
        techStack: asset.techStack ? asset.techStack.join(',') : ''
      })
    }
  },[asset])

  function change(e:any){
    const {name,value} = e.target
    setForm((s:any)=>({...s,[name]: value}))
  }

  async function submit(e:any){
    e.preventDefault()
    const payload = {...form, techStack: form.techStack.split(',').map((s:string)=>s.trim())}
    try{
      if(asset){
        await axios.put(`http://localhost:4000/api/assets/${asset.id}`, payload)
      } else {
        await axios.post('http://localhost:4000/api/assets', payload)
      }
      onSaved && onSaved()
      onClose()
    }catch(err){
      alert('Save failed')
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <input name="name" value={form.name} onChange={change} placeholder="Name" className="px-3 py-2 rounded bg-gray-900 w-full" />
        <input name="version" value={form.version} onChange={change} placeholder="Version" className="px-3 py-2 rounded bg-gray-900 w-full" />
        <select name="type" value={form.type} onChange={change} className="px-3 py-2 rounded bg-gray-900 w-full">
          <option>POC</option>
          <option>Demo</option>
          <option>Document</option>
        </select>
        <select name="status" value={form.status} onChange={change} className="px-3 py-2 rounded bg-gray-900 w-full">
          <option>Active</option>
          <option>In Development</option>
          <option>Deprecated</option>
        </select>
      </div>

      <input name="category" value={form.category} onChange={change} placeholder="Category" className="px-3 py-2 rounded bg-gray-900 w-full" />
      <input name="techStack" value={form.techStack} onChange={change} placeholder="Tech stack (comma separated)" className="px-3 py-2 rounded bg-gray-900 w-full" />
      <textarea name="description" value={form.description} onChange={change} placeholder="Description" className="px-3 py-2 rounded bg-gray-900 w-full" />

      <div className="flex gap-2">
        <input name="repoCount" value={form.repoCount} onChange={change} type="number" className="px-3 py-2 rounded bg-gray-900 w-32" />
        <input name="docCount" value={form.docCount} onChange={change} type="number" className="px-3 py-2 rounded bg-gray-900 w-32" />
      </div>

      <div className="flex justify-end gap-2">
        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-800 rounded">Cancel</button>
        <button type="submit" className="px-4 py-2 bg-indigo-600 rounded">Save</button>
      </div>
    </form>
  )
}
