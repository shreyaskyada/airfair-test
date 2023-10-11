import {
  updateStopsFilter,
  updateAirlinesFilter,
  updateProvidersFilter,
  updateTimeRangeFilter,
  updatePriceRangeFilter,
  updateReturnAirlinesFilter,
  resetFilters,
} from '../../redux/slices/filters';
import './index.css';
import { uniq } from 'lodash';
import { Col, Row, Typography } from 'antd';
import { TripType, stopsOptions, timeRangeOptions } from '../../data/contants';
import SelectWithSlots from '../shared/SelectWithSlots';
import { airlineMapping } from '../../services/airports';
import SelectWithSlider from '../shared/SelectWithSlider';
import SelectWithCheckbox from '../shared/SelectWithCheckbox';
import { ISearchFlights } from '../../redux/slices/searchFlights';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';

const { Text } = Typography;

const Filters = () => {
  const dispatch = useAppDispatch();
  const { originFlights } = useAppSelector((state) => state.originFlight);
  const searchFlightData = useAppSelector(
    (state: { searchFlights: ISearchFlights }) => state.searchFlights
  );
  const { destinationFlights } = useAppSelector(
    (state) => state.destinationFlight
  );
  const { airlines, providers, returnAirlines, timeRange, stops, priceRange } =
    useAppSelector((state) => state.filtersSlice);

  let airlineOptions: string[] = [];
  let providersOptions: string[] = [];
  let returnAirlineOptions: string[] = [];
  let minPrice = Number.MAX_SAFE_INTEGER;
  let maxPrice = -1;

  originFlights.forEach((flight: any) => {
    airlineOptions = airlineOptions.concat(
      uniq(
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
      uniq(
        flight.flightCode
          ?.split('->')
          .map((item: string) => item.substring(0, 2))
      )
    );
  });

  const onApplyTimeRange = (oV: string[], rV: string[]) => {
    dispatch(
      updateTimeRangeFilter({
        originFlights: oV,
        returnFlights: rV,
      })
    );
  };

  const onApplyStops = (oV: string[], rV: string[]) => {
    dispatch(
      updateStopsFilter({
        originFlights: oV,
        returnFlights: rV,
      })
    );
  };

  const hasReturnFlight = searchFlightData.flightType !== TripType.ONE_WAY;

  const getLabel = (label: string) => (
    <Text style={{ margin: '12px' }}>{label}</Text>
  );

  return (
    <>
      <div
        style={{
          width: '100%',
          overflowX: 'auto',
        }}
      >
        <Row
          gutter={16}
          wrap={false}
          style={{ margin: 0, justifyContent: 'space-between' }}
        >
          <Col span={4} className='filters-column mb-1'>
            {getLabel('Providers')}
            <SelectWithCheckbox
              selectedValues={providers}
              mobilePlaceholder='Providers'
              placeholder='Select Providers'
              onApply={(t) => dispatch(updateProvidersFilter(t))}
              options={uniq(providersOptions).map((el: string) => ({
                value: el,
                label: el,
              }))}
            />
          </Col>

          <Col span={4} className='filters-column mb-1'>
            {getLabel('Price Range')}
            <SelectWithSlider
              min={minPrice}
              max={maxPrice}
              mobilePlaceholder='Prices'
              selectedValues={priceRange}
              placeholder='Select Price Range'
              onChange={(t) => dispatch(updatePriceRangeFilter(t))}
              selectLabel={
                priceRange.length ? (
                  <>
                    <Text>₹{priceRange[0]}</Text> -{' '}
                    <Text>₹{priceRange[1]}</Text>
                  </>
                ) : (
                  ''
                )
              }
            />
          </Col>

          <Col span={4} className='filters-column mb-1'>
            {getLabel('Stops')}
            <SelectWithSlots
              options={stopsOptions}
              onApply={onApplyStops}
              selectedValues={stops}
              mobilePlaceholder='Stops'
              placeholder='Select Stops'
              hasReturn={hasReturnFlight}
              originLabel='Departure from Delhi'
              returnLabel='Departure from Mumbai'
              selectLabel={
                stops.originFlights.length || stops.returnFlights.length ? (
                  <>
                    <Text>
                      {[0, 3].includes(stops.originFlights.length)
                        ? 'Any Stop'
                        : stops.originFlights
                            .map(
                              (val) =>
                                stopsOptions.find((el) => el.value === val)
                                  ?.label
                            )
                            .join(', ')}
                    </Text>
                    {hasReturnFlight && (
                      <>
                        {' -> '}
                        <Text>
                          {[0, 3].includes(stops.returnFlights.length)
                            ? 'Any Stop'
                            : stops.returnFlights
                                .map(
                                  (val) =>
                                    stopsOptions.find((el) => el.value === val)
                                      ?.label
                                )
                                .join(', ')}
                        </Text>
                      </>
                    )}
                  </>
                ) : (
                  ''
                )
              }
            />
          </Col>

          <Col span={4} className='filters-column mb-1'>
            {getLabel('Time Range')}
            <SelectWithSlots
              mobilePlaceholder='Times'
              options={timeRangeOptions}
              onApply={onApplyTimeRange}
              selectedValues={timeRange}
              hasReturn={hasReturnFlight}
              placeholder='Select Time Range'
              originLabel='Departure from Delhi'
              returnLabel='Departure from Mumbai'
              selectLabel={
                timeRange.originFlights.length ||
                timeRange.returnFlights.length ? (
                  <>
                    <Text>
                      {[0, 4].includes(timeRange.originFlights.length)
                        ? 'Any Time'
                        : timeRange.originFlights
                            .map(
                              (val) =>
                                timeRangeOptions.find((el) => el.value === val)
                                  ?.label
                            )
                            .join(', ')}
                    </Text>
                    {hasReturnFlight && (
                      <>
                        {' -> '}
                        <Text>
                          {[0, 4].includes(timeRange.returnFlights.length)
                            ? 'Any Time'
                            : timeRange.returnFlights
                                .map(
                                  (val) =>
                                    timeRangeOptions.find(
                                      (el) => el.value === val
                                    )?.label
                                )
                                .join(', ')}
                        </Text>
                      </>
                    )}
                  </>
                ) : (
                  ''
                )
              }
            />
          </Col>

          <Col span={4} className='filters-column mb-1'>
            {getLabel('Depart Airlines')}
            <SelectWithCheckbox
              defaultValue={airlines}
              selectedValues={airlines}
              mobilePlaceholder='Airlines'
              placeholder='Select Airlines'
              onApply={(t) => {
                dispatch(updateAirlinesFilter(t));
              }}
              options={uniq(airlineOptions).map((el: string) => ({
                value: el,
                label: airlineMapping[el],
              }))}
            />
          </Col>

          {hasReturnFlight && (
            <Col span={4} className='filters-column mb-1'>
              {getLabel('Return Airlines')}
              <SelectWithCheckbox
                mobilePlaceholder='Return'
                selectedValues={returnAirlines}
                placeholder='Select Return Airlines'
                onApply={(t) => dispatch(updateReturnAirlinesFilter(t))}
                options={uniq(returnAirlineOptions).map((el: string) => ({
                  value: el,
                  label: airlineMapping[el],
                }))}
              />
            </Col>
          )}
        </Row>
      </div>
      <div
        style={{
          margin: '10px 0',
          textAlign: 'center',
        }}
      >
        <button
          className='headerButtons outlined'
          onClick={() => dispatch(resetFilters())}
        >
          RESET
        </button>
      </div>
    </>
  );
};

export default Filters;
