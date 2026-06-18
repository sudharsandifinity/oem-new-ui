import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { Alert, Box, Breadcrumbs, Button, CircularProgress, Divider, Snackbar, Tab, Tabs, Typography } from '@mui/material';

import HomeIcon from '@mui/icons-material/Home';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

import MainCard from 'ui-component/cards/MainCard';
import PRGeneralTab from './GeneralTab';
import PRContentTab from './ContentTab';
import { createPR, resetPRState } from '../../store/slices/purchaseRequestSlice';
import { getDepartments } from '../../store/slices/commonSlice';
import { buildPRPayload, mrLineToPRRow } from './prHelpers';
import { resolveDepartmentName } from 'utils/department';

const today = new Date().toISOString().split('T')[0];

export default function PurchaseRequestCreate() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { state } = useLocation();

  const { createLoading, saveSuccess, error } = useSelector((s) => s.purchaseRequest);
  const { user } = useSelector((s) => s.auth);
  const { departments } = useSelector((s) => s.common);

  const [tabValue, setTabValue] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, severity: 'success', message: '' });

  const [form, setForm] = useState(() => ({
    MRNo: state?.mrNo ?? '',
    MRDocEntry: state?.mrDocEntry ?? null,
    ProjectCode: state?.projectCode ?? '',
    ProjectName: state?.projectName ?? '',
    DocDate: today,
    RequiredDate: '',
    ReqCode: state?.reqCode ?? '',
    ReqType: state?.reqType ?? null,
    RequestorTypeLabel: state?.requestorTypeLabel ?? '',
    RequestorName: state?.requestorName ?? '',
    DeptId: state?.department ?? '',
    Department: state?.departmentName ?? '',
    Comments: ''
  }));

  const [lines, setLines] = useState(() => (state?.selectedLines ?? []).map(mrLineToPRRow));

  useEffect(() => {
    if (!departments.length) dispatch(getDepartments());
  }, [dispatch]);

  useEffect(() => {
    if (!form.DeptId || form.Department || !departments.length) return;
    const name = resolveDepartmentName(departments, form.DeptId);
    setForm((prev) => ({ ...prev, Department: name }));
  }, [departments, form.DeptId, form.Department]);

  useEffect(() => {
    if (saveSuccess) {
      setSnackbar({ open: true, severity: 'success', message: 'Purchase Request created successfully!' });
      dispatch(resetPRState());
      setTimeout(() => navigate('/purchase-requests/list'), 1500);
    }
    if (error) {
      setSnackbar({ open: true, severity: 'error', message: error });
      dispatch(resetPRState());
    }
  }, [saveSuccess, error, dispatch, navigate]);

  const handleSubmit = () => {
    dispatch(createPR(buildPRPayload(form, lines, user)));
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
          <Typography variant="h4">Purchase Request</Typography>
          <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <HomeIcon sx={{ fontSize: 18, color: 'secondary.main' }} />
            </Box>
            <Typography variant="body2" color="text.primary">
              Purchase Request
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
            <PRGeneralTab data={form} setData={setForm} />
          </Box>
          <Box sx={{ display: tabValue === 1 ? 'block' : 'none' }}>
            <PRContentTab data={form} setData={setForm} rows={lines} setRows={setLines} />
          </Box>

          <Divider sx={{ my: 4 }} />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button variant="outlined" color="error" onClick={() => navigate(-1)}>
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
