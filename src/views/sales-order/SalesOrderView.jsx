import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSalesOrderById, resetSalesOrderState } from '../../store/slices/salesOrderSlice';
import { useParams, useNavigate } from 'react-router-dom';

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
import GeneralTab from './GeneralTab';
import ContentTab from './ContentTab';
import AttachmentTab from './AttachmentTab';

function ViewSkeleton() {
  return (
    <Box>
      {/* Header skeleton */}
      <MainCard content={false} sx={{ mb: 3 }}>
        <Box sx={{ px: 3, py: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Skeleton variant="text" width={140} height={32} />
          <Skeleton variant="text" width={220} height={24} />
        </Box>
      </MainCard>

      {/* Content skeleton */}
      <MainCard content={false}>
        {/* Tab bar */}
        <Box sx={{ px: 3, pt: 1, display: 'flex', gap: 3, borderBottom: 1, borderColor: 'divider' }}>
          <Skeleton variant="text" width={60} height={40} />
          <Skeleton variant="text" width={70} height={40} />
          <Skeleton variant="text" width={90} height={40} />
        </Box>

        <Box sx={{ p: 3 }}>
          {/* Two-column fields */}
          <Box sx={{ display: 'flex', gap: 4 }}>
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} variant="rounded" height={40} />
              ))}
            </Box>
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} variant="rounded" height={40} />
              ))}
            </Box>
          </Box>

          {/* Table skeleton */}
          <Skeleton variant="rounded" height={180} sx={{ mt: 4 }} />

          <Divider sx={{ my: 4 }} />

          {/* Footer buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Skeleton variant="rounded" width={80} height={34} />
            <Skeleton variant="rounded" width={80} height={34} />
          </Box>
        </Box>
      </MainCard>
    </Box>
  );
}

export default function SalesOrdersView() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const noop = () => {};

  const { loading, currentOrder } = useSelector((state) => state.salesOrder);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    if (id) dispatch(getSalesOrderById(id));
    return () => { dispatch(resetSalesOrderState()); };
  }, [dispatch, id]);

  if (loading || !currentOrder) return <ViewSkeleton />;

  return (
    <Box>
      {/* HEADER */}
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
          <Typography variant="h3">Sales Orders</Typography>

          <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <HomeIcon color="secondary" sx={{ fontSize: 18 }} />
            </Box>
            <Typography variant="body2" color="text.primary">Sales Orders</Typography>
            <Typography variant="body2" color="secondary" fontWeight={600}>View</Typography>
          </Breadcrumbs>
        </Box>
      </MainCard>

      {/* CONTENT */}
      <MainCard content={false}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 3, pt: 1 }}>
          <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)} variant="scrollable" scrollButtons="auto">
            <Tab label="General" />
            <Tab label="Contents" />
            <Tab label="Attachments" />
          </Tabs>
        </Box>

        <Box sx={{ p: 3 }}>
          {tabValue === 0 && <GeneralTab data={currentOrder} setData={noop} readOnly />}
          {tabValue === 1 && (
            <ContentTab
              data={currentOrder}
              setData={noop}
              rows={currentOrder.DocumentLines || []}
              setRows={noop}
              readOnly
            />
          )}
          {tabValue === 2 && <AttachmentTab data={currentOrder} readOnly />}

          <Divider sx={{ my: 4 }} />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, flexWrap: 'wrap' }}>
            <Button variant="outlined" onClick={() => navigate(-1)}>Back</Button>
            <Button variant="contained" color="secondary" onClick={() => navigate(`/sales-orders/edit/${id}`)}>
              Edit
            </Button>
          </Box>
        </Box>
      </MainCard>
    </Box>
  );
}
