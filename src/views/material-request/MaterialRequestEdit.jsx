import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { getMRById, updateMR, resetMRState } from '../../store/slices/materialRequestSlice';
// import { getItems } from '../../store/slices/itemSlice'; // used by Refresh Stock (hidden)
import { getDepartments } from '../../store/slices/commonSlice';
import { mapApiToForm, mapApiLineToRow, buildPayload } from './mrHelpers';
import { resolveDepartmentName } from 'utils/department';

import { Alert, Box, Breadcrumbs, Button, CircularProgress, Divider, Skeleton, Snackbar, Tab, Tabs, Typography } from '@mui/material';

import HomeIcon from '@mui/icons-material/Home';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
// import RefreshIcon from '@mui/icons-material/Refresh'; // used by Refresh Stock (hidden)

import MainCard from 'ui-component/cards/MainCard';
import MRGeneralTab from './GeneralTab';
import MRContentTab from './ContentTab';
import PurchaseRequestModal from './PurchaseRequestModal';

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

export default function MaterialRequestEdit() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentMR, currentMRLoading, currentMRError, updateLoading, saveSuccess, error } = useSelector((s) => s.materialRequest);
  const { departments } = useSelector((s) => s.common);

  const [tabValue, setTabValue] = useState(0);
  const [form, setForm] = useState(null);
  const [lines, setLines] = useState([]);
  const [prModalOpen, setPrModalOpen] = useState(false);
  // const [stockLoading, setStockLoading] = useState(false); // used by Refresh Stock (hidden)
  const [snackbar, setSnackbar] = useState({ open: false, severity: 'success', message: '' });

  // Fetch on mount
  useEffect(() => {
    if (id) dispatch(getMRById(id));
    if (!departments.length) dispatch(getDepartments());
    return () => {
      dispatch(resetMRState());
    };
  }, [dispatch, id]);

  // Seed form whenever currentMR changes (initial load only in practice)
  useEffect(() => {
    if (!currentMR) return;
    setForm(mapApiToForm(currentMR));
    setLines((currentMR.HLB_MRQ1Collection || []).map(mapApiLineToRow));
  }, [currentMR]);

  // Resolve Department display name from id once the departments list is available
  useEffect(() => {
    if (!form?.DeptId || !departments.length) return;
    const name = resolveDepartmentName(departments, form.DeptId);
    if (name !== form.Department) {
      setForm((prev) => ({ ...prev, Department: name }));
    }
  }, [departments, form?.DeptId]);

  // Handle save result
  useEffect(() => {
    if (saveSuccess) {
      setSnackbar({ open: true, severity: 'success', message: 'Material Request updated successfully!' });
      dispatch(resetMRState());
      setTimeout(() => navigate(`/material-request/view/${id}`), 1500);
    }
    if (error) {
      setSnackbar({ open: true, severity: 'error', message: error });
      dispatch(resetMRState());
    }
  }, [saveSuccess, error, dispatch, id, navigate]);

  // Refresh Stock
  // const handleRefreshStock = async () => {
  //   if (!lines.some((l) => l.ItemCode)) return;
  //
  //   setStockLoading(true);
  //   try {
  //     const items = await dispatch(getItems()).unwrap();
  //
  //     setLines((prev) =>
  //       prev.map((line) => {
  //         if (!line.ItemCode) return line;
  //         const itemCode = String(line.ItemCode).trim();
  //         const whsCode  = String(line.WarehouseCode ?? '').trim();
  //         const item = items.find((i) => String(i.ItemCode).trim() === itemCode);
  //         if (!item) return line;
  //         const whs = (item.ItemWarehouseInfoCollection || []).find(
  //           (w) => String(w.WarehouseCode).trim() === whsCode
  //         );
  //         return { ...line, InStock: whs != null ? whs.InStock : line.InStock };
  //       })
  //     );
  //     setSnackbar({ open: true, severity: 'success', message: 'Stock refreshed successfully' });
  //   } catch {
  //     setSnackbar({ open: true, severity: 'error', message: 'Failed to refresh stock' });
  //   } finally {
  //     setStockLoading(false);
  //   }
  // };

  const handleSubmit = () => {
    dispatch(updateMR({ docEntry: id, payload: buildPayload(form, lines) }));
  };

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

  const loading = currentMRLoading || !form;

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
          <Typography variant="h4">Material Request</Typography>
          <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <HomeIcon sx={{ fontSize: 18, color: 'secondary.main' }} />
            </Box>
            <Typography variant="body2" color="text.primary">
              Material Request
            </Typography>
            <Typography variant="body2" color="secondary" fontWeight={600}>
              Edit
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
                <MRGeneralTab data={form} setData={setForm} lockCustomerProject />
              </Box>
              <Box sx={{ display: tabValue === 1 ? 'block' : 'none' }}>
                <MRContentTab data={form} setData={setForm} rows={lines} setRows={setLines} />
              </Box>
            </>
          )}

          <Divider sx={{ my: 4 }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<ShoppingCartIcon />}
                disabled={loading}
                onClick={() => setPrModalOpen(true)}
              >
                Purchase Request
              </Button>

              {/* Refresh Stock
              <Button
                variant="outlined"
                color="info"
                startIcon={stockLoading ? <CircularProgress size={16} color="inherit" /> : <RefreshIcon />}
                onClick={handleRefreshStock}
                disabled={loading || stockLoading}
              >
                Refresh Stock
              </Button>
              */}
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button variant="outlined" color="error" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleSubmit}
                disabled={loading || updateLoading}
                startIcon={updateLoading ? <CircularProgress size={16} color="inherit" /> : null}
              >
                Update
              </Button>
            </Box>
          </Box>
        </Box>
      </MainCard>

      <PurchaseRequestModal open={prModalOpen} onClose={() => setPrModalOpen(false)} onContinue={handlePRContinue} lines={lines} />

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
