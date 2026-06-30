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
import CircularProgress from '@mui/material/CircularProgress';
import { getServices } from '../../../store/slices/commonSlice';

export default function ServiceSelectPopup({ open, onClose, onSelectService }) {
  const dispatch = useDispatch();

  const { services, servicesLoading } = useSelector((state) => state.common);

  useEffect(() => {
    if (open && services.length === 0) {
      dispatch(getServices());
    }
  }, [open]);

  const [filters, setFilters] = useState({
    Code: '',
    Name: ''
  });

  const filteredData = useMemo(() => {
    return (services || []).filter((service) => {
      const code = (service.Code || '').toString().toLowerCase();
      const name = (service.Name || '').toString().toLowerCase();

      const fCode = (filters.Code || '').toLowerCase();
      const fName = (filters.Name || '').toLowerCase();

      return (!fCode || code.includes(fCode)) && (!fName || name.includes(fName));
    });
  }, [filters, services]);

  const clearFilters = () => {
    setFilters({
      Code: '',
      Name: ''
    });
  };

  useEffect(() => {
    if (open) {
      setFilters({
        Code: '',
        Name: ''
      });
    }
  }, [open]);

  const handleSelect = (row) => {
    onSelectService({
      Code: row.Code,
      Name: row.Name
    });

    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Typography variant="h4">Service Selection</Typography>

        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>

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

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                size="small"
                label="Service No"
                value={filters.Code}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    Code: e.target.value
                  })
                }
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                size="small"
                label="Service Description"
                value={filters.Name}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    Name: e.target.value
                  })
                }
              />
            </Grid>

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

        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow
                sx={{
                  backgroundColor: 'grey.100'
                }}
              >
                {['S.No', 'Service No', 'Service Description'].map((header) => (
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
              {servicesLoading && services.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} align="center" sx={{ py: 5 }}>
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
                </TableRow>
              ))}

              {!servicesLoading && filteredData.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} align="center">
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
