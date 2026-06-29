import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { getGRPOById, resetGRPOState } from '../../store/slices/goodsReceiptPOSlice';
import { mapApiToForm, mapApiLineToRow } from './grpoHelpers';

import { Box, Breadcrumbs, Button, Divider, Skeleton, Tab, Tabs, Typography } from '@mui/material';

import HomeIcon from '@mui/icons-material/Home';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

import MainCard from 'ui-component/cards/MainCard';
import GRPOGeneralTab from './GeneralTab';
import GRPOContentTab from './ContentTab';
import GRPOAttachmentTab from './AttachmentTab';

import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import MRPrintTemplate from '../../utils/MRPrintTemplate';
import logo from "../../assets/images/logo.png";

const noop = () => {};

function ContentSkeleton() {
  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 4 }}>
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} variant="rounded" height={40} />
          ))}
        </Box>
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} variant="rounded" height={40} />
          ))}
        </Box>
      </Box>
      <Skeleton variant="rounded" height={200} sx={{ mt: 4 }} />
    </Box>
  );
}

export default function GoodsReceiptPOView() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
const { currentGRPO, currentGRPOLoading, currentGRPOError } = useSelector((s) => s.goodsReceiptPO);

  const [tabValue, setTabValue] = useState(0);
  const [form, setForm] = useState(null);
  const [lines, setLines] = useState([]);
  //print
  const contentRef = useRef(null);

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');

    printWindow.document.write(MRPrintTemplate({form,lines}));
    console.log('handleprintform', form, lines);

    printWindow.document.close();

    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    };
  };
  //print
  

  useEffect(() => {
    if (id) dispatch(getGRPOById(id));
    return () => {
      dispatch(resetGRPOState());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (!currentGRPO) return;
    setForm(mapApiToForm(currentGRPO));
    setLines((currentGRPO.DocumentLines || []).map(mapApiLineToRow));
  }, [currentGRPO]);

  const loading = currentGRPOLoading || !form;

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
          <Typography variant="h4">Goods Receipt PO</Typography>

          {/* <div
            style={{
              position: 'absolute',
              //left: "-9999px",
              top: 0
            }}
            ref={contentRef}
          >
            <MRPrintTemplate data={form} />
          </div> */}
          <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <HomeIcon sx={{ fontSize: 18, color: 'secondary.main' }} />
            </Box>
            <Typography variant="body2" color="text.primary">
              Goods Receipt PO
            </Typography>
            <Typography variant="body2" color="secondary" fontWeight={600}>
              View
            </Typography>
          </Breadcrumbs>
        </Box>
      </MainCard>

      <MainCard content={false}>
        <Box
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            px: 3,
            pt: 1,
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <Tabs  sx={{ flexGrow: 1 }} value={tabValue} onChange={(_, v) => !loading && setTabValue(v)}>
            <Tab label="General" />
            <Tab label="Contents" />
            <Tab label="Attachments" />
          </Tabs>
          <Button  variant="contained"
    sx={{ ml: 2 }} onClick={handlePrint}>print</Button>
        </Box>

        <Box sx={{ p: 3 }}>
          {currentGRPOError ? (
            <Box sx={{ py: 6, textAlign: 'center' }}>
              <Typography color="error" variant="h5">
                Failed to load Goods Receipt PO
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 1 }}>
                {currentGRPOError}
              </Typography>
            </Box>
          ) : loading ? (
            <ContentSkeleton />
          ) : (
            <>
              <Box sx={{ display: tabValue === 0 ? 'block' : 'none' }}>
                <GRPOGeneralTab data={form} setData={noop} readOnly />
              </Box>
              <Box sx={{ display: tabValue === 1 ? 'block' : 'none' }}>
                <GRPOContentTab data={form} setData={noop} rows={lines} setRows={noop} readOnly />
              </Box>
              {tabValue === 2 && <GRPOAttachmentTab attachmentEntry={currentGRPO?.AttachmentEntry} />}
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
