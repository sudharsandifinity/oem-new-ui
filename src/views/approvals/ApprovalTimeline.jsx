import { Alert, Box, Chip, Paper, Step, StepLabel, Stepper, Typography } from '@mui/material';

import { formatDateDDMMYYYY } from 'utils/dataGridFormatters';

const DECISION_META = {
  approved: { label: 'Approved', color: 'success' },
  rejected: { label: 'Rejected', color: 'error' },
  resubmitted: { label: 'Resubmitted', color: 'info' }
};

const stageActors = (stage) =>
  [stage?.approver?.name, stage?.delegator?.name ? `${stage.delegator.name} (delegate)` : null].filter(Boolean).join(', ');

export function ApprovalStatusBanner({ approval }) {
  if (!approval) return null;
  const { status, pendingWith } = approval;

  if (status === 'not_required') {
    return <Alert severity="info">No approval workflow is configured for this request.</Alert>;
  }
  if (status === 'approved') {
    return <Alert severity="success">Fully approved.</Alert>;
  }
  if (status === 'sent_back') {
    return <Alert severity="error">Sent back by the approver. Please revise and resubmit.</Alert>;
  }
  if (status === 'pending' && pendingWith) {
    return (
      <Alert severity="warning">
        Pending with <strong>{stageActors(pendingWith) || '—'}</strong> — {pendingWith.stageName} (Stage {pendingWith.stageOrder} of{' '}
        {pendingWith.totalStages})
      </Alert>
    );
  }
  return null;
}

export function ApprovalStepper({ approval }) {
  const stages = approval?.stages || [];
  if (!stages.length) return null;

  const status = approval.status;
  const activeStep = status === 'approved' ? stages.length : (approval.currentStageOrder || 1) - 1;
  const lastAction = (approval.actions || [])[(approval.actions || []).length - 1];
  const rejectedStage = status === 'sent_back' && lastAction?.decision === 'rejected' ? lastAction.stageOrder : null;

  return (
    <Paper variant="outlined" sx={{ p: 3, mb: 3, borderRadius: 2 }}>
      <Stepper activeStep={rejectedStage ? rejectedStage - 1 : activeStep} alternativeLabel>
        {stages.map((stage) => (
          <Step key={stage.stageOrder} completed={status === 'approved' || (!rejectedStage && stage.stageOrder - 1 < activeStep)}>
            <StepLabel
              error={rejectedStage === stage.stageOrder}
              optional={
                <Typography variant="caption" color="text.secondary">
                  {stageActors(stage)}
                </Typography>
              }
            >
              {stage.name}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Paper>
  );
}

export function ApprovalHistory({ actions = [] }) {
  if (!actions.length) {
    return <Typography color="text.secondary">No actions yet.</Typography>;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      {actions.map((a, i) => {
        const meta = DECISION_META[a.decision] || { label: a.decision, color: 'default' };
        return (
          <Paper key={i} variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              <Chip size="small" label={meta.label} color={meta.color} variant="outlined" />
              {a.decision !== 'resubmitted' && <Typography variant="body2">Stage {a.stageOrder}</Typography>}
              <Typography variant="body2" color="text.secondary">
                • {a.approver || '—'}
                {a.actedAs === 'delegator' ? ' (delegate)' : ''}
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
        );
      })}
    </Box>
  );
}
