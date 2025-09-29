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

const now = Date.now();

const ROUND1_START_DELAY = -1 * 60 * 1000; // Начинается 1 минуту назад для тестирования
const ROUND_INTERVAL = 35 * 60 * 1000;

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
    start: new Date(now + ROUND1_START_DELAY),
    durationMs: 60 * 30 * 1000,
    address: Address.parse("kQAlcCrkkjBp1BtN32uDEz0pxp0VzRaOv7eNkr3vads4890W"),
    dict: Cell.fromBase64(import.meta.env.VITE_DICT_CELL_1).beginParse().loadDictDirect(Dictionary.Keys.BigUint(256), Dictionary.Values.Address())
  },
  {
    id: "r2",
    label: "Round #2",
    start: new Date(now + ROUND1_START_DELAY + ROUND_INTERVAL), // через 39 минут
    durationMs: 60 * 30 * 1000,
    address: Address.parse("kQAcTkyKjmGuyQn6x3TcrHDaqlwr_1t5K22hacDN19hYVB_X"),
    dict: Cell.fromBase64(import.meta.env.VITE_DICT_CELL_2).beginParse().loadDictDirect(Dictionary.Keys.BigUint(256), Dictionary.Values.Address())
  },
  {
    id: "r3",
    label: "Round #3",
    start: new Date(now + ROUND1_START_DELAY + ROUND_INTERVAL * 2), // через 74 минуты
    durationMs: 60 * 30 * 1000,
    address: Address.parse("kQAoNQFb0IZ11x6K8Hg_a32pc_SmUs1Y_pLZILBe5N4-RNbV"),
    dict: Cell.fromBase64(import.meta.env.VITE_DICT_CELL_1).beginParse().loadDictDirect(Dictionary.Keys.BigUint(256), Dictionary.Values.Address()),

  },
  {
    id: "r4",
    label: "Round #4",
    start: new Date(now + ROUND1_START_DELAY + ROUND_INTERVAL * 3), // через 109 минут
    durationMs: 60 * 60 * 24 * 1000,
    address: Address.parse("kQBY7tcLwtnCPHrv8AfcBTFFoyETX2E7_m2k0l1gl1X_QOmC"),
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
              {point.label} - starts at {point.start.toLocaleTimeString()} for {
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
