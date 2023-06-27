import DataCard from "../../widget/DataCard";
import { useAppSelector } from "../../redux/hooks";
import { memo } from "react";

const OriginFlight = (props:any) => {

  const { originFlights } = useAppSelector((state) => state.originFlight);
  const { departFlight } = useAppSelector(
    (state) => state.flight
  );
  console.log("calling originFlights");

    const {
        type,
        selectedKey,
        onSelectedFlightChange
    } = props;

    console.log("selectedkey : ",selectedKey)

    return <>{
      originFlights?.map((flight: any, index: number) => (
        <DataCard
          index={index}
          type={type}
          selectedKey={selectedKey}
          onSelectedFlightChange={(data: any) =>
            onSelectedFlightChange(data, type, flight)
          }
          checked={departFlight.flightCode === flight.flightCode}
          dataKey={index}
          tags={[]}
          flight={{
            connectivity: flight.journeyType,
            agent: flight.cheapestProvider.providerCode,
            type: flight.cheapestProvider.providerRank.toString(),
            company: flight.flightCode || "Dummy provider",
            companyImg: "string",
            price: flight.cheapestFare.toString(),
            totalTime: flight.duration,
            schedule: {
              departure: flight.depTime,
              arrival: flight.arrTime,
            },
            route: {
              from: flight.from + " " + flight.fromCity,
              to: flight.to + " " + flight.toCity,
            },
            partners: Object.entries(flight.compare).map((item: any) => ({
              price: item[1].fare.totalFareAfterDiscount.toString(),
              name: item[0],
            })),
          }}
        />
      ))
    }</>

}

export default OriginFlight