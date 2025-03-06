"use client";

import type { PropsWithChildren } from "react";
import { Modal as MuiModal, Box, useTheme } from "@mui/material";
import { useState, createContext, useContext } from "react";
import Typography from "@mui/material/Typography";
import { uniqueId } from "lodash";

type ModalContextType = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

const ModalContext = createContext<ModalContextType | null>(null);

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("Modal components must be used within a Modal");
  }
  return context;
};

type ModalProps = PropsWithChildren<{
  defaultOpen?: boolean;
}>;

const Modal = ({ children, defaultOpen = false }: ModalProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return (
    <ModalContext.Provider value={{ isOpen, open, close }}>
      {children}
    </ModalContext.Provider>
  );
};

type TriggerProps = PropsWithChildren<{
  asChild?: boolean;
}>;

const Trigger = ({ children, asChild = false }: TriggerProps) => {
  const { open } = useModal();

  if (asChild) {
    return (
      <div onClick={open} role="button" tabIndex={0}>
        {children}
      </div>
    );
  }

  return (
    <div onClick={open} role="button" tabIndex={0}>
      {children}
    </div>
  );
};

type ContentProps = PropsWithChildren<{
  title?: string;
  description?: string;
}>;

const Content = ({ children, title, description }: ContentProps) => {
  const { isOpen, close } = useModal();
  const theme = useTheme();
  const titleId = uniqueId("modal-title");
  const descriptionId = uniqueId("modal-description");

  const baseTransform = "translate(-50%, -50%)";
  const transform = isOpen ? baseTransform : "translate(-50%, -48%)";

  return (
    <MuiModal
      open={isOpen}
      onClose={close}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      slotProps={{
        backdrop: {
          sx: {
            backgroundColor: "rgba(0, 0, 0, 0.2)",
            transition: "background-color 0.2s ease-in-out",
          },
        },
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform,
          width: 400,
          bgcolor: theme.palette.background.paper,
          boxShadow: theme.shadows[24],
          p: 4,
          borderRadius: 1,
          border: `1px solid ${theme.palette.divider}`,
          "&:focus-visible": {
            outline: "none",
          },
          transition: "transform 0.2s ease-in-out, opacity 0.2s ease-in-out",
          opacity: isOpen ? 1 : 0,
        }}
      >
        {title && (
          <Typography
            variant="h6"
            component="h2"
            id={titleId}
            sx={{
              color: theme.palette.text.primary,
              mb: 2,
            }}
          >
            {title}
          </Typography>
        )}
        {description && (
          <Typography
            id={descriptionId}
            sx={{
              mt: 2,
              color: theme.palette.text.secondary,
              mb: 3,
            }}
          >
            {description}
          </Typography>
        )}
        {children}
      </Box>
    </MuiModal>
  );
};

// Export individual components
export { Modal, Trigger, Content };

// Export the compound component
const ModalComponents = {
  Modal,
  Trigger,
  Content,
} as const;

export default ModalComponents;
