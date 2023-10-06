import _ from 'lodash';
import { Col, Row, Select } from 'antd';
import { airlineMapping } from '../../services/airports';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  updateAirlinesFilter,
  updateProvidersFilter,
  updateReturnAirlinesFilter,
} from '../../redux/slices/filters';
import { TripType } from '../../data/contants';
import { ISearchFlights } from '../../redux/slices/searchFlights';

const Filters = () => {
  const dispatch = useAppDispatch();
  const { originFlights } = useAppSelector((state) => state.originFlight);
  const searchFlightData = useAppSelector(
    (state: { searchFlights: ISearchFlights }) => state.searchFlights
  );
  const { destinationFlights } = useAppSelector(
    (state) => state.destinationFlight
  );

  let airlineOptions: string[] = [];
  let providersOptions: string[] = [];
  let returnAirlineOptions: string[] = [];

  originFlights.forEach((flight: any) => {
    airlineOptions = airlineOptions.concat(
      _.uniq(
        flight.flightCode
          ?.split('->')
          .map((item: string) => item.substring(0, 2))
      )
    );

    providersOptions = providersOptions.concat(Object.keys(flight.compare));
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
          onChange={(t) => dispatch(updateAirlinesFilter(t))}
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
        />
      </Col>
    </Row>
  );
};

export default Filters;
