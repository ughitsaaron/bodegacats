import { useRef, forwardRef } from "react";
import styles from "./modal.module.css";

type Props = {
  children:
    | React.ReactNode
    | ((props: { onClose: () => void }) => React.ReactNode);
  trigger:
    | React.ReactNode
    | ((props: { onClick: () => void }) => React.ReactNode);
};

// export function Modal({ children, trigger }: Props) {
//   const dialogRef = useRef<HTMLDialogElement>(null);

//   return (
//       <dialog ref={dialogRef} className={styles.dialog}>
//         {typeof children === "function"
//           ? children({ onClose: () => dialogRef.current?.close() })
//           : children}
//       </dialog>
//       {trigger &&
//         (typeof trigger === "function"
//           ? trigger({ onClick: () => dialogRef.current?.showModal() })
//           : trigger)}
//   );
// }

// const ModalTrigger =
// export function ModalTrigger({ children }: { children: React.ReactNode }) {
// "use client";
// }
