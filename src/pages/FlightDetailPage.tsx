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
        <div className="headerCard" style={{ margin: "2rem 0" }}>
          <div className="flighCompleteDetail">
            <div className="flightDetailContent">
              <div className="flightNameContainer">
                <Avatar size={45}>K</Avatar>
                <h1 className="flightName">Indigo 7442</h1>
              </div>
              <div className="flightTimeDetail">
                <div className="flightTime">
                  <h3>12:45</h3>
                </div>
                <div className="cityDivider">
                  <span className="circle circle1"></span>
                  <div className="divider"></div>
                  <span className="circle circle2"></span>
                </div>
                <div className="flightTime">
                  <h3>15:30</h3>
                </div>
              </div>
              <div className="flightCity">
                <p>Delhi</p>
                <p>2h 25m - 1 Stop</p>
                <p>Mumbai</p>
              </div>
              <div className="chipsSection">
                <div className="chip">
                  <p>Economy</p>
                </div>
                <div className="chip">
                  <p>24-08-2023</p>
                </div>
                <div className="chip">
                  <p>Cabin Baggage 7 KG</p>
                </div>
                <div className="chip">
                  <p>Checkin Baggage 8 KG</p>
                </div>
              </div>
            </div>

            <div className="mainDivider">
              <span className="circle circle1"></span>
              <div className="divider"></div>
              <span className="circle circle2"></span>
            </div>

            <div className="flightDetailContent">
              <div className="flightNameContainer">
                <Avatar size={45}>K</Avatar>
                <h1 className="flightName">Indigo 7442</h1>
              </div>
              <div className="flightTimeDetail">
                <div className="flightTime">
                  <h3>12:45</h3>
                </div>
                <div className="cityDivider">
                  <span className="circle circle1"></span>
                  <div className="divider"></div>
                  <span className="circle circle2"></span>
                </div>
                <div className="flightTime">
                  <h3>15:30</h3>
                </div>
              </div>
              <div className="flightCity">
                <p>Delhi</p>
                <p>2h 25m - 1 Stop</p>
                <p>Mumbai</p>
              </div>
              <div className="chipsSection">
                <div className="chip">
                  <p>Economy</p>
                </div>
                <div className="chip">
                  <p>24-08-2023</p>
                </div>
                <div className="chip">
                  <p>Cabin Baggage 7 KG</p>
                </div>
                <div className="chip">
                  <p>Checkin Baggage 8 KG</p>
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
