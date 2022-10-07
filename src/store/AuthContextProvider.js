import AppContext from "./store";
import { useState, useEffect, useCallback } from "react";

let logoutTimer;

const calculateRemianingTime = (expirationTime) => {
  const currentTime = new Date().getTime();


  console.log('curT  ' + currentTime)
  const adjExpirationTime = new Date(expirationTime).getTime();
console.log('adjT  '+adjExpirationTime)
  const remainingDuration = adjExpirationTime - currentTime;

  return remainingDuration;
};

const retreiveStoredToken = () => {
  const storedToken = localStorage.getItem("token");
  const storedExpirationTime = localStorage.getItem("expirationTime");

  const remainingTime = calculateRemianingTime(storedExpirationTime);

  console.log(remainingTime)

  if (remainingTime <= 36000) {
    localStorage.removeItem("token");
    localStorage.removeItem("expirationTime");
    return null;
  }

  return {
    token: storedToken,
    duration: remainingTime,
  };
};

function AuthContextProvider(props) {
  const tokenData = retreiveStoredToken();
  let initialToken;

  if (tokenData) {
    initialToken = tokenData.token;
  }
  const [token, setToken] = useState(initialToken);

  const userIsLoggedIn = !!token;

  const logoutHandler = useCallback(() => {
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("expirationTime");

    if (logoutTimer) {
      clearTimeout(logoutTimer);
    }
  }, []);

  const loginHandler = (token, expirationTime) => {
    setToken(token);
    localStorage.setItem("token", token);
    localStorage.setItem("expirationTime", expirationTime);

    const remainingTime = calculateRemianingTime(expirationTime);

    logoutTimer = setTimeout(logoutHandler, remainingTime);
  };

  //Use Effect Approach for login persistence
  /*
  useEffect(() => {
    const isOnline = localStorage.getItem("token");

    if (isOnline) {
      setToken(isOnline);
    }
  }, []);
*/

  useEffect(() => {
    if (tokenData) {
      logoutTimer = setTimeout(logoutHandler, tokenData.duration);
    }
  }, [tokenData, logoutHandler]);

  const dynamicContext = {
    logout: logoutHandler,
    login: loginHandler,
    token: token,
    isLoggedIn: userIsLoggedIn,
  };

  return (
    <AppContext.Provider value={dynamicContext}>
      {props.children}
    </AppContext.Provider>
  );
}

export default AuthContextProvider;
