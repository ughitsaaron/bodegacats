'use client';
import { useMap } from "@/contexts/map"
import styles from './upload.module.css'

export function Upload() {
  const { map } = useMap();

  const center = map?.getCenter();

  return (
    <div className={styles.backdrop}>
      <div className={styles.dialog}>
        <dialog open={true}>
          <label>
            Upload image
            <input type="file" />
          </label>
          <button>Save</button>
        </dialog>
      </div>
    </div>
  )
}
