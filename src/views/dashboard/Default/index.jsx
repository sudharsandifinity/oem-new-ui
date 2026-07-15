import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Avatar, Box, Chip, CircularProgress, Divider, Grid, IconButton, Paper, Tooltip, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';

import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import RefreshIcon from '@mui/icons-material/Refresh';

import { getPendingCounts } from '../../../store/slices/dashboardSlice';

function HeroStat({ label, value }) {
  return (
    <Box
      sx={{
        px: 2,
        py: 1.25,
        borderRadius: 2,
        minWidth: 88,
        textAlign: 'center',
        bgcolor: 'rgba(255,255,255,0.15)',
        backdropFilter: 'blur(4px)'
      }}
    >
      <Typography sx={{ color: '#fff', fontWeight: 700, lineHeight: 1.1 }} variant="h3">
        {value == null ? '—' : value}
      </Typography>
      <Typography sx={{ color: 'rgba(255,255,255,0.85)', fontSize: 12 }}>{label}</Typography>
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

  const fullName = [user?.first_name, user?.last_name].filter(Boolean).join(' ') || 'there';
  const projects = Array.isArray(user?.Projects) ? user.Projects : [];

  const initials = ([user?.first_name, user?.last_name].filter(Boolean).map((s) => s[0]).join('') || 'U').toUpperCase();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const today = new Date().toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const totalPending = ['mr', 'pr', 'grpo'].reduce((sum, k) => sum + (counts[k] || 0), 0);

  const load = () => dispatch(getPendingCounts({ email: user?.email || '' }));

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.email]);

  const tiles = [
    {
      key: 'mr',
      label: 'Material Requests Pending',
      value: counts.mr,
      color: 'secondary',
      icon: <ShoppingCartIcon />,
      to: '/material-request/list'
    },
    {
      key: 'pr',
      label: 'Purchase Requests Pending',
      value: counts.pr,
      color: 'primary',
      icon: <ReceiptLongIcon />,
      to: '/purchase-request/list'
    },
    {
      key: 'grpo',
      label: 'Goods Receipt PO Pending',
      value: counts.grpo,
      color: 'warning',
      icon: <LocalShippingIcon />,
      to: '/GRPO/list'
    }
  ];

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
          color: '#fff',
          background: 'linear-gradient(135deg,#5e35b1 0%,#4527a0 55%,#7b1fa2 100%)'
        }}
      >
        <Box sx={{ position: 'absolute', right: -40, top: -50, width: 190, height: 190, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.08)' }} />
        <Box sx={{ position: 'absolute', right: 80, bottom: -70, width: 150, height: 150, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.06)' }} />

        <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 2.5, flexWrap: 'wrap' }}>
          <Avatar sx={{ width: 60, height: 60, bgcolor: 'rgba(255,255,255,0.2)', color: '#fff', fontWeight: 700, fontSize: 22 }}>
            {initials}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 220 }}>
            <Typography variant="h2" sx={{ color: '#fff', fontWeight: 700, lineHeight: 1.15 }}>
              {greeting}, {fullName}!
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.85)', mt: 0.5 }}>
              {today} &nbsp;·&nbsp; Here&apos;s what needs your attention.
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
            <HeroStat label="Pending" value={loading ? null : totalPending} />
            <HeroStat label="Projects" value={projects.length} />
          </Box>
        </Box>
      </Paper>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
        <Typography variant="h4">Pending</Typography>
        <Tooltip title="Refresh">
          <IconButton size="small" onClick={load} disabled={loading}>
            <RefreshIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {tiles.map((t) => (
          <Grid item xs={12} sm={6} md={4} key={t.key}>
            <StatTile icon={t.icon} label={t.label} value={t.value} color={t.color} loading={loading} onClick={() => navigate(t.to)} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={7} lg={6}>
          <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <Box sx={{ px: 2.5, py: 1.75, display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <AccountTreeIcon color="secondary" fontSize="small" />
              <Typography variant="h4" sx={{ flex: 1 }}>
                My Projects
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
