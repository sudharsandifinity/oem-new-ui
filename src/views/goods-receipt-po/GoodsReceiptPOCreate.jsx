import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { Alert, Box, Breadcrumbs, Button, CircularProgress, Divider, Snackbar, Tab, Tabs, Typography } from '@mui/material';

import HomeIcon from '@mui/icons-material/Home';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

import MainCard from 'ui-component/cards/MainCard';
import AttachmentUploadTab from 'ui-component/AttachmentUploadTab';
import GRPOGeneralTab from './GeneralTab';
import GRPOContentTab from './ContentTab';
import POSelectModal from './POSelectModal';
import POItemSelectModal from './POItemSelectModal';
import { createGRPO, resetGRPOState } from '../../store/slices/goodsReceiptPOSlice';
import { buildGRPOFormData, poLineToGRPORow } from './grpoHelpers';

const today = new Date().toISOString().split('T')[0];

const initialForm = () => ({
  VendorCode: '',
  VendorName: '',
  ContactPerson: '',
  VendorRefNo: '',
  DocDate: today,
  DocDueDate: today,
  PONumber: '',
  ProjectCode: '',
  ProjectName: '',
  Comments: '',
  ReceivedBy: '',
  Attachments2_Lines: [{ id: 1, file: null, fileName: '' }]
});

export default function GoodsReceiptPOCreate() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { createLoading, saveSuccess, error } = useSelector((s) => s.goodsReceiptPO);
  const { user } = useSelector((s) => s.auth);
  const receivedBy = useMemo(() => [user?.first_name, user?.last_name].filter(Boolean).join(' '), [user]);

  const [tabValue, setTabValue] = useState(0);
  const [form, setForm] = useState(() => ({ ...initialForm(), ReceivedBy: receivedBy }));
  const [lines, setLines] = useState([]);
  const [poModalOpen, setPOModalOpen] = useState(false);
  const [poItemModalOpen, setPOItemModalOpen] = useState(false);
  const [pendingPO, setPendingPO] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, severity: 'success', message: '' });

  const canCopyFromPO = !!(form.VendorCode?.trim() || form.ProjectCode?.trim());

  useEffect(() => {
    if (saveSuccess) {
      setSnackbar({ open: true, severity: 'success', message: 'Goods Receipt PO created successfully!' });
      dispatch(resetGRPOState());
      setTimeout(() => navigate('/goods-receipt-po/list'), 1500);
    }
    if (error) {
      setSnackbar({ open: true, severity: 'error', message: error });
      dispatch(resetGRPOState());
    }
  }, [saveSuccess, error, dispatch, navigate]);

  const handlePOChoose = (po) => {
    setPOModalOpen(false);
    setForm((prev) => ({
      ...prev,
      VendorCode: prev.VendorCode || po.CardCode || '',
      VendorName: prev.VendorName || po.CardName || '',
      ProjectCode: prev.ProjectCode || po.U_PrjCode || '',
      ProjectName: prev.ProjectName || po.U_PrjDesc || '',
      PONumber: prev.PONumber || String(po.DocEntry ?? '')
    }));
    setPendingPO(po);
    setPOItemModalOpen(true);
  };

  const handlePOItemsConfirm = (selectedLines) => {
    setLines(selectedLines.map((line) => poLineToGRPORow(line, pendingPO?.DocEntry ?? '')));
    setPendingPO(null);
    setPOItemModalOpen(false);
    setTabValue(1);
  };

  const handleSubmit = () => {
    dispatch(createGRPO(buildGRPOFormData(form, lines, form.Attachments2_Lines, user)));
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
          <Typography variant="h4">Goods Receipt PO</Typography>
          <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <HomeIcon sx={{ fontSize: 18, color: 'secondary.main' }} />
            </Box>
            <Typography variant="body2" color="text.primary">
              Goods Receipt PO
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
            <Tab label="Attachments" />
          </Tabs>
        </Box>

        <Box sx={{ p: 3 }}>
          <Box sx={{ display: tabValue === 0 ? 'block' : 'none' }}>
            <GRPOGeneralTab data={form} setData={setForm} />
          </Box>
          <Box sx={{ display: tabValue === 1 ? 'block' : 'none' }}>
            <GRPOContentTab data={form} setData={setForm} rows={lines} setRows={setLines} />
          </Box>
          <Box sx={{ display: tabValue === 2 ? 'block' : 'none' }}>
            <AttachmentUploadTab data={form} setData={setForm} />
          </Box>

          <Divider sx={{ my: 4 }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<ContentCopyIcon />}
              disabled={!canCopyFromPO}
              onClick={() => setPOModalOpen(true)}
            >
              Copy from PO
            </Button>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button variant="outlined" color="error" onClick={() => navigate('/goods-receipt-po/list')}>
                Cancel
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleSubmit}
                disabled={createLoading}
                startIcon={createLoading ? <CircularProgress size={16} color="inherit" /> : null}
              >
                Submit
              </Button>
            </Box>
          </Box>
        </Box>
      </MainCard>

      <POSelectModal
        open={poModalOpen}
        onClose={() => setPOModalOpen(false)}
        onChoose={handlePOChoose}
        projectCode={form.ProjectCode}
        cardCode={form.VendorCode}
      />

      <POItemSelectModal
        open={poItemModalOpen}
        onClose={() => {
          setPOItemModalOpen(false);
          setPendingPO(null);
        }}
        onConfirm={handlePOItemsConfirm}
        lines={pendingPO?.DocumentLines || []}
      />

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
