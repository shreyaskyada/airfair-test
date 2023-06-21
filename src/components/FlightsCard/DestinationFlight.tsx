import DataCard from "../../widget/DataCard"
import { useAppSelector } from "../../redux/hooks"
import { memo, useEffect, useState } from "react"

const DestinationFlight = (props: any) => {
  const { destinationFlights } = useAppSelector(
    (state) => state.destinationFlight
  )

  const { returnFlight } = useAppSelector((state) => state.flight)
  console.log("calling destination")
  const { type, selectedKey, onSelectedFlightChange } = props
  return (
    <>
      {destinationFlights?.map((flight: any, index: number) => (
        <DataCard
          index={index}
          type={type}
          selectedKey={selectedKey}
          onSelectedFlightChange={(data: any) =>
            onSelectedFlightChange(data, type, flight)
          }
          // checked={returnFlight.flightCode === flight.flightCode}
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
              arrival: flight.arrTime
            },
            route: {
              from: flight.from + " " + flight.fromCity,
              to: flight.to + " " + flight.toCity
            },
            partners: Object.entries(flight.compare).map((item: any) => ({
              price: item[1].fare.totalFareAfterDiscount.toString(),
              name: item[0]
            }))
          }}
        />
      ))}
    </>
  )
}

export default DestinationFlight
