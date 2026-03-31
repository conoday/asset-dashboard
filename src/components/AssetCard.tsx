import React from 'react'
import { EyeIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline'

export default function AssetCard({asset,onView,onEdit,onDelete}:any){
  return (
    <div className="p-4 card flex items-start justify-between">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-gray-800 rounded flex items-center justify-center">{asset.type[0]}</div>
        <div>
          <div className="flex items-center gap-2">
            <div className="font-semibold">{asset.name}</div>
            <div className="text-xs px-2 py-0.5 bg-gray-800 rounded muted">{asset.type}</div>
            <div className="text-xs px-2 py-0.5 bg-gray-800 rounded muted">{asset.status}</div>
          </div>
          <div className="muted text-sm mt-1">{asset.description}</div>
          <div className="flex gap-2 mt-2 flex-wrap">
            <div className="text-xs muted">{asset.version}</div>
            {asset.techStack.map((t:string)=> <div key={t} className="text-xs px-2 py-0.5 bg-gray-800 rounded">{t}</div>)}
            <div className="text-xs px-2 py-0.5 bg-gray-800 rounded">{asset.category}</div>
            <div className="text-xs px-2 py-0.5 bg-purple-700 rounded">{asset.repoCount} repos</div>
            <div className="text-xs px-2 py-0.5 bg-orange-700 rounded">{asset.docCount} docs</div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button onClick={()=>onView && onView(asset)} className="p-2 hover:bg-gray-800 rounded"><EyeIcon className="w-5 h-5" /></button>
        <button onClick={()=>onEdit && onEdit(asset)} className="p-2 hover:bg-gray-800 rounded"><PencilSquareIcon className="w-5 h-5" /></button>
        <button onClick={()=>onDelete && onDelete(asset)} className="p-2 hover:bg-gray-800 rounded text-red-400"><TrashIcon className="w-5 h-5" /></button>
      </div>
    </div>
  )
}
