import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface CompareFlightCompanyDetails {
    fare?: {
        baseFare?: number
        tax?: number
        comission?: number
        cashbackDiscount?: number
        instantDiscount?: number
        totalDiscount?: number
        totalFare?: number
        totalFareAfterDiscount?: number
        totalBaseFare?: number
        adultBaseFare?: number
        adultTax?: number
        totalTax?: number
        adultTotalFare?: number
        totalCommission?: number
        surcharge?: number
        otherCharges?: number
    }
    offerApplied?: boolean
    offerDescription?: {    
        offerType?: string
        bankName?: string
        cardName?: string
        cardType?: string
        walletName?: string
        promoCode?: string
        discountType?: string
        primaryDiscountType?: string
        comment?: string
        fareReduced?: boolean
    }
    redirecUrl?: string
}
export interface Flight {
    flightCode?: string
    compare?: {
        [key: string]: CompareFlightCompanyDetails
    }
    from?: string
    fromCity?: string
    to?: string
    toCity?: string
    depDate?: string
    arrDate?: string
    depTime?: string
    arrTime?: string
    schedule?: {
        departure: string
        arrival: string
    }
    duration?: string
    via?: string
    depTerminal?: string
    arrTerminal?: string
    airline?: string
    startTimeList?: ["2023-05-12T23:15:00"]
    endTimeList?: ["2023-05-13T01:20:00"]
    layoverDurationList?: string[]
    stops?: number
    cheapestFare?: number
    cheapestProvider?: {
        providerCode?: string
        providerName?: string
        providerRank?: number
        fare?: number
        cheapest?: true
    }
    durationsList?: string[]
    departureTerminalList?: string[]
    arrivalTerminalList?: string[]
    transitFlight?: { viaCity: string; viaAirportName: string; viaAirportCode: string }[]
}

export interface FlightState {
  flights: any;
  departFlight: Flight;
  returnFlight: Flight;
}

export const initialState: FlightState = {
  flights: {},
  departFlight: {},
  returnFlight: {},
};

export const flightsSlice = createSlice({
    name: "app",
    initialState,
    reducers: {
        updateFlights: (state, action: PayloadAction<any>) => {
            state.flights = action.payload
        },
        updateDepartFlights: (state, action: PayloadAction<any>) => {
            state.departFlight = action.payload
        },
        updateReturnFlights: (state, action: PayloadAction<any>) => {
            state.returnFlight = action.payload
        },
    },
})

// Action creators are generated for each case present in reducers object
export const { updateFlights, updateReturnFlights, updateDepartFlights } = flightsSlice.actions

export default flightsSlice.reducer
