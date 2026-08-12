import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';

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
  Paper,
  Snackbar,
  Step,
  StepLabel,
  Stepper,
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
import MRGeneralTab from '../material-request/GeneralTab';
import MRContentTab from '../material-request/ContentTab';
import ContentSkeleton from '../material-request/ContentSkeleton';
import { mapApiToForm, mapApiLineToRow, buildPayload } from '../material-request/mrHelpers';
import { getApprovalRequestById, approveApprovalRequest, rejectApprovalRequest, resetApprovalState } from '../../store/slices/approvalSlice';
import { updateMR, resetMRState } from '../../store/slices/materialRequestSlice';
import { getDepartments } from '../../store/slices/commonSlice';
import { resolveDepartmentName } from 'utils/department';
import { formatDateDDMMYYYY } from 'utils/dataGridFormatters';

const noop = () => {};

export default function MyApprovalView() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { current, currentLoading, currentError, decisionLoading } = useSelector((s) => s.approval);
  const { updateLoading } = useSelector((s) => s.materialRequest);
  const { departments } = useSelector((s) => s.common);

  const [tabValue, setTabValue] = useState(0);
  const [lines, setLines] = useState([]);
  const [confirm, setConfirm] = useState({ open: false, type: null });
  const [remark, setRemark] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, severity: 'success', message: '' });

  useEffect(() => {
    if (id) dispatch(getApprovalRequestById(id));
    if (!departments.length) dispatch(getDepartments());
    return () => {
      dispatch(resetApprovalState());
      dispatch(resetMRState());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, id]);

  useEffect(() => {
    if (!current?.mr) return;
    setLines((current.mr.HLB_MRQ1Collection || []).map(mapApiLineToRow));
  }, [current]);

  const loading = currentLoading || !current;
  const form = current?.mr ? mapApiToForm(current.mr) : null;
  // Resolve the department id (e.g. -2) to its name, as the Create/Edit screens do.
  if (form) form.Department = resolveDepartmentName(departments, form.DeptId) || form.Department;
  const stages = current?.stages || [];
  const activeStep = (current?.currentStageOrder || 1) - 1;
  const isPending = current?.status === 'pending';
  const busy = decisionLoading || updateLoading;

  const closeConfirm = () => {
    if (!busy) setConfirm({ open: false, type: null });
  };

  const handleDecision = async () => {
    const isApprove = confirm.type === 'approve';
    const action = isApprove ? approveApprovalRequest : rejectApprovalRequest;
    try {
      if (isApprove && current?.mr?.DocEntry) {
        // eslint-disable-next-line no-unused-vars
        const { U_OEM_UID, U_OEM_UEMAIL, U_OEM_UName, U_PreparedBy, ...payload } = buildPayload(form, lines, null, {
          useApprovedQty: true
        });
        await dispatch(updateMR({ docEntry: current.mr.DocEntry, payload })).unwrap();
      }
      const result = await dispatch(action({ id, remark })).unwrap();
      const pr = isApprove ? result?.purchaseRequest : null;
      let message;
      if (isApprove && result?.status === 'approved') {
        message =
          pr && pr.created === false
            ? `Approved (final). Auto Purchase Request failed: ${pr.error || 'unknown error'}`
            : 'Approved (final) and Purchase Request created!';
      } else if (isApprove) {
        message = 'Approved — advanced to the next stage.';
      } else {
        message = 'Rejected — sent back to the requestor.';
      }
      setSnackbar({ open: true, severity: pr && pr.created === false ? 'warning' : 'success', message });
      setConfirm({ open: false, type: null });
      setRemark('');
      setTimeout(() => navigate('/my-approvals/list'), 1200);
    } catch (err) {
      setSnackbar({ open: true, severity: 'error', message: typeof err === 'string' ? err : err?.message || 'Action failed' });
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
          <Typography variant="h4">Approval Review</Typography>
          <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <HomeIcon sx={{ fontSize: 18, color: 'secondary.main' }} />
            </Box>
            <Typography variant="body2">My Approvals</Typography>
            <Typography variant="body2" color="secondary" fontWeight={600}>
              Review
            </Typography>
          </Breadcrumbs>
        </Box>
      </MainCard>

      <MainCard content={false}>
        <Box sx={{ p: 3 }}>
          {currentError ? (
            <Box sx={{ py: 6, textAlign: 'center' }}>
              <Typography color="error" variant="h5">
                Failed to load approval request
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 1 }}>
                {currentError}
              </Typography>
            </Box>
          ) : loading ? (
            <ContentSkeleton />
          ) : (
            <>
              {stages.length > 0 && (
                <Paper variant="outlined" sx={{ p: 3, mb: 3, borderRadius: 2 }}>
                  <Stepper activeStep={activeStep} alternativeLabel>
                    {stages.map((stage) => (
                      <Step key={stage.stageOrder}>
                        <StepLabel
                          optional={
                            <Typography variant="caption" color="text.secondary">
                              {(stage.approvers || []).map((a) => a.name).join(', ')}
                            </Typography>
                          }
                        >
                          {stage.name}
                        </StepLabel>
                      </Step>
                    ))}
                  </Stepper>
                </Paper>
              )}

              <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)}>
                  <Tab label="General" />
                  <Tab label="Contents" />
                  <Tab label="History" />
                </Tabs>
              </Box>

              <Box sx={{ display: tabValue === 0 ? 'block' : 'none' }}>{form && <MRGeneralTab data={form} setData={noop} readOnly />}</Box>
              <Box sx={{ display: tabValue === 1 ? 'block' : 'none' }}>
                <MRContentTab data={form} setData={noop} rows={lines} setRows={setLines} readOnly canEditApprovedQty={isPending} />
              </Box>
              <Box sx={{ display: tabValue === 2 ? 'block' : 'none' }}>
                {(current.actions || []).length === 0 ? (
                  <Typography color="text.secondary">No actions yet.</Typography>
                ) : (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    {current.actions.map((a, i) => (
                      <Paper key={i} variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                          <Chip
                            size="small"
                            label={a.decision === 'approved' ? 'Approved' : 'Rejected'}
                            color={a.decision === 'approved' ? 'success' : 'error'}
                            variant="outlined"
                          />
                          <Typography variant="body2">Stage {a.stageOrder}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            • {a.approver || '—'}
                          </Typography>
                          <Box sx={{ flex: 1 }} />
                          <Typography variant="caption" color="text.secondary">
                            {formatDateDDMMYYYY({ value: a.createdAt })}
                          </Typography>
                        </Box>
                        {a.remark && (
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            {a.remark}
                          </Typography>
                        )}
                      </Paper>
                    ))}
                  </Box>
                )}
              </Box>

              <Divider sx={{ my: 4 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Button variant="outlined" onClick={() => navigate(-1)}>
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    disabled={loading || !isPending || !current?.mr?.DocEntry}
                    onClick={() => navigate(`/material-request/edit/${current.mr.DocEntry}`, { state: { approverEdit: true, approvalId: id } })}
                  >
                    Edit
                  </Button>
                </Box>

                {isPending && (
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Button
                      variant="outlined"
                      color="success"
                      startIcon={<CheckCircleIcon />}
                      disabled={busy}
                      onClick={() => {
                        setRemark('');
                        setConfirm({ open: true, type: 'approve' });
                      }}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<CancelIcon />}
                      disabled={busy}
                      onClick={() => {
                        setRemark('');
                        setConfirm({ open: true, type: 'reject' });
                      }}
                    >
                      Reject
                    </Button>
                  </Box>
                )}
              </Box>
            </>
          )}
        </Box>
      </MainCard>

      <Dialog open={confirm.open} onClose={closeConfirm} maxWidth="xs" fullWidth>
        <DialogTitle>{confirm.type === 'approve' ? 'Approve' : 'Reject'} this stage</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {confirm.type === 'approve'
              ? 'Approving advances the request to the next stage (or finalises it if this is the last stage).'
              : 'Rejecting sends the request back to the requestor to revise and resubmit.'}
          </DialogContentText>
          <TextField
            fullWidth
            multiline
            rows={3}
            size="small"
            label="Remark (optional)"
            sx={{ mt: 2 }}
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            disabled={busy}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={closeConfirm} color="inherit" disabled={busy}>
            Cancel
          </Button>
          <Button
            onClick={handleDecision}
            variant="outlined"
            color={confirm.type === 'approve' ? 'success' : 'error'}
            disabled={busy}
            startIcon={busy ? <CircularProgress size={16} color="inherit" /> : null}
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
