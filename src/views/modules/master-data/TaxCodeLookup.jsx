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
import { getPurTaxCodes, getTaxCodes } from '../../../store/slices/taxCodeSlice';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';

// ================= COMPONENT ================= //

export default function TaxSelectPopup({ open, onClose, onSelectTax,isPurchase=false }) {
  const dispatch = useDispatch();
  const { taxCodes, loading, error,purTaxCode,
  purTaxLoading,
  purTaxerror } = useSelector((state) => state.taxCode);

  const [filters, setFilters] = useState({
    taxCode: '',
    taxName: ''
  });

  // ================= FILTERED DATA ================= //

  const filteredData = useMemo(() => {
    return (isPurchase?purTaxCode||[]:taxCodes || []).filter((tax) => {
      return (
        (!filters.taxCode || tax.Code.toLowerCase().includes(filters.taxCode.toLowerCase())) &&
        (!filters.taxName || tax.Name.toLowerCase().includes(filters.taxName.toLowerCase()))
      );
    });
  }, [filters, taxCodes,purTaxCode]);

  // ================= CLEAR FILTERS ================= //

  const clearFilters = () => {
    setFilters({
      taxCode: '',
      taxName: ''
    });
  };

  // ================= SELECT TAX ================= //

  const handleSelect = (row) => {
    onSelectTax({
      taxCode: row.Code,
      taxName: row.Name,
      taxPercentage: row.VatGroups_Lines?.[0]?.Rate || 0
    });
    onClose();
  };

  useEffect(() => {
    if (open) {
      if(isPurchase){
        dispatch(getPurTaxCodes());
      }else{
      dispatch(getTaxCodes());
      }
      setFilters({
        taxCode: '',
        taxName: ''
      });
    }
  }, [open]);

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
        <Typography variant="h5" component="div">
          Tax Selection
        </Typography>

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
            {/* TAX CODE */}

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                size="small"
                label="Tax Code"
                value={filters.taxCode}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    taxCode: e.target.value
                  })
                }
              />
            </Grid>

            {/* TAX NAME */}

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                size="small"
                label="Tax Name"
                value={filters.taxName}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    taxName: e.target.value
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
                {['S.No', 'Tax Code', 'Tax Name', 'Tax %'].map((header) => (
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
              {isPurchase?purTaxLoading && purTaxCode.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 5 }}>
                    <CircularProgress color="secondary" size={32} />
                  </TableCell>
                </TableRow>
              ):loading && taxCodes.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 5 }}>
                    <CircularProgress color="secondary" size={32} />
                  </TableCell>
                </TableRow>
              )}
              {filteredData.map((row, index) => (
                <TableRow
                  key={row.Code}
                  hover
                  onClick={() => handleSelect(row)}
                  sx={{
                    cursor: 'pointer'
                  }}
                >
                  <TableCell>{index + 1}</TableCell>

                  <TableCell>{row.Code}</TableCell>

                  <TableCell>{row.Name}</TableCell>

                  <TableCell>{row.VatGroups_Lines?.[0]?.Rate || 0}%</TableCell>
                </TableRow>
              ))}

              {/* EMPTY */}

              {!loading&&purTaxLoading && filteredData.length === 0 && (
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
