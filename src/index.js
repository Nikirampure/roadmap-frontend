import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Auth0Provider } from "@auth0/auth0-react";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Auth0Provider
    domain="dev-zzp4cihrw17ga1ax.us.auth0.com"
    clientId="OiDBuHbkSJlv0ygQekfLKgiXhoV5J4oB"
    authorizationParams={{
      redirect_uri: window.location.origin,
    }}
  >
    <React.StrictMode>
      <App />
      <ToastContainer style={{ width: "400px" }} />
    </React.StrictMode>
  </Auth0Provider>,
);
