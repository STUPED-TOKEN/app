import "./App.css";
import { Main } from "./components/Main/Main";
import { TonConnectUIProvider } from "@tonconnect/ui-react";

function App() {
  return (
    <TonConnectUIProvider manifestUrl={"https://raw.githubusercontent.com/ton-community/tma-usdt-payments-demo/refs/heads/master/public/tonconnect-manifest.json"}>
      <Main />
    </TonConnectUIProvider>
  );
}

export default App;
