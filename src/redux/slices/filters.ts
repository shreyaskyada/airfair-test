import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface IFilters {
  airlines: string[];
  returnAirlines: string[];
  providers: string[];
}

const filterInitialState: IFilters = {
  airlines: [],
  providers: [],
  returnAirlines: [],
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
  },
});

export const {
  updateAirlinesFilter,
  updateProvidersFilter,
  updateReturnAirlinesFilter,
} = filtersSlice.actions;
export default filtersSlice.reducer;
