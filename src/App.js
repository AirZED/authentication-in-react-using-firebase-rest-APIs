import { Switch, Route, Redirect } from "react-router-dom";
import { useContext } from "react";
import AppContext from "./store/store";

import Layout from "./components/Layout/Layout";
import UserProfile from "./components/Profile/UserProfile";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";

function App() {
  const AuthCtx = useContext(AppContext);

  const isLoggedIn = AuthCtx.isLoggedIn;
  return (
    <Layout>
      <Switch>
        <Route path="/" exact>
          <HomePage />
        </Route>
        {!isLoggedIn && (
          <Route path="/auth">
            <AuthPage />
          </Route>
        )}
        {isLoggedIn && (
          <Route path="/profile">
            <UserProfile />
          </Route>
        )}
        <Route path={"*"}>
          <Redirect to={"/"} />
        </Route>
      </Switch>
    </Layout>
  );
}

export default App;
