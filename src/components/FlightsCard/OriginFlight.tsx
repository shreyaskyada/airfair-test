import DataCard from '../../widget/DataCard';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { useEffect, useState } from 'react';
import { updateDepartFlights } from '../../redux/slices/flights';

const OriginFlight = (props: any) => {
  const dispatch = useAppDispatch();
  const { originFlights } = useAppSelector((state) => state.originFlight);
  const { departFlight } = useAppSelector((state) => state.flight);
  const { airlines, providers } = useAppSelector((state) => state.filtersSlice);

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

    return show;
  });

  useEffect(() => {
    if (filteredData.length) {
      dispatch(updateDepartFlights(filteredData[0]));
    }
  }, [providers, airlines]);

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
