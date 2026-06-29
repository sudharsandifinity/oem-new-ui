import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';

import { Box, Breadcrumbs, Button, Divider, Skeleton, Tab, Tabs, Typography } from '@mui/material';

import HomeIcon from '@mui/icons-material/Home';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

import MainCard from 'ui-component/cards/MainCard';
import GeneralTab from './GeneralTab';
import ContentTab from './ContentTab';
import AttachmentTab from './AttachmentTab';
import { getSalesQuotationById, resetSalesQuotationState } from '../../store/slices/salesQuotationSlice';
import { mapApiToForm, mapApiToRows } from './salesQuotationHelpers';

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
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} variant="rounded" height={40} />
          ))}
        </Box>
      </Box>
      <Skeleton variant="rounded" height={180} sx={{ mt: 4 }} />
    </Box>
  );
}

export default function SalesQuotationsView() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentOrder, loading, error } = useSelector((state) => state.salesQuotation);

  const [tabValue, setTabValue] = useState(0);
  const [salesQuotation, setSalesQuotation] = useState(null);
  const [documentLines, setDocumentLines] = useState([]);

  useEffect(() => {
    if (id) dispatch(getSalesQuotationById(id));
    return () => {
      dispatch(resetSalesQuotationState());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (!currentOrder) return;
    setSalesQuotation(mapApiToForm(currentOrder));
    setDocumentLines(mapApiToRows(currentOrder));
  }, [currentOrder]);

  const isLoading = loading || !salesQuotation;

  return (
    <Box>
      <MainCard content={false} sx={{ mb: 3 }}>
        <Box
          sx={{
            px: 3,
            py: 2.5,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', md: 'center' },
            flexDirection: { xs: 'column', md: 'row' },
            gap: 2
          }}
        >
          <Typography variant="h3">Sales Quotations</Typography>
          <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <HomeIcon color="secondary" sx={{ fontSize: 18 }} />
            </Box>
            <Typography variant="body2" color="text.primary">
              Sales Quotations
            </Typography>
            <Typography variant="body2" color="secondary" fontWeight={600}>
              View
            </Typography>
          </Breadcrumbs>
        </Box>
      </MainCard>

      <MainCard content={false}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 3, pt: 1 }}>
          <Tabs value={tabValue} onChange={(_, v) => !isLoading && setTabValue(v)} variant="scrollable" scrollButtons="auto">
            <Tab label="General" />
            <Tab label="Contents" />
            <Tab label="Attachments" />
          </Tabs>
        </Box>

        <Box sx={{ p: 3 }}>
          {error ? (
            <Box sx={{ py: 6, textAlign: 'center' }}>
              <Typography color="error" variant="h5">
                Failed to load Sales Quotation
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 1 }}>
                {error}
              </Typography>
            </Box>
          ) : isLoading ? (
            <ContentSkeleton />
          ) : (
            <>
              <Box sx={{ display: tabValue === 0 ? 'block' : 'none' }}>
                <GeneralTab data={salesQuotation} setData={noop} readOnly />
              </Box>
              <Box sx={{ display: tabValue === 1 ? 'block' : 'none' }}>
                <ContentTab data={salesQuotation} setData={noop} rows={documentLines} setRows={noop} readOnly />
              </Box>
              <Box sx={{ display: tabValue === 2 ? 'block' : 'none' }}>
                <AttachmentTab data={salesQuotation} setData={noop} readOnly />
              </Box>
            </>
          )}

          <Divider sx={{ my: 4 }} />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, flexWrap: 'wrap' }}>
            <Button variant="outlined" onClick={() => navigate(-1)}>
              Back
            </Button>
            <Button
              variant="contained"
              color="secondary"
              disabled={isLoading || !!error}
              onClick={() => navigate(`/sales-order/edit/${id}`)}
            >
              Edit
            </Button>
          </Box>
        </Box>
      </MainCard>
    </Box>
  );
}
