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

export const alignDropdownList = (windowWidth: number) => {
  const dropdowns = document.getElementsByClassName('filters-select open');
  const dropdown = dropdowns[0] as HTMLDivElement;

  if (dropdown && windowWidth < 1200) {
    const leftPos = parseFloat(dropdown.style.left);
    const dropdownWidth = dropdown.clientWidth;
    if (leftPos + dropdownWidth > windowWidth) {
      const offset = leftPos + dropdownWidth - windowWidth;
      dropdown.style.left = `${leftPos - offset - 10}px`;
    }
  }
};
