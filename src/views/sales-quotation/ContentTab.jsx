import { useEffect } from 'react';
import {
  Box,
  IconButton,
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

const TABLE_COLUMNS = [
  { key: 'seq', label: '#', width: 50, editable: false },
  { key: 'ItemCode', label: 'Item Code', width: 130, editable: false },
  { key: 'ItemDescription', label: 'Description', width: 180, editable: true },
  { key: 'FullDescription', label: 'Full Desc', width: 180, editable: false },
  { key: 'Quantity', label: 'Quantity', width: 100, editable: true, type: 'number' },
  { key: 'UoMCode', label: 'UOM', width: 100, editable: false },
  { key: 'POQty', label: 'PO Qty', width: 100, editable: false },
  { key: 'POOpenQty', label: 'PO Open Qty', width: 120, editable: false },
  { key: 'WarehouseCode', label: 'Warehouse', width: 130, editable: false },
  { key: 'ProjectCode', label: 'Project', width: 130, editable: false },
  { key: 'IssuedQty', label: 'Issued Qty', width: 100, editable: false },
  { key: 'InStock', label: 'In Stock', width: 100, editable: false },
  { key: 'Remark', label: 'Remark', width: 160, editable: true }
];

export default function SalesQuotationContentTab({ data, setData, rows, setRows, readOnly = false }) {
  useEffect(() => {
    if (!rows.length) return;
    setRows((prev) =>
      prev.map((r) => ({
        ...r,
        ProjectCode: r.ProjectCode || data?.ProjectCode || ''
      }))
    );
  }, [data]);

  const updateRow = (id, field, value) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  };

  const deleteRow = (id) => {
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  const renderCell = (row, col) => {
    if (col.key === 'seq') return null;

    const disabled = readOnly || !col.editable;

    if (col.type === 'number') {
      return (
        <TextField
          size="small"
          fullWidth
          type="number"
          value={row[col.key] ?? ''}
          disabled={disabled}
          onChange={(e) => updateRow(row.id, col.key, e.target.value)}
          sx={{ minWidth: col.width - 20 }}
        />
      );
    }

    const field = (
      <TextField
        size="small"
        fullWidth
        value={row[col.key] ?? ''}
        disabled={disabled}
        onChange={(e) => updateRow(row.id, col.key, e.target.value)}
        sx={{ minWidth: col.width - 20 }}
      />
    );

    if ((col.key === 'ItemDescription' || col.key === 'FullDescription') && row[col.key]) {
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
      <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 360, borderRadius: 2 }}>
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

      <Box sx={{ mt: 3, display: 'flex' }}>
        <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, width: '50%', minWidth: 280 }}>
          <Typography variant="h5" sx={{ mb: 2.5 }}>
            Comments
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
      </Box>
    </Box>
  );
}
