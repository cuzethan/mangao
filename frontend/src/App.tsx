import MangaList  from './components/MangaList'
import Bar from './components/Bar'
import axios from 'axios'
import { useState } from 'react'

const url = `http://localhost:${import.meta.env.VITE_PORT|| 3000}/`

function App() {
  const [sampleData, setSampleData] = useState([]);

  axios.get(url + 'testing').then((res) => {
    setSampleData(res.data)
  })

  return (
    <div className="mx-auto p-6 bg-black text-white">
      <h1 className="text-5xl font-bbh">WELCOME TO MANGAO!!!</h1>
      <Bar></Bar>
      <MangaList mangas={sampleData}/>
    </div>
  )
}

export default App
