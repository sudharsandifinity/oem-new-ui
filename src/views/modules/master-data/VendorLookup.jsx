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
import { getVendors } from '../../../store/slices/customerSlice';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';

// ================= COMPONENT ================= //

export default function VendorSelectPopup({ open, onClose, onSelectVendor }) {
  const dispatch = useDispatch();
  const { vendor, vendorLoading, vendorerror } = useSelector((state) => state.customer);

  useEffect(() => {
    if (open && vendor.length === 0) {
      dispatch(getVendors());
    }
  }, [open]);

  const [filters, setFilters] = useState({
    VendorCode: '',
    VendorName: '',
    ContactPerson: '',
    type: ''
  });

  // ================= FILTER LOGIC ================= //

  const filteredData = useMemo(() => {
    return (vendor || []).filter((c) => {
      return (
        (!filters.VendorCode || c.VendorCode.toLowerCase().includes(filters.VendorCode.toLowerCase())) &&
        (!filters.VendorName || c.VendorName.toLowerCase().includes(filters.VendorName.toLowerCase())) &&
        (!filters.ContactPerson || c.ContactPerson.toLowerCase().includes(filters.ContactPerson.toLowerCase())) &&
        (!filters.type || c.type === filters.type)
      );
    });
  }, [filters, vendor]);

  // ================= RESET ================= //

  const clearFilters = () => {
    setFilters({
      VendorCode: '',
      VendorName: '',
      ContactPerson: '',
      type: ''
    });
  };

  // ================= SELECT Vendor ================= //

  const handleSelect = (row) => {
    onSelectVendor({
      VendorCode: row.CardCode,
      VendorName: row.CardName,
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
        Vendor Selection
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {/* ================= FILTER Vendor ================= */}

        <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Filters
          </Typography>

          <Grid container spacing={2}>
            {/* Vendor CODE */}

            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                size="small"
                label="Vendor Code"
                value={filters.CardCode}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    CardCode: e.target.value
                  })
                }
              />
            </Grid>

            {/* Vendor NAME */}

            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                size="small"
                label="Vendor Name"
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

        {vendorerror && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {vendorerror}
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
                {['S.No', 'Vendor Code', 'Vendor Name', 'Contact Person'].map((h) => (
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
              {vendorLoading && vendor.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 5 }}>
                    <CircularProgress color="secondary" size={30} />
                  </TableCell>
                </TableRow>
              )}

              {filteredData.map((row, index) => (
                <TableRow
                  key={row.VendorCode}
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

              {!vendorLoading && filteredData.length === 0 && (
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
