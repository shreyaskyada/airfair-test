import DataCard from '../../widget/DataCard';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { useEffect } from 'react';
import {
  filterAirlines,
  filterPrices,
  filterProviders,
  filterStops,
  filterTimeRange,
} from '../../data/utils';
import { updateFilteredOriginDataLength } from '../../redux/slices/filters';

const OriginFlight = (props: any) => {
  const dispatch = useAppDispatch();
  const { originFlights } = useAppSelector((state) => state.originFlight);
  const { departFlight } = useAppSelector((state) => state.flight);
  const { airlines, providers, priceRange, stops, timeRange } = useAppSelector(
    (state) => state.filtersSlice
  );
  const { filteredDataPresent } = useAppSelector((state) => state.filtersSlice);

  const { type, selectedKey, onSelectedFlightChange } = props;

  const filteredData = originFlights?.filter((el: any) => {
    let show = true;

    if (!el.flightCode) {
      return false;
    }

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
    // if (filteredData.length) {
    onSelectedFlightChange(
      {
        target: {
          value: 'depart-0',
        },
      },
      type,
      filteredData[0]
    );
    // }
    dispatch(updateFilteredOriginDataLength(filteredData.length > 0));
  }, [providers, airlines, priceRange, timeRange, stops]);

  return filteredDataPresent.originFlights &&
    filteredDataPresent.returnFlights ? (
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
            stops: flight.stops,
            schedule: {
              departure: flight.depTime,
              arrival: flight.arrTime,
            },
            route: {
              from: flight.fromCity,
              to: flight.toCity,
              toCode: flight.to,
              fromCode: flight.from,
            },
            partners: Object.entries(flight.compare).map((item: any) => ({
              price: item[1].fare.totalFareAfterDiscount.toString(),
              name: item[0],
            })),
          }}
        />
      ))}
    </>
  ) : null;
};

export default OriginFlight;
