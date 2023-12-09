export enum TripType {
  ROUND_TRIP = 'ROUND_TRIP',
  ONE_WAY = 'ONE_WAY',
}

export enum Stops {
  NON_STOP = 'NON_STOP',
  ONE_STOP = 'ONE_STOP',
  ONE_PLUS_STOP = 'ONE_PLUS_STOP',
}

export enum TimeRangesEnum {
  EARLY_MORNING = 'EARLY_MORNING',
  MORNING = 'MORNING',
  MID_DAY = 'MID_DAY',
  NIGHT = 'NIGHT',
}

export const stopsOptions = [
  { value: Stops.NON_STOP, label: 'Non Stop' },
  { value: Stops.ONE_STOP, label: '1 Stop' },
  { value: Stops.ONE_PLUS_STOP, label: '1+ Stop' },
];

export const timeRangeOptions = [
  { value: TimeRangesEnum.EARLY_MORNING, label: 'Before 6 AM' },
  { value: TimeRangesEnum.MORNING, label: '6AM - 12PM' },
  { value: TimeRangesEnum.MID_DAY, label: '12PM - 6PM' },
  { value: TimeRangesEnum.NIGHT, label: 'After 6PM' },
];

export const popularFlightsArr = [
  {
    id: 44,
    airportCd: 'BOM',
    city: 'Mumbai',
    airportName: 'C S M International Airport',
    country: 'INDIA',
  },
  {
    id: 48,
    airportCd: 'DEL',
    city: 'New Delhi',
    airportName: 'Indira Gandhi International Airport',
    country: 'INDIA',
  },
  {
    id: 926,
    airportCd: 'DMK',
    city: 'Bangkok',
    airportName: 'Don Mueang International Airport',
    country: 'Thailand',
  },
  {
    id: 8,
    airportCd: 'BLR',
    city: 'Bangalore',
    airportName: 'Bangalore Airport',
    country: 'INDIA',
  },
  {
    id: 51,
    airportCd: 'PNQ',
    city: 'Pune',
    airportName: 'Lohegaon Airport',
    country: 'INDIA',
  },
  {
    id: 92,
    airportCd: 'MAA',
    city: 'Chennai',
    airportName: 'Chennai International Airport',
    country: 'INDIA',
  },
  {
    id: 13,
    airportCd: 'CCU',
    city: 'Kolkata',
    airportName: 'Netaji S C Bose International Airport',
    country: 'INDIA',
  },
  {
    id: 24,
    airportCd: 'GOI',
    city: 'Goa',
    airportName: 'Dabolim Airport',
    country: 'INDIA',
  },
];
