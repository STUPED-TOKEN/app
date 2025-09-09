import type React from "react";
import styles from "./Main.module.css";
import Button from "../Button/Button";
import { StoryLine } from "../StoryLine/StoryLine";
import ProgressBar from "../ProgressBar/ProgressBar";
import { useTonAddress, useTonConnectUI } from "@tonconnect/ui-react";

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
];
export const Main: React.FC = () => {
  const address = useTonAddress();
  const [tonConnectUI] = useTonConnectUI();

  const handleConnect = () => {
    if (!address) tonConnectUI.openModal();
  };

  const shortAddress = address ? `${address.slice(0, 4)}...${address.slice(-2)}` : "";

  return (
    <div className={styles.container}>
      <div className={styles.glass}>
        <div className={styles.header}>
          <div className={styles.logo}>
            <span>tg</span>
            <span>x</span>
            <span>gg</span>
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
        <p className={styles.text}>
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley
          of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was
          popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of
          Lorem Ipsum.
        </p>
      </div>
    </div>
  );
};
