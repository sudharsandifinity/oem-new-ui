import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { Alert, Box, Breadcrumbs, Button, CircularProgress, Divider, Snackbar, Tab, Tabs, Typography } from '@mui/material';

import HomeIcon from '@mui/icons-material/Home';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

import MainCard from 'ui-component/cards/MainCard';
import SalesQuoatationGeneralTab from './GeneralTab';
import { createSalesQuotation, resetSalesQuotationState } from '../../store/slices/salesQuotationSlice';
import SalesQuotationContentTab from './ContentTab';

const today = new Date().toISOString().split('T')[0];

const initialForm = () => ({
  seq: '',
  ItemCode: '',
  ItemDescription: '',
  FullDescription: today,
  UoMCode: '',
  POQty: '',
  Comments: ''
});

export default function SalesQuotationCreate() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, saveSuccess, error } = useSelector((s) => s.salesQuotation);

  const [tabValue, setTabValue] = useState(0);
  const [form, setForm] = useState(initialForm());
  const [lines, setLines] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, severity: 'success', message: '' });


  useEffect(() => {
    if (saveSuccess) {
      setSnackbar({ open: true, severity: 'success', message: 'Sales Quotation created successfully!' });
      dispatch(resetSalesQuotationState());
      setTimeout(() => navigate('/GRPO/list'), 1500);
    }
    if (error) {
      setSnackbar({ open: true, severity: 'error', message: error });
      dispatch(resetSalesQuotationState());
    }
  }, [saveSuccess, error, dispatch, navigate]);

  

  const handleSubmit = () => {
    dispatch(createSalesQuotation(buildSalesQuoatationPayload(form, lines)));
  };

  return (
    <Box>
      <MainCard content={false} sx={{ mb: 3 }}>
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
            <Typography variant="body2" color="text.primary">
             Sales Quotation
            </Typography>
            <Typography variant="body2" color="secondary" fontWeight={600}>
              Create
            </Typography>
          </Breadcrumbs>
        </Box>
      </MainCard>

      <MainCard content={false}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 3, pt: 1 }}>
          <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)}>
            <Tab label="General" />
            <Tab label="Contents" />
          </Tabs>
        </Box>

        <Box sx={{ p: 3 }}>
          <Box sx={{ display: tabValue === 0 ? 'block' : 'none' }}>
            <SalesQuoatationGeneralTab data={form} setData={setForm} />
          </Box>
          <Box sx={{ display: tabValue === 1 ? 'block' : 'none' }}>
            <SalesQuotationContentTab data={form} setData={setForm} rows={lines} setRows={setLines} />
          </Box>

          <Divider sx={{ my: 4 }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button variant="outlined" color="error" onClick={() => navigate('/Sales-Quotation/list')}>
                Cancel
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleSubmit}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
              >
                Submit
              </Button>
            </Box>
          </Box>
        </Box>
      </MainCard>

      

      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => setSnackbar((p) => ({ ...p, open: false }))}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar((p) => ({ ...p, open: false }))}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
