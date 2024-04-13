import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface FlightState {
  destinationFlights: object[]
}

export const initialState: FlightState = {
  destinationFlights: []
};

export const destinationFlightsSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    updateDestinationFlights: (state, action: PayloadAction<any>) => {
      state.destinationFlights = action.payload;
    },

    resetDestinationFlights:(state)=>{
      state.destinationFlights=[];
    }
  },
});

// Action creators are generated for each case present in reducers object
export const { updateDestinationFlights, resetDestinationFlights } =
  destinationFlightsSlice.actions;   


export default destinationFlightsSlice.reducer;