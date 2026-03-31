import React, { useMemo, useState } from 'react'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import SummaryCards from './components/SummaryCards'
import AssetList from './components/AssetList'
import Modal from './components/Modal'
import AssetForm from './components/AssetForm'
import axios from 'axios'

export default function App(){
  const [query, setQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [modalOpen,setModalOpen] = useState(false)
  const [editingAsset,setEditingAsset] = useState<any>(null)

  async function handleExport(){
    try{
      const res = await axios.get('http://localhost:4000/api/assets/export', { responseType: 'blob' })
      const url = window.URL.createObjectURL(new Blob([res.data]))
      const a = document.createElement('a')
      a.href = url
      a.download = 'assets.csv'
      document.body.appendChild(a)
      a.click()
      a.remove()
    }catch(e){ alert('Export failed') }
  }

  function handleAdd(){
    setEditingAsset(null)
    setModalOpen(true)
  }

  function handleEdit(asset:any){
    setEditingAsset(asset)
    setModalOpen(true)
  }

  function onSaved(){
    // let list components refresh via React Query cache invalidation; simple approach: reload
    window.location.reload()
  }

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1 p-6">
        <Header
          title="Asset Environment"
          subtitle="Manage frameworks, POCs, demos, and environments"
          onSearch={setQuery}
          onTypeFilter={setTypeFilter}
          onStatusFilter={setStatusFilter}
          onExport={handleExport}
          onAdd={handleAdd}
        />

        <div className="mt-6">
          <SummaryCards query={query} typeFilter={typeFilter} statusFilter={statusFilter} />
        </div>

        <div className="mt-6">
          <AssetList query={query} typeFilter={typeFilter} statusFilter={statusFilter} onEdit={handleEdit} />
        </div>
      </div>

      <Modal open={modalOpen} onClose={()=>setModalOpen(false)} title={editingAsset ? 'Edit Asset' : 'Add Asset'}>
        <AssetForm asset={editingAsset} onClose={()=>setModalOpen(false)} onSaved={onSaved} />
      </Modal>
    </div>
  )
}
