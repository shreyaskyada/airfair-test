import { Avatar, Typography, Divider, Tooltip } from "antd"

const FlightDetailPage = () => {
  return (
    <div style={{ margin: "1rem 1.5rem" }}>
      <div style={{ padding: "2rem 0" }}>
        <div className="headerCard">
          <div className="cardContent">
            <div className="flightStats">
              <Avatar.Group>
                <Avatar size={64}>K</Avatar>
                <Avatar size={64}>L</Avatar>
              </Avatar.Group>

              <h2 className="heading">DEL - MOMB</h2>
              <p className="date">24 - 25 AUGUST</p>
              <p className="passengers">1 Traveller</p>
            </div>
            <Divider />
            <div className="providersSection">
              <div className="providerDetail">
                <div className="leftCol">
                  <p className="providerTitle">Agoda.com</p>
                  <p className="ticketPrice">$ 3738</p>
                </div>
                <div className="rightCol">
                  <Tooltip title="Ant User" placement="top">
                    <p className="tooltipContent">i</p>
                  </Tooltip>
                  <button
                    className="headerButtons filled"
                    style={{ width: "100px" }}
                  >
                    View Detail
                  </button>
                </div>
              </div>
              <div className="providerDetail">
                <div className="leftCol">
                  <p className="providerTitle">Agoda.com</p>
                  <p className="ticketPrice">$ 3738</p>
                </div>
                <div className="rightCol">
                  <Tooltip title="Ant User" placement="top">
                    <p className="tooltipContent">i</p>
                  </Tooltip>
                  <button
                    className="headerButtons filled"
                    style={{ width: "100px" }}
                  >
                    View Detail
                  </button>
                </div>
              </div>
              <div className="providerDetail">
                <div className="leftCol">
                  <p className="providerTitle">Agoda.com</p>
                  <p className="ticketPrice">$ 3738</p>
                </div>
                <div className="rightCol">
                  <Tooltip title="Ant User" placement="top">
                    <p className="tooltipContent">i</p>
                  </Tooltip>
                  <button
                    className="headerButtons filled"
                    style={{ width: "100px" }}
                  >
                    View Detail
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FlightDetailPage
