import { Row, Col } from "antd"
import PopularAirlinesItem from "./PopularAirlinesItem"
import { Airlines_Data } from "../../data/popularAirlines"
import "./styles.css"

const PopularAirlines = () => {
  return (
    <div className="airlineSection">
      <div className="airlineContainer">
        <h1 className="airlineHeading">Popular Domestic Airlines</h1>
        <Row gutter={[12, 20]} justify="space-between">
          {Airlines_Data.map((airline, index) => (
            <Col key={index} md={2} sm={8} xs={12}>
              <PopularAirlinesItem name={airline.name} image={airline.image} />
            </Col>
          ))}
        </Row>
      </div>
    </div>
  )
}

export default PopularAirlines
