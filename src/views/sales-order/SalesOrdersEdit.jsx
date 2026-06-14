import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { getSalesOrderById, updateSalesOrder, resetSalesOrderState } from '../../store/slices/salesOrderSlice';

import {
  Alert,
  Box,
  Breadcrumbs,
  Button,
  CircularProgress,
  Divider,
  Snackbar,
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

const mapApiRowToInternal = (row, index) => ({
  id: row.LineNum ?? index + 1,
  ItemCode: row.ItemCode || '',
  ItemDescription: row.ItemDescription || '',
  Quantity: row.Quantity?.toString() || '',
  UnitPrice: row.UnitPrice?.toString() || '',
  DiscountPercent: row.DiscountPercent?.toString() || '',
  LineTotal: row.LineTotal?.toString() || '',
  VatGroup: row.VatGroup || '',
  TaxPercentagePerRow: row.TaxPercentagePerRow?.toString() || '',
  TaxTotal: row.TaxTotal?.toString() || '',
  GrossTotal: row.GrossTotal?.toString() || '',
  ProjectCode: row.ProjectCode || '',
  WarehouseCode: row.WarehouseCode || '',
  UoMCode: row.UoMCode || '',
  UoMEntry: row.UoMEntry ?? '',
  UoMName: row.UoMCode || '',
  AvailableUOMs: row.UoMCode
    ? [{ AbsEntry: row.UoMEntry, Code: row.UoMCode, Name: row.UoMCode }]
    : [],
  dimension1: row.CostingCode || '',
  dimension2: row.CostingCode2 || '',
  dimension3: row.CostingCode3 || '',
  dimension4: row.CostingCode4 || '',
  dimension5: row.CostingCode5 || ''
});

const emptyRow = () => ({
  id: Date.now(),
  ItemCode: '', ItemDescription: '', Quantity: '', UnitPrice: '',
  DiscountPercent: '', LineTotal: '', VatGroup: '', TaxPercentagePerRow: '',
  TaxTotal: '', GrossTotal: '', ProjectCode: '', WarehouseCode: '',
  UoMCode: '', UoMName: '', AvailableUOMs: [],
  dimension1: '', dimension2: '', dimension3: '', dimension4: '', dimension5: ''
});

export default function SalesOrdersEdit() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, saveSuccess, currentOrder } = useSelector((state) => state.salesOrder);

  const [tabValue, setTabValue] = useState(0);
  const [salesOrder, setSalesOrder] = useState(null);
  const [documentLines, setDocumentLines] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, severity: 'success', message: '' });
  const hasSeeded = useRef(false);

  useEffect(() => {
    hasSeeded.current = false;
    dispatch(resetSalesOrderState());
    if (id) dispatch(getSalesOrderById(id));
    return () => { dispatch(resetSalesOrderState()); };
  }, [dispatch, id]);

  useEffect(() => {
    if (!currentOrder || hasSeeded.current) return;
    hasSeeded.current = true;
    setSalesOrder({
      CardCode: currentOrder.CardCode || '',
      CardName: currentOrder.CardName || '',
      ContactPerson: currentOrder.ContactPerson || '',
      NumAtCard: currentOrder.NumAtCard || '',
      DocDate: currentOrder.DocDate?.split('T')[0] || '',
      DocDueDate: currentOrder.DocDueDate?.split('T')[0] || '',
      TaxDate: currentOrder.TaxDate?.split('T')[0] || '',
      DocType: currentOrder.DocType || 'dDocument_Items',
      DocCurrency: currentOrder.DocCurrency || '',
      Comments: currentOrder.Comments || '',
      SalesPersonCode: currentOrder.SalesPersonCode || '',
      ContactPersonCode: currentOrder.ContactPersonCode || '',
      DiscountPercent: currentOrder.DiscountPercent ?? 0,
      Rounding: currentOrder.Rounding === 'tYES',
      RoundingDiffAmount: currentOrder.RoundingDiffAmount ?? 0,
      DocumentAdditionalExpenses: currentOrder.DocumentAdditionalExpenses || [],
      Attachments2_Lines: [{ id: 1, file: null, fileName: '' }]
    });
    setDocumentLines([
      ...(currentOrder.DocumentLines || []).map(mapApiRowToInternal),
      emptyRow()
    ]);
  }, [currentOrder]);

  useEffect(() => {
    if (saveSuccess) {
      navigate(`/sales-orders/view/${id}`);
    }
    if (error) setSnackbar({ open: true, severity: 'error', message: error });
  }, [saveSuccess, error]);

  const handleSubmit = async () => {
    const payload = {
      DocType: salesOrder.DocType,
      CardCode: salesOrder.CardCode,
      CardName: salesOrder.CardName,
      NumAtCard: salesOrder.NumAtCard,
      DocDate: salesOrder.DocDate,
      DocDueDate: salesOrder.DocDueDate,
      DocCurrency: salesOrder.DocCurrency,
      Comments: salesOrder.Comments,
      SalesPersonCode: salesOrder.SalesPersonCode,
      ContactPersonCode: salesOrder.ContactPersonCode,
      RequriedDate: salesOrder.DocDueDate,
      DiscountPercent: Number(salesOrder.DiscountPercent),
      Rounding: salesOrder.Rounding ? 'tYES' : 'tNO',
      DocumentLines: documentLines
        .filter(row => row.ItemCode && Number(row.Quantity) > 0)
        .map((row, index) => ({
          LineNum: index,
          ItemCode: row.ItemCode,
          UoMCode: row.UoMCode,
          UoMEntry: row.UoMEntry ?? '',
          ItemDescription: row.ItemDescription,
          Quantity: Number(row.Quantity),
          UnitPrice: Number(row.UnitPrice),
          DiscountPercent: Number(row.DiscountPercent),
          WarehouseCode: row.WarehouseCode || null,
          ProjectCode: row.ProjectCode || null,
          VatGroup: row.VatGroup || null
        })),
      DocumentAdditionalExpenses: (salesOrder.DocumentAdditionalExpenses || []).map(exp => ({
        ExpenseCode: Number(exp.freightCode ?? exp.ExpenseCode),
        Remarks: exp.remark ?? exp.Remarks ?? '',
        VatGroup: exp.taxGroup ?? exp.VatGroup ?? null,
        LineTotal: Number(exp.amount ?? exp.LineTotal ?? 0)
      }))
    };

    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (key === 'DocumentLines' || key === 'DocumentAdditionalExpenses') {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value ?? '');
      }
    });

    (salesOrder.Attachments2_Lines || []).forEach((attachment) => {
      if (attachment.file) formData.append('Attachments2_Lines', attachment.file);
    });

    dispatch(updateSalesOrder({ docEntry: id, formData }));
  };

  if (loading && !salesOrder) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!salesOrder) return null;

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
            <Typography variant="body2" color="secondary" fontWeight={600}>Edit</Typography>
          </Breadcrumbs>
        </Box>
      </MainCard>

      {/* CONTENT */}
      <MainCard content={false}>
        <Box sx={{ px: 3, pt: 2 }}>
          <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)}>
            <Tab label="General" />
            <Tab label="Content" />
            <Tab label="Attachments" />
          </Tabs>
        </Box>

        <Box sx={{ p: 3 }}>
          {tabValue === 0 && (
            <GeneralTab data={salesOrder} setData={setSalesOrder} />
          )}
          {tabValue === 1 && (
            <ContentTab
              data={salesOrder}
              setData={setSalesOrder}
              rows={documentLines}
              setRows={setDocumentLines}
              disableRounding
            />
          )}
          {tabValue === 2 && (
            <AttachmentTab data={salesOrder} setData={setSalesOrder} />
          )}

          <Divider sx={{ my: 4 }} />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button variant="outlined" onClick={() => navigate(-1)}>Cancel</Button>
            <Button variant="contained" color="secondary" onClick={handleSubmit} disabled={loading}>
              {loading ? 'Saving...' : 'Update'}
            </Button>
          </Box>
        </Box>
      </MainCard>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert severity={snackbar.severity} variant="standard" onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
