import type {Contract, ContractProvider, Sender} from "@ton/core";
import { Address, beginCell, Cell, SendMode } from '@ton/core';


export type RoundConfig = {
    merkleRoot: bigint;
    helperCode: Cell;
    startTime: bigint;
    endTime: bigint;
    collectionAddress: Address;
    admin: Address;
    price: bigint;
    buyerLimit: bigint;
    available: bigint;
    needProof: boolean;
};

export function roundConfigToCell(config: RoundConfig): Cell {
    return beginCell()
    .storeUint(config.merkleRoot, 256)
    .storeRef(config.helperCode)
    .storeUint(config.startTime, 64)
    .storeUint(config.endTime, 64)
    .storeAddress(config.collectionAddress)
    .storeAddress(config.admin)
    .storeUint(config.price, 64)
    .storeBit(config.needProof)
    .storeRef(beginCell()
        .storeUint(config.buyerLimit, 32)
        .storeUint(config.available, 32)
        .endCell())
    .endCell();
}

export class Round implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new Round(address);
    }

    async sendPurchase(provider: ContractProvider, via: Sender, value: bigint, queryId: bigint, merkleProof: Cell, index: bigint, entryIndex: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(123, 32)
                .storeUint(queryId, 64)
                .storeRef(merkleProof)
                .storeUint(index, 32)
                .storeUint(entryIndex, 256)
                .endCell(),
        });
    }

    async getContractData(provider: ContractProvider) {
        const result = await provider.get('get_contract_data', []);
        return {
            merkleRoot: result.stack.readBigNumber(),
            helperCode: result.stack.readCell(),
            startTime: result.stack.readBigNumber(),
            endTime: result.stack.readBigNumber(),
            collectionAddress: result.stack.readAddress(),
            admin: result.stack.readAddress(),
            price: result.stack.readBigNumber(),
            needProof: result.stack.readBoolean(),
            buyerLimit: result.stack.readBigNumber(),
            available: result.stack.readBigNumber(),
        };
    }
}
