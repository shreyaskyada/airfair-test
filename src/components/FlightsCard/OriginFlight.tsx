import DataCard from '../../widget/DataCard';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { useEffect } from 'react';
import { updateDepartFlights } from '../../redux/slices/flights';
import { Stops } from '../../data/contants';
import {
  filterAirlines,
  filterPrices,
  filterProviders,
  filterStops,
  filterTimeRange,
} from '../../data/utils';

const OriginFlight = (props: any) => {
  const dispatch = useAppDispatch();
  const { originFlights } = useAppSelector((state) => state.originFlight);
  const { departFlight } = useAppSelector((state) => state.flight);
  const { airlines, providers, priceRange, stops, timeRange } = useAppSelector(
    (state) => state.filtersSlice
  );

  const { type, selectedKey, onSelectedFlightChange } = props;

  console.log('timeRange.originFlights: ', timeRange.originFlights);
  console.log('airlines: ', airlines);
  console.log('providers: ', providers);
  console.log('priceRange: ', priceRange);
  console.log('stops.originFlights: ', stops.originFlights);

  const filteredData = originFlights?.filter((el: any) => {
    let show = true;

    show &&= filterAirlines(airlines, el.flightCode);
    if (!show) return false;

    show &&= filterProviders(providers, el.compare);
    if (!show) return false;

    show &&= filterPrices(priceRange, el.compare, el.cheapestFare);
    if (!show) return false;

    show &&= filterStops(stops.originFlights, el.transitFlight);
    if (!show) return false;

    show &&= filterTimeRange(timeRange.originFlights, el.depTime);

    return show;
  });

  useEffect(() => {
    if (filteredData) {
      dispatch(updateDepartFlights(filteredData[0]));
    }
  }, [providers, airlines, priceRange, timeRange, stops]);

  return (
    <>
      {filteredData?.map((flight: any, index: number) => (
        <DataCard
          key={index}
          index={index}
          type={type}
          selectedKey={selectedKey}
          onSelectedFlightChange={(data: any) => {
            console.log('data  :', data);
            onSelectedFlightChange(data, type, flight);
          }}
          checked={departFlight?.flightCode === flight.flightCode}
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

export default OriginFlight;
