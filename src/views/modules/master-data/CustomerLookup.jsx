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
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { getCustomers } from '../../../store/slices/customerSlice';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';

// ================= COMPONENT ================= //

export default function CustomerSelectPopup({ open, onClose, onSelectCustomer }) {
  const dispatch = useDispatch();
  const { customers, loading, error } = useSelector((state) => state.customer);

  useEffect(() => {
    if (open && customers.length === 0) {
      dispatch(getCustomers());
    }
  }, [open]);

  const [filters, setFilters] = useState({
    CardCode: '',
    CardName: '',
    ContactPerson: '',
    type: ''
  });

  // ================= FILTER LOGIC ================= //

  const filteredData = useMemo(() => {
    return (customers || []).filter((c) => {
      return (
        (!filters.CardCode || c.CardCode.toLowerCase().includes(filters.CardCode.toLowerCase())) &&
        (!filters.CardName || c.CardName.toLowerCase().includes(filters.CardName.toLowerCase())) &&
        (!filters.ContactPerson || c.ContactPerson.toLowerCase().includes(filters.ContactPerson.toLowerCase())) &&
        (!filters.type || c.type === filters.type)
      );
    });
  }, [filters, customers]);

  // ================= RESET ================= //

  const clearFilters = () => {
    setFilters({
      CardCode: '',
      CardName: '',
      ContactPerson: '',
      type: ''
    });
  };

  // ================= SELECT CUSTOMER ================= //

  const handleSelect = (row) => {
    onSelectCustomer({
      CardCode: row.CardCode,
      CardName: row.CardName,
      ContactPerson: row.ContactPerson
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
        Customer Selection
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {/* ================= FILTER CARD ================= */}

        <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Filters
          </Typography>

          <Grid container spacing={2}>
            {/* CARD CODE */}

            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                size="small"
                label="Card Code"
                value={filters.CardCode}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    CardCode: e.target.value
                  })
                }
              />
            </Grid>

            {/* CARD NAME */}

            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                size="small"
                label="Card Name"
                value={filters.CardName}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    CardName: e.target.value
                  })
                }
              />
            </Grid>

            {/* CONTACT PERSON */}

            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                size="small"
                label="Contact Person"
                value={filters.ContactPerson}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    ContactPerson: e.target.value
                  })
                }
              />
            </Grid>

            {/* CLEAR BUTTON */}

            <Grid item xs={12}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: 2
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
                {['S.No', 'Card Code', 'Card Name', 'Contact Person'].map((h) => (
                  <TableCell
                    key={h}
                    sx={{
                      color: '#fff',
                      fontWeight: 600
                    }}
                  >
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {loading && customers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 5 }}>
                    <CircularProgress color="secondary" size={30} />
                  </TableCell>
                </TableRow>
              )}

              {filteredData.map((row, index) => (
                <TableRow
                  key={row.CardCode}
                  hover
                  onClick={() => handleSelect(row)}
                  sx={{
                    cursor: 'pointer'
                  }}
                >
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{row.CardCode}</TableCell>
                  <TableCell>{row.CardName}</TableCell>
                  <TableCell>{row.ContactPerson}</TableCell>
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
