import  { useEffect } from "react"
import { BrowserRouter } from "react-router-dom"
import { useAppDispatch } from "./redux/hooks"
import { updateAppName, updateIsLoggedIn } from "./redux/slices/app"
import useLocalStorage from "./hooks/LocalStorage"
import RoutesWrapper from "./routes"
import ScrollToTop from "./components/shared/ScrollToTop"

const App = () => {
  const [isLoggedIn] = useLocalStorage("isLoggedIn", "")
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(updateIsLoggedIn(isLoggedIn))

    setTimeout(() => {
      dispatch(updateAppName("New name"))
    })
  }, [])

  return (
    <BrowserRouter>
      <ScrollToTop />
        <RoutesWrapper />
    </BrowserRouter>
  )
}

export default App
