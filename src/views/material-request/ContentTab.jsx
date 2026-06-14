import { useState } from 'react';
import {
  Box,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
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
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import { useLookup } from '../../context/LookupContext';
import RequestorSelectModal from './RequestorSelectModal';

const TABLE_COLUMNS = [
  { key: 'seq',             label: '#',            width: 50  },
  { key: 'BOMLineNum',      label: 'BOM Line',     width: 90  },
  { key: 'ItemCode',        label: 'Item Code',    width: 130 },
  { key: 'ItemDescription', label: 'Description',  width: 180 },
  { key: 'FullDescription', label: 'Full Desc',    width: 180 },
  { key: 'Quantity',        label: 'Quantity',     width: 100 },
  { key: 'UoMCode',         label: 'UOM',          width: 100 },
  { key: 'BOMQty',          label: 'BOM Qty',      width: 100 },
  { key: 'BOMOpenQty',      label: 'BOM Open Qty', width: 120 },
  { key: 'MROpenQty',       label: 'MR Open Qty',  width: 120 },
  { key: 'WarehouseCode',   label: 'Warehouse',    width: 130 },
  { key: 'ProjectCode',     label: 'Project',      width: 130 },
  { key: 'IssuedQty',       label: 'Issued Qty',   width: 100 },
  { key: 'InStock',         label: 'In Stock',     width: 100 },
  { key: 'Remark',          label: 'Remark',       width: 160 },
];

// Always read-only regardless of mode
const DISABLED_COLS = new Set([
  'BOMLineNum', 'FullDescription', 'BOMQty', 'BOMOpenQty',
  'MROpenQty', 'ProjectCode', 'IssuedQty', 'InStock'
]);

export default function MRContentTab({ data, setData, rows, setRows, readOnly = false }) {
  const { openLookup } = useLookup();
  const [requestorModalOpen, setRequestorModalOpen] = useState(false);

  const updateRow = (id, field, value) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  };

  const deleteRow = (id) => {
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  const handleOpenItemLookup = (rowId) => {
    openLookup({
      type: 'item',
      onSelect: (item) => {
        updateRow(rowId, 'ItemCode', item.ItemCode || '');
        updateRow(rowId, 'ItemDescription', item.ItemName || item.ItemDescription || '');
      }
    });
  };

  const handleOpenWarehouseLookup = (rowId) => {
    openLookup({
      type: 'warehouse',
      onSelect: (whs) => {
        updateRow(rowId, 'WarehouseCode', whs.WarehouseCode || whs.WhsCode || '');
      }
    });
  };

  const handleRequestorSelect = ({ code, name, deptId = '', deptName = '' }) => {
    setData((prev) => ({ ...prev, ReqCode: code, RequestorName: name, DeptId: deptId, Department: deptName }));
  };

  const renderCell = (row, col) => {
    const isDisabled = readOnly || DISABLED_COLS.has(col.key);

    if (col.key === 'Quantity') {
      return (
        <TextField
          size="small"
          fullWidth
          type="number"
          value={row.Quantity || ''}
          disabled={readOnly}
          onChange={(e) => updateRow(row.id, 'Quantity', e.target.value)}
          sx={{ minWidth: 80 }}
        />
      );
    }

    if (col.key === 'ItemCode') {
      return (
        <TextField
          size="small"
          fullWidth
          value={row.ItemCode || ''}
          disabled={isDisabled}
          sx={{ minWidth: 110 }}
          InputProps={{
            readOnly: true,
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  disabled={isDisabled}
                  onClick={() => handleOpenItemLookup(row.id)}
                >
                  <SearchIcon sx={{ fontSize: 16, color: isDisabled ? 'text.disabled' : '#2196f3' }} />
                </IconButton>
              </InputAdornment>
            )
          }}
        />
      );
    }

    if (col.key === 'WarehouseCode') {
      return (
        <TextField
          size="small"
          fullWidth
          value={row.WarehouseCode || ''}
          disabled={readOnly}
          sx={{ minWidth: 110 }}
          InputProps={{
            readOnly: true,
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  disabled={readOnly}
                  onClick={() => handleOpenWarehouseLookup(row.id)}
                >
                  <SearchIcon sx={{ fontSize: 16, color: readOnly ? 'text.disabled' : '#2196f3' }} />
                </IconButton>
              </InputAdornment>
            )
          }}
        />
      );
    }

    if (col.key === 'ProjectCode') {
      return (
        <TextField
          size="small"
          fullWidth
          value={row.ProjectCode || ''}
          disabled
          sx={{ minWidth: 110 }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton size="small" disabled>
                  <SearchIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
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
        disabled={isDisabled}
        onChange={(e) => !isDisabled && updateRow(row.id, col.key, e.target.value)}
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
      {/* Lines table */}
      <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 360, borderRadius: 2 }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              {TABLE_COLUMNS.map((col) => (
                <TableCell
                  key={col.key}
                  sx={{
                    minWidth: col.width,
                    fontWeight: 700,
                    whiteSpace: 'nowrap',
                    backgroundColor: 'grey.100'
                  }}
                >
                  {col.label}
                </TableCell>
              ))}
              {!readOnly && (
                <TableCell sx={{ minWidth: 80, backgroundColor: 'grey.100', fontWeight: 700 }}>
                  Remove
                </TableCell>
              )}
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={row.id} hover>
                <TableCell>{index + 1}</TableCell>
                {TABLE_COLUMNS.slice(1).map((col) => (
                  <TableCell key={col.key}>{renderCell(row, col)}</TableCell>
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
          </TableBody>
        </Table>
      </TableContainer>

      {/* Bottom row: Requestor Details + Remark side by side */}
      <Box sx={{ mt: 3, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'stretch' }}>

        {/* Requestor section — 40% width */}
        <Box sx={{ flex: '0 0 40%', minWidth: 260 }}>
        <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, height: '100%' }}>
          <Typography variant="h5" sx={{ mb: 2.5 }}>
            Requestor Details
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Row 1: type + requestor code */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl size="small" sx={{ minWidth: 150 }} disabled={readOnly}>
                <InputLabel>Requestor Type</InputLabel>
                <Select
                  label="Requestor Type"
                  value={data?.RequestorType || 'User'}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      RequestorType: e.target.value,
                      ReqCode: '',
                      RequestorName: '',
                      Department: ''
                    }))
                  }
                >
                  <MenuItem value="User">User</MenuItem>
                  <MenuItem value="Employee">Employee</MenuItem>
                </Select>
              </FormControl>

              <TextField
                size="small"
                label="Requestor Code"
                value={data?.ReqCode || ''}
                disabled={readOnly}
                sx={{ flex: 1 }}
                InputProps={{
                  readOnly: true,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        disabled={readOnly}
                        onClick={() => setRequestorModalOpen(true)}
                      >
                        <PersonSearchIcon sx={{ fontSize: 18, color: readOnly ? 'text.disabled' : '#2196f3' }} />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Box>

            <TextField
              size="small"
              fullWidth
              label="Requestor Name"
              value={data?.RequestorName || ''}
              disabled
            />

            <TextField
              size="small"
              fullWidth
              label="Department"
              value={data?.Department || ''}
              disabled
            />
          </Box>
        </Paper>
        </Box>

        {/* Remark section — fills remaining space */}
        <Box sx={{ flex: 1, minWidth: 200 }}>
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, height: '100%' }}>
            <Typography variant="h5" sx={{ mb: 2.5 }}>
              Remark
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              size="small"
              label="Remark"
              value={data?.Remark || ''}
              disabled={readOnly}
              onChange={(e) => setData((prev) => ({ ...prev, Remark: e.target.value }))}
            />
          </Paper>
        </Box>

      </Box>{/* end bottom row */}

      <RequestorSelectModal
        open={requestorModalOpen}
        onClose={() => setRequestorModalOpen(false)}
        onSelect={handleRequestorSelect}
        requestorType={data?.RequestorType || 'User'}
      />
    </Box>
  );
}

export const emptyRow = () => ({
  id: Date.now() + Math.random(),
  LineId: null,
  BOMLineNum: '',
  ItemCode: '',
  ItemDescription: '',
  FullDescription: '',
  Quantity: '',
  UoMCode: '',
  BOMQty: '',
  BOMOpenQty: '',
  MROpenQty: '',
  WarehouseCode: '',
  ProjectCode: '',
  IssuedQty: '',
  InStock: '',
  Remark: '',
});
