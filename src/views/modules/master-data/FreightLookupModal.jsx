import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  Box,
  Button,
  Dialog,
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
  Typography,
  CircularProgress,
  Alert
} from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';
import { getFreights } from '../../../store/slices/freightSlice';

export default function FreightLookupModal({ open, onClose, onSelectFreight }) {
  const dispatch = useDispatch();

  const { freights = [], loading, error } = useSelector((state) => state.freight);

  const [filters, setFilters] = useState({
    name: ''
  });

  // ================= FETCH ================= //

  useEffect(() => {
    if (open && freights.length === 0) {
      dispatch(getFreights());
    }
  }, [open, freights.length, dispatch]);

  // ================= FILTER ================= //

  const filteredData = useMemo(() => {
    return (freights || []).filter((f) => {
      return !filters.name || (f.Name || '').toLowerCase().includes(filters.name.toLowerCase());
    });
  }, [freights, filters]);

  // ================= CLEAR ================= //

  const clearFilters = () => {
    setFilters({ name: '' });
  };

  // ================= SELECT ================= //

  const handleSelect = (row) => {
    onSelectFreight({
      freightCode: row.ExpensCode, // SAP mapping
      freightName: row.Name
    });

    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      {/* ================= HEADER ================= */}
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          py: 1.5
        }}
      >
        <Typography variant="h6">Freight Selection</Typography>

        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* ================= BODY ================= */}
      <DialogContent sx={{ p: 2 }}>
        {/* ================= FILTER ================= */}
        <Paper variant="outlined" sx={{ p: 2, mb: 2, borderRadius: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                size="small"
                label="Search Freight Name"
                value={filters.name}
                onChange={(e) => setFilters({ name: e.target.value })}
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button size="small" variant="outlined" color="error" onClick={clearFilters}>
                  Clear
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* ================= ERROR ================= */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* ================= TABLE ================= */}
        <TableContainer
          component={Paper}
          variant="outlined"
          sx={{
            maxHeight: 380,
            borderRadius: 2
          }}
        >
          <Table stickyHeader size="small">
            {/* HEADER */}
            <TableHead>
              <TableRow>
                <TableCell width={70} sx={{ fontWeight: 700 }}>
                  S.No
                </TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Freight Name</TableCell>
              </TableRow>
            </TableHead>

            {/* BODY */}
            <TableBody>
              {loading && freights.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2} align="center" sx={{ py: 4 }}>
                    <CircularProgress size={26} />
                  </TableCell>
                </TableRow>
              ) : filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2} align="center">
                    No freights found
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((row, index) => (
                  <TableRow
                    key={row.Code || index}
                    hover
                    onClick={() => handleSelect(row)}
                    sx={{
                      cursor: 'pointer',
                      '&:hover': { backgroundColor: '#f5f5f5' }
                    }}
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{row.Name}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
    </Dialog>
  );
}
