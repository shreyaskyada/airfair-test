import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface FlightState {
  originFlights: object[],
}

export const initialState: FlightState = {
  originFlights: [],
};

export const originFlightsSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    updateOriginFlights: (state, action: PayloadAction<any>) => {
      state.originFlights = action.payload;
    },

    resetOriginFlights :(state)=>{
      state.originFlights=[];
    }
  },
});

// Action creators are generated for each case present in reducers object
export const { updateOriginFlights,resetOriginFlights } =
  originFlightsSlice.actions;  


export default originFlightsSlice.reducer;