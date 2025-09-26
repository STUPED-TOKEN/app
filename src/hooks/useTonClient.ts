import { TonClient4 } from "@ton/ton";
import useAsyncInitialize from "./useAsyncInitialize";

export default function useTonClient() {
    return useAsyncInitialize(
        async () =>
            new TonClient4({
                endpoint: 'https://mainnet-v4.tonhubapi.com/',
            }),
    )
}