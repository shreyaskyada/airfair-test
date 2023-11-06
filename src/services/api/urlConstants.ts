import { AxiosRequestConfig } from "axios"

export const getAirports = (query: string): AxiosRequestConfig => {
  return {
    url: `api/airports/search/${query}`,
    method: "GET",
    baseURL: "https://gateway.mytripsaver.in"
  }
}

export const singupUserConfig = (data: {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
  userName: string
  phoneNo: string
  roles: string[]
}) => {
  return {
    url: `auth/register`,
    method: "POST",
    baseURL: "https://gateway.mytripsaver.in",
    data: {
      ...data,
      roles: ["USER"]
    }
  }
}

export const logoutUserConfig = (data: {
  userId: string
  authToken: string
}) => {
  return {
    url: `auth/logoff`,
    method: "POST",
    baseURL: "https://gateway.mytripsaver.in",
    data: {
      token: data.authToken,
      username: data.userId
    }
  }
}

export const loginUserConfig = (data: {
  username: string
  password: string
}) => {
  return {
    url: `auth/login`,
    method: "POST",
    baseURL: "https://gateway.mytripsaver.in",
    data
  }
}

export const verifyTokenConfig = (token: string, userName: string) => {
  return {
    url: `auth/verifyotp`,
    method: "POST",
    baseURL: "https://gateway.mytripsaver.in",
    data: { otp: token, username: userName }
  }
}

export const getFlightsConfig = (data: {
  from?: string
  to?: string
  doj?: string
  doa?: string
  adults?: number
  children?: number
  infants?: number
  roundtrip?: boolean
  seatingClass?: string
  typeOfJourney?: string
  offerDetails?: any
  walletList: any
  bankList: any
}): AxiosRequestConfig => {
  const {
    from,
    to,
    doj,
    roundtrip,
    adults,
    infants,
    children,
    seatingClass,
    doa,
    typeOfJourney,
    bankList,
    walletList
  } = data
  return {
    url: "api/flight/compare",
    method: "POST",
    baseURL: "https://gateway.mytripsaver.in",
    data: {
      from,
      to,
      doj,
      roundtrip,
      adults,
      infant: infants,
      child: children,
      seatingClass,
      doa,
      typeOfJourney,
      offerDetails: {
        bankList: bankList.map((bank: any) => ({
          bankName: bank.bankName,
          bankCards: [bank.bankCardName]
        })),
        walletList: walletList.map((wallet: any) => wallet.walletName)
      }
    }
  }
}

export const getProfileDetailsConfig = (userName: string, token: string) => {
  return {
    url: `profile/get-profile/${userName}`,
    method: "GET",
    baseURL: "https://gateway.mytripsaver.in",
    headers: { token }
  }
}

export const getBankDetailsConfig = (status: string) => {
  return {
    url: `profile/bank/details`,
    method: "GET",
    baseURL: "https://gateway.mytripsaver.in",
    params: {
      status
    }
  }
}

export const getBankNameConfig = (bankName: string, bankType: string) => {
  return {
    url: `profile/bank/card/details`,
    method: "GET",
    baseURL: "https://gateway.mytripsaver.in",
    params: {
      bankName,
      cardType: bankType
    }
  }
}

// curl --location 'https://localhost:8765/profile/add-profile' \
// --header 'Content-Type: application/json' \
// --header 'token: eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZ2FtLmFicm9sMTIiLCJyb2xlcyI6W10sImlhdCI6MTY4NTA5ODIwNCwiZXhwIjoxNjg1MTAxODA0fQ.hzw2TvHWMT_S5GxDtYrfCaNvYu5riQXqe1FPaB1GHWk' \
// --data-raw '{
//   "username": "agam.abrol12",
//   "email": "abrol.agam@gma.com",
// "bankDetails":[{
// "bankName":"TEST1",
// "cardType":"TEst1",
// "cardName":"Test1",
// "cardIssuer":"CITI1"},
// {
// "bankName":"TEST",
// "cardType":"TEst",
// "cardName":"Test",
// "cardIssuer":"CITI"},
// {
// "bankName":"AMEX",
// "cardType":"PREMIER MILES",
// "cardName":"MASTERCARD",
// "cardIssuer":"CITI"},
// {
// "bankName":"AU",
// "cardType":"CREDIT",
// "cardName":"TEST-AU",
// "cardIssuer":"MASTERCARD"}],
// "walletDetails":[{
//     "walletName":"PAYTM",
//     "walletType":"Wallet"
// },
// {
//     "walletName":"AmazonPay",
//     "walletType":"UPI"
// },
// {
//     "walletName":"Mobikwik",
//     "walletType":"Wallet"
// }]
// }'

export const updateProfileConfig = (
  userName: string,
  phoneNo: number,
  emailId: string,
  bankDetails: any,
  wallets: any,
  token: string
) => {
  return {
    url: `profile/add-profile`,
    method: "POST",
    baseURL: "https://gateway.mytripsaver.in",
    data: {
      mobileNo: phoneNo,
      username: userName,
      email: emailId,
      bankDetails: bankDetails,
      walletDetails: wallets
    },
    headers: { token }
  }
}

export const getBestOfferConfig = (data: object) => {
  return {
    url: `offers/offer/getBestOffer`,
    method: "POST",
    baseURL: "https://gateway.mytripsaver.in",
    data: data,
    //headers: { token }
  }
}

export const sendOTPConfig = (
  userName: string
) => {
  return {
    url: `auth/sendotp`,
    method: "POST",
    baseURL: "https://gateway.mytripsaver.in",
    data: {
      username: userName,
      purpose: "test"
    },
  }
}

export const groupBookingConfig = (data: any) => {
  return {
    url: `email`,
    method: 'POST',
    baseURL: 'https://gateway.mytripsaver.in',
    data: {
      subject: 'New Group Booking Query',
      to: 'info@tripsaverz.in',
      text: data,
    },
    headers: {
      'Content-Type': 'application/json',
    },
  };
};