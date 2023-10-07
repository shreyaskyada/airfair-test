import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface IFilters {
  airlines: string[];
  returnAirlines: string[];
  providers: string[];
  priceRange: [number, number];
  stops: string[];
  timeRange: string[];
}

const filterInitialState: IFilters = {
  airlines: [],
  providers: [],
  returnAirlines: [],
  priceRange: [0, 0],
  stops: [],
  timeRange: [],
};

export const filtersSlice = createSlice({
  name: 'app',
  initialState: filterInitialState,
  reducers: {
    updateAirlinesFilter: (state, action: PayloadAction<any>) => {
      state.airlines = action.payload;
    },
    updateReturnAirlinesFilter: (state, action: PayloadAction<any>) => {
      state.returnAirlines = action.payload;
    },
    updateProvidersFilter: (state, action: PayloadAction<any>) => {
      state.providers = action.payload;
    },
    updatePriceRangeFilter: (state, action: PayloadAction<any>) => {
      state.priceRange = action.payload;
    },
    updateStopsFilter: (state, action: PayloadAction<any>) => {
      state.stops = action.payload;
    },
    updateTimeRangeFilter: (state, action: PayloadAction<any>) => {
      state.timeRange = action.payload;
    },
  },
});

export const {
  updateStopsFilter,
  updateAirlinesFilter,
  updateProvidersFilter,
  updateTimeRangeFilter,
  updatePriceRangeFilter,
  updateReturnAirlinesFilter,
} = filtersSlice.actions;
export default filtersSlice.reducer;
