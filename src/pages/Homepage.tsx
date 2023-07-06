import { Typography } from "antd"

import SearchFilter from "../components/SearchFilter"
import PopularFlights from "../components/PopularFlights/PopularFlights"
import { PopularAirlines } from "../components/popularAirlines"

const { Title, Text } = Typography

const Homepage = () => {
  return (
    <div>
      <SearchFilter redirectRoute={"/flights-listing"} />

      <div className="homepageContent">
        <div className="introSection">
          <Title
            level={2}
            style={{
              textAlign: "center",
              margin: "3rem .6rem 0 .6rem",
              color: "#013042"
            }}
          >
            Unlock Exclusive Flight Deals. Complete Your Profile for
            Personalized Travel Savings. Don't Miss Out,{" "}
            <Text
              style={{
                textDecoration: "underline",
                fontSize: "1.8rem",
                color: "#DBAE1E",
                cursor: "pointer"
              }}
            >
              Sign Up Now!
            </Text>
          </Title>
        </div>
        <PopularFlights />
        <PopularAirlines />
      </div>
    </div>
  )
}

export default Homepage
