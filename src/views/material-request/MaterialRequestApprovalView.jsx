import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { getMRById, resetMRState, approveMR, rejectMR } from '../../store/slices/materialRequestSlice';
import { getDepartments } from '../../store/slices/commonSlice';
import { mapApiToForm, mapApiLineToRow, MR_STATUS_META } from './mrHelpers';
import { resolveDepartmentName } from 'utils/department';

import {
  Alert,
  Box,
  Breadcrumbs,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Skeleton,
  Snackbar,
  Tab,
  Tabs,
  TextField,
  Typography
} from '@mui/material';

import HomeIcon from '@mui/icons-material/Home';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

import MainCard from 'ui-component/cards/MainCard';
import MRGeneralTab from './GeneralTab';
import MRContentTab from './ContentTab';

const noop = () => {};

function ContentSkeleton() {
  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 4 }}>
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {[1, 2, 3, 4, 5].map((i) => (
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

export default function MaterialRequestApprovalView() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentMR, currentMRLoading, currentMRError, decisionLoading } = useSelector((s) => s.materialRequest);
  const { departments } = useSelector((s) => s.common);

  const [tabValue, setTabValue] = useState(0);
  const [form, setForm] = useState(null);
  const [lines, setLines] = useState([]);
  const [confirm, setConfirm] = useState({ open: false, type: null });
  const [aprRemark, setAprRemark] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, severity: 'success', message: '' });

  useEffect(() => {
    if (id) dispatch(getMRById(id));
    if (!departments.length) dispatch(getDepartments());
    return () => {
      dispatch(resetMRState());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (!currentMR) return;
    setForm(mapApiToForm(currentMR));
    setLines((currentMR.HLB_MRQ1Collection || []).map(mapApiLineToRow));
  }, [currentMR]);

  useEffect(() => {
    if (!form?.DeptId || !departments.length) return;
    const name = resolveDepartmentName(departments, form.DeptId);
    if (name !== form.Department) {
      setForm((prev) => ({ ...prev, Department: name }));
    }
  }, [departments, form?.DeptId, currentMR]);

  const loading = currentMRLoading || !form;
  const docStatus = currentMR?.U_DocStatus;
  const isPending = docStatus === 'D';

  const closeConfirm = () => {
    if (!decisionLoading) setConfirm({ open: false, type: null });
  };

  const handleDecision = async () => {
    const action = confirm.type === 'approve' ? approveMR : rejectMR;
    try {
      await dispatch(action({ docEntry: id, remark: aprRemark })).unwrap();
      setSnackbar({
        open: true,
        severity: 'success',
        message: `Material Request ${confirm.type === 'approve' ? 'approved' : 'rejected'} successfully!`
      });
      setConfirm({ open: false, type: null });
      setAprRemark('');
      dispatch(getMRById(id));
    } catch (err) {
      setSnackbar({ open: true, severity: 'error', message: err || 'Action failed' });
      setConfirm({ open: false, type: null });
    }
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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Typography variant="h4">Material Request Approval</Typography>
            {docStatus && (
              <Chip
                label={(MR_STATUS_META[docStatus] || { label: docStatus }).label}
                color={(MR_STATUS_META[docStatus] || { color: 'default' }).color}
                variant="outlined"
              />
            )}
          </Box>
          <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <HomeIcon sx={{ fontSize: 18, color: 'secondary.main' }} />
            </Box>
            <Typography variant="body2" color="text.primary">
              Approvals
            </Typography>
            <Typography variant="body2" color="secondary" fontWeight={600}>
              View
            </Typography>
          </Breadcrumbs>
        </Box>
      </MainCard>

      <MainCard content={false}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 3, pt: 1 }}>
          <Tabs value={tabValue} onChange={(_, v) => !loading && setTabValue(v)}>
            <Tab label="General" />
            <Tab label="Contents" />
          </Tabs>
        </Box>

        <Box sx={{ p: 3 }}>
          {currentMRError ? (
            <Box sx={{ py: 6, textAlign: 'center' }}>
              <Typography color="error" variant="h5">
                Failed to load Material Request
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 1 }}>
                {currentMRError}
              </Typography>
            </Box>
          ) : loading ? (
            <ContentSkeleton />
          ) : (
            <>
              <Box sx={{ display: tabValue === 0 ? 'block' : 'none' }}>
                <MRGeneralTab data={form} setData={noop} readOnly />
              </Box>
              <Box sx={{ display: tabValue === 1 ? 'block' : 'none' }}>
                <MRContentTab data={form} setData={noop} rows={lines} setRows={noop} readOnly />
              </Box>
            </>
          )}

          {currentMR?.U_Apr_remark && (
            <Alert severity="info" sx={{ mt: 3 }}>
              <strong>Approver Remark:</strong> {currentMR.U_Apr_remark}
            </Alert>
          )}

          <Divider sx={{ my: 4 }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Button variant="outlined" onClick={() => navigate(-1)}>
              Back
            </Button>

            {isPending && (
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="outlined"
                  color="success"
                  startIcon={<CheckCircleIcon />}
                  disabled={loading || !!currentMRError || decisionLoading}
                  onClick={() => {
                    setAprRemark('');
                    setConfirm({ open: true, type: 'approve' });
                  }}
                >
                  Approve
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<CancelIcon />}
                  disabled={loading || !!currentMRError || decisionLoading}
                  onClick={() => {
                    setAprRemark('');
                    setConfirm({ open: true, type: 'reject' });
                  }}
                >
                  Reject
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      </MainCard>

      <Dialog open={confirm.open} onClose={closeConfirm} maxWidth="xs" fullWidth>
        <DialogTitle>{confirm.type === 'approve' ? 'Approve Material Request' : 'Reject Material Request'}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to {confirm.type === 'approve' ? 'approve' : 'reject'} this Material Request
            {form?.ProjectCode ? ` for project ${form.ProjectCode}` : ''}?
          </DialogContentText>
          <TextField
            fullWidth
            multiline
            rows={3}
            size="small"
            label="Remark (optional)"
            sx={{ mt: 2 }}
            value={aprRemark}
            onChange={(e) => setAprRemark(e.target.value)}
            disabled={decisionLoading}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={closeConfirm} color="inherit" disabled={decisionLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleDecision}
            variant="outlined"
            color={confirm.type === 'approve' ? 'success' : 'error'}
            disabled={decisionLoading}
            startIcon={decisionLoading ? <CircularProgress size={16} color="inherit" /> : null}
          >
            {confirm.type === 'approve' ? 'Approve' : 'Reject'}
          </Button>
        </DialogActions>
      </Dialog>

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
