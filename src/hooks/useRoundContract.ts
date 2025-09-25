import useAsyncInitialize from "./useAsyncInitialize";
import type { OpenedContract } from "@ton/core";
import { Address, toNano } from "@ton/core";
import useTonConnect from "./useTonConnect";
import useTonClient from "./useTonClient";
import { Round } from "../contracts/round";


export default function useRoundContract(address: Address) {
  const client = useTonClient();
  const { sender } = useTonConnect();

  const roundContract = useAsyncInitialize(async () => {
    if (!client) return;
    const contract = new Round(address);
    return client.open(contract) as OpenedContract<Round>
  }, [client]);

  return {
    address: roundContract?.address.toString(),
    sendPurchase: async (queryId: bigint, nextItemIndex: bigint, entryIndex: bigint) => {
        return roundContract?.sendPurchase(sender, toNano("0.05"), queryId, nextItemIndex, entryIndex);
    },
  };
}
