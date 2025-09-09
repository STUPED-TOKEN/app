import "./App.css";
import { Main } from "./components/Main/Main";
import { TonConnectUIProvider } from "@tonconnect/ui-react";

function App() {
  return (
    <TonConnectUIProvider manifestUrl={import.meta.env.VITE_TONCONNECT_MANIFEST_URL}>
      <Main />
    </TonConnectUIProvider>
  );
}

export default App;
