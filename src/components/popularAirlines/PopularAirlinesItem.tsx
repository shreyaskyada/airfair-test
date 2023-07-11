import React from "react"

interface PopularAirlinesItemProps {
  name: string
  image: string
}

const PopularAirlinesItem: React.FC<PopularAirlinesItemProps> = ({
  name,
  image
}) => {
  return (
    <div className="itemContainer">
      <div className="airlineImgContainer">
        <img src={image} alt={name} className="airlineImage"/>
      </div>
      <p className="airlineTitle">{name}</p>
    </div>
  )
}

export default PopularAirlinesItem
