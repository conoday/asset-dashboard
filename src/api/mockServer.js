const express = require('express')
const cors = require('cors')
const path = require('path')
const fs = require('fs')
const { stringify } = require('csv-stringify')

const app = express()
app.use(cors())
app.use(express.json())

const DATA_FILE = path.resolve(__dirname,'assets.json')

function readData(){
  return JSON.parse(fs.readFileSync(DATA_FILE,'utf8'))
}

function writeData(d){
  fs.writeFileSync(DATA_FILE, JSON.stringify(d,null,2))
}

app.get('/api/assets', (req,res)=>{
  const data = readData()
  res.json(data)
})

app.get('/api/assets/export', (req,res)=>{
  const data = readData()
  res.setHeader('Content-Type','text/csv')
  res.setHeader('Content-Disposition','attachment; filename="assets.csv"')
  const columns = ['id','name','type','status','version','techStack','category','repoCount','docCount','createdAt']
  const stringifier = stringify({header:true,columns})
  data.forEach(a=>{
    stringifier.write({
      id:a.id,
      name:a.name,
      type:a.type,
      status:a.status,
      version:a.version,
      techStack:a.techStack.join('|'),
      category:a.category,
      repoCount:a.repoCount,
      docCount:a.docCount,
      createdAt:a.createdAt
    })
  })
  stringifier.end()
  stringifier.pipe(res)
})

app.post('/api/assets', (req,res)=>{
  const data = readData()
  const item = {...req.body, id: Date.now().toString(), createdAt: new Date().toISOString()}
  data.unshift(item)
  writeData(data)
  res.status(201).json(item)
})

app.put('/api/assets/:id', (req,res)=>{
  const data = readData()
  const idx = data.findIndex(d=>d.id === req.params.id)
  if(idx===-1) return res.status(404).json({error:'not found'})
  data[idx] = {...data[idx], ...req.body, updatedAt: new Date().toISOString()}
  writeData(data)
  res.json(data[idx])
})

app.delete('/api/assets/:id', (req,res)=>{
  let data = readData()
  data = data.filter(d=>d.id !== req.params.id)
  writeData(data)
  res.status(204).end()
})

const port = 4000
app.listen(port, ()=> console.log('Mock API running on', port))
