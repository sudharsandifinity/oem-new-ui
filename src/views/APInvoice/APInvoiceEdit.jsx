import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';

import { Alert, Box, Breadcrumbs, Button, Divider, Skeleton, Snackbar, Tab, Tabs, Typography } from '@mui/material';

import HomeIcon from '@mui/icons-material/Home';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

import MainCard from 'ui-component/cards/MainCard';
import GeneralTab from './GeneralTab';
import ContentTab from './ContentTab';
import AttachmentTab from './AttachmentTab';
import { mapApiToForm, mapApiToRows, buildPurchaseInvoiceFormData } from './APInvoiceHelpers';
import { getAPInvoiceById, resetAPInvoiceState, updateAPInvoice } from '../../store/slices/APInvoiceSlice';

function ContentSkeleton() {
  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 4 }}>
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} variant="rounded" height={40} />
          ))}
        </Box>
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} variant="rounded" height={40} />
          ))}
        </Box>
      </Box>
      <Skeleton variant="rounded" height={180} sx={{ mt: 4 }} />
    </Box>
  );
}

export default function PurchaseInvoicesEdit() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentInvoice, loading, error, saveSuccess } = useSelector((state) => state.APInvoice);

  const [tabValue, setTabValue] = useState(0);
  const [purchaseInvoice, setPurchaseInvoice] = useState(null);
  const [documentLines, setDocumentLines] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, severity: 'success', message: '' });

  useEffect(() => {
    if (id) dispatch(getAPInvoiceById(id));
    return () => {
      dispatch(resetAPInvoiceState());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (!currentInvoice) return;
    setPurchaseInvoice(mapApiToForm(currentInvoice));
    setDocumentLines([...mapApiToRows(currentInvoice), { id: Date.now(), itemNo: '', itemDescription: '', quantity: '', unitPrice: '', discount: '', lineTotal: '', taxCode: '', taxPercentage: '', taxAmount: '', grossTotal: '', project: '', warehouse: '', dimension1: '', dimension2: '', dimension3: '', dimension4: '', dimension5: '' }]);
  }, [currentInvoice]);

  useEffect(() => {
    if (saveSuccess && submitting) {
      setSnackbar({ open: true, severity: 'success', message: 'Purchase Invoice updated successfully' });
      setSubmitting(false);
      setTimeout(() => navigate(`/A/P-Invoice/view/${id}`), 1500);
    }
    if (error && submitting) {
      setSnackbar({ open: true, severity: 'error', message: error });
      setSubmitting(false);
    }
  }, [saveSuccess, error, submitting, id, navigate]);

  const isLoading = !purchaseInvoice;

  const handleSubmit = () => {
    const formData = buildPurchaseInvoiceFormData(purchaseInvoice, documentLines);
    setSubmitting(true);
    dispatch(updateAPInvoice({ docEntry: id, formData }));
  };

  return (
    <Box>
      <MainCard content={false} sx={{ mb: 3 }}>
        <Box
          sx={{
            px: 3,
            py: 2.5,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', md: 'center' },
            flexDirection: { xs: 'column', md: 'row' },
            gap: 2
          }}
        >
          <Typography variant="h3">Purchase Invoices</Typography>
          <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }} onClick={() => navigate('/')}>
              <HomeIcon color="secondary" sx={{ fontSize: 18, cursor: 'pointer'  }} />
            </Box>
            <Typography variant="body2" color="text.primary">
              Purchase Invoices
            </Typography>
            <Typography variant="body2" color="secondary" fontWeight={600}>
              Edit
            </Typography>
          </Breadcrumbs>
        </Box>
      </MainCard>

      <MainCard content={false}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 3, pt: 1 }}>
          <Tabs value={tabValue} onChange={(_, v) => !isLoading && setTabValue(v)} variant="scrollable" scrollButtons="auto">
            <Tab label="General" />
            <Tab label="Contents" />
            <Tab label="Attachments" />
          </Tabs>
        </Box>

        <Box sx={{ p: 3 }}>
          {error && !purchaseInvoice ? (
            <Box sx={{ py: 6, textAlign: 'center' }}>
              <Typography color="error" variant="h5">
                Failed to load Purchase Invoice
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 1 }}>
                {error}
              </Typography>
            </Box>
          ) : isLoading ? (
            <ContentSkeleton />
          ) : (
            <>
              <Box sx={{ display: tabValue === 0 ? 'block' : 'none' }}>
                <GeneralTab data={purchaseInvoice} setData={setPurchaseInvoice} />
              </Box>
              <Box sx={{ display: tabValue === 1 ? 'block' : 'none' }}>
                <ContentTab data={purchaseInvoice} setData={setPurchaseInvoice} rows={documentLines} setRows={setDocumentLines} />
              </Box>
              <Box sx={{ display: tabValue === 2 ? 'block' : 'none' }}>
                <AttachmentTab data={purchaseInvoice} setData={setPurchaseInvoice} />
              </Box>
            </>
          )}

          <Divider sx={{ my: 4 }} />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, flexWrap: 'wrap' }}>
            <Button variant="outlined" color="error" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button variant="contained" color="secondary" disabled={isLoading || submitting} onClick={handleSubmit}>
              {submitting ? 'Saving...' : 'Update'}
            </Button>
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
