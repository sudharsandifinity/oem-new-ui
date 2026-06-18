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
import ClearIcon from '@mui/icons-material/Clear';

const COLUMNS = [
  { key: 'LineNum', label: 'Line', width: 70 },
  { key: 'ItemCode', label: 'Item Code', width: 130 },
  { key: 'ItemDescription', label: 'Description', width: 220 },
  { key: 'Quantity', label: 'Quantity', width: 100 },
  { key: 'UoMCode', label: 'UOM', width: 90 },
  { key: 'WarehouseCode', label: 'Warehouse', width: 120 },
  { key: 'ProjectCode', label: 'Project', width: 120 },
  { key: 'OpenQuantity', label: 'Open Qty', width: 100 }
];

const FILTER_FIELDS = [
  { key: 'ItemCode', label: 'Item Code' },
  { key: 'ItemDescription', label: 'Description' },
  { key: 'WarehouseCode', label: 'Warehouse' },
  { key: 'ProjectCode', label: 'Project' }
];

const emptyFilters = () => ({ ItemCode: '', ItemDescription: '', WarehouseCode: '', ProjectCode: '' });

const rowId = (line) => line.LineNum ?? line.id ?? String(Math.random());

export default function POItemSelectModal({ open, onClose, onConfirm, lines = [] }) {
  const [selected, setSelected] = useState(new Set());
  const [filters, setFilters] = useState(emptyFilters());

  const setFilter = (field, value) => setFilters((prev) => ({ ...prev, [field]: value }));

  const filtered = useMemo(
    () =>
      lines.filter(
        (l) =>
          (!filters.ItemCode || (l.ItemCode || '').toLowerCase().includes(filters.ItemCode.toLowerCase())) &&
          (!filters.ItemDescription || (l.ItemDescription || '').toLowerCase().includes(filters.ItemDescription.toLowerCase())) &&
          (!filters.WarehouseCode || (l.WarehouseCode || '').toLowerCase().includes(filters.WarehouseCode.toLowerCase())) &&
          (!filters.ProjectCode || (l.ProjectCode || '').toLowerCase().includes(filters.ProjectCode.toLowerCase()))
      ),
    [lines, filters]
  );

  const allSelected = filtered.length > 0 && filtered.every((l) => selected.has(rowId(l)));

  const toggleAll = () => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (allSelected) {
        filtered.forEach((l) => next.delete(rowId(l)));
      } else {
        filtered.forEach((l) => next.add(rowId(l)));
      }
      return next;
    });
  };

  const toggle = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleConfirm = () => {
    const selectedLines = lines.filter((l) => selected.has(rowId(l)));
    setSelected(new Set());
    setFilters(emptyFilters());
    onConfirm(selectedLines);
  };

  const handleClose = () => {
    setSelected(new Set());
    setFilters(emptyFilters());
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" component="div">
          Select Items from Purchase Order
        </Typography>
        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
          <Typography sx={{ mb: 2 }}>Filters</Typography>
          <Grid container spacing={2}>
            {FILTER_FIELDS.map((f) => (
              <Grid item xs={12} md={3} key={f.key}>
                <TextField
                  fullWidth
                  size="small"
                  label={f.label}
                  value={filters[f.key]}
                  onChange={(e) => setFilter(f.key, e.target.value)}
                />
              </Grid>
            ))}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant="outlined" color="error" size="small" startIcon={<ClearIcon />} onClick={() => setFilters(emptyFilters())}>
                  Clear
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 380 }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox" sx={{ backgroundColor: 'grey.100' }}>
                  <Checkbox indeterminate={selected.size > 0 && !allSelected} checked={allSelected} onChange={toggleAll} size="small" />
                </TableCell>
                <TableCell sx={{ fontWeight: 700, backgroundColor: 'grey.100', width: 50 }}>S.No</TableCell>
                {COLUMNS.map((col) => (
                  <TableCell key={col.key} sx={{ fontWeight: 700, backgroundColor: 'grey.100', minWidth: col.width, whiteSpace: 'nowrap' }}>
                    {col.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((row, index) => {
                const id = rowId(row);
                return (
                  <TableRow key={id} hover selected={selected.has(id)} onClick={() => toggle(id)} sx={{ cursor: 'pointer' }}>
                    <TableCell padding="checkbox">
                      <Checkbox checked={selected.has(id)} size="small" onChange={() => toggle(id)} onClick={(e) => e.stopPropagation()} />
                    </TableCell>
                    <TableCell>{index + 1}</TableCell>
                    {COLUMNS.map((col) => (
                      <TableCell key={col.key}>{row[col.key] ?? ''}</TableCell>
                    ))}
                  </TableRow>
                );
              })}
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
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
        <Typography variant="body2" sx={{ flex: 1, color: 'text.secondary' }}>
          {selected.size} item{selected.size !== 1 ? 's' : ''} selected
        </Typography>
        <Button variant="outlined" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="contained" color="secondary" onClick={handleConfirm} disabled={selected.size === 0}>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}
