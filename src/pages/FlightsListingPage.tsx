import React, { useEffect, useState } from "react";
import SearchFilter from "../components/SearchFilter";
import { getFlightsConfig } from "../services/api/urlConstants";
import backendService from "../services/api";
import { Radio } from "antd";
import data from "../data/flights.json";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  Flight,
  updateDepartFlights,
  updateFlights,
  updateReturnFlights,
} from "../redux/slices/flights";
import { toggleModal, uploadIsLoading } from "../redux/slices/app";

import {
  updateDestinationFlights,
} from "../redux/slices/destinationFlight";

import {
  updateOriginFlights,
} from "../redux/slices/originFlight";
import OriginFlight from "../components/FlightsCard/OriginFlight";
import DestinationFlight from "../components/FlightsCard/DestinationFlight";

const FlightsListingPage = () => {
  const dispatch = useAppDispatch();
  const [selectedFlight, setSelectedFlight] = useState({
    depart: "depart-0",
    return: "return-0",
  });

  const { flights }: { flights: any } = useAppSelector((state) => state.flight);

  useEffect(() => {
    dispatch(toggleModal({ modal: "flightInfo", status: true }));
  }, []);

  const filterFlightList = (selectedFlightProvider: any, type: string) => {

    let flightsListToFilter = type === "depart" ? flights.returnJourneyCompareResponse || [] : flights.flightCompareResponse || [];

    let data = flightsListToFilter.filter((x:any) => Object.keys(x.compare).filter((value:any) => selectedFlightProvider.includes(value)).length > 0);
    let filteredFlights = data;
    if(selectedFlightProvider.length === 1){
      filteredFlights = [];
      for(let x of data){
        let temp = {...x};
        let comparedata = temp.compare[selectedFlightProvider[0]];
        temp.compare = {
          [selectedFlightProvider[0]] : comparedata
        };
        temp.cheapestFare = comparedata.fare.totalFareAfterDiscount;
        temp.cheapestProvider = {
          providerCode : [selectedFlightProvider[0]],
          cheapest: true,
          providerName : null,
          providerRank: 0,
          fare: null
        };
        filteredFlights.push(temp);
      }
    }
    return filteredFlights;
  }

  const onSelectedFlightChange = (value: any, type: string, flight: Flight) => {
    if(type === "depart") {
      dispatch(uploadIsLoading(true))
    }
    setTimeout(()=>{
      setSelectedFlight((prevDate) => ({
        ...prevDate,
        [type]: value.target.value,
      }));
      let compareData = Object.keys(flight.compare || {});
      switch (type) {
        case "depart": {
          dispatch(updateDepartFlights(flight));
          dispatch(updateDestinationFlights(filterFlightList(compareData, type)));
          dispatch(uploadIsLoading(false));
          break;
        }
        case "return": {
          dispatch(updateReturnFlights(flight));
          //dispatch(updateOriginFlights(filterFlightList(compareData, type)));
          break;
        }
        default: {
          console.log("onSelectedFlightChange :: Error occured white updating file");
        }
      }
    }, 500);
  };

  console.log("rendering the app");
  return (
    <div
      style={{
        margin: "40px 100px",
      }}
    >
      <SearchFilter redirectRoute="" />
      <br />
      <br />
      <br />
      <h3>Flights listing</h3>
      {flights && flights?.returnJourneyCompareResponse?.length > 0 ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            columnGap: "25px",
          }}
        >
          <div>
            <h4>Departure</h4>
            <div>
              <OriginFlight
                type="depart"
                selectedKey={selectedFlight["depart"]}
                onSelectedFlightChange={onSelectedFlightChange}
              />
            </div>
          </div>
          <div>
            <h4>Return</h4>
            <div>
              <DestinationFlight
                type="return"
                selectedKey={selectedFlight["return"]}
                onSelectedFlightChange={onSelectedFlightChange}
              />
             </div>
          </div>
        </div>
      ) : (
        <div>
          <h4>Departure</h4>
            <OriginFlight
              type="depart"
              selectedKey={selectedFlight["depart"]}
              onSelectedFlightChange={onSelectedFlightChange}
            />
        </div>
      )}
    </div>
  );
};

export default FlightsListingPage;
