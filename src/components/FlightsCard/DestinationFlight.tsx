import DataCard from '../../widget/DataCard';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { useEffect } from 'react';
import { updateReturnFlights } from '../../redux/slices/flights';
import {
  filterAirlines,
  filterProviders,
  filterStops,
  filterTimeRange,
} from '../../data/utils';

const DestinationFlight = (props: any) => {
  const dispatch = useAppDispatch();
  const { destinationFlights } = useAppSelector(
    (state) => state.destinationFlight
  );
  const { providers, returnAirlines, stops, timeRange } = useAppSelector(
    (state) => state.filtersSlice
  );

  console.log('timeRange.returnFlights: ', timeRange.returnFlights);
  console.log('stops.returnFlights: ', stops.returnFlights);

  const { returnFlight } = useAppSelector((state) => state.flight);

  const { type, selectedKey, onSelectedFlightChange } = props;

  const filteredData = destinationFlights?.filter((el: any) => {
    let show = true;

    show &&= filterAirlines(returnAirlines, el.flightCode);
    if (!show) return false;

    show &&= filterProviders(providers, el.compare);
    if (!show) return false;

    show &&= filterStops(stops.returnFlights, el.transitFlight);
    if (!show) return false;

    show &&= filterTimeRange(timeRange.returnFlights, el.depTime);

    return show;
  });

  useEffect(() => {
    if (filteredData.length) {
      dispatch(updateReturnFlights(filteredData[0]));
    }
  }, [providers, returnAirlines]);

  return (
    <>
      {filteredData?.map((flight: any, index: number) => (
        <DataCard
          key={index}
          index={index}
          type={type}
          selectedKey={selectedKey}
          onSelectedFlightChange={(data: any) =>
            onSelectedFlightChange(data, type, flight)
          }
          checked={returnFlight.flightCode === flight.flightCode}
          dataKey={index}
          tags={[]}
          flight={{
            connectivity: flight.journeyType,
            agent: flight.cheapestProvider.providerCode,
            type: flight.cheapestProvider.providerRank.toString(),
            company: flight.flightCode || 'Dummy provider',
            companyImg: 'string',
            price: flight.cheapestFare.toString(),
            totalTime: flight.duration,
            schedule: {
              departure: flight.depTime,
              arrival: flight.arrTime,
            },
            route: {
              from: flight.fromCity,
              to: flight.toCity,
            },
            partners: Object.entries(flight.compare).map((item: any) => ({
              price: item[1].fare.totalFareAfterDiscount.toString(),
              name: item[0],
            })),
          }}
        />
      ))}
    </>
  );
};

export default DestinationFlight;
