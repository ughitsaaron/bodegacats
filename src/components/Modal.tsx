"use client";

import { useRef } from "react";
import styles from "./modal.module.css";

type Props = {
  children: React.ReactNode;
  trigger: React.ReactNode;
};

export function Modal({ children, trigger }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button
        onClick={() => {
          dialogRef.current?.showModal();
        }}
      >
        {trigger}
      </button>
      <div className={styles.backdrop}>
        <dialog ref={dialogRef} className={styles.dialog}>
          {children}
        </dialog>
      </div>
    </>
  );
}
