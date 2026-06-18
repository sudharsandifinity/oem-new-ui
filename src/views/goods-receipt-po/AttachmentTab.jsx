import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  CircularProgress,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography
} from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { getAttachments, clearAttachments } from '../../store/slices/attachmentSlice';

const API_BASE = import.meta.env.VITE_APP_API_BASE_URL || 'http://localhost:8005/api/v1';

export default function GRPOAttachmentTab({ attachmentEntry }) {
  const dispatch = useDispatch();
  const { attachments, loading, error } = useSelector((s) => s.attachment);

  useEffect(() => {
    if (attachmentEntry) {
      dispatch(getAttachments(attachmentEntry));
    }
    return () => {
      dispatch(clearAttachments());
    };
  }, [attachmentEntry, dispatch]);

  const openFile = async (att) => {
    const url = `${API_BASE}/ess/general/attachments/${att.AbsoluteEntry}/${encodeURIComponent(att.FileName)}/${att.FileExtension}`;
    try {
      const res = await fetch(url, { credentials: 'include' });
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, '_blank');
    } catch {
      alert(`Could not open attachment "${att.FileName}.${att.FileExtension}". Please contact support.`);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ py: 4, textAlign: 'center' }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, backgroundColor: 'grey.100', width: 50 }}>#</TableCell>
              <TableCell sx={{ fontWeight: 700, backgroundColor: 'grey.100' }}>File Name</TableCell>
              <TableCell sx={{ fontWeight: 700, backgroundColor: 'grey.100', width: 100 }}>Extension</TableCell>
              <TableCell sx={{ fontWeight: 700, backgroundColor: 'grey.100', width: 80 }}>View</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {attachments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                    <AttachFileIcon sx={{ fontSize: 32, opacity: 0.3 }} />
                    <Typography variant="body2">No attachments</Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              attachments.map((att, index) => (
                <TableRow key={att.AbsoluteEntry ?? index} hover>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{att.FileName}</TableCell>
                  <TableCell>{att.FileExtension}</TableCell>
                  <TableCell>
                    <Tooltip title="Open in new tab">
                      <IconButton size="small" color="primary" onClick={() => openFile(att)}>
                        <OpenInNewIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
