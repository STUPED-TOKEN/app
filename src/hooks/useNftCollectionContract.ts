import useAsyncInitialize from "./useAsyncInitialize";
import type { Cell, OpenedContract } from "@ton/core";
import { Address } from "@ton/core";
import useTonClient from "./useTonClient";
import { NftCollection } from "../contracts/nftCollection";
import { useEffect, useState } from "react";
import { sleep } from "../helpers";


export default function useNftCollectionContract(address: Address) {
  const client = useTonClient();

  const [contractData, setContractData] = useState<null | {
    nextItemIndex: bigint,
    content: Cell,
    nftItemCode: Cell,
  }>();

  const nftCollectionContract = useAsyncInitialize(async () => {
    if (!client) return;
    const contract = new NftCollection(address);
    return client.open(contract) as OpenedContract<NftCollection>
  }, [client]);

  useEffect(() => {
    async function getValue() {
      if (!nftCollectionContract) return;
      setContractData(null);
      const val = await nftCollectionContract.getCollectionData();
      setContractData({
        nextItemIndex: val.nextItemIndex,
        content: val.content,
        nftItemCode: val.nftItemCode,
      });
      await sleep(5000);
      getValue();
    }

    getValue();
  }, [nftCollectionContract])

  return {
    address: nftCollectionContract?.address.toString(),
    ...contractData,
  };
}
