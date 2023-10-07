import _ from 'lodash';
import { Col, Row, Select, Slider } from 'antd';
import { airlineMapping } from '../../services/airports';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  updateAirlinesFilter,
  updatePriceRangeFilter,
  updateProvidersFilter,
  updateReturnAirlinesFilter,
  updateStopsFilter,
  updateTimeRangeFilter,
} from '../../redux/slices/filters';
import { Stops, TimeRangesEnum, TripType } from '../../data/contants';
import { ISearchFlights } from '../../redux/slices/searchFlights';
import CheckableTag from 'antd/es/tag/CheckableTag';
import { useEffect, useRef, useState } from 'react';

const Filters = () => {
  const dispatch = useAppDispatch();
  const { originFlights } = useAppSelector((state) => state.originFlight);
  const searchFlightData = useAppSelector(
    (state: { searchFlights: ISearchFlights }) => state.searchFlights
  );
  const { destinationFlights } = useAppSelector(
    (state) => state.destinationFlight
  );
  const { airlines, providers, returnAirlines } = useAppSelector(
    (state) => state.filtersSlice
  );

  const tagsData = [
    { value: Stops.NON_STOP, label: 'Non Stop' },
    { value: Stops.ONE_STOP, label: '1 Stop' },
    { value: Stops.ONE_PLUS_STOP, label: '1+ Stop' },
  ];

  const timeRange = [
    { value: TimeRangesEnum.EARLY_MORNING, label: 'Before 6 AM' },
    { value: TimeRangesEnum.MORNING, label: '6AM - 12PM' },
    { value: TimeRangesEnum.MID_DAY, label: '12PM - 6PM' },
    { value: TimeRangesEnum.NIGHT, label: 'After 6PM' },
  ];

  const [selectedTags, setSelectedTags] = useState<string[]>(
    tagsData.map((tag) => tag.value)
  );

  const [selectedTimeRanges, setSelectedTimeRanges] = useState<string[]>(
    timeRange.map((timeRange) => timeRange.value)
  );

  let airlineOptions: string[] = [];
  let providersOptions: string[] = [];
  let returnAirlineOptions: string[] = [];
  let minPrice = Number.MAX_SAFE_INTEGER;
  let maxPrice = -1;

  originFlights.forEach((flight: any) => {
    airlineOptions = airlineOptions.concat(
      _.uniq(
        flight.flightCode
          ?.split('->')
          .map((item: string) => item.substring(0, 2))
      )
    );

    providersOptions = providersOptions.concat(Object.keys(flight.compare));

    minPrice = Math.min(minPrice, flight.cheapestFare);
    const allMaxPrices: number[] = [];

    Object.keys(flight.compare).forEach((p) => {
      allMaxPrices.push(
        flight.compare[p]?.fare?.totalFareAfterDiscount +
          flight.compare[p]?.fare?.convenienceFee
      );
    });

    maxPrice = Math.max(maxPrice, ...allMaxPrices);
  });

  destinationFlights.forEach((flight: any) => {
    returnAirlineOptions = returnAirlineOptions.concat(
      _.uniq(
        flight.flightCode
          ?.split('->')
          .map((item: string) => item.substring(0, 2))
      )
    );
  });

  const [selectedPriceRange, setSelectedPriceRange] = useState<
    [number, number]
  >([minPrice, maxPrice]);

  const handleChange = (tag: string, checked: boolean) => {
    setSelectedTags((p) => {
      if (checked) {
        return [...p, tag];
      }
      return [...p].filter((t) => t !== tag);
    });
  };

  const handleTimeRangeChange = (tag: string, checked: boolean) => {
    setSelectedTimeRanges((p) => {
      if (checked) {
        return [...p, tag];
      }
      return [...p].filter((t) => t !== tag);
    });
  };

  useEffect(() => {
    dispatch(updateStopsFilter(selectedTags));
  }, [selectedTags]);

  useEffect(() => {
    dispatch(updateTimeRangeFilter(selectedTimeRanges));
  }, [selectedTimeRanges]);

  const debouncedFilter = useRef(
    _.debounce((t) => {
      dispatch(updatePriceRangeFilter(t));
    }, 200)
  ).current;

  useEffect(() => {
    debouncedFilter(selectedPriceRange);
  }, [selectedPriceRange]);

  return (
    <Row gutter={16} wrap>
      <Col span={12} className='mb-2'>
        <Select
          placeholder='Select Airlines'
          options={_.uniq(airlineOptions).map((el: string) => ({
            value: el,
            label: airlineMapping[el],
          }))}
          style={{ width: '100%' }}
          mode='tags'
          className='w-full'
          value={airlines}
          onChange={(t) => {
            dispatch(updateAirlinesFilter(t));
          }}
        />
      </Col>

      {searchFlightData.flightType !== TripType.ONE_WAY && (
        <Col span={12} className='mb-2'>
          <Select
            placeholder='Select Return Airlines'
            options={_.uniq(returnAirlineOptions).map((el: string) => ({
              value: el,
              label: airlineMapping[el],
            }))}
            style={{ width: '100%' }}
            mode='tags'
            className='w-full'
            value={returnAirlines}
            onChange={(t) => dispatch(updateReturnAirlinesFilter(t))}
          />
        </Col>
      )}

      <Col span={12} className='mb-2'>
        <Select
          placeholder='Select Providers'
          options={_.uniq(providersOptions).map((el: string) => ({
            value: el,
            label: el,
          }))}
          className='w-full'
          mode='multiple'
          onChange={(t) => dispatch(updateProvidersFilter(t))}
          value={providers}
        />
      </Col>

      <Col span={12} className='mb-2'>
        <Slider
          range={{ draggableTrack: true }}
          min={minPrice}
          max={maxPrice}
          value={selectedPriceRange}
          onChange={(t: [number, number]) => setSelectedPriceRange(t)}
        />
      </Col>

      <Col span={12} className='mb-2'>
        {tagsData.map((tag) => (
          <CheckableTag
            key={tag.value}
            checked={selectedTags.includes(tag.value)}
            onChange={(checked) => handleChange(tag.value, checked)}
          >
            {tag.label}
          </CheckableTag>
        ))}
      </Col>

      <Col span={24} className='mb-2'>
        {timeRange.map((time) => (
          <CheckableTag
            key={time.value}
            checked={selectedTimeRanges.includes(time.value)}
            onChange={(checked) => handleTimeRangeChange(time.value, checked)}
          >
            {time.label}
          </CheckableTag>
        ))}
      </Col>
    </Row>
  );
};

export default Filters;
