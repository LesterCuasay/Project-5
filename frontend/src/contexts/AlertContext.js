import { createContext, useState } from "react";

const initialState = {
  alertMessage: "",
  alertType: "",
};

const AlertContext = createContext({
  ...initialState,
  setAlert: () => {},
});

export const AlertProvider = ({ children }) => {
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");

  const setAlert = (alertMessage, alertType) => {
    setAlertMessage(alertMessage);
    setAlertType(alertType);

    setTimeout(() => {
      setAlertMessage("");
      setAlertType("");
    }, 3000);
  };
};

return (
  <AlertContext.Provider value={{ alertMessage, alertType, setAlert }}>
    {children}
  </AlertContext.Provider>
);

export default AlertContext;
