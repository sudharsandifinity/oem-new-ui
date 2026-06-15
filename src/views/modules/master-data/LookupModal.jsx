import { useMemo, useState, useEffect } from 'react';

import {
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
  TextField
} from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';

// ================= MOCK DATA ================= //

const DATA_MAP = {
  item: Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    code: `ITM00${i}`,
    name: `Item ${i}`
  })),

  tax: Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    code: `TAX00${i}`,
    name: `Tax ${i}`,
    percent: i + 5
  })),

  project: Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    code: `PRJ00${i}`,
    name: `Project ${i}`
  })),

  warehouse: Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    code: `WH00${i}`,
    name: `Warehouse ${i}`
  }))
};

// ================= CONFIG ================= //

const CONFIG = {
  item: {
    title: 'Item Selection',
    fields: ['code', 'name'],
    filterKeys: ['code', 'name']
  },

  tax: {
    title: 'Tax Selection',
    fields: ['code', 'name', 'percent'],
    filterKeys: ['code', 'name']
  },

  project: {
    title: 'Project Selection',
    fields: ['code', 'name'],
    filterKeys: ['code', 'name']
  },

  warehouse: {
    title: 'Warehouse Selection',
    fields: ['code', 'name'],
    filterKeys: ['code', 'name']
  }
};

// ================= COMPONENT ================= //

export default function LookupModal({ open, onClose, type, onSelect }) {
  const [filters, setFilters] = useState({});

  const config = CONFIG[type];
  const data = DATA_MAP[type];

  // reset filters on open
  useEffect(() => {
    if (open) setFilters({});
  }, [open]);

  // ================= FILTER ================= //

  const filteredData = useMemo(() => {
    return data.filter((row) => {
      return config.filterKeys.every((key) => {
        if (!filters[key]) return true;
        return row[key].toString().toLowerCase().includes(filters[key].toLowerCase());
      });
    });
  }, [filters, type]);

  // ================= SELECT ================= //

  const handleSelect = (row) => {
    onSelect(row);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      {/* HEADER */}

      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between'
        }}
      >
        {config.title}

        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {/* FILTERS */}

        <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
          <Grid container spacing={2}>
            {config.filterKeys.map((key) => (
              <Grid item xs={12} md={6} key={key}>
                <TextField
                  fullWidth
                  size="small"
                  label={key.toUpperCase()}
                  value={filters[key] || ''}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      [key]: e.target.value
                    })
                  }
                />
              </Grid>
            ))}
          </Grid>
        </Paper>

        {/* TABLE */}

        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: 'grey.100' }}>
                {config.fields.map((f) => (
                  <TableCell key={f} sx={{ fontWeight: 700 }}>
                    {f.toUpperCase()}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredData.map((row) => (
                <TableRow key={row.id} hover onClick={() => handleSelect(row)} sx={{ cursor: 'pointer' }}>
                  {config.fields.map((f) => (
                    <TableCell key={f}>{row[f]}</TableCell>
                  ))}
                </TableRow>
              ))}

              {filteredData.length === 0 && (
                <TableRow>
                  <TableCell colSpan={10} align="center">
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
