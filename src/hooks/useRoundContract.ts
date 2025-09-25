import useAsyncInitialize from "./useAsyncInitialize";
import type { OpenedContract } from "@ton/core";
import { Address, toNano } from "@ton/core";
import useTonConnect from "./useTonConnect";
import useTonClient from "./useTonClient";
import { Round } from "../contracts/round";
import { useEffect, useState } from "react";
import { Cell } from "@ton/core";
import { sleep } from "../helpers";


export default function useRoundContract(address: Address) {
  const client = useTonClient();
  const { sender } = useTonConnect();
  
  const [contractData, setContractData] = useState<null | {
    merkleRoot: bigint,
    helperCode: Cell,
    startTime: bigint,
    endTime: bigint,
    collectionAddress: Address,
    admin: Address,
    price: bigint,
    needProof: boolean,
    buyerLimit: bigint,
    available: bigint,
  }>();

  const roundContract = useAsyncInitialize(async () => {
    if (!client) return;
    const contract = new Round(address);
    return client.open(contract) as OpenedContract<Round>
  }, [client]);

  useEffect(() => {
    async function getValue() {
      if (!roundContract) return;
      setContractData(null);
      const val = await roundContract.getContractData();
      setContractData({
        merkleRoot: val.merkleRoot,
        helperCode: val.helperCode,
        startTime: val.startTime,
        endTime: val.endTime,
        collectionAddress: val.collectionAddress,
        admin: val.admin,
        price: val.price,
        needProof: val.needProof,
        buyerLimit: val.buyerLimit,
        available: val.available,
      });
      await sleep(5000);
      getValue();
    }

    getValue();
  }, [roundContract])

  return {
    address: roundContract?.address.toString(),
    ...contractData,
    sendPurchase: async (queryId: bigint, nextItemIndex: bigint, entryIndex: bigint) => {
        return roundContract?.sendPurchase(sender, toNano("0.05"), queryId, nextItemIndex, entryIndex);
    },
  };
}
