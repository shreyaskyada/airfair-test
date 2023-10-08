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
