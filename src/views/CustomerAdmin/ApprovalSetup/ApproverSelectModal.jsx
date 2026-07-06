import { useState, useMemo, useEffect } from 'react';
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export default function ApproverSelectModal({ open, onClose, onConfirm, users = [], loading = false, initialSelected = [] }) {
  const [selectedIds, setSelectedIds] = useState([]);
  const [filters, setFilters] = useState({ name: '', email: '' });

  useEffect(() => {
    if (!open) return;
    setSelectedIds(initialSelected);
    setFilters({ name: '', email: '' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const setFilter = (key, val) => setFilters((prev) => ({ ...prev, [key]: val }));
  const clearFilters = () => setFilters({ name: '', email: '' });

  const filtered = useMemo(() => {
    const n = filters.name.trim().toLowerCase();
    const e = filters.email.trim().toLowerCase();
    return users.filter((u) => {
      const label = (u.label || '').toLowerCase();
      const email = (u.email || '').toLowerCase();
      return (!n || label.includes(n)) && (!e || email.includes(e));
    });
  }, [users, filters]);

  const toggle = (id) => setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const handleConfirm = () => {
    onConfirm(selectedIds);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" component="div">
          Select Approvers
        </Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
          <Typography sx={{ mb: 2 }}>Filters</Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={5}>
              <TextField fullWidth size="small" label="Name" value={filters.name} onChange={(e) => setFilter('name', e.target.value)} />
            </Grid>
            <Grid item xs={12} md={5}>
              <TextField fullWidth size="small" label="Email" value={filters.email} onChange={(e) => setFilter('email', e.target.value)} />
            </Grid>
            <Grid item xs={12} md={2}>
              <Button fullWidth variant="outlined" color="error" onClick={clearFilters}>
                Clear
              </Button>
            </Grid>
          </Grid>
        </Paper>

        <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 380 }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: 'grey.100' }}>
                <TableCell padding="checkbox" sx={{ backgroundColor: 'grey.100' }} />
                <TableCell sx={{ fontWeight: 700, backgroundColor: 'grey.100' }}>S.No</TableCell>
                <TableCell sx={{ fontWeight: 700, backgroundColor: 'grey.100' }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 700, backgroundColor: 'grey.100' }}>Email</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 5 }}>
                    <CircularProgress size={28} />
                  </TableCell>
                </TableRow>
              )}

              {!loading &&
                filtered.map((u, index) => (
                  <TableRow key={u.id} hover selected={selectedIds.includes(u.id)} onClick={() => toggle(u.id)} sx={{ cursor: 'pointer' }}>
                    <TableCell padding="checkbox">
                      <Checkbox checked={selectedIds.includes(u.id)} />
                    </TableCell>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>{u.label}</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>{u.email}</TableCell>
                  </TableRow>
                ))}

              {!loading && filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                    No results found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
        <Button variant="outlined" onClick={onClose}>
          Close
        </Button>
        <Button variant="contained" color="secondary" onClick={handleConfirm}>
          Choose{selectedIds.length ? ` (${selectedIds.length})` : ''}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
