import { CSSProperties } from "react"
import { Carousel as AntCarousel } from "antd"
import { carousalImage1 } from "../../assets/images"
import "./carousel.styles.css"

const contentStyle: CSSProperties = {
  height: "170px",
  color: "#fff",
  lineHeight: "170px",
  textAlign: "center",
  borderRadius: "5px"
}

const Carousel = () => {
  return (
    <div className="carouselContainer">
      <AntCarousel
        autoplay
        arrows={true}
        dots={false}
        autoplaySpeed={4000}
        touchMove={true}
      >
        <div style={contentStyle}>
          <img src={carousalImage1} alt="add" style={{width:"100%"}}/>
        </div>
      </AntCarousel>
    </div>
  )
}

export default Carousel
