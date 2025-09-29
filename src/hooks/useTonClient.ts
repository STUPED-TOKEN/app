import { TonClient4 } from "@ton/ton";
import useAsyncInitialize from "./useAsyncInitialize";
import { IS_TESTNET } from "../consts";

export default function useTonClient() {
    return useAsyncInitialize(
        async () =>
            new TonClient4({
                endpoint: IS_TESTNET ? 'https://testnet-v4.tonhubapi.com/' : 'https://mainnet-v4.tonhubapi.com/',
            }),
    )
}