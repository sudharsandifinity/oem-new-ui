import { useMemo, useState } from 'react';
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import AppDatePicker from 'ui-component/AppDatePicker';
import TaxSelectPopup from '../modules/master-data/TaxCodeLookup';
import FreightPopup from '../sales-order/FreightPopup';
import { computePRLineAmounts } from './prHelpers';

const TABLE_COLUMNS = [
  { key: 'seq', label: '#', width: 50 },
  { key: 'ItemCode', label: 'Item Code', width: 170 },
  { key: 'ItemDescription', label: 'Description', width: 200 },
  { key: 'Quantity', label: 'Quantity', width: 120, editable: true, type: 'number' },
  { key: 'UoMCode', label: 'UOM', width: 110 },
  { key: 'UnitPrice', label: 'Price', width: 120, editable: true, type: 'number' },
  { key: 'Discount', label: 'Disc %', width: 110, editable: true, type: 'number' },
  { key: 'LineTotal', label: 'Total', width: 130 },
  { key: 'TaxCode', label: 'Tax Code', width: 150, type: 'tax' },
  { key: 'TaxPercentage', label: 'Tax %', width: 110 },
  { key: 'TaxAmount', label: 'Tax Amount', width: 130 },
  { key: 'GrossTotal', label: 'Gross Total', width: 140 },
  { key: 'WarehouseCode', label: 'Warehouse', width: 130 },
  { key: 'RequiredDate', label: 'Required Date', width: 150, editable: true, type: 'date' },
  { key: 'Remark', label: 'Remark', width: 160, editable: true }
];

export default function PRContentTab({ data, setData, rows, setRows, readOnly = false }) {
  const [openTaxPopup, setOpenTaxPopup] = useState(false);
  const [selectedTaxRowId, setSelectedTaxRowId] = useState(null);
  const [freightPopupOpen, setFreightPopupOpen] = useState(false);

  const freightNet = useMemo(
    () => (data?.DocumentAdditionalExpenses || []).reduce((sum, e) => sum + Number(e.amount ?? e.LineTotal ?? 0), 0),
    [data?.DocumentAdditionalExpenses]
  );

  const freightTax = useMemo(
    () =>
      (data?.DocumentAdditionalExpenses || []).reduce((sum, e) => {
        const amt = Number(e.amount ?? e.LineTotal ?? 0);
        const tax = e.taxAmount !== undefined && e.taxAmount !== null && e.taxAmount !== '' ? Number(e.taxAmount) : (amt * Number(e.taxPercentage || 0)) / 100;
        return sum + (Number(tax) || 0);
      }, 0),
    [data?.DocumentAdditionalExpenses]
  );

  const updateRow = (id, field, value) => {
    if (readOnly) return;
    setRows((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        const newRow = { ...r, [field]: value };
        return { ...newRow, ...computePRLineAmounts(newRow) };
      })
    );
  };

  const handleSelectTax = (tax) => {
    setOpenTaxPopup(false);
    setRows((prev) =>
      prev.map((r) => {
        if (r.id !== selectedTaxRowId) return r;
        const newRow = { ...r, TaxCode: tax.taxCode, TaxPercentage: tax.taxPercentage };
        return { ...newRow, ...computePRLineAmounts(newRow) };
      })
    );
    setSelectedTaxRowId(null);
  };

  const deleteRow = (id) => {
    if (readOnly) return;
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  const summary = useMemo(() => {
    const totalBeforeDiscount = rows.reduce((sum, r) => sum + parseFloat(r.LineTotal || 0), 0);
    const totalTax = rows.reduce((sum, r) => sum + parseFloat(r.TaxAmount || 0), 0);
    const grandTotal = rows.reduce((sum, r) => sum + parseFloat(r.GrossTotal || 0), 0);
    return { totalBeforeDiscount, totalTax, grandTotal };
  }, [rows]);

  const renderCell = (row, col) => {
    if (col.type === 'number') {
      return (
        <TextField
          size="small"
          fullWidth
          type="number"
          value={row[col.key] ?? ''}
          disabled={readOnly}
          onChange={(e) => updateRow(row.id, col.key, e.target.value)}
          sx={{ minWidth: col.width - 20 }}
        />
      );
    }

    if (col.type === 'date') {
      return (
        <AppDatePicker
          size="small"
          value={row[col.key] || ''}
          disabled={readOnly}
          onChange={(val) => updateRow(row.id, col.key, val)}
          sx={{ minWidth: col.width - 20 }}
        />
      );
    }

    if (col.type === 'tax') {
      return (
        <TextField
          size="small"
          fullWidth
          value={row[col.key] ?? ''}
          disabled={readOnly}
          sx={{ minWidth: col.width - 20 }}
          InputProps={{
            readOnly: true,
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  disabled={readOnly}
                  onClick={() => {
                    setSelectedTaxRowId(row.id);
                    setOpenTaxPopup(true);
                  }}
                >
                  <SearchIcon sx={{ color: '#2196f3', fontSize: 16 }} />
                </IconButton>
              </InputAdornment>
            )
          }}
        />
      );
    }

    const field = (
      <TextField
        size="small"
        fullWidth
        value={row[col.key] ?? ''}
        disabled={readOnly || !col.editable}
        onChange={(e) => updateRow(row.id, col.key, e.target.value)}
        sx={{ minWidth: col.width - 20 }}
      />
    );

    if (col.key === 'ItemDescription' && row[col.key]) {
      return (
        <Tooltip title={row[col.key]} placement="top" arrow>
          <span style={{ display: 'block', width: '100%' }}>{field}</span>
        </Tooltip>
      );
    }

    return field;
  };

  return (
    <Box>
      <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 480, borderRadius: 2 }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              {TABLE_COLUMNS.map((col) => (
                <TableCell key={col.key} sx={{ minWidth: col.width, fontWeight: 700, whiteSpace: 'nowrap', backgroundColor: 'grey.100' }}>
                  {col.label}
                </TableCell>
              ))}
              {!readOnly && <TableCell sx={{ minWidth: 80, backgroundColor: 'grey.100', fontWeight: 700 }}>Remove</TableCell>}
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={row.id} hover>
                {TABLE_COLUMNS.map((col) => (
                  <TableCell key={col.key}>{col.key === 'seq' ? index + 1 : renderCell(row, col)}</TableCell>
                ))}
                {!readOnly && (
                  <TableCell align="center">
                    <IconButton color="error" size="small" onClick={() => deleteRow(row.id)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                )}
              </TableRow>
            ))}
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={TABLE_COLUMNS.length + (readOnly ? 0 : 1)} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                  No lines
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ mt: 3, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
        <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, flex: 1, minWidth: 280 }}>
          <Typography variant="h5" sx={{ mb: 2.5 }}>
            Additional Information
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            size="small"
            label="Comments"
            value={data?.Comments || ''}
            disabled={readOnly}
            onChange={(e) => !readOnly && setData((prev) => ({ ...prev, Comments: e.target.value }))}
          />
        </Paper>

        <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, width: 380 }}>
          <Typography variant="h5" sx={{ mb: 3 }}>
            Total Summary
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography>Total Before Discount</Typography>
            <Typography>{summary.totalBeforeDiscount.toFixed(2)}</Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography>Freight</Typography>
            <Button variant="outlined" color="secondary" size="small" disabled={readOnly} onClick={() => setFreightPopupOpen(true)} sx={{ width: 120 }}>
              {freightNet > 0 ? freightNet.toFixed(2) : 'Add Freight'}
            </Button>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography>Tax</Typography>
            <Typography>{(summary.totalTax + freightTax).toFixed(2)}</Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Typography variant="h5">Total</Typography>
            <Typography variant="h5">{(summary.grandTotal + freightNet + freightTax).toFixed(2)}</Typography>
          </Box>
        </Paper>
      </Box>

      <TaxSelectPopup open={openTaxPopup} onClose={() => setOpenTaxPopup(false)} onSelectTax={handleSelectTax} />
      <FreightPopup
        open={freightPopupOpen}
        initialExpenses={data?.DocumentAdditionalExpenses}
        onClose={() => setFreightPopupOpen(false)}
        onApply={(result) => setData((prev) => ({ ...prev, DocumentAdditionalExpenses: result.expenses }))}
      />
    </Box>
  );
}
