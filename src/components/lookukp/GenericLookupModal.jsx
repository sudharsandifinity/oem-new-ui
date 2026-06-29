import { useEffect, useMemo, useState } from 'react';

import {
  Alert,
  Box,
  Button,
  CircularProgress,
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
import Checkbox from '@mui/material/Checkbox';
import CloseIcon from '@mui/icons-material/Close';

export default function GenericLookupModal({
  open,
  onClose,
  title,
  data = [],
  loading = false,
  error = null,
  filters = [],
  columns = [],
  onSelect,
  multiSelect = false,
   selectedIds = []
}) {
  const [filterValues, setFilterValues] = useState({});
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    if (!open) return;

    const initialFilters = {};
    filters.forEach((f) => {
      initialFilters[f.key] = '';
    });
    setFilterValues(initialFilters);
    setSelectedRows([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);
  useEffect(() => {
    if (!open || !multiSelect || !selectedIds.length) return;
    setSelectedRows((prev) => (prev.length ? prev : data.filter((row) => selectedIds.includes(row.id))));
  }, [open, multiSelect, data, selectedIds]);
  const handleRowSelection = (row) => {
    console.log('handlerowselection', multiSelect);
    if (!multiSelect) {
      onSelect?.(row);
      onClose?.();
      return;
    }

    setSelectedRows((prev) => {
      const exists = prev.some((r) => r.id === row.id);

      if (exists) {
        return prev.filter((r) => r.id !== row.id);
      }

      return [...prev, row];
    });
  };

  // ================= FILTER DATA =================

  const filteredData = useMemo(() => {
    return (data || []).filter((row) =>
      filters.every((filter) => {
        const filterValue = filterValues[filter.key];

        if (!filterValue) return true;

        return String(row[filter.dataKey] ?? '')
          .toLowerCase()
          .includes(filterValue.toLowerCase());
      })
    );
  }, [data, filters, filterValues]);

  // ================= CLEAR FILTERS =================

  const clearFilters = () => {
    const reset = {};

    filters.forEach((f) => {
      reset[f.key] = '';
    });

    setFilterValues(reset);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      {/* HEADER */}

      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Typography variant="h5" component="div">
          {title}
        </Typography>

        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {/* FILTERS */}

        <Paper
          variant="outlined"
          sx={{
            p: 2,
            mb: 3
          }}
        >
          <Typography sx={{ mb: 2 }}>Filters</Typography>

          <Grid container spacing={2}>
            {filters.map((filter) => (
              <Grid item xs={12} md={4} key={filter.key}>
                <TextField
                  fullWidth
                  size="small"
                  label={filter.label}
                  value={filterValues[filter.key] || ''}
                  onChange={(e) =>
                    setFilterValues((prev) => ({
                      ...prev,
                      [filter.key]: e.target.value
                    }))
                  }
                />
              </Grid>
            ))}

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

        {/* ERROR */}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* TABLE */}

        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow
                sx={{
                  backgroundColor: 'grey.100'
                }}
              >
                {' '}
                {multiSelect && (
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={filteredData.length > 0 && selectedRows.length === filteredData.length}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedRows(filteredData);
                        } else {
                          setSelectedRows([]);
                        }
                      }}
                    />
                  </TableCell>
                )}
                <TableCell
                  sx={{
                    fontWeight: 700
                  }}
                >
                  S.No
                </TableCell>
                {columns.map((column) => (
                  <TableCell
                    key={column.field}
                    sx={{
                      fontWeight: 700
                    }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {/* LOADING */}

              {loading && data.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={columns.length + 1}
                    align="center"
                    sx={{
                      py: 5
                    }}
                  >
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              )}

              {/* DATA */}

              {filteredData.map((row, index) => (
                // <TableRow
                //   hover
                //   key={row.id || index}
                //   sx={{
                //     cursor: 'pointer'
                //   }}
                //   onClick={() => {
                //     onSelect?.(row);

                //     onClose?.();
                //   }}
                // >
                <TableRow
                  hover
                  key={row.id || index}
                  sx={{
                    cursor: 'pointer'
                  }}
                  onClick={() => handleRowSelection(row)}
                >
                  {multiSelect && (
                    <TableCell padding="checkbox">
                      <Checkbox checked={selectedRows.some((r) => r.id === row.id)} />
                    </TableCell>
                  )}
                  <TableCell>{index + 1}</TableCell>

                  {columns.map((column) => (
                    <TableCell key={column.field}>{row[column.field]}</TableCell>
                  ))}
                </TableRow>
              ))}

              {/* EMPTY */}

              {!loading && filteredData.length === 0 && (
                <TableRow>
                  <TableCell colSpan={columns.length + 1} align="center">
                    No Data Found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          {multiSelect && (
            <Box
              sx={{
                mt: 2,
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 1
              }}
            >
              <Button onClick={onClose}>Cancel</Button>

              <Button
                variant="contained"
                onClick={() => {
                  onSelect?.(selectedRows);
                  onClose?.();
                }}
              >
                Select ({selectedRows.length})
              </Button>
            </Box>
          )}
        </TableContainer>
      </DialogContent>
    </Dialog>
  );
}
