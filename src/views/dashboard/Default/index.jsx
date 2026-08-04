import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Avatar, Box, Chip, CircularProgress, Divider, Grid, IconButton, Paper, Tooltip, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';

import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import RefreshIcon from '@mui/icons-material/Refresh';

import { getPendingCounts } from '../../../store/slices/dashboardSlice';
import { getMyApprovals } from '../../../store/slices/approvalSlice';

const TILE_REGISTRY = {
  'Material Request': { count: 'mr', label: 'Material Requests Pending', color: 'secondary', icon: <ShoppingCartIcon />, to: '/material-request/list' },
  'Purchase Request': { count: 'pr', label: 'Purchase Requests Pending', color: 'primary', icon: <ReceiptLongIcon />, to: '/purchase-request/list' },
  GRPO: { count: 'grpo', label: 'Goods Receipt PO Pending', color: 'warning', icon: <LocalShippingIcon />, to: '/GRPO/list' },
  'My Approvals': { count: 'approvals', label: 'Approvals Pending', color: 'success', icon: <FactCheckIcon />, to: '/my-approvals/list' }
};

function HeroStat({ label, value, color = 'primary' }) {
  return (
    <Box
      sx={{
        px: 2,
        py: 1.25,
        borderRadius: 2,
        minWidth: 96,
        textAlign: 'center',
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider'
      }}
    >
      <Typography variant="h3" sx={{ fontWeight: 700, lineHeight: 1.1, color: (t) => t.palette[color].main }}>
        {value == null ? '—' : value}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
    </Box>
  );
}

function StatTile({ icon, label, value, color, loading, onClick }) {
  return (
    <Paper
      variant="outlined"
      onClick={onClick}
      sx={{
        p: 2.5,
        borderRadius: 2,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        transition: 'box-shadow .2s, transform .2s',
        '&:hover': { boxShadow: 4, transform: 'translateY(-2px)' }
      }}
    >
      <Box
        sx={{
          width: 52,
          height: 52,
          borderRadius: 2,
          display: 'grid',
          placeItems: 'center',
          bgcolor: (t) => alpha(t.palette[color].main, 0.12),
          color: (t) => t.palette[color].main,
          flexShrink: 0
        }}
      >
        {icon}
      </Box>
      <Box sx={{ minWidth: 0 }}>
        {loading ? (
          <CircularProgress size={22} />
        ) : (
          <Typography variant="h2" sx={{ lineHeight: 1.1, fontWeight: 700 }}>
            {value == null ? '—' : value}
          </Typography>
        )}
        <Typography variant="body2" color="text.secondary" noWrap>
          {label}
        </Typography>
      </Box>
    </Paper>
  );
}

export default function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
  const { counts, loading } = useSelector((s) => s.dashboard);
  const { count: approvalsCount, listLoading: approvalsLoading } = useSelector((s) => s.approval);

  const fullName = [user?.first_name, user?.last_name].filter(Boolean).join(' ') || 'there';
  const projects = Array.isArray(user?.Projects) ? user.Projects : [];
  const initials = ([user?.first_name, user?.last_name].filter(Boolean).map((s) => s[0]).join('') || 'U').toUpperCase();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const today = new Date().toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  const isComAdmin = Boolean(user?.is_com_admin);
  const menuNames = new Set(
    (user?.Roles || [])
      .flatMap((role) => role.UserMenus || [])
      .flatMap((menu) => [menu, ...(menu.children || [])])
      .filter((m) => m?.status === 1)
      .map((m) => m.display_name)
  );

  const countByKey = { mr: counts.mr, pr: counts.pr, grpo: counts.grpo, approvals: approvalsCount };
  const loadingByKey = { mr: loading, pr: loading, grpo: loading, approvals: approvalsLoading };

  const tiles = Object.entries(TILE_REGISTRY)
    .filter(([name]) => isComAdmin || menuNames.has(name))
    .map(([name, cfg]) => ({
      key: cfg.count,
      name,
      label: cfg.label,
      color: cfg.color,
      icon: cfg.icon,
      to: cfg.to,
      value: countByKey[cfg.count],
      loading: loadingByKey[cfg.count]
    }));

  const hasApprovalsTile = tiles.some((t) => t.key === 'approvals');
  const totalPending = tiles.reduce((sum, t) => sum + (t.value || 0), 0);

  const load = () => {
    dispatch(getPendingCounts({ email: user?.email || '' }));
    if (hasApprovalsTile) dispatch(getMyApprovals({ docType: 'MR', status: 'pending', top: 1 }));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.email]);

  return (
    <Box sx={{ p: 3 }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 4 },
          mb: 4,
          borderRadius: 3,
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid',
          borderColor: 'divider',
          borderLeft: (t) => `6px solid ${t.palette.primary.main}`,
          boxShadow: (t) => `0 6px 20px ${alpha(t.palette.primary.main, 0.12)}`,
          bgcolor: 'background.default'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, flexWrap: 'wrap' }}>
          <Avatar sx={{ width: 60, height: 60, bgcolor: 'primary.main', color: '#fff', fontWeight: 700, fontSize: 22 }}>{initials}</Avatar>
          <Box sx={{ flex: 1, minWidth: 220 }}>
            <Typography variant="h2" sx={{ fontWeight: 700, lineHeight: 1.15 }}>
              {greeting}, {fullName}!
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 0.5 }}>
              {today} &nbsp;·&nbsp; Here&apos;s what needs your attention.
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
            <HeroStat label="Pending" value={loading ? null : totalPending} color="primary" />
            <HeroStat label="Projects" value={projects.length} color="secondary" />
          </Box>
        </Box>
      </Paper>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
        <Typography variant="h4">Pending</Typography>
        <Tooltip title="Refresh">
          <IconButton size="small" onClick={load} disabled={loading || approvalsLoading}>
            <RefreshIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      {tiles.length === 0 ? (
        <Paper variant="outlined" sx={{ p: 4, mb: 4, borderRadius: 2, textAlign: 'center' }}>
          <Typography color="text.secondary">No modules assigned to your account.</Typography>
        </Paper>
      ) : (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {tiles.map((t) => (
            <Grid item xs={12} sm={6} md={4} key={t.key}>
              <StatTile icon={t.icon} label={t.label} value={t.value} color={t.color} loading={t.loading} onClick={() => navigate(t.to)} />
            </Grid>
          ))}
        </Grid>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={7} lg={6}>
          <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <Box sx={{ px: 2.5, py: 1.75, display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <AccountTreeIcon color="secondary" fontSize="small" />
              <Typography variant="h4" sx={{ flex: 1 }}>
                Projects
              </Typography>
              <Chip size="small" color="secondary" label={projects.length} />
            </Box>
            <Divider />
            <Box sx={{ maxHeight: 340, overflowY: 'auto' }}>
              {projects.length === 0 ? (
                <Box sx={{ p: 4, textAlign: 'center' }}>
                  <Typography color="text.secondary">No projects assigned.</Typography>
                </Box>
              ) : (
                projects.map((p, i) => (
                  <Box
                    key={p.id ?? p.Code ?? i}
                    sx={{
                      px: 2.5,
                      py: 1.25,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      borderBottom: i < projects.length - 1 ? '1px solid' : 'none',
                      borderColor: 'divider'
                    }}
                  >
                    <Typography variant="body2" sx={{ color: 'text.disabled', width: 24, textAlign: 'right' }}>
                      {i + 1}
                    </Typography>
                    <Box sx={{ minWidth: 0, flex: 1 }}>
                      <Typography variant="body1" sx={{ fontWeight: 600 }} noWrap>
                        {p.Code || '—'}
                      </Typography>
                      {p.Name && (
                        <Typography variant="body2" color="text.secondary" noWrap>
                          {p.Name}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                ))
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
