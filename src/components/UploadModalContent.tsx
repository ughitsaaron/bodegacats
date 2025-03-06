"use client";

import {
  Button,
  Box,
  Typography,
  useTheme,
  CircularProgress,
} from "@mui/material";
import { useMap } from "@/contexts/map";
import { useState, useCallback } from "react";
import { Upload } from "@mui/icons-material";
import { createCat } from "@/db/operations/createCat";
import { useModal } from "./Modal";

type Props = {
  onUpload: (file: File) => void;
};

// Temporary user ID until we implement auth
const TEMP_USER_ID = "2e7ad2bb-8e5a-4dda-8455-314cc00e2359";

export function UploadModalContent({ onUpload }: Props) {
  const map = useMap();
  const theme = useTheme();
  const { close } = useModal();
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith("image/")) {
      setSelectedFile(file);
      setError(null);
    } else {
      setError("Please select an image file");
    }
  }, []);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setSelectedFile(file);
        setError(null);
      }
    },
    []
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!selectedFile || !map?.map) return;

      try {
        setIsUploading(true);
        setError(null);

        const center = map.map.getCenter();
        const result = await createCat({
          lat: center.lat,
          lng: center.lng,
          creatorId: TEMP_USER_ID,
          photoFile: selectedFile,
        });

        if (result.success) {
          onUpload(selectedFile);
          close();
        } else {
          setError(result.error || "Failed to upload cat");
        }
      } catch (err) {
        setError("An unexpected error occurred");
        console.error(err);
      } finally {
        setIsUploading(false);
      }
    },
    [selectedFile, map, onUpload, close]
  );

  return (
    <form onSubmit={handleSubmit}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        <Box
          component="label"
          htmlFor="file-upload"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          sx={{
            border: `2px dashed ${
              isDragging ? theme.palette.primary.main : theme.palette.divider
            }`,
            borderRadius: 1,
            p: 3,
            textAlign: "center",
            cursor: "pointer",
            transition: "all 0.2s ease-in-out",
            bgcolor: isDragging ? "rgba(144, 202, 249, 0.08)" : "transparent",
            "&:hover": {
              borderColor: theme.palette.primary.main,
              bgcolor: "rgba(144, 202, 249, 0.08)",
            },
          }}
        >
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            name="file"
            onChange={handleFileSelect}
            style={{ display: "none" }}
            disabled={isUploading}
          />
          <Upload
            sx={{ fontSize: 40, color: theme.palette.primary.main, mb: 1 }}
          />
          <Typography variant="body1" color="text.primary" gutterBottom>
            {selectedFile
              ? selectedFile.name
              : "Drag and drop an image here, or click to select"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Supports: JPG, PNG, GIF
          </Typography>
        </Box>

        {error && (
          <Typography
            color="error"
            variant="body2"
            sx={{ textAlign: "center" }}
          >
            {error}
          </Typography>
        )}

        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={!selectedFile || isUploading}
          sx={{
            py: 1.5,
            textTransform: "none",
            fontSize: "1rem",
            position: "relative",
          }}
        >
          {isUploading ? (
            <>
              <CircularProgress
                size={24}
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  marginTop: "-12px",
                  marginLeft: "-12px",
                }}
              />
              <span style={{ visibility: "hidden" }}>Upload Cat Photo</span>
            </>
          ) : (
            "Upload Cat Photo"
          )}
        </Button>
      </Box>
    </form>
  );
}
