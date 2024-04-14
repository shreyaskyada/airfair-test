import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
  Flight,
  updateDepartFlights,
  updateReturnFlights,
} from '../redux/slices/flights';
import { flightListLoading, toggleModal, uploadIsLoading } from '../redux/slices/app';
import SearchFilter from '../components/SearchFilter';
import OriginFlight from '../components/FlightsCard/OriginFlight';
import { updateDestinationFlights } from '../redux/slices/destinationFlight';
import DestinationFlight from '../components/FlightsCard/DestinationFlight';
import FlightDetailCard from '../components/Modals/FlightDetailsCard';
import { noResult } from '../assets/images';
import { ISearchFlights } from '../redux/slices/searchFlights';
import Filters from '../components/Filters';
import { TripType } from '../data/contants';
import { checkIfFilterApplied, compareProvidersAndFilter } from '../data/utils';
import InternationalFlightCard from '../components/FlightsCard/InternationalFlightCard';

function compareArrays(array1: any, array2: any) {
  if (array1.length !== array2.length) {
    return false;
  }

  const sortedArray1 = array1.slice().sort();
  const sortedArray2 = array2.slice().sort();

  for (let i = 0; i < sortedArray1.length; i++) {
    if (sortedArray1[i] !== sortedArray2[i]) {
      return false;
    }
  }

  return true;
}

const FlightsListingPage = () => {
  const dispatch = useAppDispatch();
  const [selectedFlight, setSelectedFlight] = useState({
    depart: 'depart-0',
    return: 'return-0',
  });

  const {
    flights,
    departFlight,
    returnFlight,
    internationalFlight,
  }: {
    flights: any;
    departFlight: any;
    returnFlight: any;
    internationalFlight: any;
  } = useAppSelector((state) => state.flight);

  const {isLoading, isFlightListLoading, isFlightListFetched} = useAppSelector((state) => state.app);

  const searchFlightData = useAppSelector(
    (state: { searchFlights: ISearchFlights }) => state.searchFlights
  );

  const { filteredDataPresent } = useAppSelector((state) => state.filtersSlice);
  const filtersSlice = useAppSelector((state) => state.filtersSlice);

  useEffect(() => {
    dispatch(toggleModal({ modal: 'flightInfo', status: true }));
  }, []);

  useEffect(() => {
    const departProviders = Object.keys(departFlight?.compare || {});
    const flightsToFilter = flights.returnJourneyCompareResponse || [];

    if (departFlight && flightsToFilter.length) {
      let data = flightsToFilter.filter((value: any) => {
        let providers = Object.keys(value.compare);
        return compareProvidersAndFilter(departProviders, providers);
      });
      data && data.length && updateDestinationFlights(data);
    }
  }, [flights, departFlight]);

  const filterFlightList = (selectedFlightProvider: any, type: string) => {
    let flightsListToFilter =
      type === 'depart'
        ? flights.returnJourneyCompareResponse || []
        : flights.flightCompareResponse || [];

    // let data = flightsListToFilter.filter(
    //   (x: any) =>
    //     Object.keys(x.compare).filter((value: any) =>
    //       selectedFlightProvider.includes(value)
    //     ).length > 0
    // )

    let data = flightsListToFilter.filter((value: any) => {
      let providers = Object.keys(value.compare);
      const ret = compareProvidersAndFilter(selectedFlightProvider, providers);
      return ret;
    });

    let filteredFlights = data;
    // if (selectedFlightProvider.length === 1) {
    //   filteredFlights = []
    //   for (let x of data) {
    //     let temp = { ...x }
    //     let comparedata = temp.compare[selectedFlightProvider[0]]
    //     temp.compare = {
    //       [selectedFlightProvider[0]]: comparedata
    //     }
    //     temp.cheapestFare = comparedata.fare.totalFareAfterDiscount
    //     temp.cheapestProvider = {
    //       providerCode: [selectedFlightProvider[0]],
    //       cheapest: true,
    //       providerName: null,
    //       providerRank: 0,
    //       fare: null
    //     }
    //     filteredFlights.push(temp)
    //   }
    // }
    return filteredFlights;
  };

  const onSelectedFlightChange = (value: any, type: string, flight: Flight) => {
    dispatch(flightListLoading(true));
    setTimeout(() => {
      setSelectedFlight((prevDate) => ({
        ...prevDate,
        [type]: value.target.value,
      }));
      let compareData = Object.keys(flight?.compare || {});
      switch (type) {
        case 'depart': {
          dispatch(updateDepartFlights({ ...flight }));
          const data = filterFlightList(compareData, type);
          dispatch(updateDestinationFlights(data));
          dispatch(updateReturnFlights(data[0]));

          searchFlightData.flightType === TripType.ONE_WAY &&
            dispatch(flightListLoading(false));
          break;
        }
        case 'return': {
          dispatch(updateReturnFlights(flight));
          //dispatch(uploadIsLoading(false))
          //dispatch(updateOriginFlights(filterFlightList(compareData, type)));
          break;
        }
        default: {
          dispatch(flightListLoading(false));
        }
      }
    }, 1000);

    dispatch(flightListLoading(false));
  };

  return (
    <div className='fligtListingSection'>
      <div className='flightSearch'>
        <SearchFilter redirectRoute='' />
      </div>
      {((flights && Object.keys(flights).length > 0) ||
        internationalFlight) && <Filters />}
      {isFlightListFetched && !isFlightListLoading && (((flights &&
          Object.keys(flights).length <= 0 &&
          !internationalFlight))) && (
          <div className='notFoundContainer'>
            <img
              style={{ width: '100px' }}
              src={noResult}
              alt='search-not-found-icon'
            />
            <h1 className='notFoundHeading'>
              {checkIfFilterApplied(filtersSlice)
                ? 'No Flights Found as Per Filters, Kindly Reset Filters'
                : 'No Flights Found Please Search Again!'}
            </h1>
          </div>
        )}

      {internationalFlight && <InternationalFlightCard />}

      {flights && flights?.returnJourneyCompareResponse?.length > 0 ? (
        <div className='flightListContainer bigScreen'>
          <div>
            <OriginFlight
              type='depart'
              selectedKey={selectedFlight['depart']}
              onSelectedFlightChange={onSelectedFlightChange}
            />
          </div>
          <div>
            <DestinationFlight
              type='return'
              selectedKey={selectedFlight['return']}
              onSelectedFlightChange={onSelectedFlightChange}
            />
          </div>
        </div>
      ) : (
        !internationalFlight && (
          <div>
            <OriginFlight
              type='depart'
              selectedKey={selectedFlight['depart']}
              onSelectedFlightChange={onSelectedFlightChange}
            />
          </div>
        )
      )}
      {flights &&
        !internationalFlight &&
        filteredDataPresent.originFlights &&
        filteredDataPresent.returnFlights &&
        searchFlightData.flightType !== TripType.ONE_WAY && (
          <div className='detailCardContainer'>{<FlightDetailCard />}</div>
        )}
    </div>
  );
};

export default FlightsListingPage;
