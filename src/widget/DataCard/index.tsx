import { useState, useEffect, useRef } from 'react';
import { Tag, Modal } from 'antd';
import { airlineMapping } from '../../services/airports';
import { Airlines_Images } from '../../data/popularAirlines';
import './DataCard.css';
import { useNavigate } from 'react-router';
import { airplaneIcon } from '../../assets/images';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { ISearchFlights } from '../../redux/slices/searchFlights';
import { updateDepartFlights } from '../../redux/slices/flights';
import { TripType } from '../../data/contants';
import SendEmailCard from '../../components/Modals/SendEmailCard';
import { getStopsLabel } from '../../data/utils';
import { uniq } from 'lodash';

interface Props {
  checked?: boolean;
  departCode?: string;
  currentCode?: string;
  index: number;
  dataKey: number;
  type: string;
  selectedKey: string;
  onSelectedFlightChange: any;
  _flight?: any;
  tags: {
    color: string;
    name: string;
  }[];
  flight: {
    connectivity: string;
    agent: string;
    type: string;
    company: string;
    companyImg: string;
    price: string;
    totalTime: string;
    stops: string[];
    schedule: {
      departure: string;
      arrival: string;
    };
    route: {
      from: string;
      to: string;
      fromCode: string;
      toCode: string;
    };
    partners: {
      price: string;
      name: string;
    }[];
  };
  onLikeClick?: () => void;
  onViewDealClick?: () => void;
}

const DataCard = (props: Props) => {
  const {
    tags,
    flight,
    type,
    dataKey,
    onSelectedFlightChange,
    checked,
  } = props;
  const dispatch = useAppDispatch();
  const [details] = useState(false);
  const [flightNames, setFlightNames] = useState<string[]>([]);
  const [flightImage, setFlightImage] = useState<any>(null);
  const ref = useRef(null);
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  const searchFlightData = useAppSelector(
    (state: { searchFlights: ISearchFlights }) => state.searchFlights
  );

  useEffect(() => {
    const _names = uniq(
      flight.company?.split('->').map((item) => item.substring(0, 2))
    );
    setFlightNames(_names);

    if (_names.length > 1) {
      setFlightImage(Airlines_Images['Multiple Airlines']);
    } else {
      setFlightImage(
        Airlines_Images[airlineMapping[_names[0]]] ||
          Airlines_Images['Multiple Airlines']
      );
    }
  }, [flight]);

  return (
    <div
      className={
        searchFlightData && searchFlightData.flightType === TripType.ONE_WAY
          ? 'detailCard'
          : 'roundTripDetailCard'
      }
      style={
        searchFlightData && searchFlightData.flightType === TripType.ONE_WAY
          ? { border: checked ? '1px solid #4E6F7B' : '' }
          : {}
      }
    >
      <div className='cardContainer'>
        {searchFlightData &&
          searchFlightData.flightType !== TripType.ONE_WAY && (
            <div className='radioButtonContainer'>
              <input
                ref={ref}
                type='radio'
                name={type}
                id={type}
                className='radioButton'
                value={`${type}-${dataKey}`}
                checked={checked}
                onChange={onSelectedFlightChange}
              />
            </div>
          )}
        <div className='flightInfoSection'>
          <div className='flightNamesSection'>
            <div className='flightImageSection' style={{ marginRight: '10px' }}>
              <img
                src={flightImage ? flightImage : flight.companyImg}
                style={{ width: '100%', height: '100%' }}
              />
            </div>
            <div className='flightDetailSection'>
              <div className='tagContainer'>
                <div>
                  {tags.map((tag) => (
                    <Tag color={tag.color}>{tag.name}</Tag>
                  ))}
                </div>
              </div>
              <div className='nameTime' style={{ marginBottom: '0.5rem' }}>
                <p className='flightName'>
                  {flightNames.length > 1
                    ? 'Multiple Airlines'
                    : flightNames
                        .map((name) => airlineMapping[name || 'AI'])
                        .join(', ')}
                </p>
                {/* <p className="flightTime"> {flight.totalTime}</p> */}
              </div>

              <div className='flightTimeDetail1' style={{ margin: '0' }}>
                <p style={{ textAlign: 'center' }}>
                    {getStopsLabel(flight.stops)}
                  </p>
                <div className='flightTimeDetail'>
                <div className='flightTime'>
                  <h3>{flight.schedule.departure}</h3>
                </div>

                <div
                  style={{
                    flex: '1',
                  }}
                >
                  <div style={{ margin: '12px 0' }} className='cityDivider'>
                    <span
                      className='circle circle1'
                      //style={{ background: "#4E6F7B" }}
                    ></span>
                    <img
                      src={airplaneIcon}
                      alt='aeroplane'
                      width={25}
                      height={25}
                      className='dividerIcon'
                    />
                    <div
                      className='divider'
                      style={{ borderBottom: '3px dotted #013042' }}
                    ></div>
                    <span
                      className='circle circle2'
                      //style={{ background: "#4E6F7B" }}
                    ></span>
                  </div>
                  <p style={{ textAlign: 'center' }}>{flight.totalTime}</p>
                </div>

                <div className='flightTime'>
                  <h3>{flight.schedule.arrival}</h3>
                </div>
                </div>
              </div>

              {/* <p className="flightScheduled">
                {flight.schedule.departure} - {flight.schedule.arrival}
              </p> */}

              <div
                className='flightCity'
                style={{
                  fontWeight: 'bold',
                  marginTop: '-10px',
                }}
              >
                <p>{`${flight.route.fromCode}, ${flight.route.from}`}</p>
                <p
                  style={{ textAlign: 'right' }}
                >{`${flight.route.toCode}, ${flight.route.to}`}</p>
              </div>
              {/* <p className="flightRoute">
                {flight.route.from} - {flight.route.to}
              </p> */}
              <div>
                <p className='flightConnectivity'>{flight.connectivity}</p>
              </div>
            </div>
          </div>
          <div
            className='flightCompanySection'
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <p className='flightCompany'>{flight.company}</p>
            <p className='smallTime'>{flight.totalTime}</p>
            {/* <div className="flightCompanyInfo">
              <p>
                {flight.partners.map((partner) => {
                  return Array.isArray(flight.agent)
                    ? flight.agent[0] !== partner.name && (
                        <div className="flightPartener">
                          <p
                            style={{ color: "#013042" }}
                            className="partenerPrice"
                          >
                            ₹ {partner.price}
                          </p>
                          <p
                            className="partenerName"
                            style={{ color: "#013042" }}
                          >
                            {partner.name}
                          </p>
                        </div>
                      )
                    : flight.agent !== partner.name && (
                        <div className="flightPartener">
                          <p
                            className="partenerPrice"
                            style={{ color: "#013042" }}
                          >
                            ₹ {partner.price}
                          </p>
                          <p
                            className="partenerName"
                            style={{ color: "#013042" }}
                          >
                            {partner.name}
                          </p>
                        </div>
                      )
                })}
                {details &&
                  flight.partners.length - 2 &&
                  flight.partners.slice(2).map((partner) => (
                    <div className="flightPartener">
                      <p className="partenerPrice">₹ {partner.price}</p>
                      <p className="partenerName">{partner.name}</p>
                    </div>
                  ))}
              </p>
            </div> */}
          </div>
        </div>
        <div className='flightPrice'>
          <div className='flightPriceContent'>
            <div className='fareSection' style={{ marginBottom: '0.3rem' }}>
              <p className='regularTitle'>₹{flight.price}</p>
            </div>
            <p className='flightAgent'>{flight.agent}</p>
            <div style={{ marginTop: '0.3rem' }}>
              {flight.partners.length > 1 && (
                <div>
                  <p>
                    {!details
                      ? `+${flight.partners.length - 1} more providers`
                      : ''}
                  </p>
                </div>
              )}
            </div>
            {searchFlightData &&
              searchFlightData.flightType === TripType.ONE_WAY && (
                <button
                  className='headerButtons filled'
                  style={{ marginTop: '0.5rem', height: '34px' }}
                  onClick={() => {
                    dispatch(updateDepartFlights({}));
                    if (searchFlightData.totalTravellers > 9) {
                      setShowModal(true);
                    } else {
                      onSelectedFlightChange(ref.current);
                      //setTimeout(()=>{
                      navigate(
                        '/flights/' +
                          `${flight.route.from}-${flight.route.to}` +
                          `-${flight.company}-${flight.totalTime}-${flight.schedule.departure}`
                      );
                    }
                    // },1100)
                  }}
                >
                  Select Deal
                </button>
              )}
          </div>
        </div>
      </div>
      <Modal
        open={showModal}
        centered
        footer={null}
        closable={false}
        zIndex={1003}
        onCancel={() => setShowModal(false)}
        width='350px'
      >
        <SendEmailCard
          key={new Date().toString()}
          onCancel={() => setShowModal(false)}
        />
      </Modal>
    </div>
  );
};

export default DataCard;
