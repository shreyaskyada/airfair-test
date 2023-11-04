import { IFilters } from '../redux/slices/filters';
import { Stops, TimeRangesEnum } from './contants';

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

export const filterAirlines = (airlines: string[], flightCode: string) => {
  if (
    !airlines.length ||
    (airlines.length &&
      flightCode
        ?.split('->')
        .map((item: string) => item.substring(0, 2))
        .some((item: string) => airlines.includes(item)))
  ) {
    return true;
  }
  return false;
};

export const filterProviders = (providers: string[], compare: object) => {
  if (
    !providers.length ||
    (providers.length &&
      Object.keys(compare).some((item: string) => providers.includes(item)))
  ) {
    return true;
  }
  return false;
};

export const filterPrices = (
  priceRange: [number, number] | [],
  compare: { [key: string]: any },
  cheapestFare: number
) => {
  // let maxPrice = -1;

  // Object.keys(compare).forEach((p) => {
  //   maxPrice = Math.max(
  //     maxPrice,
  //     compare[p]?.fare?.totalFareAfterDiscount +
  //       compare[p]?.fare?.convenienceFee
  //   );
  // });

  const minPrice = cheapestFare;

  if (
    !priceRange.length ||
    (priceRange.length &&
      minPrice >= priceRange[0] &&
      minPrice <= priceRange[1])
    //  ||
    // (priceRange.length &&
    //   maxPrice >= priceRange[0] &&
    //   maxPrice <= priceRange[1])
  ) {
    return true;
  }
  return false;
};

export const filterStops = (
  stops: string[],
  transitFlight: { [key: string]: string }[]
) => {
  let stop = '';
  if (transitFlight?.length > 1) {
    stop = Stops.ONE_PLUS_STOP;
  } else if (
    !transitFlight?.length ||
    (transitFlight?.length === 1 &&
      (transitFlight[0].viaAirportCode === 'NON-STOP' ||
        !transitFlight[0].viaAirportName ||
        !transitFlight[0].viaCity))
  ) {
    stop = Stops.NON_STOP;
  } else if (transitFlight?.length) {
    stop = Stops.ONE_STOP;
  }

  if (!stops.length || (stops.length && stops.includes(stop))) {
    return true;
  }

  return false;
};

export const filterTimeRange = (timeRange: string[], depTime: string) => {
  if (
    !timeRange.length ||
    (timeRange.length && timeRange.includes(categorizeTime(depTime)))
  ) {
    return true;
  }
  return false;
};

export const checkIfFilterApplied = (filtersSlice: IFilters) => {
  const { airlines, priceRange, providers, returnAirlines, stops, timeRange } =
    filtersSlice;

  if (
    airlines.length ||
    providers.length ||
    priceRange.length ||
    returnAirlines.length ||
    stops.originFlights.length ||
    stops.returnFlights.length ||
    timeRange.originFlights.length ||
    timeRange.returnFlights.length
  ) {
    return true;
  }

  return false;
};

export const compareProvidersAndFilter = (
  array1: string[],
  array2: string[]
) => {
  return array1.some((a) => array2.includes(a));
};

export const capitalizeFirstLetter = (str: string) => {
  return str
    .split(' ')
    .map((el) => el.trim())
    .filter((el) => el)
    .map((el) => {
      if (el.length > 2) {
        return el[0].toUpperCase() + el.substring(1).toLowerCase();
      }
      return el;
    })
    .join(' ');
};
