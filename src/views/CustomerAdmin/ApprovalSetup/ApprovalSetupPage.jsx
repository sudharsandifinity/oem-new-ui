import { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Alert,
  Autocomplete,
  Box,
  Breadcrumbs,
  Button,
  Chip,
  Divider,
  IconButton,
  Paper,
  Snackbar,
  Stack,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';

import HomeIcon from '@mui/icons-material/Home';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';

import MainCard from 'ui-component/cards/MainCard';
import ApproverSelectModal from './ApproverSelectModal';
import {
  getApprovalFlow,
  saveApprovalFlow,
  getadminUsers,
  getCompanyProjects,
  resetApprovalFlowState
} from '../../../store/slices/commonCustomerSlice';

const DOC_TYPE = 'MR';
const emptyStage = () => ({ name: '', approverUserId: null, delegatorUserId: null });

export default function ApprovalSetupPage() {
  const dispatch = useDispatch();
  const {
    approvalFlow,
    approvalFlowLoading,
    approvalFlowSaving,
    approvalFlowSaveSuccess,
    users,
    usersLoading,
    companyProjects,
    companyProjectsLoading,
    error
  } = useSelector((s) => s.commonCustomer);

  const [projectId, setProjectId] = useState(null);
  const [stages, setStages] = useState([emptyStage()]);
  const [snackbar, setSnackbar] = useState({ open: false, severity: 'success', message: '' });
  const [picker, setPicker] = useState({ open: false, index: -1, role: null });

  useEffect(() => {
    if (!users.length) dispatch(getadminUsers());
    if (!companyProjects.length) dispatch(getCompanyProjects());
    return () => {
      dispatch(resetApprovalFlowState());
    };
  }, [dispatch]);

  useEffect(() => {
    if (projectId) dispatch(getApprovalFlow({ docType: DOC_TYPE, projectId }));
  }, [dispatch, projectId]);

  useEffect(() => {
    if (!approvalFlow) return;
    const loaded = (approvalFlow.stages || []).map((s) => ({
      name: s.name || '',
      approverUserId: s.approver?.userId ?? null,
      delegatorUserId: s.delegator?.userId ?? null
    }));
    setStages(loaded.length ? loaded : [emptyStage()]);
  }, [approvalFlow]);

  useEffect(() => {
    if (approvalFlowSaveSuccess) {
      setSnackbar({ open: true, severity: 'success', message: 'Approval flow saved' });
      dispatch(resetApprovalFlowState());
    }
    if (error) {
      setSnackbar({ open: true, severity: 'error', message: typeof error === 'string' ? error : 'Failed to save approval flow' });
    }
  }, [approvalFlowSaveSuccess, error, dispatch]);

  const userOptions = useMemo(
    () =>
      (Array.isArray(users) ? users : []).map((u) => ({
        id: u.id,
        label: [u.first_name, u.last_name].filter(Boolean).join(' ') || u.email,
        email: u.email
      })),
    [users]
  );

  const projectOptions = useMemo(
    () =>
      (Array.isArray(companyProjects) ? companyProjects : []).map((p) => ({
        id: p.id,
        label: [p.Code, p.Name].filter(Boolean).join(' - ') || p.Code || p.id
      })),
    [companyProjects]
  );

  const userLabel = (id) => userOptions.find((o) => o.id === id)?.label || id;

  const updateStage = (index, field, value) => {
    setStages((prev) => prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)));
  };

  const addStage = () => setStages((prev) => [...prev, emptyStage()]);
  const removeStage = (index) => setStages((prev) => (prev.length <= 1 ? prev : prev.filter((_, i) => i !== index)));

  const openPicker = (index, role) => setPicker({ open: true, index, role });
  const closePicker = () => setPicker({ open: false, index: -1, role: null });
  const confirmPicker = (id) => {
    if (picker.index < 0 || !picker.role) return;
    updateStage(picker.index, picker.role, id);
  };

  const handleSave = () => {
    if (!projectId) {
      setSnackbar({ open: true, severity: 'error', message: 'Select a project first' });
      return;
    }
    const payloadStages = stages
      .filter((s) => (s.name || '').trim() && s.approverUserId)
      .map((s) => ({ name: s.name.trim(), approverUserId: s.approverUserId, delegatorUserId: s.delegatorUserId || null }));

    if (!payloadStages.length) {
      setSnackbar({ open: true, severity: 'error', message: 'Add at least one stage with a name and approver' });
      return;
    }
    dispatch(saveApprovalFlow({ docType: DOC_TYPE, projectId, stages: payloadStages }));
  };

  return (
    <Box sx={{ p: 2 }}>
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
          <Typography variant="h4">Approval Setup</Typography>
          <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <HomeIcon sx={{ fontSize: 18, color: 'secondary.main' }} />
            </Box>
            <Typography variant="body2">Approval Setup</Typography>
            <Typography variant="body2" color="secondary" fontWeight={600}>
              Material Request
            </Typography>
          </Breadcrumbs>
        </Box>
      </MainCard>

      <MainCard content={false}>
        <Box sx={{ p: 3 }}>
          <Autocomplete
            options={projectOptions}
            loading={companyProjectsLoading}
            value={projectOptions.find((o) => o.id === projectId) || null}
            onChange={(_, val) => setProjectId(val?.id ?? null)}
            isOptionEqualToValue={(o, v) => o.id === v.id}
            sx={{ maxWidth: 420, mb: 3 }}
            renderInput={(params) => <TextField {...params} label="Project" size="small" />}
          />

          {!projectId ? (
            <Typography color="text.secondary">Select a project to configure its approval flow.</Typography>
          ) : approvalFlowLoading ? (
            <Typography color="text.secondary">Loading…</Typography>
          ) : (
            <Stack spacing={2}>
              {stages.map((stage, index) => (
                <Paper key={index} variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
                    <Chip label={`Stage ${index + 1}`} color="secondary" size="small" />
                    <Box sx={{ flex: 1 }} />
                    <Tooltip title="Remove stage">
                      <span>
                        <IconButton size="small" color="error" disabled={stages.length <= 1} onClick={() => removeStage(index)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'flex-start' }}>
                    <TextField
                      label="Stage Name"
                      size="small"
                      sx={{ flex: 1, minWidth: 200 }}
                      value={stage.name}
                      onChange={(e) => updateStage(index, 'name', e.target.value)}
                    />

                    <Box sx={{ flex: 1, minWidth: 240 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Button
                          variant="outlined"
                          color="secondary"
                          size="small"
                          startIcon={<PersonAddAltIcon />}
                          onClick={() => openPicker(index, 'approverUserId')}
                          disabled={usersLoading}
                        >
                          Select Approver
                        </Button>
                        {!stage.approverUserId && (
                          <Typography variant="caption" color="text.secondary">
                            None selected
                          </Typography>
                        )}
                      </Box>
                      {stage.approverUserId && (
                        <Chip
                          label={userLabel(stage.approverUserId)}
                          size="small"
                          onDelete={() => updateStage(index, 'approverUserId', null)}
                        />
                      )}
                    </Box>

                    <Box sx={{ flex: 1, minWidth: 240 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Button
                          variant="outlined"
                          color="secondary"
                          size="small"
                          startIcon={<PersonAddAltIcon />}
                          onClick={() => openPicker(index, 'delegatorUserId')}
                          disabled={usersLoading}
                        >
                          Select Delegator
                        </Button>
                        {!stage.delegatorUserId && (
                          <Typography variant="caption" color="text.secondary">
                            Optional
                          </Typography>
                        )}
                      </Box>
                      {stage.delegatorUserId && (
                        <Chip
                          label={userLabel(stage.delegatorUserId)}
                          size="small"
                          onDelete={() => updateStage(index, 'delegatorUserId', null)}
                        />
                      )}
                    </Box>
                  </Box>
                </Paper>
              ))}

              <Box>
                <Button variant="outlined" color="secondary" startIcon={<AddIcon />} onClick={addStage}>
                  Add Stage
                </Button>
              </Box>
            </Stack>
          )}

          <Divider sx={{ my: 3 }} />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleSave}
              disabled={approvalFlowSaving || approvalFlowLoading || !projectId}
            >
              {approvalFlowSaving ? 'Saving…' : 'Save'}
            </Button>
          </Box>
        </Box>
      </MainCard>

      <ApproverSelectModal
        open={picker.open}
        onClose={closePicker}
        users={userOptions}
        loading={usersLoading}
        title={picker.role === 'delegatorUserId' ? 'Select Delegator' : 'Select Approver'}
        initialSelected={picker.index >= 0 && picker.role ? stages[picker.index][picker.role] : null}
        onConfirm={confirmPicker}
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
