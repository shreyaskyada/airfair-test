import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import dayjs from "dayjs"

export interface ISearchFlights {
  flightType: string
  totalTravellers: number
  dateOfDep: string
}

const searchFlights: ISearchFlights = {
  flightType: "ONE_WAY",
  totalTravellers: 1,
  dateOfDep: dayjs().toString()
}

export const searchFlightsSlice = createSlice({
  name: "app",
  initialState: searchFlights,
  reducers: {
    updateSaarchFlights: (state, action: PayloadAction<ISearchFlights>) => {
        console.log("action:",action.payload)
      state.dateOfDep = action.payload.dateOfDep
      state.flightType=action.payload.flightType
      state.totalTravellers=action.payload.totalTravellers
    }
  }
})

export const { updateSaarchFlights } = searchFlightsSlice.actions
export default searchFlightsSlice.reducer
