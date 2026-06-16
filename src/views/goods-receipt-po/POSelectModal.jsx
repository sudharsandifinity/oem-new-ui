import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
  CircularProgress,
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
import ClearIcon from '@mui/icons-material/Clear';
import { getPurchaseOrderList } from '../../store/slices/purchaseOrderSlice';

const COLUMNS = [
  { key: 'DocEntry', label: 'Doc Entry' },
  { key: 'CardCode', label: 'Vendor Code' },
  { key: 'CardName', label: 'Vendor Name' },
  { key: 'U_PrjCode', label: 'Project Code' },
  { key: 'U_PrjDesc', label: 'Project Name' }
];

const EMPTY_FILTERS = { DocEntry: '', CardCode: '', CardName: '', U_PrjCode: '', U_PrjDesc: '' };

export default function POSelectModal({ open, onClose, onChoose }) {
  const dispatch = useDispatch();
  const { list: items, listLoading: loading } = useSelector((s) => s.purchaseOrder);
  const [selected, setSelected] = useState(null);
  const [filters, setFilters] = useState(EMPTY_FILTERS);

  useEffect(() => {
    if (!open) return;
    setSelected(null);
    setFilters(EMPTY_FILTERS);
    dispatch(getPurchaseOrderList({ top: 200, skip: 0 }));
  }, [open, dispatch]);

  const filtered = items.filter(
    (row) =>
      (!filters.DocEntry || String(row.DocEntry).includes(filters.DocEntry)) &&
      (!filters.CardCode || (row.CardCode || '').toLowerCase().includes(filters.CardCode.toLowerCase())) &&
      (!filters.CardName || (row.CardName || '').toLowerCase().includes(filters.CardName.toLowerCase())) &&
      (!filters.U_PrjCode || (row.U_PrjCode || '').toLowerCase().includes(filters.U_PrjCode.toLowerCase())) &&
      (!filters.U_PrjDesc || (row.U_PrjDesc || '').toLowerCase().includes(filters.U_PrjDesc.toLowerCase()))
  );

  const handleChoose = () => {
    if (!selected) return;
    onChoose(selected);
    setSelected(null);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Select Purchase Order</DialogTitle>

      <DialogContent dividers>
        {/* Filters */}
        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center', mb: 2 }}>
          <TextField
            size="small"
            label="Doc Entry"
            value={filters.DocEntry}
            onChange={(e) => setFilters((p) => ({ ...p, DocEntry: e.target.value }))}
            sx={{ width: 110 }}
          />
          <TextField
            size="small"
            label="Vendor Code"
            value={filters.CardCode}
            onChange={(e) => setFilters((p) => ({ ...p, CardCode: e.target.value }))}
            sx={{ width: 130 }}
          />
          <TextField
            size="small"
            label="Vendor Name"
            value={filters.CardName}
            onChange={(e) => setFilters((p) => ({ ...p, CardName: e.target.value }))}
            sx={{ width: 160 }}
          />
          <TextField
            size="small"
            label="Project Code"
            value={filters.U_PrjCode}
            onChange={(e) => setFilters((p) => ({ ...p, U_PrjCode: e.target.value }))}
            sx={{ width: 130 }}
          />
          <TextField
            size="small"
            label="Project Name"
            value={filters.U_PrjDesc}
            onChange={(e) => setFilters((p) => ({ ...p, U_PrjDesc: e.target.value }))}
            sx={{ width: 160 }}
          />
          <Button variant="outlined" color="error" size="small" startIcon={<ClearIcon />} onClick={() => setFilters(EMPTY_FILTERS)}>
            Clear
          </Button>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer sx={{ maxHeight: 320 }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, backgroundColor: 'grey.100', whiteSpace: 'nowrap', width: 60 }}>#</TableCell>
                  {COLUMNS.map((col) => (
                    <TableCell key={col.key} sx={{ fontWeight: 700, backgroundColor: 'grey.100', whiteSpace: 'nowrap' }}>
                      {col.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.map((row, index) => (
                  <TableRow
                    key={row.DocEntry}
                    hover
                    selected={selected?.DocEntry === row.DocEntry}
                    onClick={() => setSelected((prev) => (prev?.DocEntry === row.DocEntry ? null : row))}
                    sx={{
                      cursor: 'pointer',
                      '&.Mui-selected': { backgroundColor: '#e8eaf6' },
                      '&.Mui-selected:hover': { backgroundColor: '#c5cae9' }
                    }}
                  >
                    <TableCell>{index + 1}</TableCell>
                    {COLUMNS.map((col) => (
                      <TableCell key={col.key}>{row[col.key] ?? ''}</TableCell>
                    ))}
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={COLUMNS.length + 1} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                      No purchase orders found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
        <Typography variant="body2" sx={{ flex: 1, color: 'text.secondary' }}>
          {selected ? `Selected: ${selected.DocEntry} — ${selected.CardName || ''}` : 'Click a row to select'}
        </Typography>
        <Button variant="outlined" onClick={onClose}>
          Close
        </Button>
        <Button variant="contained" color="secondary" onClick={handleChoose} disabled={!selected}>
          Choose
        </Button>
      </DialogActions>
    </Dialog>
  );
}
