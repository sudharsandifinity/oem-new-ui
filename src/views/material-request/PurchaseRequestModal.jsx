import { useState, useMemo } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const COLUMNS = [
  { key: 'ItemCode', label: 'Item Code' },
  { key: 'ItemDescription', label: 'Description' },
  { key: 'Quantity', label: 'Quantity' },
  { key: 'InStock', label: 'In Stock' },
  { key: 'UoMCode', label: 'UOM' },
  { key: 'WarehouseCode', label: 'Warehouse' }
];

export default function PurchaseRequestModal({ open, onClose, onContinue, lines = [] }) {
  const [selected, setSelected] = useState(new Set());

  const items = useMemo(() => lines.filter((l) => l.ItemCode), [lines]);

  const allSelected = items.length > 0 && items.every((l) => selected.has(l.id));
  const someSelected = items.some((l) => selected.has(l.id));

  const toggleRow = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (allSelected) {
      setSelected((prev) => {
        const next = new Set(prev);
        items.forEach((l) => next.delete(l.id));
        return next;
      });
    } else {
      setSelected((prev) => {
        const next = new Set(prev);
        items.forEach((l) => next.add(l.id));
        return next;
      });
    }
  };

  const handleClose = () => {
    setSelected(new Set());
    onClose();
  };

  const handleContinue = () => {
    const selectedLines = items.filter((l) => selected.has(l.id));
    setSelected(new Set());
    onContinue(selectedLines);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" component="div">
          Purchase Request — Items
        </Typography>
        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 420 }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: 'grey.100' }}>
                <TableCell padding="checkbox" sx={{ backgroundColor: 'grey.100' }}>
                  <Checkbox size="small" checked={allSelected} indeterminate={someSelected && !allSelected} onChange={toggleAll} />
                </TableCell>
                <TableCell sx={{ fontWeight: 700, backgroundColor: 'grey.100' }}>S.No</TableCell>
                {COLUMNS.map((col) => (
                  <TableCell key={col.key} sx={{ fontWeight: 700, whiteSpace: 'nowrap', backgroundColor: 'grey.100' }}>
                    {col.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {items.map((row, index) => (
                <TableRow
                  key={row.id ?? index}
                  hover
                  selected={selected.has(row.id)}
                  onClick={() => toggleRow(row.id)}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell padding="checkbox">
                    <Checkbox size="small" checked={selected.has(row.id)} />
                  </TableCell>
                  <TableCell>{index + 1}</TableCell>
                  {COLUMNS.map((col) => (
                    <TableCell key={col.key} sx={{ whiteSpace: 'nowrap' }}>
                      {row[col.key]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}

              {items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={COLUMNS.length + 2} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                    No items available
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
          Close
        </Button>
        <Button variant="contained" color="secondary" disabled={selected.size === 0} onClick={handleContinue}>
          Continue
        </Button>
      </DialogActions>
    </Dialog>
  );
}
