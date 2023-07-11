import { Row, Col } from "antd"
import PopularFlightItem from "./PopularFlightItem"
import { popularFlightsData } from "../../data/popularFlights"
import "./styles.css"

export const PopularFlights = () => {
  return (
    <div className="flightSection">
      <div className="flightContainer">
        <h1 className="flightHeading">Popular Flight Routes</h1>
        <Row gutter={{lg:12, xs:8}}>
          {popularFlightsData.map((flight, index) => (
            <Col lg={8} md={12} sm={12} xs={24} key={index}>
              <PopularFlightItem
                departureFlightCode={flight.departureFlightCode}
                departureFlightImage={flight.departureFlightImage}
                departureFlightTitle={flight.departureFlightTitle}
                destinationFlights={flight.destinationFlights}
              />
            </Col>
          ))}
        </Row>
      </div>
    </div>
  )
}

export default PopularFlights
