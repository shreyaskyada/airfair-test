import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import InternationDataCard from '../../widget/DataCard/InternationDataCard';
import { updateFilteredOriginDataLength } from '../../redux/slices/filters';
import {
  filterAirlines,
  filterPrices,
  filterProviders,
  filterStops,
  filterTimeRange,
} from '../../data/utils';

const InternationalFlightCard = () => {
  const {
    internationalFlight,
  }: {
    internationalFlight: any;
  } = useAppSelector((state) => state.flight);
  const dispatch = useAppDispatch();

  const { airlines, providers, priceRange, stops, timeRange, returnAirlines } =
    useAppSelector((state) => state.filtersSlice);

  const filteredData = internationalFlight?.filter((el: any) => {
    let show = true;

    const flightCode = el.flightCode.split(':');

    if (flightCode[0] === 'null' || flightCode[1] === 'null') {
      return false;
    }

    if (flightCode[0]) {
      show &&= filterAirlines(airlines, flightCode[0]);
      if (!show) return false;
    }

    if (flightCode[1]) {
      show &&= filterAirlines(returnAirlines, flightCode[1]);
      if (!show) return false;
    }

    show &&= filterPrices(priceRange, el.compare, el.cheapestFare);
    if (!show) return false;

    show &&= filterStops(stops.originFlights, el.outboundFlight.transitFlight);
    if (!show) return false;

    show &&= filterStops(stops.returnFlights, el.inboundFlight.transitFlight);
    if (!show) return false;

    show &&= filterTimeRange(
      timeRange.originFlights,
      el.outboundFlight.depTime
    );
    if (!show) return false;

    show &&= filterTimeRange(timeRange.returnFlights, el.inboundFlight.depTime);

    return show;
  });

  useEffect(() => {
    dispatch(updateFilteredOriginDataLength(filteredData.length > 0));
  }, [providers, airlines, priceRange, timeRange, stops]);

  return (
    <div>
      {filteredData?.map((el: any) => (
        <InternationDataCard key={el.flightCode} {...el} />
      ))}
    </div>
  );
};

export default InternationalFlightCard;
