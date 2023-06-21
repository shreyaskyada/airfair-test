import { useState } from "react";

import SearchFilter from "../components/SearchFilter";
import { UserDetailsType, updateUserDetails } from "../redux/slices/app";
import { useAppDispatch } from "../redux/hooks";
import {
  bannerImage2,
  bannerImage3,
  bannerImage4,
  bannerImage5,
  bannerImages,
} from "../assets/images";
import "./index.css";
import Slider from "react-slick";
import { divide } from "lodash";
import { bannerImage1 } from "../assets/images";

const Homepage = () => {
  const dispatch = useAppDispatch();

  const [otpModal, setOtpModal] = useState(false);
  const [signupModal, setSignupModal] = useState(true);
  const [flightDetailsModal, setFlightDetailsModal] = useState(true);

  const sliderSettings = {
    dots: false,
    speed: 500,
    autoplay: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    style: {
      height: "40%",
    },
  };

  return (
    <div
      style={{
        position: "relative",
      }}
    >
      <Slider {...sliderSettings}>
        <div>
          <img src={bannerImage1} />
        </div>
        <div>
          <img src={bannerImage2} />
        </div>
        <div>
          <img src={bannerImage5} />
        </div>
        <div>
          <img src={bannerImage4} />
        </div>
      </Slider>
      {/* <LoginCard /> */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          width: "100%",
          top: "40%",
          position: "absolute",
          zIndex: 2,
        }}
      >
        <SearchFilter redirectRoute={"/flights-listing"} />
      </div>
    </div>
  );
};

export default Homepage;