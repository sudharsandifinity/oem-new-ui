import { useState, useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
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
import { getUsers, getEmployees, getDepartments } from '../../store/slices/commonSlice';

// Column config per type
const USER_COLS = ['UserCode', 'UserName', 'Email'];
const EMP_COLS = ['EmployeeID', 'FirstName', 'LastName', 'Email'];
const USER_LABELS = { UserCode: 'User Code', UserName: 'Username', Email: 'Email' };
const EMP_LABELS = { EmployeeID: 'Employee ID', FirstName: 'First Name', LastName: 'Last Name', Email: 'Email' };

export default function RequestorSelectModal({ open, onClose, onSelect, requestorType = 'User' }) {
  const dispatch = useDispatch();
  const { users, usersLoading, employees, employeesLoading, departments } = useSelector((s) => s.common);

  const [selectedId, setSelectedId] = useState(null);
  const [filters, setFilters] = useState({});

  const isEmployee = requestorType === 'Employee';
  const source = isEmployee ? employees : users;
  const loading = isEmployee ? employeesLoading : usersLoading;
  const cols = isEmployee ? EMP_COLS : USER_COLS;
  const labels = isEmployee ? EMP_LABELS : USER_LABELS;

  useEffect(() => {
    if (!open) return;
    setSelectedId(null);
    setFilters({});
    if (isEmployee) {
      if (!employees.length) dispatch(getEmployees());
    } else {
      if (!users.length) dispatch(getUsers());
    }
    if (!departments.length) dispatch(getDepartments());
  }, [open, isEmployee]);

  const setFilter = (key, val) => setFilters((prev) => ({ ...prev, [key]: val }));
  const clearFilters = () => setFilters({});

  const filtered = useMemo(() => {
    return source.filter((row) =>
      cols.every((key) => {
        const f = filters[key] || '';
        return (
          !f ||
          String(row[key] ?? '')
            .toLowerCase()
            .includes(f.toLowerCase())
        );
      })
    );
  }, [source, cols, filters]);

  const rowId = (row) => (isEmployee ? row.EmployeeID : row.UserCode);

  const resolveDept = (deptKey) => {
    if (!deptKey) return { deptId: '', deptName: '' };
    const dept = departments.find((d) => String(d.Code ?? d.DeptCode ?? d.Id ?? '') === String(deptKey));
    return {
      deptId: String(deptKey),
      deptName: dept?.Name ?? dept?.DeptName ?? dept?.Description ?? String(deptKey)
    };
  };

  const handleChoose = () => {
    const row = filtered.find((r) => rowId(r) === selectedId);
    if (!row) return;
    const rawDeptKey = row.DeptCode ?? row.Department ?? row.DepartmentCode ?? '';
    const { deptId, deptName } = resolveDept(rawDeptKey);
    onSelect(
      isEmployee
        ? { code: row.EmployeeID, name: `${row.FirstName ?? ''} ${row.LastName ?? ''}`.trim(), deptId, deptName }
        : { code: row.UserCode, name: row.UserName ?? row.Username ?? '', deptId, deptName }
    );
    handleClose();
  };

  const handleClose = () => {
    setSelectedId(null);
    setFilters({});
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" component="div">
          Select Requestor — {requestorType}
        </Typography>
        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
          <Typography sx={{ mb: 2 }}>Filters</Typography>
          <Grid container spacing={2}>
            {cols.map((key) => (
              <Grid item xs={12} md={4} key={key}>
                <TextField
                  fullWidth
                  size="small"
                  label={labels[key]}
                  value={filters[key] || ''}
                  onChange={(e) => setFilter(key, e.target.value)}
                />
              </Grid>
            ))}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant="outlined" color="error" onClick={clearFilters}>
                  Clear
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 380 }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: 'grey.100' }}>
                <TableCell sx={{ fontWeight: 700 }}>S.No</TableCell>
                {cols.map((key) => (
                  <TableCell key={key} sx={{ fontWeight: 700, whiteSpace: 'nowrap', backgroundColor: 'grey.100' }}>
                    {labels[key]}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell colSpan={cols.length + 1} align="center" sx={{ py: 5 }}>
                    <CircularProgress size={28} />
                  </TableCell>
                </TableRow>
              )}

              {!loading &&
                filtered.map((row, index) => (
                  <TableRow
                    key={rowId(row)}
                    hover
                    selected={selectedId === rowId(row)}
                    onClick={() => setSelectedId(rowId(row))}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell>{index + 1}</TableCell>
                    {cols.map((key) => (
                      <TableCell key={key} sx={{ whiteSpace: 'nowrap' }}>
                        {row[key]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}

              {!loading && filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={cols.length + 1} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                    No results found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
        <Button variant="outlined" onClick={handleClose}>
          Close
        </Button>
        <Button variant="contained" color="secondary" disabled={!selectedId} onClick={handleChoose}>
          Choose
        </Button>
      </DialogActions>
    </Dialog>
  );
}
