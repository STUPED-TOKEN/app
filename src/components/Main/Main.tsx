import type React from "react";
import styles from "./Main.module.css";
import Button from "../Button/Button";
import { StoryLine } from "../StoryLine/StoryLine";
import type { EnrichedStoryPoint } from "../StoryLine/StoryLine";
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
import { Counter } from "../Counter/Counter";

const points = [
  {
    id: "r1",
    label: "Round #1",
    start: new Date(1760004000 * 1000),
    durationMs: 60 * 30 * 1000,
    address: Address.parse("kQBywi4e6gISQ9fm-pCPUa31oYwreD9-zdO2Qb7PZYjmQoi8"),
    dict: Cell.fromBase64("te6cckEBAwEATgACA8/4AQIAQyAHzFJtT1rFTuHyfXzl94UQ59hHX/o20riTxdJbn/414xwAQyAA5z2iGqWMVqB8REOUoVyaGvXFvcX46LvgSmwHTfL5LHyxOK1K")
      .beginParse()
      .loadDictDirect(Dictionary.Keys.BigUint(256), Dictionary.Values.Address()),
  },
  {
    id: "r2",
    label: "Round #2",
    start: new Date(1760005800 * 1000),
    durationMs: 60 * 30 * 1000,
    address: Address.parse("kQCyla34KhrJZSyID6fTshEsFhKFwIdqplfHjKHlO2poB7FX"),
    dict: Cell.fromBase64("te6cckEBAwEATgACA8/4AQIAQyAA5z2iGqWMVqB8REOUoVyaGvXFvcX46LvgSmwHTfL5LHwAQyADEtILwLCyawmdRYQsD56FNShlruWT6c0XSxTGKlHpT4xfhbQ9")
      .beginParse()
      .loadDictDirect(Dictionary.Keys.BigUint(256), Dictionary.Values.Address()),
  },
  {
    id: "r3",
    label: "Round #3",
    start: new Date(1760007600 * 1000),
    durationMs: 60 * 30 * 1000,
    address: Address.parse("kQCbUAJPvD2QwuEWurzzA_x2Ba3iFD9L6GicCCjEVM6O3dyc"),
    dict: Cell.fromBase64("te6cckEBAwEATgACA8/4AQIAQyAHzFJtT1rFTuHyfXzl94UQ59hHX/o20riTxdJbn/414xwAQyAA5z2iGqWMVqB8REOUoVyaGvXFvcX46LvgSmwHTfL5LHyxOK1K")
      .beginParse()
      .loadDictDirect(Dictionary.Keys.BigUint(256), Dictionary.Values.Address()),
  },
  {
    id: "r4",
    label: "Round #4",
    start: new Date(1760009400 * 1000),
    durationMs: 60 * 60 * 24 * 1000,
    address: Address.parse("kQBTYsftO_45EjLTzIq6i6fRezBf2_qLgrygIGWwe6hHtd3v"),
    dict: Cell.fromBase64("te6cckEBAwEATgACA8/4AQIAQyAA5z2iGqWMVqB8REOUoVyaGvXFvcX46LvgSmwHTfL5LHwAQyADEtILwLCyawmdRYQsD56FNShlruWT6c0XSxTGKlHpT4xfhbQ9")
      .beginParse()
      .loadDictDirect(Dictionary.Keys.BigUint(256), Dictionary.Values.Address()),
  },
];
export const Main: React.FC = () => {
  const rawAddress = useTonAddress(false);
  const address = useTonAddress();
  const [tonConnectUI] = useTonConnectUI();
  const [modalOpen, setModalOpen] = useState(false);
  const [entryIndex, setEntryIndex] = useState<number | null>(null);
  const [counterValue, setCounterValue] = useState(0);
  const nftCollectionContract = useNftCollectionContract(COLLECTION_ADDRESS);
  const [currentPoint, setCurrentPoint] = useState<EnrichedStoryPoint | null>(null);
  const currentRoundNumber = points.findIndex((point) => point.id === currentPoint?.id);
  
  const handleMint = async () => {
    if (!rawAddress) {
      return;
    }

    const entryIndex = getAddressIndex(rawAddress, currentRoundNumber);
    setEntryIndex(entryIndex);

    if (currentPoint === null) {
      return;
    }

    const roundContract = useRoundContract(currentPoint?.address);

    if (nftCollectionContract.nextItemIndex === null || nftCollectionContract.nextItemIndex === undefined) {
      return;
    }

    if (roundContract.price === null || roundContract.price === undefined) {
      return;
    }

    if (entryIndex === -1) {
      return;
    }

    const dict = currentPoint?.dict;
    const merkleProof = dict.generateMerkleProof([BigInt(entryIndex)]);

    let quantity = BigInt(counterValue);

    await roundContract.sendPurchase(
      (toNano(roundContract.price) + FEE) * quantity,
      BigInt(entryIndex), // queryId
      merkleProof,
      nftCollectionContract.nextItemIndex,
      BigInt(entryIndex),
      quantity
    );
  };

  useEffect(() => {
    if (address) {
      const entryIndex = getAddressIndex(rawAddress, currentRoundNumber);
      setEntryIndex(entryIndex);
    } else {
      setEntryIndex(null);
    }
  }, [address, currentRoundNumber]);

  const canMint = address && (entryIndex !== -1 || currentRoundNumber === 3 || currentRoundNumber === 4);

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
        <StoryLine
          points={points}
          setCurrentPoint={setCurrentPoint}
        />
        <ProgressBar
          value={nftCollectionContract.nextItemIndex ? Number(nftCollectionContract.nextItemIndex) : 0}
          max={5555}
        />

        <div className={styles.button_group}>
          <Counter 
            size="large" 
            onCountChange={setCounterValue}
          />
          <Button
            size="large"
            onClick={handleMint}
            disabled={!canMint}
            className={styles.mint}>
            MINT
          </Button>
        </div>
        <div className={styles.rounds}>
          {points.map((point) => (
            <div key={point.id}>
              {point.label} - starts at {point.start.toLocaleTimeString("en-GB", { timeZone: "UTC" })} GMT+0 for{" "}
              {point.durationMs > 59 * 60 * 1000 ? `${point.durationMs / (60 * 60 * 1000)} hours` : `${point.durationMs / (60 * 1000)} minutes`}
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
