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
import { getBOQList, clearBOQList } from '../../store/slices/materialRequestSlice';

const COLUMNS = [
  { key: 'DocEntry', label: 'Doc Entry' },
  { key: 'U_BPCode', label: 'Customer Code' },
  { key: 'U_BPName', label: 'Customer Name' },
  { key: 'U_PrjCode', label: 'Project Code' },
  { key: 'U_PrjName', label: 'Project Name' }
];

const emptyFilters = () => ({ DocEntry: '', U_BPCode: '', U_BPName: '', U_PrjCode: '', U_PrjName: '' });

export default function BOMSelectModal({ open, onClose, onSelect, cardCode = '', projectCode = '' }) {
  const dispatch = useDispatch();
  const { boqList, boqLoading } = useSelector((s) => s.materialRequest);

  const [selectedId, setSelectedId] = useState(null);
  const [filters, setFilters] = useState(emptyFilters());

  useEffect(() => {
    if (open) {
      dispatch(getBOQList({ U_BPCode: cardCode, U_PrjCode: projectCode }));
    } else {
      dispatch(clearBOQList());
      setSelectedId(null);
      setFilters(emptyFilters());
    }
  }, [open, cardCode, projectCode, dispatch]);

  const setFilter = (field, value) => setFilters((prev) => ({ ...prev, [field]: value }));

  const clearFilters = () => setFilters(emptyFilters());

  const filtered = useMemo(() => {
    const f = filters;
    return boqList.filter(
      (b) =>
        (!f.DocEntry || String(b.DocEntry).includes(f.DocEntry)) &&
        (!f.U_BPCode || b.U_BPCode?.toLowerCase().includes(f.U_BPCode.toLowerCase())) &&
        (!f.U_BPName || b.U_BPName?.toLowerCase().includes(f.U_BPName.toLowerCase())) &&
        (!f.U_PrjCode || b.U_PrjCode?.toLowerCase().includes(f.U_PrjCode.toLowerCase())) &&
        (!f.U_PrjName || b.U_PrjName?.toLowerCase().includes(f.U_PrjName.toLowerCase()))
    );
  }, [boqList, filters]);

  const handleChoose = () => {
    const row = filtered.find((b) => b.DocEntry === selectedId);
    if (row) {
      onSelect(row);
      handleClose();
    }
  };

  const handleClose = () => {
    setSelectedId(null);
    setFilters(emptyFilters());
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" component="div">
          Select BOM
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
                {COLUMNS.map((col) => (
                  <TableCell key={col.key} sx={{ fontWeight: 700, whiteSpace: 'nowrap', backgroundColor: 'grey.100' }}>
                    {col.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {boqLoading && (
                <TableRow>
                  <TableCell colSpan={COLUMNS.length + 1} align="center" sx={{ py: 5 }}>
                    <CircularProgress size={28} />
                  </TableCell>
                </TableRow>
              )}

              {!boqLoading &&
                filtered.map((row, index) => (
                  <TableRow
                    key={row.DocEntry}
                    hover
                    selected={selectedId === row.DocEntry}
                    onClick={() => setSelectedId(row.DocEntry)}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell>{index + 1}</TableCell>
                    {COLUMNS.map((col) => (
                      <TableCell key={col.key} sx={{ whiteSpace: 'nowrap' }}>
                        {row[col.key]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}

              {!boqLoading && filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={COLUMNS.length + 1} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                    No BOMs found
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
