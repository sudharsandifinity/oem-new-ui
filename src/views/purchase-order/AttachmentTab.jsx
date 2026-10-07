import { useState } from 'react';

// material-ui
import {
  Box,
  Button,
  IconButton,
  Paper,
  TextField
} from '@mui/material';

// icons
import DeleteIcon from '@mui/icons-material/Delete';
import PreviewIcon from '@mui/icons-material/Preview';

const createAttachmentRow = (id) => ({
  id,
  file: null,
  fileName: ''
});

export default function AttachmentTab({ data, setData, readOnly = false }) {
  const attachments = data.Attachments2_Lines || [];

  const handleFileChange = (id, event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const updated = attachments.map((row) =>
      row.id === id
        ? {
            ...row,
            file,
            fileName: file.name
          }
        : row
    );

    setData((prev) => ({
      ...prev,
      Attachments2_Lines: updated
    }));
  };

  const addMoreAttachment = () => {
    setData((prev) => ({
      ...prev,
      Attachments2_Lines: [
        ...prev.Attachments2_Lines,
        createAttachmentRow(
          prev.Attachments2_Lines.length + 1
        )
      ]
    }));
  };

  const removeAttachment = (id) => {
    setData((prev) => ({
      ...prev,
      Attachments2_Lines:
        prev.Attachments2_Lines.filter(
          (row) => row.id !== id
        )
    }));
  };

  const previewFile = (file) => {
    if (!file) return;

    const fileUrl =
      URL.createObjectURL(file);

    window.open(fileUrl, '_blank');
  };

  return (
    <Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}
      >
        {(data.Attachments2_Lines || []).map((row) => (
          <Paper
            key={row.id}
            variant="outlined"
            sx={{
              p: 2
            }}
          >
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                alignItems: 'center',
                flexWrap: 'wrap'
              }}
            >

              {!readOnly && (
                <Button
                  variant="outlined"
                  component="label"
                >
                  Upload

                  <input
                    hidden
                    type="file"
                    onChange={(e) =>
                      handleFileChange(
                        row.id,
                        e
                      )
                    }
                  />
                </Button>
              )}

              <TextField
                size="small"
                label="File Name"
                value={row.fileName}
                disabled
                sx={{
                  flex: 1,
                  minWidth: {
                    xs: '100%',
                    sm: 250
                  }
                }}
              />

              <Button
                variant="outlined"
                startIcon={
                  <PreviewIcon />
                }
                disabled={!row.file}
                onClick={() =>
                  previewFile(
                    row.file
                  )
                }
              >
                Preview
              </Button>

              {!readOnly && (
                <IconButton
                  color="error"
                  onClick={() =>
                    removeAttachment(
                      row.id
                    )
                  }
                >
                  <DeleteIcon />
                </IconButton>
              )}
            </Box>
          </Paper>
        ))}

        {readOnly && attachments.length === 0 && (
          <Paper variant="outlined" sx={{ p: 2 }}>
            <TextField size="small" fullWidth value="No attachments" disabled />
          </Paper>
        )}
      </Box>

      {!readOnly && (
        <Box sx={{ mt: 3 }}>
          <Button
            variant="contained"
            onClick={addMoreAttachment}
          >
            Add More
          </Button>
        </Box>
      )}
    </Box>
  );
}
