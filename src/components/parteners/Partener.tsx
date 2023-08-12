import React from "react"

interface PartenerProps {
  name: string
  image: string
}

const Partener: React.FC<PartenerProps> = ({
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

export default Partener
