import { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Alert,
  Box,
  Breadcrumbs,
  Button,
  Checkbox,
  Chip,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
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
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

import MainCard from 'ui-component/cards/MainCard';
import { getApprovalFlow, saveApprovalFlow, getadminUsers, resetApprovalFlowState } from '../../../store/slices/commonCustomerSlice';

const DOC_TYPE = 'MR';
const emptyStage = () => ({ name: '', approverUserIds: [] });

export default function ApprovalSetupPage() {
  const dispatch = useDispatch();
  const { approvalFlow, approvalFlowLoading, approvalFlowSaving, approvalFlowSaveSuccess, users, usersLoading, error } = useSelector(
    (s) => s.commonCustomer
  );

  const [stages, setStages] = useState([emptyStage()]);
  const [snackbar, setSnackbar] = useState({ open: false, severity: 'success', message: '' });

  useEffect(() => {
    dispatch(getApprovalFlow(DOC_TYPE));
    if (!users.length) dispatch(getadminUsers());
    return () => {
      dispatch(resetApprovalFlowState());
    };
  }, [dispatch]);

  useEffect(() => {
    if (!approvalFlow) return;
    const loaded = (approvalFlow.stages || []).map((s) => ({
      name: s.name || '',
      approverUserIds: (s.approvers || []).map((a) => a.userId)
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
  const userLabel = (id) => userOptions.find((o) => o.id === id)?.label || id;

  const updateStage = (index, field, value) => {
    setStages((prev) => prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)));
  };

  const addStage = () => setStages((prev) => [...prev, emptyStage()]);

  const removeStage = (index) => setStages((prev) => (prev.length <= 1 ? prev : prev.filter((_, i) => i !== index)));

  const moveStage = (index, dir) => {
    setStages((prev) => {
      const next = [...prev];
      const target = index + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const handleSave = () => {
    const payloadStages = stages
      .filter((s) => (s.name || '').trim() && s.approverUserIds.length)
      .map((s) => ({ name: s.name.trim(), approverUserIds: s.approverUserIds }));

    if (!payloadStages.length) {
      setSnackbar({ open: true, severity: 'error', message: 'Add at least one stage with a name and approver' });
      return;
    }
    dispatch(saveApprovalFlow({ docType: DOC_TYPE, stages: payloadStages }));
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
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Configure the ordered approval stages for Material Requests. Each stage may have one or more approvers — any one of them can approve
            to advance to the next stage.
          </Typography>

          {approvalFlowLoading ? (
            <Typography color="text.secondary">Loading…</Typography>
          ) : (
            <Stack spacing={2}>
              {stages.map((stage, index) => (
                <Paper key={index} variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
                    <Chip label={`Stage ${index + 1}`} color="secondary" size="small" />
                    <Box sx={{ flex: 1 }} />
                    <Tooltip title="Move up">
                      <span>
                        <IconButton size="small" disabled={index === 0} onClick={() => moveStage(index, -1)}>
                          <ArrowUpwardIcon fontSize="small" />
                        </IconButton>
                      </span>
                    </Tooltip>
                    <Tooltip title="Move down">
                      <span>
                        <IconButton size="small" disabled={index === stages.length - 1} onClick={() => moveStage(index, 1)}>
                          <ArrowDownwardIcon fontSize="small" />
                        </IconButton>
                      </span>
                    </Tooltip>
                    <Tooltip title="Remove stage">
                      <span>
                        <IconButton size="small" color="error" disabled={stages.length <= 1} onClick={() => removeStage(index)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <TextField
                      label="Stage Name"
                      size="small"
                      sx={{ flex: 1, minWidth: 220 }}
                      value={stage.name}
                      onChange={(e) => updateStage(index, 'name', e.target.value)}
                    />

                    <FormControl size="small" sx={{ flex: 2, minWidth: 280 }}>
                      <InputLabel>Approvers</InputLabel>
                      <Select
                        multiple
                        value={stage.approverUserIds}
                        onChange={(e) => updateStage(index, 'approverUserIds', e.target.value)}
                        input={<OutlinedInput label="Approvers" />}
                        disabled={usersLoading}
                        renderValue={(selected) => (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selected.map((id) => (
                              <Chip key={id} label={userLabel(id)} size="small" />
                            ))}
                          </Box>
                        )}
                      >
                        {userOptions.map((opt) => (
                          <MenuItem key={opt.id} value={opt.id}>
                            <Checkbox checked={stage.approverUserIds.indexOf(opt.id) > -1} />
                            <ListItemText primary={opt.label} secondary={opt.email} />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
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
            <Button variant="contained" color="secondary" onClick={handleSave} disabled={approvalFlowSaving || approvalFlowLoading}>
              {approvalFlowSaving ? 'Saving…' : 'Save'}
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
