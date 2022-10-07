import { useContext, useRef } from "react";
import { useHistory } from "react-router-dom";
import AppContext from "../../store/store";
import API_KEY from "../../lib/API_KEY";

import classes from "./ProfileForm.module.css";

const ProfileForm = () => {
  const history = useHistory();
  const newPasswordRef = useRef();
  const authCtx = useContext(AppContext);

  const handleChangePassword = (event) => {
    event.preventDefault();

    const enteredNewPassword = newPasswordRef.current.value;

    if (!enteredNewPassword) {
      return;
    }

    fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${API_KEY}`,
      {
        method: "POST",
        body: JSON.stringify({
          password: enteredNewPassword,
          idToken: authCtx.token,
          returnSecureToken: false,
        }),
        headers: { "Content-Type": "application/json" },
      }
    )
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw new Error("Request Failed");
      })
      .then((data) => {
        console.log(data);
        history.replace("/");
      })
      .catch((error) => {
        alert(error.message);
      });
  };
  return (
    <form className={classes.form} onSubmit={handleChangePassword}>
      <div className={classes.control}>
        <label htmlFor="new-password">New Password</label>
        <input ref={newPasswordRef} type="password" id="new-password" />
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
};

export default ProfileForm;
