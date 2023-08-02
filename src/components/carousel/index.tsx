import { CSSProperties } from "react"
import { Carousel as AntCarousel } from "antd"
import { carousalImageList } from "../../assets/images"
import "./carousel.styles.css"

const contentStyle: CSSProperties = {
  maxHeight: "170px",
  height:"100%",
  color: "#fff",
  textAlign: "center",
  borderRadius: "5px",
  border:"1px solid black"
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
        {carousalImageList &&
          carousalImageList.map((image: any, index: number) => (
            <div style={contentStyle} key={index}>
              <img src={image} alt="add" style={{ width: "100%" ,height:"170px"}} />
            </div>
          ))}
      </AntCarousel>
    </div>
  )
}

export default Carousel
