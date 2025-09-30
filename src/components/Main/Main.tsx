import type React from "react";
import styles from "./Main.module.css";
import Button from "../Button/Button";
import { StoryLine } from "../StoryLine/StoryLine";
import ProgressBar from "../ProgressBar/ProgressBar";
import { useTonAddress, useTonConnectUI } from "@tonconnect/ui-react";
import { useState, useEffect } from "react";
import { Modal } from "../Modal/Modal";
import { Tg } from "../../assets/icons/Tg";
import { X } from "../../assets/icons/X";
import { Gg } from "../../assets/icons/Gg";
import useNftCollectionContract from "../../hooks/useNftCollectionContract";
import { COLLECTION_ADDRESS, FEE } from "../../consts";
import { Address, Cell, Dictionary, toNano } from "@ton/core";
import useRoundContract from "../../hooks/useRoundContract";
import { getAddressIndex } from "../../helpers";


function getActiveRoundIndex(rounds: Array<{start: Date, durationMs: number}>) {
  const currentTime = Date.now();
  
  for (let i = 0; i < rounds.length; i++) {
    const round = rounds[i];
    const start = round.start.getTime();
    const end = start + round.durationMs;
    
    if (currentTime >= start && currentTime <= end) {
      return i;
    }
  }
  
  return null;
}

const points = [
  {
    id: "r1",
    label: "Round #1",
    start: new Date(1759226400 * 1000),
    durationMs: 60 * 30 * 1000,
    address: Address.parse("kQDYxH-ZqFlbbioUk03wfquScU2uyUb-ObfjaDmTVwaxbVkA"),
    dict: Cell.fromBase64(import.meta.env.VITE_DICT_CELL_1).beginParse().loadDictDirect(Dictionary.Keys.BigUint(256), Dictionary.Values.Address())
  },
  {
    id: "r2",
    label: "Round #2",
    start: new Date(1759230000 * 1000),
    durationMs: 60 * 30 * 1000,
    address: Address.parse("kQBTB9YaxFkPexY3wQEj7z840FeIXOeJbseopVYI5qh0ma_L"),
    dict: Cell.fromBase64(import.meta.env.VITE_DICT_CELL_2).beginParse().loadDictDirect(Dictionary.Keys.BigUint(256), Dictionary.Values.Address())
  },
  {
    id: "r3",
    label: "Round #3",
    start: new Date(1759231800 * 1000),
    durationMs: 60 * 30 * 1000,
    address: Address.parse("kQDMFjbSmM0Pukz2aQNNbJ-0h1_vqc2Wi6lOFqAVhskqmP5Z"),
    dict: Cell.fromBase64(import.meta.env.VITE_DICT_CELL_1).beginParse().loadDictDirect(Dictionary.Keys.BigUint(256), Dictionary.Values.Address()),

  },
  {
    id: "r4",
    label: "Round #4",
    start: new Date(1759233600 * 1000),
    durationMs: 60 * 60 * 24 * 1000,
    address: Address.parse("kQBiQsN8FEciIYsviRSCP1542jSD-5_-F3vaiezW5PttfKtk"),
    dict: Cell.fromBase64(import.meta.env.VITE_DICT_CELL_1).beginParse().loadDictDirect(Dictionary.Keys.BigUint(256), Dictionary.Values.Address()),
  },
];
export const Main: React.FC = () => {
  const rawAddress = useTonAddress(false);
  const address = useTonAddress();
  const [tonConnectUI] = useTonConnectUI();
  const [modalOpen, setModalOpen] = useState(false);
  const [entryIndex, setEntryIndex] = useState<number | null>(null);
  const nftCollectionContract = useNftCollectionContract(COLLECTION_ADDRESS);
  
  const activeRoundIndex = getActiveRoundIndex(points);
  const currentRoundNumber = activeRoundIndex !== null ? activeRoundIndex + 1 : 1;
  const currentRoundAddress = activeRoundIndex !== null ? points[activeRoundIndex].address : points[0].address;
  
  const roundContract = useRoundContract(currentRoundAddress);

  const handleMint = async () => {    
    if (!rawAddress) {
      return;
    }
    
    const entryIndex = getAddressIndex(rawAddress, currentRoundNumber);
    setEntryIndex(entryIndex);
    
    if (activeRoundIndex === null) {
      return;
    }
    
    if (nftCollectionContract.nextItemIndex === null || nftCollectionContract.nextItemIndex === undefined) {
      return;
    }
    
    if (roundContract.price === null || roundContract.price === undefined) {
      return;
    }
    
    if (entryIndex === -1) {
      return;
    }

    const dict = points[activeRoundIndex].dict;
    const merkleProof = dict.generateMerkleProof([BigInt(entryIndex)]);

    await roundContract.sendPurchase(
      toNano(roundContract.price) + FEE,
      BigInt(entryIndex), // queryId
      merkleProof,
      nftCollectionContract.nextItemIndex,
      BigInt(entryIndex),
    );
  }

  useEffect(() => {
    if (address) {
      const entryIndex = getAddressIndex(rawAddress, currentRoundNumber);
      setEntryIndex(entryIndex);
    } else {
      setEntryIndex(null);
    }
  }, [address, currentRoundNumber]);

  const canMint = address && entryIndex !== -1;

  const handleConnect = () => {
    if (!address) {
      return tonConnectUI.openModal();
    }
    return setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const disconnectWallet = () => {
    tonConnectUI.disconnect();
    closeModal();
  };

  const shortAddress = address ? `${address.slice(0, 4)}...${address.slice(-2)}` : "";

  return (
    <div className={styles.container}>
      <Modal
        title="DO YOU WISH TO DISCONNECT THE WALLET CONNECTION?"
        isOpen={modalOpen}
        onClose={closeModal}>
        <div className={styles.modal_buttons}>
          <Button
            onClick={disconnectWallet}
            size="small">
            YES
          </Button>
          <Button
            onClick={closeModal}
            size="small">
            NO
          </Button>
        </div>
      </Modal>
      <div className={styles.glass}>
        <div className={styles.header}>
          <div className={styles.logo}>
            <a
              href="https://t.me/StupedCoyn"
              target="_blank">
              <Tg />
            </a>
            <a
              href="https://t.me/StupedCoyn"
              target="_blank">
              <X />
            </a>
            <a
              href="https://getgems.io"
              target="_blank">
              <Gg />
            </a>
          </div>
          <span className={styles.name}>STUPED NFT</span>
          <Button
            size="small"
            onClick={handleConnect}>
            {shortAddress || "Connect Wallet"}
          </Button>
        </div>
        <StoryLine points={points} />
        <ProgressBar
          value={nftCollectionContract.nextItemIndex ? Number(nftCollectionContract.nextItemIndex - 1n) : 0}
          max={5555}
        />
        <Button
          size="large"
          onClick={handleMint}
          disabled={!canMint}
          className={styles.button}>
          MINT
        </Button>
        <div className={styles.rounds}>
          {points.map((point) => (
            <div key={point.id}>
              {point.label} - starts at {point.start.toLocaleTimeString('en-GB', { timeZone: 'UTC' })} GMT+0 for {
                point.durationMs > 59 * 60 * 1000 
                  ? `${(point.durationMs / (60 * 60 * 1000))} hours`
                  : `${point.durationMs / (60 * 1000)} minutes`
              }
            </div>
          ))}
        </div>
        <div className={styles.logo_bottom}>
          <a
            href="https://t.me/StupedCoyn"
            target="_blank">
            <Tg />
          </a>
          <a
            href="https://t.me/StupedCoyn"
            target="_blank">
            <X />
          </a>
          <a
            href="https://getgems.io"
            target="_blank">
            <Gg />
          </a>
        </div>
      </div>
    </div>
  );
};
