import { CSSProperties } from "react"
import { Carousel as AntCarousel } from "antd"
import { carousalImageList } from "../../assets/images"
import "./carousel.styles.css"

const contentStyle: CSSProperties = {
  maxHeight: "170px",
  height: "100%",
  textAlign: "center",
}

const Carousel = () => {
  return (
    <>
      {carousalImageList && carousalImageList.length && (
        <div className="carouselContainer">
          <AntCarousel
            autoplay
            arrows={true}
            dots={false}
            autoplaySpeed={4000}
            touchMove={true}
          >
            {carousalImageList.map((image: any, index: number) => (
              <div style={contentStyle} key={index}>
                <div style={{ height: "170px" }}>
                  <img
                    src={image}
                    alt="add"
                    style={{ width: "100%", height: "100%" }}
                  />
                </div>
              </div>
            ))}
          </AntCarousel>
        </div>
      )}
    </>
  )
}

export default Carousel
