import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import SearchIcon from '@mui/icons-material/Search';
import FreightLookupModal from '../master-data/FreightLookupModal';
import TaxCodeLookupModal from '../master-data/TaxCodeLookup';

const createRow = (id) => ({
  id,
  freightCode: '',
  freightName: '',
  remark: '',
  amount: '',
  taxGroup: '',
  taxPercentage: '',
  taxAmount: '',
  grossAmount: ''
});

export default function FreightPopup({open, onClose, onApply, initialExpenses,isPurchase}) {

  const [rows, setRows] = useState([
    createRow(1)
  ]);

  useEffect(() => {
    if (!open) return;
    const seeded = (initialExpenses || []).map((exp, i) => ({
      ...createRow(i + 1),
      ...exp,
      id: exp.id ?? i + 1
    }));
    setRows(seeded.length ? [...seeded, createRow(seeded.length + 1)] : [createRow(1)]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const [openFreightLookup, setOpenFreightLookup] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState(null);

  const [openTaxLookup, setOpenTaxLookup] = useState(false);
  const [selectedTaxRowId, setSelectedTaxRowId] = useState(null);

  const updateRow = (id, field, value) => {
    const updatedRows = rows.map((row) => {
      if (row.id === id) {

        const updated = {
          ...row,
          [field]: value
        };

        const amount = parseFloat(updated.amount || 0);
        const taxPercent = parseFloat(updated.taxPercentage || 0);

        const taxAmount = (amount * taxPercent) / 100;
        const gross = amount + taxAmount;

        return {
          ...updated,
          taxAmount: taxAmount.toFixed(2),
          grossAmount: gross.toFixed(2)
        };
      }
      return row;
    });

    setRows(updatedRows);

    const lastRow = updatedRows[updatedRows.length - 1];
    const filled = lastRow.freightName && lastRow.amount;

    if (filled) {
      setRows((prev) => [
        ...updatedRows,
        createRow(prev.length + 1)
      ]);
    }
  };

  const deleteRow = (id) => {
    setRows((prev) => (prev.length <= 1 ? prev : prev.filter((r) => r.id !== id)));
  };

  const handleFreightSelect = (selected) => {
    const updatedRows = rows.map((row) => {
      if (row.id === selectedRowId) {
        return {
          ...row,
          freightCode: selected.freightCode,
          freightName: selected.freightName
        };
      }
      return row;
    });

    setRows(updatedRows);
    setOpenFreightLookup(false);
    setSelectedRowId(null);
  };

  const handleTaxSelect = (selected) => {
    const updatedRows = rows.map((row) => {
      if (row.id === selectedTaxRowId) {

        const taxPercentage = parseFloat(selected.taxPercentage || 0);
        const amount = parseFloat(row.amount || 0);

        const taxAmount = (amount * taxPercentage) / 100;
        const grossAmount = amount + taxAmount;

        return {
          ...row,
          taxGroup: selected.taxCode,
          taxPercentage: taxPercentage.toString(),
          taxAmount: taxAmount.toFixed(2),
          grossAmount: grossAmount.toFixed(2)
        };
      }
      return row;
    });

    setRows(updatedRows);
    setOpenTaxLookup(false);
    setSelectedTaxRowId(null);
  };

  const summary = useMemo(() => {
    const totalAmount = rows.reduce(
      (sum, row) => sum + parseFloat(row.amount || 0),
      0
    );

    const totalTax = rows.reduce(
      (sum, row) => sum + parseFloat(row.taxAmount || 0),
      0
    );

    const grossTotal = rows.reduce(
      (sum, row) => sum + parseFloat(row.grossAmount || 0),
      0
    );

    return { totalAmount, totalTax, grossTotal };
  }, [rows]);

  const handleApply = () => {
    const validRows = rows.filter(
      row =>
        row.freightCode &&
        Number(row.amount) > 0
    );

    onApply({
      total: summary.grossTotal,
      expenses: validRows
    });

    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xl"
      fullWidth
    >

      <DialogTitle>
        Freight Details
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <TableContainer
          component={Paper}
          variant="outlined"
          sx={{
            mt: 2,
            maxHeight: 500
          }}
        >
          <Table
            stickyHeader
            size="small"
          >

            <TableHead>
              <TableRow>
                {[
                  'S.No',
                  'Freight Name',
                  'Remark',
                  'Amount',
                  'Tax Group',
                  'Tax %',
                  'Tax Amount',
                  'Gross Amount',
                  'Action'
                ].map((header) => (
                  <TableCell
                    key={header}
                    sx={{
                      color: '#fff',
                      fontWeight: 700,
                      whiteSpace: 'nowrap',
                      backgroundColor: 'grey.100'
                    }}
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {rows.map(
                (row, index) => (
                  <TableRow
                    key={row.id}
                    hover
                  >

                    <TableCell>
                      {index + 1}
                    </TableCell>

                    <TableCell
                      sx={{
                        minWidth: 220
                      }}
                    >
                      <TextField
                        size="small"
                        value={
                          row.freightName
                        }
                        onChange={(e) =>
                          updateRow(
                            row.id,
                            'freightName',
                            e.target.value
                          )
                        }
                        sx={{
                          width: '100%'
                        }}
                        InputProps={{
                          readOnly: true,
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                size="small"
                                onClick={() => {
                                  setSelectedRowId(row.id);
                                  setOpenFreightLookup(true);
                                }}
                              >
                                <SearchIcon
                                  sx={{ color: '#2196f3', fontSize: 16 }}
                                />
                              </IconButton>
                            </InputAdornment>
                          )
                        }}
                      />
                    </TableCell>
                    <TableCell
                      sx={{
                        minWidth: 220
                      }}
                    >
                      <TextField
                        size="small"
                        value={
                          row.remark || ''
                        }
                        onChange={(e) =>
                          updateRow(
                            row.id,
                            'remark',
                            e.target.value
                          )
                        }
                        sx={{
                          width: '100%'
                        }}
                      />
                    </TableCell>
                    <TableCell
                      sx={{
                        minWidth: 130
                      }}
                    >
                      <TextField
                        size="small"
                        type="number"
                        value={
                          row.amount || ''
                        }
                        onChange={(e) =>
                          updateRow(
                            row.id,
                            'amount',
                            e.target.value
                          )
                        }
                        sx={{
                          width: '100%'
                        }}
                      />
                    </TableCell>
                    <TableCell
                      sx={{
                        minWidth: 180
                      }}
                    >
                      <TextField
                        size="small"
                        value={
                          row.taxGroup
                        }
                        onChange={(e) =>
                          updateRow(
                            row.id,
                            'taxGroup',
                            e.target.value
                          )
                        }
                        sx={{
                          width: '100%'
                        }}
                        InputProps={{
                          readOnly: true,
                          endAdornment:
                            (
                              <InputAdornment position="end">
                                <IconButton
                                  size="small"
                                  onClick={() => {
                                    setSelectedTaxRowId(row.id);
                                    setOpenTaxLookup(true);
                                  }}
                                >
                                  <SearchIcon sx={{ color: '#2196f3', fontSize: 16 }} />
                                </IconButton>
                              </InputAdornment>
                            )
                        }}
                      />
                    </TableCell>
                    <TableCell
                      sx={{
                        minWidth: 120
                      }}
                    >
                      <TextField
                        size="small"
                        value={row.taxPercentage || ''}
                        InputProps={{ readOnly: true }}
                        sx={{ width: '100%' }}
                      />
                    </TableCell>
                    <TableCell
                      sx={{
                        minWidth: 150
                      }}
                    >
                      <TextField
                        size="small"
                        disabled
                        value={
                          row.taxAmount
                        }
                        sx={{
                          width: '100%'
                        }}
                      />
                    </TableCell>
                    <TableCell
                      sx={{
                        minWidth: 150
                      }}
                    >
                      <TextField
                        size="small"
                        disabled
                        value={
                          row.grossAmount
                        }
                        sx={{
                          width: '100%'
                        }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="error"
                        onClick={() =>
                          deleteRow(
                            row.id
                          )
                        }
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Box
          sx={{
            mt: 3,
            display: 'flex',
            justifyContent:
              'flex-end'
          }}
        >
          <Paper
            variant="outlined"
            sx={{
              p: 3,
              minWidth: 350
            }}
          >
            <Typography
              variant="h6"
              sx={{ mb: 2 }}
            >
              Freight Summary
            </Typography>

            <Stack spacing={2}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent:
                    'space-between'
                }}
              >
                <Typography>
                  Total Amount
                </Typography>

                <Typography fontWeight={600}>
                  {summary.totalAmount.toFixed(
                    2
                  )}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  justifyContent:
                    'space-between'
                }}
              >
                <Typography>
                  Total Tax
                </Typography>

                <Typography fontWeight={600}>
                  {summary.totalTax.toFixed(
                    2
                  )}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  justifyContent:
                    'space-between'
                }}
              >
                <Typography variant="h6">
                  Gross Total
                </Typography>

                <Typography
                  variant="h6"
                  color="secondary"
                >
                  {summary.grossTotal.toFixed(
                    2
                  )}
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Box>
        <Box
          sx={{
            mt: 3,
            display: 'flex',
            justifyContent:
              'flex-end',
            gap: 2
          }}
        >
          <Button
            variant="outlined"
            color="error"
            onClick={onClose}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            color="secondary"
            onClick={handleApply}
          >
            Continue
          </Button>
        </Box>
      </DialogContent>
      <FreightLookupModal
        open={openFreightLookup}
        onClose={() => setOpenFreightLookup(false)}
        onSelectFreight={handleFreightSelect}
        isPurchase={isPurchase}
      />
      <TaxCodeLookupModal
        open={openTaxLookup}
        onClose={() => setOpenTaxLookup(false)}
        onSelectTax={handleTaxSelect}
        isPurchase={isPurchase}
      />
    </Dialog>
  );
};
