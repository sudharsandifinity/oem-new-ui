import { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Breadcrumbs, Button, IconButton, Paper, Stack, TextField, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

import HomeIcon from '@mui/icons-material/Home';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';

import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ClearIcon from '@mui/icons-material/Clear';

import MainCard from 'ui-component/cards/MainCard';
import { useNavigate } from 'react-router-dom';
import { getSalesQuotations } from '../../store/slices/salesQuotationSlice';

const emptyFilters = () => ({ DocEntry: '', CardCode: '', CardName: '', U_PrjCode: '', U_PrjDesc: '' });

export default function SalesQuotationList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { quotationlist, totalCount, listLoading } = useSelector((s) => s.salesQuotation);

  const [filters, setFilters] = useState(emptyFilters());
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 25 });

  useEffect(() => {
    dispatch(
      getSalesQuotations({
        top: paginationModel.pageSize,
        skip: paginationModel.page * paginationModel.pageSize
      })
    );
  }, [paginationModel, dispatch]);

  const filteredRows = useMemo(() => {
    const { DocEntry, CardCode, CardName, U_PrjCode, U_PrjDesc } = filters;
    return quotationlist.filter((r) => {
      if (
        DocEntry &&
        !String(r.DocEntry ?? '')
          .toLowerCase()
          .includes(DocEntry.toLowerCase())
      )
        return false;
      if (
        CardCode &&
        !String(r.CardCode ?? '')
          .toLowerCase()
          .includes(CardCode.toLowerCase())
      )
        return false;
      if (
        CardName &&
        !String(r.CardName ?? '')
          .toLowerCase()
          .includes(CardName.toLowerCase())
      )
        return false;
      if (
        U_PrjCode &&
        !String(r.U_PrjCode ?? '')
          .toLowerCase()
          .includes(U_PrjCode.toLowerCase())
      )
        return false;
      if (
        U_PrjDesc &&
        !String(r.U_PrjDesc ?? '')
          .toLowerCase()
          .includes(U_PrjDesc.toLowerCase())
      )
        return false;
      return true;
    });
  }, [quotationlist, filters]);

  const clearFilters = () => setFilters(emptyFilters());

  const columns = [
    { field: 'DocEntry', headerName: 'Doc Entry', flex: 1, minWidth: 120 },
    { field: 'CardCode', headerName: 'Customer Code', flex: 1, minWidth: 130 },
    { field: 'CardName', headerName: 'Customer Name', flex: 1.5, minWidth: 200 },
    {
      field: 'DocDate',
      headerName: 'Posting Date',
      flex: 1,
      minWidth: 140,
      valueFormatter: (value) => (value ? value.substring(0, 10) : '')
    },
    {
      field: 'action',
      headerName: 'Action',
      sortable: false,
      filterable: false,
      minWidth: 80,
      renderCell: (params) => (
        <Stack direction="row" height="100%" spacing={1}>
          <IconButton size="small" color="primary" onClick={() => navigate(`/Sales-Quotation/view/${params.row.DocEntry}`)}>
            <VisibilityIcon fontSize="small" />
          </IconButton>
           <IconButton size="small" color="secondary" onClick={() => navigate(`/Sales-Quotation/edit/${params.row.DocEntry}`)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
        </Stack>
      )
    }
  ];

  return (
    <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 'calc(100vh - 176px)' }}>
      <MainCard content={false} sx={{ mb: 3, flexShrink: 0 }}>
        <Box
          sx={{
            px: 3,
            py: 1.5,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', md: 'center' },
            flexDirection: { xs: 'column', md: 'row' },
            gap: 2
          }}
        >
          <Typography variant="h4">Sales Quotation</Typography>
          <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <HomeIcon sx={{ fontSize: 18, color: 'secondary.main' }} />
            </Box>
            <Typography variant="body2">Sales Quotation</Typography>
            <Typography variant="body2" color="secondary" fontWeight={600}>
              List
            </Typography>
          </Breadcrumbs>
        </Box>
      </MainCard>

      <Paper variant="outlined" sx={{ p: 2, mb: 3, borderRadius: 2, flexShrink: 0 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', md: 'center' },
            flexDirection: { xs: 'column', md: 'row' },
            gap: 2
          }}
        >
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', flex: 1 }}>
            <TextField
              size="small"
              label="Doc Entry"
              value={filters.DocEntry}
              onChange={(e) => setFilters((p) => ({ ...p, DocEntry: e.target.value }))}
            />
            <TextField
              size="small"
              label="Customer Code"
              value={filters.CardCode}
              onChange={(e) => setFilters((p) => ({ ...p, CardCode: e.target.value }))}
            />
            <TextField
              size="small"
              label="Customer Name"
              value={filters.CardName}
              onChange={(e) => setFilters((p) => ({ ...p, CardName: e.target.value }))}
            />
            
            <Button variant="outlined" color="error" startIcon={<ClearIcon />} onClick={clearFilters}>
              Clear
            </Button>
          </Box>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<AddIcon />}
            onClick={() => navigate('/Sales-Quotation/create')}
            sx={{ minWidth: 140, whiteSpace: 'nowrap' }}
          >
            Create
          </Button>
        </Box>
      </Paper>

      <Paper variant="outlined" sx={{ flex: 1, minHeight: 0, width: '100%', borderRadius: 2, overflow: 'hidden' }}>
        <DataGrid
          rows={filteredRows}
          columns={columns}
          getRowId={(row) => row.DocEntry}
          loading={listLoading}
          paginationMode="server"
          rowCount={totalCount}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[10, 25, 50, 100]}
          disableRowSelectionOnClick
          sx={{
            border: 0,
            height: '100%',
            '& .MuiDataGrid-columnHeaders': {
              background: 'linear-gradient(135deg,#ede7f6,#d1c4e9)',
              color: '#4527a0',
              fontWeight: 700,
              borderBottom: '1px solid grey'
            },
            '& .MuiDataGrid-columnHeaderTitle': { fontWeight: 700 },
            '& .MuiDataGrid-row:hover': { backgroundColor: '#f3e5f5' },
            '& .MuiDataGrid-cell': { borderColor: '#f1f1f1' },
            '& .MuiDataGrid-footerContainer': {
              borderTop: '1px solid #e0e0e0',
              backgroundColor: '#fafafa',
              overflow: 'hidden'
            },
            '& .MuiDataGrid-scrollbarFiller': { display: 'none' }
          }}
        />
      </Paper>
    </Box>
  );
}
