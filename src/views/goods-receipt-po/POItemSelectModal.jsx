import { useState, useMemo } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@mui/material';

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

const rowId = (line) => line.LineNum ?? line.id ?? String(Math.random());

export default function POItemSelectModal({ open, onClose, onConfirm, lines = [] }) {
  const [selected, setSelected] = useState(new Set());
  const [filters, setFilters] = useState({ ItemCode: '', ItemDescription: '' });

  const filtered = useMemo(
    () =>
      lines.filter(
        (l) =>
          (!filters.ItemCode || (l.ItemCode || '').toLowerCase().includes(filters.ItemCode.toLowerCase())) &&
          (!filters.ItemDescription || (l.ItemDescription || '').toLowerCase().includes(filters.ItemDescription.toLowerCase()))
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
    setFilters({ ItemCode: '', ItemDescription: '' });
    onConfirm(selectedLines);
  };

  const handleClose = () => {
    setSelected(new Set());
    setFilters({ ItemCode: '', ItemDescription: '' });
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
      <DialogTitle>Select Items from Purchase Order</DialogTitle>

      <DialogContent dividers>
        {/* Filters */}
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
          <TextField
            size="small"
            label="Item Code"
            value={filters.ItemCode}
            onChange={(e) => setFilters((p) => ({ ...p, ItemCode: e.target.value }))}
          />
          <TextField
            size="small"
            label="Description"
            value={filters.ItemDescription}
            onChange={(e) => setFilters((p) => ({ ...p, ItemDescription: e.target.value }))}
          />
        </Box>

        <TableContainer sx={{ maxHeight: 420 }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox" sx={{ backgroundColor: 'grey.100' }}>
                  <Checkbox indeterminate={selected.size > 0 && !allSelected} checked={allSelected} onChange={toggleAll} size="small" />
                </TableCell>
                {COLUMNS.map((col) => (
                  <TableCell key={col.key} sx={{ fontWeight: 700, backgroundColor: 'grey.100', minWidth: col.width, whiteSpace: 'nowrap' }}>
                    {col.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((row) => {
                const id = rowId(row);
                return (
                  <TableRow key={id} hover selected={selected.has(id)} onClick={() => toggle(id)} sx={{ cursor: 'pointer' }}>
                    <TableCell padding="checkbox">
                      <Checkbox checked={selected.has(id)} size="small" onChange={() => toggle(id)} onClick={(e) => e.stopPropagation()} />
                    </TableCell>
                    {COLUMNS.map((col) => (
                      <TableCell key={col.key}>{row[col.key] ?? ''}</TableCell>
                    ))}
                  </TableRow>
                );
              })}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={COLUMNS.length + 1} align="center" sx={{ py: 4, color: 'text.secondary' }}>
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
          Close
        </Button>
        <Button variant="contained" color="secondary" onClick={handleConfirm} disabled={selected.size === 0}>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}
