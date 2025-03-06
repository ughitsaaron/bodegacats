"use client";

import { Fab } from "@mui/material";
import { Add } from "@mui/icons-material";
import { Box } from "@mui/material";
import { Modal, Trigger, Content } from "@/components/Modal";
import { UploadModalContent } from "@/components/UploadModalContent";
import { useCallback } from "react";

export function UploadButton() {
  const handleUpload = useCallback((file: File) => {
    // The server action will handle the upload and revalidation
    // We can add any client-side handling here if needed
    console.log("Cat photo uploaded:", file.name);
  }, []);

  return (
    <Modal>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "flex-end",
          height: "100vh",
          padding: 4,
        }}
      >
        <Trigger>
          <Fab color="primary" aria-label="add">
            <Add />
          </Fab>
        </Trigger>
      </Box>
      <Content title="Add a cat" description="Add a cat to the map">
        <UploadModalContent onUpload={handleUpload} />
      </Content>
    </Modal>
  );
}
