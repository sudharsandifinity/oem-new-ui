import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { getMRById, resetMRState } from '../../store/slices/materialRequestSlice';
import { getDepartments } from '../../store/slices/commonSlice';
import { mapApiToForm, mapApiLineToRow, MR_STATUS_META } from './mrHelpers';
import { resolveDepartmentName } from 'utils/department';

import { Alert, Box, Breadcrumbs, Button, Chip, Divider, Skeleton, Tab, Tabs, Typography } from '@mui/material';

import HomeIcon from '@mui/icons-material/Home';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

import MainCard from 'ui-component/cards/MainCard';
import MRGeneralTab from './GeneralTab';
import MRContentTab from './ContentTab';
import PurchaseRequestModal from './PurchaseRequestModal';

const noop = () => {};

function ContentSkeleton() {
  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 4 }}>
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {[1, 2, 3, 4, 5].map((i) => (
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

export default function MaterialRequestView() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentMR, currentMRLoading, currentMRError } = useSelector((s) => s.materialRequest);
  const { departments } = useSelector((s) => s.common);

  const [tabValue, setTabValue] = useState(0);
  const [form, setForm] = useState(null);
  const [lines, setLines] = useState([]);
  const [prModalOpen, setPrModalOpen] = useState(false);

  useEffect(() => {
    if (id) dispatch(getMRById(id));
    if (!departments.length) dispatch(getDepartments());
    return () => {
      dispatch(resetMRState());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (!currentMR) return;
    setForm(mapApiToForm(currentMR));
    setLines((currentMR.HLB_MRQ1Collection || []).map(mapApiLineToRow));
  }, [currentMR]);

  useEffect(() => {
    if (!form?.DeptId || !departments.length) return;
    const name = resolveDepartmentName(departments, form.DeptId);
    if (name !== form.Department) {
      setForm((prev) => ({ ...prev, Department: name }));
    }
  }, [departments, form?.DeptId, currentMR]);

  const loading = currentMRLoading || !form;
  const docStatus = currentMR?.U_DocStatus;
  const isPending = docStatus === 'D';
  const isApproved = docStatus === 'O';

  const handlePRContinue = (selectedLines) => {
    setPrModalOpen(false);
    navigate('/purchase-request/create', {
      state: {
        mrDocEntry: id,
        mrNo: id,
        projectCode: form.ProjectCode,
        projectName: form.ProjectName,
        reqCode: form.ReqCode,
        reqType: null,
        requestorTypeLabel: form.RequestorType,
        requestorName: form.RequestorName,
        department: form.DeptId,
        departmentName: form.Department,
        selectedLines
      }
    });
  };

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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Typography variant="h4">Material Request</Typography>
            {docStatus && (
              <Chip
                label={(MR_STATUS_META[docStatus] || { label: docStatus }).label}
                color={(MR_STATUS_META[docStatus] || { color: 'default' }).color}
                variant="outlined"
              />
            )}
          </Box>
          <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <HomeIcon sx={{ fontSize: 18, color: 'secondary.main' }} />
            </Box>
            <Typography variant="body2" color="text.primary">
              Material Request
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
          {currentMRError ? (
            <Box sx={{ py: 6, textAlign: 'center' }}>
              <Typography color="error" variant="h5">
                Failed to load Material Request
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 1 }}>
                {currentMRError}
              </Typography>
            </Box>
          ) : loading ? (
            <ContentSkeleton />
          ) : (
            <>
              <Box sx={{ display: tabValue === 0 ? 'block' : 'none' }}>
                <MRGeneralTab data={form} setData={noop} readOnly />
              </Box>
              <Box sx={{ display: tabValue === 1 ? 'block' : 'none' }}>
                <MRContentTab data={form} setData={noop} rows={lines} setRows={noop} readOnly />
              </Box>
            </>
          )}

          {currentMR?.U_Apr_remark && (
            <Alert severity="info" sx={{ mt: 3 }}>
              <strong>Approver Remark:</strong> {currentMR.U_Apr_remark}
            </Alert>
          )}

          <Divider sx={{ my: 4 }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              {!isPending && (
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<ShoppingCartIcon />}
                  disabled={loading || !!currentMRError}
                  onClick={() => setPrModalOpen(true)}
                >
                  Purchase Request
                </Button>
              )}
            </Box>

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button variant="outlined" onClick={() => navigate(-1)}>
                Back
              </Button>
              <Button
                variant="contained"
                color="secondary"
                disabled={loading || !!currentMRError || isApproved}
                onClick={() => navigate(`/material-request/edit/${id}`)}
              >
                Edit
              </Button>
            </Box>
          </Box>
        </Box>
      </MainCard>

      <PurchaseRequestModal open={prModalOpen} onClose={() => setPrModalOpen(false)} onContinue={handlePRContinue} lines={lines} />
    </Box>
  );
}
