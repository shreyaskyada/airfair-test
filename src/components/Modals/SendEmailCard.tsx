import { Button, Form, Input, Space } from 'antd';
import { useAppSelector } from '../../redux/hooks';
import { ISearchFlights } from '../../redux/slices/searchFlights';
import { groupBookingConfig } from '../../services/api/urlConstants';
import backendService from '../../services/api';

const SendEmailCard: React.FC<{ onCancel: () => void }> = ({ onCancel }) => {
  const searchFlightData = useAppSelector(
    (state: { searchFlights: ISearchFlights }) => state.searchFlights
  );
  const { userDetails } = useAppSelector((state) => state.app);

  const [form] = Form.useForm();

  const phoneValidator = (rule: any, value: any, callback: any) => {
    if (value && !/^\d+$/.test(value)) {
      callback('Phone number should only contain numbers');
    }
    if (value && (value.length < 10 || value.length > 15)) {
      callback('Phone number must be 10 digits');
    } else {
      callback();
    }
  };

  const passengerValidator = (rule: any, value: any, callback: any) => {
    if (value && !/^\d+$/.test(value)) {
      callback('Passenger count should only contain numbers');
    }
    if (value && (+value < 1 || +value > 99)) {
      callback('Passenger count must be valid number');
    } else {
      callback();
    }
  };

  const emailValidator = (rule: any, value: any, callback: any) => {
    if (value && !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)) {
      callback('Invalid email!');
    } else {
      callback();
    }
  };

  const onFinish = (values: any) => {
    console.log('VALUES', values);

    const config = groupBookingConfig(values);
    return backendService
      .request(config)
      .then((res) => {
        console.log('RESSSS:', res);
        return res;
      })
      .catch((err) => console.error(err));
  };

  return (
    <div>
      <h4
        style={{
          textAlign: 'center',
          margin: '0.6rem',
          color: '#013042',
          fontSize: '1.2rem',
        }}
        className='introText'
      >
        Submit Group Booking Request
      </h4>
      <Form
        name='basic'
        initialValues={{
          name:
            (userDetails.firstName + ' ' + userDetails.lastName).trim() || '',
          email: userDetails.email?.trim() || '',
          phone: userDetails.phoneNo?.trim() || '',
          passenger: {
            adult: (searchFlightData.initialValues as any)?.adult || '',
            child: (searchFlightData.initialValues as any)?.child || '',
            infant: (searchFlightData.initialValues as any)?.infant || '',
          },
          remark: '',
        }}
        style={{
          width: '100%',
        }}
        form={form}
        onFinish={onFinish}
        autoComplete='off'
      >
        <Form.Item
          name='name'
          rules={[{ required: true, message: 'Please enter your name!' }]}
        >
          <Input placeholder='Name' />
        </Form.Item>
        <Form.Item
          name='email'
          rules={[
            { required: true, message: 'Please enter your email!' },
            { validator: emailValidator },
          ]}
        >
          <Input placeholder='Email' />
        </Form.Item>

        <Form.Item
          name='phone'
          rules={[
            { required: true, message: 'Please enter your phone number!' },
            {
              validator: phoneValidator,
            },
          ]}
        >
          <Input
            type='number'
            className='input-number'
            placeholder='Phone Number'
          />
        </Form.Item>

        <Form.Item className='mb-0'>
          <Space.Compact>
            <Form.Item
              name={['passenger', 'adult']}
              rules={[
                { required: true, message: 'Please enter adult count!' },
                {
                  validator: passengerValidator,
                },
              ]}
              style={{
                flexGrow: 1,
              }}
            >
              <Input
                type='number'
                className='input-number'
                placeholder='Adult Count'
              />
            </Form.Item>
            <Form.Item
              name={['passenger', 'child']}
              rules={[
                {
                  validator: passengerValidator,
                },
              ]}
              style={{
                flexGrow: 1,
              }}
            >
              <Input
                type='number'
                className='input-number'
                placeholder='Child Count'
              />
            </Form.Item>
            <Form.Item
              name={['passenger', 'infant']}
              rules={[
                {
                  validator: passengerValidator,
                },
              ]}
              style={{
                flexGrow: 1,
              }}
            >
              <Input
                type='number'
                className='input-number'
                placeholder='Infant Count'
              />
            </Form.Item>
          </Space.Compact>
        </Form.Item>

        <Form.Item name='remark'>
          <Input.TextArea placeholder='Remark' />
        </Form.Item>

        <Form.Item style={{ textAlign: 'center' }}>
          <Button
            style={{ marginRight: '10px' }}
            className='headerButtons'
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button htmlType='submit' className='headerButtons filled'>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default SendEmailCard;
