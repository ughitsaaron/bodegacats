"use client";

import styles from "./upload.module.css";
import { Modal } from "@/components/Modal";

export default function Upload() {
  return (
    <Modal trigger={<div className={styles.upload}>+</div>}>
      <form>
        <label>
          Upload image <input type="file" />
        </label>
        <div className={styles.flex}>
          <button>Cancel</button>
          <button>Save</button>
        </div>
      </form>
    </Modal>
  );
}
