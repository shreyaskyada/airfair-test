import { CSSProperties } from "react"
import { Carousel as AntCarousel } from "antd"
import "./carousel.styles.css"

const contentStyle: CSSProperties = {
  height: "170px",
  color: "#fff",
  lineHeight: "170px",
  textAlign: "center",
  background: "#013042",
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
        <div>
          <h3 style={contentStyle}>1</h3>
        </div>
        <div>
          <h3 style={contentStyle}>2</h3>
        </div>
        <div>
          <h3 style={contentStyle}>3</h3>
        </div>
        <div>
          <h3 style={contentStyle}>4</h3>
        </div>
      </AntCarousel>
    </div>
  )
}

export default Carousel
