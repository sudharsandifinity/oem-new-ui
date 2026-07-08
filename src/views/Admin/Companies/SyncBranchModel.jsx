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

const COLUMNS = [
  { key: 'name', label: 'Company Name' },
];

const emptyFilters = () => ({ DocEntry: '', U_BPCode: '', U_BPName: '', U_PrjCode: '', U_PrjName: '' });

export default function SyncBranchModel({ open, onClose, onSelect, listLoading,companyList }) {
  const dispatch = useDispatch();

  const [selectedId, setSelectedId] = useState(null);
  const [filters, setFilters] = useState(emptyFilters());



  const setFilter = (field, value) => setFilters((prev) => ({ ...prev, [field]: value }));

  const clearFilters = () => setFilters(emptyFilters());



  const handleChoose = () => {
    const row = companyList.find((b) => b.id === selectedId);
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
          Select Company
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
              {listLoading && (
                <TableRow>
                  <TableCell colSpan={COLUMNS.length + 1} align="center" sx={{ py: 5 }}>
                    <CircularProgress size={28} />
                  </TableCell>
                </TableRow>
              )}

              {!listLoading &&
                companyList.map((row, index) => (
                  <TableRow
                    key={row.id}
                    hover
                    selected={selectedId === row.id}
                    onClick={() => setSelectedId(row.id)}
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

              {!listLoading && companyList.length === 0 && (
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
