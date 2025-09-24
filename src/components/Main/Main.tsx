import type React from "react";
import styles from "./Main.module.css";
import Button from "../Button/Button";
import { StoryLine } from "../StoryLine/StoryLine";
import ProgressBar from "../ProgressBar/ProgressBar";
import { useTonAddress, useTonConnectUI } from "@tonconnect/ui-react";
import { useState } from "react";
import { Modal } from "../Modal/Modal";
import { Tg } from "../../assets/icons/Tg";
import { X } from "../../assets/icons/X";
import { Gg } from "../../assets/icons/Gg";

const now = Date.now();

const points = [
  {
    id: "r1",
    label: "Round #1",
    start: new Date(now - 2 * 60 * 60 * 1000),
    durationMs: 60 * 60 * 1000,
  },
  {
    id: "r2",
    label: "Round #2",
    start: new Date(now - 10 * 60 * 1000),
    durationMs: 60 * 60 * 1000,
  },
  {
    id: "r3",
    label: "Round #3",
    start: new Date(now + 2 * 60 * 60 * 1000),
    durationMs: 60 * 60 * 1000,
  },
  {
    id: "r3",
    label: "Round #4",
    start: new Date(now + 3 * 60 * 60 * 1000),
    durationMs: 60 * 60 * 1000,
  },
];
export const Main: React.FC = () => {
  const address = useTonAddress();
  const [tonConnectUI] = useTonConnectUI();
  const [modalOpen, setModalOpen] = useState(false);

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
              href="https://web.telegram.org/"
              target="_blank">
              <Tg />
            </a>
            <a
              href="https://x.com"
              target="_blank">
              <X />
            </a>
            <a
              href="https://gg.com"
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
          value={3000}
          max={5555}
        />
        <Button
          size="large"
          className={styles.button}>
          MINT
        </Button>
        <div className={styles.rounds}>
          {points.map((point) => (
            <div key={point.id}>
              {point.label} - starts at {point.start.toLocaleTimeString()} for {point.durationMs / (60 * 1000)} minutes
            </div>
          ))}
        </div>
        <div className={styles.logo_bottom}>
          <a
            href="https://web.telegram.org/"
            target="_blank">
            <Tg />
          </a>
          <a
            href="https://x.com"
            target="_blank">
            <X />
          </a>
          <a
            href="https://gg.com"
            target="_blank">
            <Gg />
          </a>
        </div>
      </div>
    </div>
  );
};
