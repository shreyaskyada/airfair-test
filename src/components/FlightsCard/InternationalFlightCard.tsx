import React from 'react';
import { useAppSelector } from '../../redux/hooks';
import InternationDataCard from '../../widget/DataCard/InternationDataCard';

const InternationalFlightCard = () => {
  const {
    internationalFlight,
  }: {
    internationalFlight: any;
  } = useAppSelector((state) => state.flight);

  return (
    <div>
      {internationalFlight.map((el: any) => (
        <InternationDataCard key={el.flightCode} {...el} />
      ))}
    </div>
  );
};

export default InternationalFlightCard;
