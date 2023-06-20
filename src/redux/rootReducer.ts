/**
 * @description Wrapper function to combine all reducers and send one rootReducer for configuring store
 * @returns rootReducer | Combine reducers instance which encapsulates all reducers used in our app
 */

import { combineReducers } from "@reduxjs/toolkit";
import appReducer from "./slices/app";
import flightsSlice from "./slices/flights";
import originFlightSlice from "./slices/originFlight";
import destinationFlightsSlice from "./slices/destinationFlight";

const rootReducer = combineReducers({
  app: appReducer,
  flight: flightsSlice,
  originFlight: originFlightSlice,
  destinationFlight: destinationFlightsSlice,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
