import { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { Alert, Box, Breadcrumbs, Button, CircularProgress, Divider, Snackbar, Tab, Tabs, Typography } from '@mui/material';

import HomeIcon from '@mui/icons-material/Home';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

import MainCard from 'ui-component/cards/MainCard';
import MRGeneralTab from './GeneralTab';
import MRContentTab, { emptyRow } from './ContentTab';
import BOMSelectModal from './BOMSelectModal';
import BOMItemSelectModal from './BOMItemSelectModal';
import { createMR, resetMRState } from '../../store/slices/materialRequestSlice';
import { buildPayload, buildChildRow, fetchHasChildren } from './mrHelpers';

const today = new Date().toISOString().split('T')[0];
const nowTime = new Date().toTimeString().slice(0, 5);

const initialForm = () => ({
  RequisitionNo: '',
  RequisitionDate: today,
  RequisitionTime: nowTime,
  RequiredDate: today,
  CardCode: '',
  CardName: '',
  ProjectCode: '',
  ProjectName: '',
  BOMNo: '',
  BOMDocEntry: '',
  RequestorType: 'User',
  ReqCode: '',
  RequestorName: '',
  Department: '',
  DeptId: '',
  Remark: ''
});

const boqLineToRow = (line, projectCode) => ({
  ...emptyRow(),
  BOMLineNum: String(line.LineId ?? ''),
  ItemCode: line.U_ItemCode ?? '',
  ItemDescription: line.U_Desc ?? '',
  FullDescription: line.U_FullDesc ?? '',
  UoMCode: line.U_Unit ?? '',
  BOMQty: line.U_PQty ?? 0,
  BOMOpenQty: line.U_QDiff ?? 0,
  IssuedQty: line.U_AQty ?? 0,
  WarehouseCode: line.U_Whs || '03',
  ProjectCode: projectCode ?? '',
  Quantity: line.U_PQty ?? 0,
  MROpenQty: 0,
  InStock: 0
});

export default function MaterialRequestCreate() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { createLoading, saveSuccess, error } = useSelector((s) => s.materialRequest);
  const { user } = useSelector((s) => s.auth);

  const [tabValue, setTabValue] = useState(0);
  const [form, setForm] = useState(initialForm());
  const [lines, setLines] = useState([emptyRow()]);
  const [bomModalOpen, setBomModalOpen] = useState(false);
  const [bomItemModalOpen, setBomItemModalOpen] = useState(false);
  const [pendingBOM, setPendingBOM] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, severity: 'success', message: '' });

  const canCopyFromBOM = !!(form.CardCode?.trim() || form.ProjectCode?.trim());

  useEffect(() => {
    if (saveSuccess) {
      setSnackbar({ open: true, severity: 'success', message: 'Material Request created successfully!' });
      dispatch(resetMRState());
      setTimeout(() => navigate('/material-requests/list'), 1500);
    }
    if (error) {
      setSnackbar({ open: true, severity: 'error', message: error });
      dispatch(resetMRState());
    }
  }, [saveSuccess, error, dispatch, navigate]);

  const handleBOMSelect = (bom) => {
    setPendingBOM(bom);
    setBomItemModalOpen(true);
  };

  const handleBOMItemsConfirm = async (selectedLines) => {
    const projCode = pendingBOM.U_PrjCode || form.ProjectCode;
    const mapped = selectedLines.map((l) => boqLineToRow(l, projCode));

    const finalRows = [];
    for (const row of mapped) {
      finalRows.push(row);
      if (row.ItemCode && (await fetchHasChildren(dispatch, row.ItemCode))) {
        finalRows.push(buildChildRow(row));
      }
    }

    setLines(finalRows.length ? finalRows : [emptyRow()]);
    setForm((prev) => ({
      ...prev,
      BOMNo: pendingBOM.DocEntry,
      BOMDocEntry: pendingBOM.DocEntry,
      CardCode: pendingBOM.U_BPCode || prev.CardCode,
      CardName: pendingBOM.U_BPName || prev.CardName,
      ProjectCode: pendingBOM.U_PrjCode || prev.ProjectCode,
      ProjectName: pendingBOM.U_PrjName || prev.ProjectName
    }));
    setPendingBOM(null);
    setTabValue(1);
  };

  const handleSubmit = () => {
    const payload = buildPayload(form, lines, user);
    dispatch(createMR(payload));
  };

  return (
    <Box>
      <MainCard content={false} sx={{ mb: 3 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', md: 'center' },
            flexDirection: { xs: 'column', md: 'row' },
            px: 3,
            py: 1.5,
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
              Create
            </Typography>
          </Breadcrumbs>
        </Box>
      </MainCard>

      <MainCard content={false}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 3, pt: 1 }}>
          <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)}>
            <Tab label="General" />
            <Tab label="Contents" />
          </Tabs>
        </Box>

        <Box sx={{ p: 3 }}>
          <Box sx={{ display: tabValue === 0 ? 'block' : 'none' }}>
            <MRGeneralTab data={form} setData={setForm} />
          </Box>
          <Box sx={{ display: tabValue === 1 ? 'block' : 'none' }}>
            <MRContentTab data={form} setData={setForm} rows={lines} setRows={setLines} />
          </Box>

          <Divider sx={{ my: 4 }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<ContentCopyIcon />}
              disabled={!canCopyFromBOM}
              onClick={() => setBomModalOpen(true)}
            >
              Copy from BOM
            </Button>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button variant="outlined" color="error" onClick={() => navigate('/material-requests/list')}>
                Cancel
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleSubmit}
                disabled={createLoading}
                startIcon={createLoading ? <CircularProgress size={16} color="inherit" /> : null}
              >
                Submit
              </Button>
            </Box>
          </Box>
        </Box>
      </MainCard>

      <BOMSelectModal
        open={bomModalOpen}
        onClose={() => setBomModalOpen(false)}
        onSelect={handleBOMSelect}
        cardCode={form.CardCode}
        projectCode={form.ProjectCode}
      />

      <BOMItemSelectModal
        open={bomItemModalOpen}
        onClose={() => {
          setBomItemModalOpen(false);
          setPendingBOM(null);
        }}
        onConfirm={handleBOMItemsConfirm}
        bomLines={(pendingBOM?.HLB_BOQT1Collection || []).filter((l) => l.U_ItemCode)}
      />

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
