import { Typography } from 'antd';
import { aboutUs } from '../assets/images';
import './index.css';

const { Title } = Typography;

function AboutUs() {
  return (
    <div>
      <div className='aboutUsContainer'>
        <img
          src={aboutUs}
          alt='plane-flying'
          style={{ width: '100%', height: '100%' }}
        />
        <div className='headingText'>
          <h1 className='siteHeading'>Welcome to Tripsaverz</h1>
        </div>
      </div>

      <div className='container'>
        <h1 className='pageName'>About Us</h1>

        <p className='detail'>
          At <span className='highlight'>Tripsaverz</span>, we are dedicated to
          providing hassle-free flight and hotel bookings. We understand that
          finding the best deals on flights and hotels can be a daunting and
          time-consuming task. With countless Online Travel Agencies (OTAs)
          offering different prices and promotions, it's easy to feel
          overwhelmed and uncertain about where to book. That's why we're here
          to simplify the process for you.
        </p>

        <p className='detail'>
          Our innovative meta search engine scours through multiple OTAs,
          comparing prices and offers in real-time. Gone are the days of
          endlessly browsing through numerous websites, trying to find the best
          deals. With just a few clicks, you can compare prices from different
          OTAs, saving you both time and effort.
        </p>

        <p className='detail'>
          Not only do we display the prices from various OTAs, but we also
          highlight the exclusive offers and promotions applicable to each
          airline, ensuring that you never miss out on great deals. Whether it's
          discounted fares, bonus miles, or free upgrades, we provide you with
          all the information you need to make an informed decision and save
          money on your bookings.
        </p>

        <p className='detail'>
          At <span className='highlight'>Tripsaverz</span>, we take pride in our
          commitment to delivering exceptional service and value to our users.
          Our user-friendly interface allows you to effortlessly navigate
          through different airlines, compare prices, and explore the available
          offers. Our powerful search engine and advanced algorithms ensure that
          you receive the most accurate and relevant results tailored to your
          preferences.
        </p>

        <p className='detail'>
          In addition to our flight search capabilities, we are expanding our
          services to include hotel bookings. Soon, you'll be able to find the
          best hotel deals, compare prices, and take advantage of exclusive
          offers, all in one convenient place.
        </p>

        <p className='detail'>
          At <span className='highlight'>Tripsaverz</span>, our mission is to
          empower travelers like you with the tools and information needed to
          make smarter booking decisions. We strive to provide you with a
          seamless and enjoyable experience, allowing you to focus on the
          excitement of your upcoming journey.
        </p>

        <p className='detail'>
          But that's not all! We go beyond just bookings.{' '}
          <span className='highlight'>Tripsaverz</span> is also your go-to
          resource for unique travel hacks and tips. We share valuable insights
          on our website and social media platforms to help you maximize your
          travel experience and make the most of your adventures.
        </p>
      </div>
    </div>
  );
}

export default AboutUs;
