import { Typography } from "antd"
import { useAppDispatch, useAppSelector } from "../redux/hooks"
import SearchFilter from "../components/SearchFilter"
import PopularFlights from "../components/PopularFlights/PopularFlights"
import { PopularAirlines } from "../components/popularAirlines"
import { toggleModal } from "../redux/slices/app"
import { useEffect } from "react"

const { Title, Text } = Typography

const Homepage = () => {
  const dispatch = useAppDispatch()

  const { isLoggedIn } = useAppSelector((state) => state.app)

  const openModal = (type: "signup" | "login" | "profile") => {
    dispatch(toggleModal({ modal: type, status: true }))
  }

  useEffect(() => {
    if (!isLoggedIn) {
      dispatch(toggleModal({ modal: "login", status: true }))
    }
  }, [isLoggedIn,dispatch])

  return (
    <div>
      <SearchFilter redirectRoute={"/flights-listing"} origin="home" />

      <div className="homepageContent">
        <div className="introSection">
          <h3
            style={{
              textAlign: "center",
              margin: "3rem .6rem 0 .6rem",
              color: "#013042",
              fontSize: "1.2rem"
            }}
            className="introText"
          >
            Unlock Exclusive Flight Deals. Complete Your Profile for
            Personalized Travel Savings. Don't Miss Out{isLoggedIn ? "!" : ","}{" "}
            {!isLoggedIn && (
              <p
                style={{
                  textDecoration: "underline",
                  fontSize: "1.2rem",
                  color: "#DBAE1E",
                  cursor: "pointer"
                }}
                onClick={() => openModal("signup")}
              >
                Sign Up Now!
              </p>
            )}
          </h3>
        </div>
        <PopularFlights />
        <PopularAirlines />
      </div>
    </div>
  )
}

export default Homepage
