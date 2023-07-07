import { Typography } from "antd"
import { useAppDispatch, useAppSelector } from "../redux/hooks"
import SearchFilter from "../components/SearchFilter"
import PopularFlights from "../components/PopularFlights/PopularFlights"
import { PopularAirlines } from "../components/popularAirlines"
import { toggleModal } from "../redux/slices/app"

const { Title, Text } = Typography

const Homepage = () => {
  const dispatch = useAppDispatch()

  const { isLoggedIn } = useAppSelector((state) => state.app)

  const openModal = (type: "signup" | "login" | "profile") => {
    dispatch(toggleModal({ modal: type, status: true }))
  }

  return (
    <div>
      <SearchFilter redirectRoute={"/flights-listing"} origin="home"/>

      <div className="homepageContent">
        <div className="introSection">
          <Title
            level={4}
            style={{
              textAlign: "center",
              margin: "3rem .6rem 0 .6rem",
              color: "#013042"
            }}
          >
            Unlock Exclusive Flight Deals. Complete Your Profile for
            Personalized Travel Savings. Don't Miss Out{isLoggedIn ?  "!" : ","}{" "}
            {!isLoggedIn && <Text
              style={{
                textDecoration: "underline",
                fontSize: "1.2rem",
                color: "#DBAE1E",
                cursor: "pointer"
              }}
              onClick={() => openModal("signup")}
            >
              Sign Up Now!
            </Text>}
          </Title>
        </div>
        <PopularFlights />
        <PopularAirlines />
      </div>
    </div>
  )
}

export default Homepage
