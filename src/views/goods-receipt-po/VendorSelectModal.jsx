import { useState, useMemo, useEffect } from 'react';
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
import { getVendors } from '../../store/slices/commonSlice';

const COLUMNS = [
  { key: 'CardCode', label: 'Vendor Code' },
  { key: 'CardName', label: 'Vendor Name' }
];

const emptyFilters = () => ({ CardCode: '', CardName: '' });

export default function VendorSelectModal({ open, onClose, onChoose }) {
  const dispatch = useDispatch();
  const { vendors, vendorsLoading } = useSelector((s) => s.common);

  const [selectedId, setSelectedId] = useState(null);
  const [filters, setFilters] = useState(emptyFilters());

  useEffect(() => {
    if (!open) return;
    setSelectedId(null);
    setFilters(emptyFilters());
    if (!vendors.length) dispatch(getVendors());
  }, [open]);

  const setFilter = (field, value) => setFilters((prev) => ({ ...prev, [field]: value }));
  const clearFilters = () => setFilters(emptyFilters());

  const filtered = useMemo(
    () =>
      vendors.filter((row) =>
        COLUMNS.every(({ key }) => {
          const f = filters[key] || '';
          return (
            !f ||
            String(row[key] ?? '')
              .toLowerCase()
              .includes(f.toLowerCase())
          );
        })
      ),
    [vendors, filters]
  );

  const handleChoose = () => {
    const row = filtered.find((r) => r.CardCode === selectedId);
    if (row) {
      onChoose(row);
      handleClose();
    }
  };

  const handleClose = () => {
    setSelectedId(null);
    setFilters(emptyFilters());
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" component="div">
          Select Vendor
        </Typography>
        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
          <Typography sx={{ mb: 2 }}>Filters</Typography>
          <Grid container spacing={2}>
            {COLUMNS.map(({ key, label }) => (
              <Grid item xs={12} md={6} key={key}>
                <TextField fullWidth size="small" label={label} value={filters[key]} onChange={(e) => setFilter(key, e.target.value)} />
              </Grid>
            ))}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant="outlined" color="error" onClick={clearFilters}>
                  Clear
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 380 }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: 'grey.100' }}>
                <TableCell sx={{ fontWeight: 700, backgroundColor: 'grey.100' }}>S.No</TableCell>
                {COLUMNS.map(({ key, label }) => (
                  <TableCell key={key} sx={{ fontWeight: 700, whiteSpace: 'nowrap', backgroundColor: 'grey.100' }}>
                    {label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {vendorsLoading && (
                <TableRow>
                  <TableCell colSpan={COLUMNS.length + 1} align="center" sx={{ py: 5 }}>
                    <CircularProgress size={28} />
                  </TableCell>
                </TableRow>
              )}

              {!vendorsLoading &&
                filtered.map((row, index) => (
                  <TableRow
                    key={row.CardCode}
                    hover
                    selected={selectedId === row.CardCode}
                    onClick={() => setSelectedId(row.CardCode)}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell>{index + 1}</TableCell>
                    {COLUMNS.map(({ key }) => (
                      <TableCell key={key} sx={{ whiteSpace: 'nowrap' }}>
                        {row[key] ?? ''}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}

              {!vendorsLoading && filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={COLUMNS.length + 1} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                    No vendors found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
        <Button variant="outlined" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="contained" color="secondary" disabled={!selectedId} onClick={handleChoose}>
          Choose
        </Button>
      </DialogActions>
    </Dialog>
  );
}
