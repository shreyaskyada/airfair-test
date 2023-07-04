import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import dayjs from "dayjs"

export interface ISearchFlights {
  flightType: string
  totalTravellers: number
  dateOfDep: string
  initialValues?: {}
}

// export interface InitialValues {
//   initialValues :{
//     from: {
//       code: string,
//       city: string,
//       name: string
//     },
//     to: { code: string, city: string, name: string },
//     type: string,
//     departure: string,
//     return: string,
//     adult: number,
//     child: number,
//     infant: number,
//     class: string
//   }
// }

const searchFlights: ISearchFlights = {
  flightType: "ONE_WAY",
  totalTravellers: 1,
  dateOfDep: dayjs().toString(),
  initialValues: {
    from: {
      code: "DEL",
      city: "New Delhi",
      name: "Indira Gandhi International Airport"
    },
    to: { code: "BOM", city: "Mumbai", name: "C S M International Airport" },
    type: "one-way",
    departure: dayjs(),
    return: dayjs(),
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
