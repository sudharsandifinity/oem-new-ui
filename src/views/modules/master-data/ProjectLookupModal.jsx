import { useMemo, useState, useEffect } from 'react';

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

import { useDispatch, useSelector } from 'react-redux';

import { getProjects } from '../../../store/slices/projectSlice';

// ================= COMPONENT ================= //

export default function ProjectLookupModal({ open, onClose, onSelectProject }) {
  const dispatch = useDispatch();

  const { projects, loading, error } = useSelector((state) => state.project);

  const [filters, setFilters] = useState({
    projectCode: '',
    projectName: ''
  });

  // ================= API ================= //

  useEffect(() => {
    if (open && projects.length === 0) {
      dispatch(getProjects());
    }

    if (open) {
      setFilters({
        projectCode: '',
        projectName: ''
      });
    }
  }, [open]);

  // ================= FILTER ================= //

  const filteredData = useMemo(() => {
    return (projects || []).filter((p) => {
      return (
        (!filters.projectCode || (p.Code || '').toLowerCase().includes(filters.projectCode.toLowerCase())) &&
        (!filters.projectName || (p.Name || '').toLowerCase().includes(filters.projectName.toLowerCase()))
      );
    });
  }, [filters, projects]);

  // ================= CLEAR ================= //

  const clearFilters = () => {
    setFilters({
      projectCode: '',
      projectName: ''
    });
  };

  // ================= SELECT ================= //

  const handleSelect = (row) => {
    onSelectProject({
      projectCode: row.Code,
      projectName: row.Name
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
        <Typography variant="h5" component="div">
          Project Selection
        </Typography>

        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {/* ================= FILTER ================= */}

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
                label="Project Code"
                value={filters.projectCode}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    projectCode: e.target.value
                  })
                }
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                size="small"
                label="Project Name"
                value={filters.projectName}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    projectName: e.target.value
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
                {['S.No', 'Project Code', 'Project Name'].map((h) => (
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
              {loading && projects.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    align="center"
                    sx={{
                      py: 5
                    }}
                  >
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

              {!loading && filteredData.length === 0 && (
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
