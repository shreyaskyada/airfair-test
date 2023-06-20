import backendService from "../api";
import {
  getProfileDetailsConfig,
  loginUserConfig,
  logoutUserConfig,
  singupUserConfig,
  updateProfileConfig,
  verifyTokenConfig,
} from "../api/urlConstants";

export const signupUser = (data: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  userName: string;
  phoneNo: string;
  roles: string[];
}) => {
  const config = singupUserConfig(data);
  return backendService
    .request(config)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

export const logoutUser = () => {
  const userId = JSON.parse(localStorage.getItem("userId") || "");
  const authToken = JSON.parse(localStorage.getItem("authToken") || "");
  const config = logoutUserConfig({ userId, authToken });

  return backendService
    .request(config)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

export const loginUser = (data: { username: string; password: string }) => {
  const config = loginUserConfig(data);
  return backendService
    .request(config)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

export const verifyToken = (token: string, userName: string) => {
  const config = verifyTokenConfig(token, userName);
  return backendService
    .request(config)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

export const getProfileDetails = (username: string, token: string) => {
  const config = getProfileDetailsConfig(username, token);
  return backendService
    .request(config)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

export const updateProfileDetails = (
  userName: string,
  phoneNo: number,
  bankDetails: any,
  wallets: any,
  token: string
) => {
  const bankDetailsParams = bankDetails.map((bank: any) => ({
    bankName: bank.bankName,
    cardType: bank.bankCardType,
    cardName: bank.bankCardName,
    cardIssuer: bank.bankIssuerName,
  }));

  const walletDetailsParams = wallets.map((wallet: any) => ({
    walletName: wallet.walletName,
    walletType: wallet.walletType,
  }));

  const config = updateProfileConfig(
    userName,
    phoneNo,
    bankDetailsParams,
    walletDetailsParams,
    token
  );
  return backendService
    .request(config)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};
