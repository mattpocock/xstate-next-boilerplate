import "../styles/globals.css";
import type { AppProps } from "next/app";
import { useInterpret } from "@xstate/react";
import {
  globalStateMachine,
  GlobalStateProvider,
} from "../machines/globalState.machine";
import { Layout } from "../lib/Layout";

function MyApp({ Component, pageProps }: AppProps) {
  /**
   * We use useInterpret, not useMachine. If we were to use
   * useMachine, the whole app would re-render whenever the
   * globalStateService changed state
   */
  const globalStateService = useInterpret(globalStateMachine);

  return (
    <GlobalStateProvider value={globalStateService}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </GlobalStateProvider>
  );
}
export default MyApp;
