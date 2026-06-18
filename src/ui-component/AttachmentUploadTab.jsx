import { Box, Button, IconButton, Paper, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PreviewIcon from '@mui/icons-material/Preview';

const createAttachmentRow = (id) => ({ id, file: null, fileName: '' });

export default function AttachmentUploadTab({ data, setData }) {
  const attachments = data.Attachments2_Lines || [];

  const handleFileChange = (id, event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setData((prev) => ({
      ...prev,
      Attachments2_Lines: prev.Attachments2_Lines.map((row) => (row.id === id ? { ...row, file, fileName: file.name } : row))
    }));
  };

  const addMore = () => {
    setData((prev) => ({
      ...prev,
      Attachments2_Lines: [...prev.Attachments2_Lines, createAttachmentRow(Date.now())]
    }));
  };

  const remove = (id) => {
    setData((prev) => ({
      ...prev,
      Attachments2_Lines: prev.Attachments2_Lines.filter((row) => row.id !== id)
    }));
  };

  const preview = (file) => {
    if (!file) return;
    window.open(URL.createObjectURL(file), '_blank');
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {attachments.map((row) => (
          <Paper key={row.id} variant="outlined" sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
              <Button variant="outlined" component="label">
                Upload
                <input hidden type="file" onChange={(e) => handleFileChange(row.id, e)} />
              </Button>
              <TextField size="small" label="File Name" value={row.fileName} disabled sx={{ flex: 1, minWidth: { xs: '100%', sm: 250 } }} />
              <Button variant="outlined" startIcon={<PreviewIcon />} disabled={!row.file} onClick={() => preview(row.file)}>
                Preview
              </Button>
              <IconButton color="error" onClick={() => remove(row.id)}>
                <DeleteIcon />
              </IconButton>
            </Box>
          </Paper>
        ))}
      </Box>
      <Box sx={{ mt: 3 }}>
        <Button variant="contained" onClick={addMore}>
          Add More
        </Button>
      </Box>
    </Box>
  );
}
