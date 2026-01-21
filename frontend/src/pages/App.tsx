import MangaList from '../components/MangaList'
import Bar from '../components/Bar'
import axios from 'axios'
import { useState, useEffect, useCallback } from 'react'
import { baseURL } from '../constants'

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

  const handleMangaRefresh = useCallback(() => {
    const getMangaList = async () => {
      try {
        const res = await axios.get(`${baseURL}/getMangaList`, { params: filters })
        setMangaData(res.data)
      } catch (err) {
        console.log(err);
      }
    }
    getMangaList()
  }, [filters])

  useEffect(() => {
    handleMangaRefresh()
  }, [handleMangaRefresh]);

  return (
    <div className="mx-auto p-6 text-white">
      <h1 className="text-5xl font-bbh">WELCOME TO MANGAO!!!</h1>
      <Bar filters={filters} onFilterChange={handleCheckboxChange} onMangaAdded={handleMangaRefresh}></Bar>
      <MangaList mangas={mangaData} onMangaDelete={handleMangaRefresh} />
    </div>
  )
}

export default App
