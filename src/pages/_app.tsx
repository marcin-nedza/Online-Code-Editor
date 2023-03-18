import { type AppType } from "next/app";

import { api } from "../utils/api";

import "../styles/globals.css";
import ManageProjectProvider from "../contexts/manageProjectContext";

const MyApp: AppType = ({
  Component,
  pageProps: {  ...pageProps },
}) => {
  return (
        <ManageProjectProvider>

      <Component {...pageProps} />
        </ManageProjectProvider>
  );
};

export default api.withTRPC(MyApp);
