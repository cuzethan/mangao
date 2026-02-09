import MangaList from '../components/MangaList'
import Bar from '../components/Bar'
import NavBar from '../components/Navbar'
import axios, { AxiosError } from 'axios'
import { useState, useEffect, useCallback } from 'react'
import { baseURL } from '../constants'

function App() {
  const mangaURL = baseURL + '/mangas'
  const authURL = baseURL + '/auth'
  const [validAccess, setValidAccess] = useState(false)
  const [errPageMsg, setErrPageMsg] = useState("")
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

  async function handleTokenRefresh() {
    try {
      const test = await axios.get(`${authURL}/refresh`)
      console.log(test)
      return true;
    } catch (err) {
      if (err instanceof AxiosError) {
          const res = err.response!
          if (res.status == 401) { //token dne
            console.log("hit")
            return false;
          }
          if (res.status == 403) { //refresh token expired
            //redirect to login
          }
        }
        return false;
    }
  }

  const handleMangaRefresh = useCallback(() => {
    const getMangaList = async () => {
      try {
        const csrfToken = document.cookie.split('=')[1]
        const res = await axios.get(`${mangaURL}/getMangaList`, { 
          params: filters,
          headers: {
            "X-CSRF-TOKEN": csrfToken
          }
        })
        setValidAccess(true)
        setMangaData(res.data)
      } catch (err) {
        if (err instanceof AxiosError) {
          setValidAccess(false)
          console.log(err.response)
          const res = err.response!
          if (res.status == 403) setErrPageMsg("403 FORBIDDEN ERROR")
          if (res.status == 401) {
            if (res.data.action === "refreshReq") {
              if(await handleTokenRefresh()) getMangaList(); // call funciton again
              else {
                setErrPageMsg("401 UNAUTHROIZED ERROR")
              }
            }
          }
        }
      }
    }
    getMangaList()
  }, [filters])

  useEffect(() => {
    handleMangaRefresh()
  }, [handleMangaRefresh]);

  function defaultPage() {
    return (
      <div>
        <NavBar/>
        <h1 className="text-7xl pt-4">WELCOME TO MANGAO!!!</h1>
        <Bar filters={filters} onFilterChange={handleCheckboxChange} onMangaAdded={handleMangaRefresh}></Bar>
        <MangaList mangas={mangaData} onMangaDelete={handleMangaRefresh} />
      </div>
    )
  }

  return (<div className="mx-auto p-6 text-white text-5xl font-bbh">
    {validAccess ? defaultPage() : <h1>{errPageMsg}</h1>}
  </div>)
}

export default App
