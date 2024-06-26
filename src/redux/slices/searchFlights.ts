import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import dayjs from "dayjs"
import { TripType } from "../../data/contants"

export interface ISearchFlights {
  flightType: string
  totalTravellers: number
  dateOfDep: string
  initialValues?: {}
}

const searchFlights: ISearchFlights = {
  flightType: TripType.ONE_WAY,
  totalTravellers: 1,
  dateOfDep: dayjs().toString(),
  initialValues: {
    from: {
      code: "",
      city: "",
      name: ""
    },
    to: { code: "", city: "", name: "" },
    type: "one-way",
    departure: dayjs(),
    return: dayjs().add(1, "day"),
    adult: 1,
    child: 0,
    infant: 0,
    class: "ECONOMY"
  }
}

export const searchFlightsSlice = createSlice({
  name: "app",
  initialState: searchFlights,
  reducers: {
    updateSaarchFlights: (state, action: PayloadAction<ISearchFlights>) => {
      state.dateOfDep = action.payload.dateOfDep
      state.flightType = action.payload.flightType
      state.totalTravellers = action.payload.totalTravellers
    },
    updateInitialValues : (state, action: PayloadAction<any>) => {
      state.initialValues =action.payload
    },
    updateFromSearchValues: (state, action: PayloadAction<any>) => {
      state.initialValues = { ...state.initialValues, from: action.payload }
    },
    updateToSearchValues: (state, action: PayloadAction<any>) => {
      state.initialValues = { ...state.initialValues, to: action.payload }
    },
    updateDepartureDate: (state, action: PayloadAction<any>) => {
      state.initialValues = {
        ...state.initialValues,
        departure: action.payload
      }
    },
    updateReturnDate: (state, action: PayloadAction<any>) => {
      state.initialValues = { ...state.initialValues, return: action.payload }
    },
    updateFlightType: (state, action: PayloadAction<any>) => {
      state.initialValues = { ...state.initialValues, type: action.payload }
    },
    updateAdults:(state, action: PayloadAction<any>) => {
      state.initialValues = { ...state.initialValues, adult: action.payload }
    },
    updateChild:(state, action: PayloadAction<any>) => {
      state.initialValues = { ...state.initialValues, child: action.payload }
    },
    updateInfant:(state, action: PayloadAction<any>) => {
      state.initialValues = { ...state.initialValues, infant: action.payload }
    },
    updateClass:(state, action: PayloadAction<any>) => {
      state.initialValues = { ...state.initialValues, class: action.payload }
    },
  }
})

export const {
  updateInitialValues,
  updateSaarchFlights,
  updateFromSearchValues,
  updateToSearchValues,
  updateDepartureDate,
  updateReturnDate,
  updateFlightType,
  updateAdults,
  updateChild,
  updateInfant,
  updateClass
} = searchFlightsSlice.actions
export default searchFlightsSlice.reducer
