import {
  useMemo,
  useState,
  useEffect
} from 'react';

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

import {
  useDispatch,
  useSelector
} from 'react-redux';

import {
  getWarehouses
} from '../../../store/slices/warehouseSlice';

export default function WarehouseSelectPopup({
  open,
  onClose,
  onSelectWarehouse
}) {
  const dispatch = useDispatch();

  const {
    warehouses,
    loading,
    error
  } = useSelector(
    (state) => state.warehouse
  );

  const [filters, setFilters] =
    useState({
      warehouseCode: '',
      warehouseName: ''
    });

  useEffect(() => {
    if (
      open &&
      warehouses.length === 0
    ) {
      dispatch(getWarehouses());
    }

    if (open) {
      setFilters({
        warehouseCode: '',
        warehouseName: ''
      });
    }
  }, [open]);

  const filteredData = useMemo(() => {
    return (
      warehouses || []
    ).filter((w) => {
      return (
        (!filters.warehouseCode ||
          (
            w.WarehouseCode || ''
          )
            .toLowerCase()
            .includes(
              filters.warehouseCode.toLowerCase()
            )) &&
        (!filters.warehouseName ||
          (
            w.WarehouseName || ''
          )
            .toLowerCase()
            .includes(
              filters.warehouseName.toLowerCase()
            ))
      );
    });
  }, [filters, warehouses]);

  const clearFilters = () => {
    setFilters({
      warehouseCode: '',
      warehouseName: ''
    });
  };

  const handleSelect = (
    row
  ) => {
    onSelectWarehouse({
      warehouseCode:
        row.WarehouseCode,
      warehouseName:
        row.WarehouseName
    });

    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
    >

      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent:'space-between',
          alignItems: 'center'
        }}
      >
        <Typography
          variant="h5"
          component="div"
        >
          Warehouse Selection
        </Typography>

        <IconButton
          onClick={onClose}
        >
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
          <Typography
            variant="h6"
            sx={{ mb: 2 }}
          >
            Filters
          </Typography>

          <Grid
            container
            spacing={2}
          >
            {/* WAREHOUSE CODE */}

            <Grid
              item
              xs={12}
              md={4}
            >
              <TextField
                fullWidth
                size="small"
                label="Warehouse Code"
                value={
                  filters.warehouseCode
                }
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    warehouseCode:
                      e.target.value
                  })
                }
              />
            </Grid>

            {/* WAREHOUSE NAME */}

            <Grid
              item
              xs={12}
              md={4}
            >
              <TextField
                fullWidth
                size="small"
                label="Warehouse Name"
                value={
                  filters.warehouseName
                }
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    warehouseName:
                      e.target.value
                  })
                }
              />
            </Grid>

            {/* CLEAR BUTTON */}

            <Grid item xs={12}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent:
                    'flex-end'
                }}
              >
                <Button
                  variant="outlined"
                  color="error"
                  onClick={
                    clearFilters
                  }
                >
                  Clear
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* ================= ERROR ================= */}

        {error && (
          <Alert
            severity="error"
            sx={{ mb: 2 }}
          >
            {error}
          </Alert>
        )}

        {/* ================= TABLE ================= */}

        <TableContainer
          component={Paper}
          variant="outlined"
        >
          <Table size="small">
            <TableHead>
              <TableRow
                sx={{
                  backgroundColor:
                    'grey.100'
                }}
              >
                {[
                  'S.No',
                  'Warehouse Code',
                  'Warehouse Name'
                ].map((h) => (
                  <TableCell
                    key={h}
                    sx={{
                      fontWeight: 700
                    }}
                  >
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {/* ================= LOADER ================= */}

              {loading &&
                warehouses.length ===
                  0 && (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      align="center"
                      sx={{
                        py: 5
                      }}
                    >
                      <CircularProgress
                        color="secondary"
                        size={32}
                      />
                    </TableCell>
                  </TableRow>
                )}

              {/* ================= DATA ================= */}

              {filteredData.map(
                (
                  row,
                  index
                ) => (
                  <TableRow
                    key={
                      row.WarehouseCode
                    }
                    hover
                    onClick={() =>
                      handleSelect(
                        row
                      )
                    }
                    sx={{
                      cursor:
                        'pointer'
                    }}
                  >
                    <TableCell>
                      {index + 1}
                    </TableCell>

                    <TableCell>
                      {
                        row.WarehouseCode
                      }
                    </TableCell>

                    <TableCell>
                      {
                        row.WarehouseName
                      }
                    </TableCell>
                  </TableRow>
                )
              )}

              {/* ================= EMPTY ================= */}

              {!loading &&
                filteredData.length ===
                  0 && (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      align="center"
                    >
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