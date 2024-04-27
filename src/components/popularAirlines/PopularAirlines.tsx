import { Row, Col } from "antd";
import PopularAirlinesItem from "./PopularAirlinesItem";
import "./styles.css";
import {
  AIRINDIA,
  AIR_AISIA_INDIA,
  AIR_INDIA_EXPRESS,
  AKASA,
  ALLIANCE_AIR,
  FLY_BIG,
  INIGO,
  SPICEJET,
  STAR_AIR,
  VISTARA,
} from "../../assets/images/popularAirlines";
// import { INIGO } from "../../assets/images/popularAirlines"

export const Airlines_Data = [
  {
    name: "Indigo Airlines",
    image: INIGO,
  },
  {
    name: "Air India",
    image: AIRINDIA,
  },
  {
    name: "Air India Express",
    image: AIR_INDIA_EXPRESS,
  },
  {
    name: "Air Aisia India",
    image: AIR_AISIA_INDIA,
  },
  {
    name: "Akasa Air",
    image: AKASA,
  },
  {
    name: "Vistara Airline",
    image: VISTARA,
  },
  {
    name: "SpiceJet",
    image: SPICEJET,
  },
  {
    name: "Star Air",
    image: STAR_AIR,
  },
  {
    name: "Alliance Air",
    image: ALLIANCE_AIR,
  },
  {
    name: "Fly Big",
    image: FLY_BIG,
  },
];

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
  );
};

export default PopularAirlines;
