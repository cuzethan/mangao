import MangaList from '../components/MangaList'
import Bar from '../components/Bar'
import NavBar from '../components/Navbar'
import { AxiosError } from 'axios'
import { useState, useEffect, useCallback } from 'react'
import api from '../config/api'

function App() {
  const [validAccess, setValidAccess] = useState(false)
  const [errPageMsg, setErrPageMsg] = useState("")
  const [mangaData, setMangaData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    completed: false,
    reading: false,
    planned: false,
    hold: false
  })

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.type === "checkbox") {
      const { name, checked } = event.target;
      setFilters((prevFilters) => ({
        ...prevFilters,
        [name]: checked
      }));
    } else {
      setSearchTerm(event.target.value)
    }
  };

  const handleMangaRefresh = useCallback(() => {
    const getMangaList = async () => {
      try {
        const res = await api.get(`mangas/getMangaList/${searchTerm}`, { params: filters });
        setValidAccess(true)
        setMangaData(res.data)
      } catch (err) {
        if (err instanceof AxiosError) {
          setValidAccess(false)
          const status = err.response?.status
          if (status == 401) setErrPageMsg("401 UNAUTHORIZED ERROR")
          if (status == 500) setErrPageMsg("500 INTERNAL SERVER ERROR")
        }
      }
    }
    getMangaList()
  }, [filters, searchTerm])

  useEffect(() => {
    handleMangaRefresh(); //initial manga list load

    const pollInterval = setInterval(() => {
      handleMangaRefresh();
    }, 300000);

    return () => clearInterval(pollInterval);
  }, [handleMangaRefresh]); //poll manga list every 5 minutes OR when filters/search term changes

  function defaultPage() {
    return (
      <div>
        <NavBar />
        <h1 className="text-7xl pt-4">WELCOME TO MANGAO!!!</h1>
        <Bar filters={filters} onFilterChange={handleCheckboxChange} refreshMangaList={handleMangaRefresh}></Bar>
        <MangaList mangas={mangaData} refreshMangaList={handleMangaRefresh} />
      </div>
    )
  }

  return (<div className="mx-auto p-6 text-white text-5xl font-bbh">
    {validAccess ? defaultPage() : <h1>{errPageMsg}</h1>}
  </div>)
}

export default App
