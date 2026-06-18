import { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
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
import ClearIcon from '@mui/icons-material/Clear';
import { getOpenPurchaseOrders, clearOpenList } from '../../store/slices/purchaseOrderSlice';

const COLUMNS = [
  { key: 'CardCode', label: 'Vendor Code' },
  { key: 'CardName', label: 'Vendor Name' },
  { key: 'U_PrjCode', label: 'Project Code' },
  { key: 'U_PrjDesc', label: 'Project Name' }
];

const emptyFilters = () => ({ CardCode: '', CardName: '', U_PrjCode: '', U_PrjDesc: '' });

export default function POSelectModal({ open, onClose, onChoose, projectCode = '', cardCode = '' }) {
  const dispatch = useDispatch();
  const { openList: items, openListLoading: loading } = useSelector((s) => s.purchaseOrder);
  const [selected, setSelected] = useState(null);
  const [filters, setFilters] = useState(emptyFilters());

  useEffect(() => {
    if (open) {
      setSelected(null);
      setFilters(emptyFilters());
      dispatch(getOpenPurchaseOrders({ projectCode, cardCode }));
    } else {
      dispatch(clearOpenList());
    }
  }, [open, dispatch, projectCode, cardCode]);

  const setFilter = (field, value) => setFilters((prev) => ({ ...prev, [field]: value }));

  const filtered = useMemo(
    () =>
      items.filter(
        (row) =>
          (!filters.CardCode || (row.CardCode || '').toLowerCase().includes(filters.CardCode.toLowerCase())) &&
          (!filters.CardName || (row.CardName || '').toLowerCase().includes(filters.CardName.toLowerCase())) &&
          (!filters.U_PrjCode || (row.U_PrjCode || '').toLowerCase().includes(filters.U_PrjCode.toLowerCase())) &&
          (!filters.U_PrjDesc || (row.U_PrjDesc || '').toLowerCase().includes(filters.U_PrjDesc.toLowerCase()))
      ),
    [items, filters]
  );

  const handleChoose = () => {
    if (!selected) return;
    onChoose(selected);
    setSelected(null);
  };

  const handleClose = () => {
    setSelected(null);
    setFilters(emptyFilters());
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" component="div">
          Select Purchase Order
        </Typography>
        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
          <Typography sx={{ mb: 2 }}>Filters</Typography>
          <Grid container spacing={2}>
            {COLUMNS.map((col) => (
              <Grid item xs={12} md={4} key={col.key}>
                <TextField
                  fullWidth
                  size="small"
                  label={col.label}
                  value={filters[col.key]}
                  onChange={(e) => setFilter(col.key, e.target.value)}
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

        <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 360 }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, backgroundColor: 'grey.100', width: 50 }}>S.No</TableCell>
                {COLUMNS.map((col) => (
                  <TableCell key={col.key} sx={{ fontWeight: 700, backgroundColor: 'grey.100', whiteSpace: 'nowrap' }}>
                    {col.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell colSpan={COLUMNS.length + 1} align="center" sx={{ py: 6 }}>
                    <CircularProgress size={28} />
                  </TableCell>
                </TableRow>
              )}
              {!loading &&
                filtered.map((row, index) => (
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
              {!loading && filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={COLUMNS.length + 1} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                    No purchase orders found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
        <Typography variant="body2" sx={{ flex: 1, color: 'text.secondary' }}>
          {selected ? `Selected: ${selected.DocEntry} — ${selected.CardName || ''}` : 'Click a row to select'}
        </Typography>
        <Button variant="outlined" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="contained" color="secondary" onClick={handleChoose} disabled={!selected}>
          Choose
        </Button>
      </DialogActions>
    </Dialog>
  );
}
