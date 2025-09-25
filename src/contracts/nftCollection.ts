import type{Contract, ContractProvider} from "@ton/core";
import { Address, Cell } from '@ton/core';


export class NftCollection implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new NftCollection(address);
    }

    async getCollectionData(provider: ContractProvider) {
        const result = await provider.get("get_collection_data", []);

        return {
            nextItemIndex: result.stack.readBigNumber(),
            content: result.stack.readCell(),
            nftItemCode: result.stack.readCell(),
        };
    }
}
