import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { getMRById, resetMRState } from '../../store/slices/materialRequestSlice';
import { mapApiToForm, mapApiLineToRow } from './mrHelpers';

import {
  Box,
  Breadcrumbs,
  Button,
  Divider,
  Skeleton,
  Tab,
  Tabs,
  Typography
} from '@mui/material';

import HomeIcon from '@mui/icons-material/Home';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

import MainCard from 'ui-component/cards/MainCard';
import MRGeneralTab from './GeneralTab';
import MRContentTab from './ContentTab';

const noop = () => {};

function ContentSkeleton() {
  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 4 }}>
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {[1, 2, 3, 4, 5].map((i) => <Skeleton key={i} variant="rounded" height={40} />)}
        </Box>
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} variant="rounded" height={40} />)}
        </Box>
      </Box>
      <Skeleton variant="rounded" height={180} sx={{ mt: 4 }} />
    </Box>
  );
}

export default function MaterialRequestView() {
  const { id }   = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentMR, currentMRLoading, currentMRError } = useSelector((s) => s.materialRequest);

  const [tabValue, setTabValue] = useState(0);
  const [form, setForm]         = useState(null);
  const [lines, setLines]       = useState([]);

  useEffect(() => {
    if (id) dispatch(getMRById(id));
    return () => { dispatch(resetMRState()); };
  }, [dispatch, id]);

  useEffect(() => {
    if (!currentMR) return;
    setForm(mapApiToForm(currentMR));
    setLines((currentMR.HLB_MRQ1Collection || []).map(mapApiLineToRow));
  }, [currentMR]);

  const loading = currentMRLoading || !form;

  return (
    <Box>
      {/* HEADER — always visible */}
      <MainCard content={false} sx={{ mb: 3 }}>
        <Box
          sx={{
            px: 3, py: 2.5,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', md: 'center' },
            flexDirection: { xs: 'column', md: 'row' },
            gap: 2
          }}
        >
          <Typography variant="h3">Material Request</Typography>
          <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <HomeIcon sx={{ fontSize: 18, color: 'secondary.main' }} />
            </Box>
            <Typography variant="body2" color="text.primary">Material Request</Typography>
            <Typography variant="body2" color="secondary" fontWeight={600}>View</Typography>
          </Breadcrumbs>
        </Box>
      </MainCard>

      {/* CONTENT */}
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
              <Typography color="error" variant="h5">Failed to load Material Request</Typography>
              <Typography color="text.secondary" sx={{ mt: 1 }}>{currentMRError}</Typography>
            </Box>
          ) : loading ? (
            <ContentSkeleton />
          ) : (
            <>
              {/* Always mounted — CSS show/hide avoids unmount errors on tab switch */}
              <Box sx={{ display: tabValue === 0 ? 'block' : 'none' }}>
                <MRGeneralTab data={form} setData={noop} readOnly />
              </Box>
              <Box sx={{ display: tabValue === 1 ? 'block' : 'none' }}>
                <MRContentTab data={form} setData={noop} rows={lines} setRows={noop} readOnly />
              </Box>
            </>
          )}

          <Divider sx={{ my: 4 }} />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button variant="outlined" onClick={() => navigate(-1)}>Back</Button>
            <Button
              variant="contained"
              color="secondary"
              disabled={loading || !!currentMRError}
              onClick={() => navigate(`/material-requests/edit/${id}`)}
            >
              Edit
            </Button>
          </Box>
        </Box>
      </MainCard>
    </Box>
  );
}
