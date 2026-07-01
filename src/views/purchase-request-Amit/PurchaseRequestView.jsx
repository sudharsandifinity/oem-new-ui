import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { getPRById, resetPRState } from '../../store/slices/purchaseRequestSlice';
import { getDepartments } from '../../store/slices/commonSlice';
import { mapApiToForm, mapApiLineToRow } from './PurchaseRequestHelpers';
import { resolveDepartmentName } from 'utils/department';

import { Box, Breadcrumbs, Button, Divider, Skeleton, Tab, Tabs, Typography } from '@mui/material';

import HomeIcon from '@mui/icons-material/Home';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

import MainCard from 'ui-component/cards/MainCard';
import PRGeneralTab from './GeneralTab';
import PRContentTab from './ContentTab';

const noop = () => {};

function ContentSkeleton() {
  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 4 }}>
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} variant="rounded" height={40} />
          ))}
        </Box>
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {[1, 2].map((i) => (
            <Skeleton key={i} variant="rounded" height={40} />
          ))}
        </Box>
      </Box>
      <Skeleton variant="rounded" height={180} sx={{ mt: 4 }} />
    </Box>
  );
}

export default function PurchaseRequestView() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentPR, currentPRLoading, currentPRError } = useSelector((s) => s.purchaseRequest);
  const { departments } = useSelector((s) => s.common);

  const [tabValue, setTabValue] = useState(0);
  const [form, setForm] = useState(null);
  const [lines, setLines] = useState([]);

  useEffect(() => {
    if (id) dispatch(getPRById(id));
    if (!departments.length) dispatch(getDepartments());
    return () => {
      dispatch(resetPRState());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (!currentPR) return;
    setForm(mapApiToForm(currentPR));
    setLines((currentPR.DocumentLines || []).map(mapApiLineToRow));
  }, [currentPR]);

  useEffect(() => {
    if (!form?.DeptId || !departments.length) return;
    const name = resolveDepartmentName(departments, form.DeptId);
    if (name !== form.Department) {
      setForm((prev) => ({ ...prev, Department: name }));
    }
  }, [departments, form?.DeptId]);

  const loading = currentPRLoading || !form;

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
          {currentPRError ? (
            <Box sx={{ py: 6, textAlign: 'center' }}>
              <Typography color="error" variant="h5">
                Failed to load Purchase Request
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 1 }}>
                {currentPRError}
              </Typography>
            </Box>
          ) : loading ? (
            <ContentSkeleton />
          ) : (
            <>
              <Box sx={{ display: tabValue === 0 ? 'block' : 'none' }}>
                <PRGeneralTab data={form} setData={noop} readOnly />
              </Box>
              <Box sx={{ display: tabValue === 1 ? 'block' : 'none' }}>
                <PRContentTab data={form} setData={noop} rows={lines} setRows={noop} readOnly />
              </Box>
            </>
          )}

          <Divider sx={{ my: 4 }} />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button variant="outlined" onClick={() => navigate(-1)}>
              Back
            </Button>
          </Box>
        </Box>
      </MainCard>
    </Box>
  );
}
