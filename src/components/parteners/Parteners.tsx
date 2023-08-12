import { Row, Col } from "antd"
import Partener from "./Partener"
import { Parteners_Data } from "../../data/parteners"
import "./styles.css"

const Parteners = () => {
  return (
    <div className="airlineSection">
      <div className="airlineContainer">
        <h1 className="airlineHeading">Parteners</h1>
        <Row gutter={[12, 20]} justify="space-between">
          {Parteners_Data.map((partener, index) => (
            <Col key={index} md={2} sm={8} xs={12}>
              <Partener name={partener.name} image={partener.image} />
            </Col>
          ))}
        </Row>
      </div>
    </div>
  )
}

export default Parteners
