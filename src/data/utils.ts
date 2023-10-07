import { TimeRangesEnum } from './contants';

export const categorizeTime = (time: string) => {
  const [hours] = time?.split(':')?.map(Number);

  if (hours < 6) {
    return TimeRangesEnum.EARLY_MORNING;
  } else if (hours < 12) {
    return TimeRangesEnum.MORNING;
  } else if (hours < 18) {
    return TimeRangesEnum.MID_DAY;
  } else {
    return TimeRangesEnum.NIGHT;
  }
};
