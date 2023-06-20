import React, { useEffect } from "react";
import { Layout } from "antd";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import { updateAppName, updateIsLoggedIn } from "./redux/slices/app";
import RoutesWrapper from "./routes";
import { BrowserRouter } from "react-router-dom";
import useLocalStorage from "./hooks/LocalStorage";

const { Header, Footer, Sider, Content } = Layout;

const App = () => {
  const { appName } = useAppSelector((state) => state.app);
  const [isLoggedIn, setIsLoggedIn] = useLocalStorage("isLoggedIn", "");
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(updateIsLoggedIn(isLoggedIn));

    setTimeout(() => {
      dispatch(updateAppName("New name"));
    });
  }, []);

  return (
    <BrowserRouter>
      <RoutesWrapper />
    </BrowserRouter>
  );
};

export default App;
