import { useState, useMemo } from 'react';
import {
  Box,
  Button,
  Checkbox,
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

const COLUMNS = [
  { key: 'LineId', label: 'BOM Line', width: 90 },
  { key: 'U_ItemCode', label: 'Item Code', width: 130 },
  { key: 'U_Desc', label: 'Description', width: 200 },
  { key: 'U_Unit', label: 'UOM', width: 90 },
  { key: 'U_PQty', label: 'BOM Qty', width: 100 }
];

export default function BOMItemSelectModal({ open, onClose, onConfirm, bomLines = [] }) {
  const [selected, setSelected] = useState(new Set());
  const [filters, setFilters] = useState({ U_ItemCode: '', U_Desc: '' });

  const filtered = useMemo(
    () =>
      bomLines.filter(
        (l) =>
          (!filters.U_ItemCode || l.U_ItemCode?.toLowerCase().includes(filters.U_ItemCode.toLowerCase())) &&
          (!filters.U_Desc || l.U_Desc?.toLowerCase().includes(filters.U_Desc.toLowerCase()))
      ),
    [bomLines, filters]
  );

  const allSelected = filtered.length > 0 && filtered.every((l) => selected.has(l.LineId));
  const someSelected = filtered.some((l) => selected.has(l.LineId));

  const toggleRow = (lineId) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(lineId) ? next.delete(lineId) : next.add(lineId);
      return next;
    });
  };

  const toggleAll = () => {
    if (allSelected) {
      setSelected((prev) => {
        const next = new Set(prev);
        filtered.forEach((l) => next.delete(l.LineId));
        return next;
      });
    } else {
      setSelected((prev) => {
        const next = new Set(prev);
        filtered.forEach((l) => next.add(l.LineId));
        return next;
      });
    }
  };

  const handleConfirm = () => {
    const chosenLines = bomLines.filter((l) => selected.has(l.LineId));
    onConfirm(chosenLines);
    handleClose();
  };

  const handleClose = () => {
    setSelected(new Set());
    setFilters({ U_ItemCode: '', U_Desc: '' });
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" component="div">
          Select Items from BOM
        </Typography>
        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {/* Filters */}
        <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
          <Typography sx={{ mb: 2 }}>Filters</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                size="small"
                label="Item Code"
                value={filters.U_ItemCode}
                onChange={(e) => setFilters((p) => ({ ...p, U_ItemCode: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                size="small"
                label="Description"
                value={filters.U_Desc}
                onChange={(e) => setFilters((p) => ({ ...p, U_Desc: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant="outlined" color="error" onClick={() => setFilters({ U_ItemCode: '', U_Desc: '' })}>
                  Clear
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Table */}
        <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 380 }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: 'grey.100' }}>
                <TableCell padding="checkbox" sx={{ backgroundColor: 'grey.100' }}>
                  <Checkbox size="small" checked={allSelected} indeterminate={someSelected && !allSelected} onChange={toggleAll} />
                </TableCell>
                <TableCell sx={{ fontWeight: 700, backgroundColor: 'grey.100' }}>S.No</TableCell>
                {COLUMNS.map((col) => (
                  <TableCell key={col.key} sx={{ fontWeight: 700, whiteSpace: 'nowrap', minWidth: col.width, backgroundColor: 'grey.100' }}>
                    {col.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {filtered.map((line, index) => (
                <TableRow
                  key={line.LineId}
                  hover
                  selected={selected.has(line.LineId)}
                  onClick={() => toggleRow(line.LineId)}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell padding="checkbox">
                    <Checkbox size="small" checked={selected.has(line.LineId)} />
                  </TableCell>
                  <TableCell>{index + 1}</TableCell>
                  {COLUMNS.map((col) => (
                    <TableCell key={col.key} sx={{ whiteSpace: 'nowrap' }}>
                      {line[col.key]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}

              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={COLUMNS.length + 2} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                    No items found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          {selected.size} item{selected.size !== 1 ? 's' : ''} selected
        </Typography>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
        <Button variant="outlined" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="contained" color="secondary" disabled={selected.size === 0} onClick={handleConfirm}>
          Add Selected
        </Button>
      </DialogActions>
    </Dialog>
  );
}
