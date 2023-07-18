import { useEffect, useState, useMemo } from "react"
import { useAppDispatch, useAppSelector } from "../redux/hooks"
import {
  Flight,
  updateDepartFlights,
  updateReturnFlights
} from "../redux/slices/flights"
import { Typography, Tabs } from "antd"
import type { TabsProps } from "antd"
import { toggleModal, uploadIsLoading } from "../redux/slices/app"
import SearchFilter from "../components/SearchFilter"
import OriginFlight from "../components/FlightsCard/OriginFlight"
import { updateDestinationFlights } from "../redux/slices/destinationFlight"
import DestinationFlight from "../components/FlightsCard/DestinationFlight"
import FlightDetailsCard from "../components/Modals/FlightDetailsCard"

const { Text } = Typography

function compareArrays(array1: any, array2: any) {
  if (array1.length !== array2.length) {
    return false
  }

  const sortedArray1 = array1.slice().sort()
  const sortedArray2 = array2.slice().sort()

  for (let i = 0; i < sortedArray1.length; i++) {
    if (sortedArray1[i] !== sortedArray2[i]) {
      return false
    }
  }

  return true
}

const FlightsListingPage = () => {
  const dispatch = useAppDispatch()
  const [selectedFlight, setSelectedFlight] = useState({
    depart: "depart-0",
    return: "return-0"
  })

  const {
    flights,
    departFlight
  }: { flights: any; departFlight: any; returnFlight: any } = useAppSelector(
    (state) => state.flight
  )

  useEffect(() => {
    dispatch(toggleModal({ modal: "flightInfo", status: true }))
  }, [])

  useEffect(() => {
    const departProviders = Object.keys(departFlight.compare || {})
    const flightsToFilter = flights.returnJourneyCompareResponse || []

    if (departFlight && flightsToFilter.length) {
      let data = flightsToFilter.filter((value: any) => {
        let providers = Object.keys(value.compare)
        return compareArrays(departProviders, providers)
      })
      console.log("data", data)
      data && data.length && updateDestinationFlights(data)
    }
  }, [flights, departFlight])

  const filterFlightList = (selectedFlightProvider: any, type: string) => {
    let flightsListToFilter =
      type === "depart"
        ? flights.returnJourneyCompareResponse || []
        : flights.flightCompareResponse || []
    console.log(
      "Flights to filter : ",
      flightsListToFilter,
      selectedFlightProvider
    )
    // let data = flightsListToFilter.filter(
    //   (x: any) =>
    //     Object.keys(x.compare).filter((value: any) =>
    //       selectedFlightProvider.includes(value)
    //     ).length > 0
    // )

    let data = flightsListToFilter.filter((value: any) => {
      let providers = Object.keys(value.compare)
      return compareArrays(selectedFlightProvider, providers)
    })

    let filteredFlights = data
    if (selectedFlightProvider.length === 1) {
      filteredFlights = []
      for (let x of data) {
        let temp = { ...x }
        let comparedata = temp.compare[selectedFlightProvider[0]]
        temp.compare = {
          [selectedFlightProvider[0]]: comparedata
        }
        temp.cheapestFare = comparedata.fare.totalFareAfterDiscount
        temp.cheapestProvider = {
          providerCode: [selectedFlightProvider[0]],
          cheapest: true,
          providerName: null,
          providerRank: 0,
          fare: null
        }
        filteredFlights.push(temp)
      }
    }
    return filteredFlights
  }

  const onSelectedFlightChange = (value: any, type: string, flight: Flight) => {
    if (type === "depart") {
      dispatch(uploadIsLoading(true))
    }
    setTimeout(() => {
      setSelectedFlight((prevDate) => ({
        ...prevDate,
        [type]: value.target.value
      }))
      let compareData = Object.keys(flight.compare || {})
      switch (type) {
        case "depart": {
          dispatch(updateDepartFlights(flight))
          const data = filterFlightList(compareData, type)
          dispatch(updateDestinationFlights(data))
          dispatch(updateReturnFlights(data[0]))
          dispatch(uploadIsLoading(false))
          break
        }
        case "return": {
          dispatch(updateReturnFlights(flight))
          //dispatch(updateOriginFlights(filterFlightList(compareData, type)));
          break
        }
        default: {
          console.log(
            "onSelectedFlightChange :: Error occured white updating file"
          )
        }
      }
    }, 500)
  }

  const TabComponent = () => {
    return (
      <Tabs
        tabBarStyle={{ color: "#013042" }}
        items={[
          {
            key: "1",
            label: (
              <Text style={{ fontSize: "1rem", color: "#013042" }}>
                Departure Flights
              </Text>
            ),
            children: (
              <div>
                <OriginFlight
                  type="depart"
                  selectedKey={selectedFlight["depart"]}
                  onSelectedFlightChange={onSelectedFlightChange}
                />
              </div>
            )
          },
          {
            key: "2",
            label: (
              <Text style={{ fontSize: "1rem", color: "#013042" }}>
                Return Flights
              </Text>
            ),
            children: (
              <div>
                <DestinationFlight
                  type="return"
                  selectedKey={selectedFlight["return"]}
                  onSelectedFlightChange={onSelectedFlightChange}
                />
              </div>
            )
          }
        ]}
      />
    )
  }

  const [currentTab, setCurrentTab] = useState("depart")

  return (
    <div className="fligtListingSection">
      <div className="flightSearch">
        <SearchFilter redirectRoute="" />
      </div>
      {flights && flights?.returnJourneyCompareResponse?.length > 0 ? (
        <>
          <div className="flightListContainer">
            {/* <button onClick={()=>setCurrentTab("depart")}>Depart</button>
              <button onClick={()=>setCurrentTab("return")}>Return</button>
               */}
            <div>
              <OriginFlight
                type="depart"
                selectedKey={selectedFlight["depart"]}
                onSelectedFlightChange={onSelectedFlightChange}
              />
            </div>

            <div>
              <DestinationFlight
                type="return"
                selectedKey={selectedFlight["return"]}
                onSelectedFlightChange={onSelectedFlightChange}
              />
            </div>
          </div>
          <div className="flightListContainer bigScreen">
            <div>
              <OriginFlight
                type="depart"
                selectedKey={selectedFlight["depart"]}
                onSelectedFlightChange={onSelectedFlightChange}
              />
            </div>
            <div>
              <DestinationFlight
                type="return"
                selectedKey={selectedFlight["return"]}
                onSelectedFlightChange={onSelectedFlightChange}
              />
            </div>
          </div>
        </>
      ) : (
        <div>
          <OriginFlight
            type="depart"
            selectedKey={selectedFlight["depart"]}
            onSelectedFlightChange={onSelectedFlightChange}
          />
        </div>
      )}
      {/* <div
        style={{
          position: "sticky",
          bottom: 0,
          background: "white",
          maxWidth: "90%",
          margin: "0 auto"
        }}
      >
        {<FlightDetailsCard />}
      </div> */}
    </div>
  )
}

export default FlightsListingPage
