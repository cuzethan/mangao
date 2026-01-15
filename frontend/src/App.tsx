import MangaList  from './components/MangaList'
import Bar from './components/Bar'
import axios from 'axios'
import { useState, useEffect } from 'react'

const url = `http://localhost:${import.meta.env.VITE_PORT|| 3000}`

function App() {
  const [mangaData, setMangaData] = useState([]);
  const [filters, setFilters] = useState({
    completed: false,
    reading: false,
    planned: false,
    hold: false
  })
  
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const { name, checked } = event.target;
      setFilters((prevFilters) => ({
          ...prevFilters,
          [name]: checked
      }));
  };

  useEffect(() => {
    axios.get(url + '/getMangaList', {params:filters})
    .then((res) => {
      setMangaData(res.data)
    }).catch((err) => console.log(err))
  }, []);

  return (
    <div className="mx-auto p-6 bg-black text-white">
      <h1 className="text-5xl font-bbh">WELCOME TO MANGAO!!!</h1>
      <Bar filters={filters} onFilterChange={handleCheckboxChange}></Bar>
      <MangaList mangas={mangaData}/>
    </div>
  )
}

export default App
