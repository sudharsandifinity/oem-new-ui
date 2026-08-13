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
import { createMR, resetMRState, getBOQOpenQty } from '../../store/slices/materialRequestSlice';
import { createDraft } from '../../store/slices/draftSlice';
import { buildPayload, buildBomChildPicker, fetchHasChildren } from './mrHelpers';

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

const boqLineToRow = (line, projectCode, bom = {}) => ({
  ...emptyRow(),
  BOMLineNum: String(line.U_UniqueID ?? ''),
  BOMEntry: bom.DocEntry ?? '',
  BOMDocNum: bom.DocNum ?? '',
  BOMType: bom.Object ?? '',
  ItemCode: line.U_ItemCode ?? '',
  ItemDescription: line.U_Desc ?? '',
  FullDescription: line.U_FullDesc ?? '',
  UoMCode: line.U_Unit ?? '',
  BOMQty: line.U_PQty ?? 0,
  BOMOpenQty: 0,
  IssuedQty: line.U_AQty ?? 0,
  WarehouseCode: line.U_Whs || '03',
  ProjectCode: projectCode ?? '',
  Quantity: line.U_PQty ?? 0,
  ApprovedQuantity: line.U_PQty ?? 0,
  MROpenQty: 0,
  InStock: 0,
  IsBOMRow: true
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
  const [bomOpenMap, setBomOpenMap] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, severity: 'success', message: '' });

  const canCopyFromBOM = !!(form.CardCode?.trim() || form.ProjectCode?.trim());
  const isBOM = !!(form.BOMDocEntry || form.BOMNo);

  useEffect(() => {
    if (saveSuccess) {
      setSnackbar({ open: true, severity: 'success', message: 'Material Request created successfully!' });
      dispatch(resetMRState());
      setTimeout(() => navigate('/material-request/list'), 1500);
    }
    if (error) {
      setSnackbar({ open: true, severity: 'error', message: error });
      dispatch(resetMRState());
    }
  }, [saveSuccess, error, dispatch, navigate]);

  useEffect(() => {
    if (!form.ProjectCode) return;
    setLines((prev) => {
      let changed = false;
      const next = prev.map((r) => {
        if (r.ProjectCode === form.ProjectCode) return r;
        changed = true;
        return { ...r, ProjectCode: form.ProjectCode };
      });
      return changed ? next : prev;
    });
  }, [form.ProjectCode, lines.length]);

  const handleBOMSelect = async (bom) => {
    setPendingBOM(bom);
    setBomOpenMap({});
    setBomItemModalOpen(true);

    const plannedByUid = {};
    for (const l of bom.HLB_BOQT1Collection || []) {
      if (String(l.U_Type || '').trim() === 'Regular' && l.U_UniqueID != null && String(l.U_UniqueID) !== '') {
        plannedByUid[String(l.U_UniqueID)] = Number(l.U_PQty) || 0;
      }
    }

    let usedByUid = {};
    try {
      usedByUid = await dispatch(getBOQOpenQty({ docEntry: bom.DocEntry })).unwrap();
    } catch {
      usedByUid = {};
    }

    const map = {};
    Object.keys(plannedByUid).forEach((uid) => {
      const planned = plannedByUid[uid];
      const used = Number(usedByUid[uid]?.used) || 0;
      map[uid] = { planned, used, available: planned - used };
    });
    setBomOpenMap(map);
  };

  const handleBOMItemsConfirm = async (selectedLines) => {
    const projCode = pendingBOM.U_PrjCode || form.ProjectCode;
    const titleByLineId = {};
    let currentTitle = '';
    for (const l of pendingBOM.HLB_BOQT1Collection || []) {
      const type = String(l.U_Type || '').trim();
      if (type === 'Text') currentTitle = l.U_Desc || '';
      else if (type === 'Regular') titleByLineId[l.LineId] = currentTitle;
    }
    const mapped = selectedLines.map((l) => ({
      ...boqLineToRow(l, projCode, pendingBOM),
      Title: titleByLineId[l.LineId] || '',
      BOMAvailable: bomOpenMap[String(l.U_UniqueID)]?.available
    }));

    const finalRows = [];
    const parentCodes = [];
    const parentLineMap = {};
    for (const row of mapped) {
      if (row.ItemCode && (await fetchHasChildren(dispatch, row.ItemCode))) {
        if (!parentCodes.includes(row.ItemCode)) parentCodes.push(row.ItemCode);
        if (parentLineMap[row.ItemCode] === undefined) parentLineMap[row.ItemCode] = row.BOMLineNum;
      } else {
        finalRows.push(row);
      }
    }

    if (parentCodes.length) {
      finalRows.push(
        buildBomChildPicker(parentCodes, parentLineMap, {
          BOMEntry: pendingBOM.DocEntry,
          BOMDocNum: pendingBOM.DocNum,
          BOMType: pendingBOM.Object
        })
      );
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
    const overQty = lines.filter((r) => r.ItemCode && r.BOMAvailable != null && Number(r.Quantity) > Number(r.BOMAvailable));
    if (overQty.length) {
      setSnackbar({
        open: true,
        severity: 'error',
        message: `Requested qty exceeds available BOM qty: ${overQty
          .map((r) => `${r.ItemCode} (BOM line ${r.BOMLineNum}): requested ${r.Quantity}, available ${r.BOMAvailable}`)
          .join('; ')}`
      });
      return;
    }
    const payload = buildPayload(form, lines, user);
    dispatch(createMR(payload));
  };
const handleSubmitasDraft=()=>{
    const payload = {...buildPayload(form, lines, user),DocModule:"MaterialRequest",};
  dispatch(createDraft(payload));
}
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
            <MRGeneralTab data={form} setData={setForm} showRequisitionNo={false} />
          </Box>
          <Box sx={{ display: tabValue === 1 ? 'block' : 'none' }}>
            <MRContentTab data={form} setData={setForm} rows={lines} setRows={setLines} isBOM={isBOM} allowBomRowDelete />
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
              <Button variant="outlined" color="error" onClick={() => navigate('/material-request/list')}>
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
        openQtyMap={bomOpenMap}
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
