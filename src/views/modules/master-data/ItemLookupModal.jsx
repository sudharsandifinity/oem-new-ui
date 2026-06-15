import { useMemo, useState, useEffect } from 'react';
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
  Typography
} from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import { getItems } from '../../../store/slices/itemSlice';

// ================= COMPONENT ================= //

export default function ItemSelectPopup({ open, onClose, onSelectItem }) {
  const dispatch = useDispatch();

  const { items, loading, error } = useSelector((state) => state.item);

  useEffect(() => {
    if (open && items.length === 0) {
      dispatch(getItems());
    }
  }, [open]);

  const [filters, setFilters] = useState({
    ItemCode: '',
    ItemName: ''
  });

  // ================= FILTERED DATA ================= //

  const filteredData = useMemo(() => {
    return (items || []).filter((item) => {
      const code = (item.ItemCode || '').toString().toLowerCase();
      const name = (item.ItemName || '').toString().toLowerCase();

      const fCode = (filters.ItemCode || '').toLowerCase();
      const fName = (filters.ItemName || '').toLowerCase();

      return (!fCode || code.includes(fCode)) && (!fName || name.includes(fName));
    });
  }, [filters, items]);

  // ================= CLEAR FILTERS ================= //

  const clearFilters = () => {
    setFilters({
      ItemCode: '',
      ItemName: ''
    });
  };

  useEffect(() => {
    if (open) {
      setFilters({
        ItemCode: '',
        ItemName: ''
      });
    }
  }, [open]);
  // ================= SELECT ITEM ================= //

  const handleSelect = (row) => {
    onSelectItem({
      ItemCode: row.ItemCode,
      ItemName: row.ItemName
    });

    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      {/* ================= HEADER ================= */}

      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Typography variant="h4">Item Selection</Typography>

        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* ================= CONTENT ================= */}

      <DialogContent sx={{ p: 3 }}>
        {/* ================= FILTER SECTION ================= */}

        <Paper
          variant="outlined"
          sx={{
            p: 2,
            mb: 3,
            borderRadius: 2
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Filters
          </Typography>

          <Grid container spacing={2}>
            {/* ITEM CODE */}

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                size="small"
                label="Item Code"
                value={filters.ItemCode}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    ItemCode: e.target.value
                  })
                }
              />
            </Grid>

            {/* ITEM NAME */}

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                size="small"
                label="Item Name"
                value={filters.ItemName}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    ItemName: e.target.value
                  })
                }
              />
            </Grid>

            {/* CLEAR BUTTON */}

            <Grid item xs={12}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-end'
                }}
              >
                <Button variant="outlined" color="error" onClick={clearFilters}>
                  Clear
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* ================= TABLE ================= */}

        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow
                sx={{
                  backgroundColor: 'grey.100'
                }}
              >
                {['S.No', 'Item Code', 'Item Name'].map((header) => (
                  <TableCell
                    key={header}
                    sx={{
                      fontWeight: 700,
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {loading && items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 5 }}>
                    <CircularProgress color="secondary" size={32} />
                  </TableCell>
                </TableRow>
              )}
              {filteredData.map((row, index) => (
                <TableRow
                  key={row.ItemCode}
                  hover
                  onClick={() => handleSelect(row)}
                  sx={{
                    cursor: 'pointer'
                  }}
                >
                  <TableCell>{index + 1}</TableCell>

                  <TableCell>{row.ItemCode}</TableCell>

                  <TableCell>{row.ItemName}</TableCell>
                </TableRow>
              ))}

              {!loading && filteredData.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No Data Found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
    </Dialog>
  );
}
