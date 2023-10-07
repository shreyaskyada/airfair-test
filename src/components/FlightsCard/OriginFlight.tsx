import DataCard from '../../widget/DataCard';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { useEffect, useState } from 'react';
import { updateDepartFlights } from '../../redux/slices/flights';
import { Stops } from '../../data/contants';
import { categorizeTime } from '../../data/utils';

const OriginFlight = (props: any) => {
  const dispatch = useAppDispatch();
  const { originFlights } = useAppSelector((state) => state.originFlight);
  const { departFlight } = useAppSelector((state) => state.flight);
  const { airlines, providers, priceRange, stops, timeRange } = useAppSelector(
    (state) => state.filtersSlice
  );

  const { type, selectedKey, onSelectedFlightChange } = props;

  const filteredData = originFlights?.filter((el: any) => {
    let show = true;

    if (
      !airlines.length ||
      (airlines.length &&
        el.flightCode
          ?.split('->')
          .map((item: string) => item.substring(0, 2))
          .some((item: string) => airlines.includes(item)))
    ) {
      show &&= true;
    } else {
      show &&= false;
    }

    if (
      !providers.length ||
      (providers.length &&
        Object.keys(el.compare).some((item: string) =>
          providers.includes(item)
        ))
    ) {
      show &&= true;
    } else {
      show &&= false;
    }

    let maxPrice = -1;

    Object.keys(el.compare).forEach((p) => {
      maxPrice = Math.max(
        maxPrice,
        el.compare[p]?.fare?.totalFareAfterDiscount +
          el.compare[p]?.fare?.convenienceFee
      );
    });

    const minPrice = el.cheapestFare;

    if (
      !priceRange.length ||
      (priceRange.length &&
        minPrice >= priceRange[0] &&
        minPrice <= priceRange[1]) ||
      (priceRange.length &&
        maxPrice >= priceRange[0] &&
        maxPrice <= priceRange[1])
    ) {
      show &&= true;
    } else {
      show &&= false;
    }

    const transitFlight = el.transitFlight;
    let stop = '';
    if (transitFlight?.length > 1) {
      stop = Stops.ONE_PLUS_STOP;
    } else if (
      !transitFlight?.length ||
      (transitFlight?.length === 1 &&
        (transitFlight[0].viaAirportCode === 'NON-STOP' ||
          !transitFlight[0].viaAirportName ||
          !transitFlight[0].viaCity))
    ) {
      stop = Stops.NON_STOP;
    } else if (transitFlight?.length) {
      stop = Stops.ONE_STOP;
    }

    if (!stops.length || (stops.length && stops.includes(stop))) {
      show &&= true;
    } else {
      show &&= false;
    }

    if (
      !timeRange.length ||
      (timeRange.length && timeRange.includes(categorizeTime(el.depTime)))
    ) {
      show &&= true;
    } else {
      show &&= false;
    }

    return show;
  });

  useEffect(() => {
    if (filteredData.length) {
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
          checked={departFlight.flightCode === flight.flightCode}
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
