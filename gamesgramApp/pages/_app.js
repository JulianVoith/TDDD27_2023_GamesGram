import "@/styles/globals.css";
import "bootstrap/dist/css/bootstrap.css";
import { Provider } from "../context/Context";
import { useEffect, useState } from "react";

export default function App({ Component, pageProps }) {

  return (
    <Provider>
      <Component {...pageProps} />
    </Provider>
  );
}
