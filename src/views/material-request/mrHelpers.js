import { getChildItems } from '../../store/slices/itemSlice';

export const MR_STATUS_META = {
  D: { label: 'Pending', color: 'warning' },
  O: { label: 'Approved', color: 'success' },
  C: { label: 'Closed', color: 'default' },
  R: { label: 'Rejected', color: 'error' }
};

export const emptyRow = () => ({
  id: Date.now() + Math.random(),
  LineId: null,
  BOMLineNum: '',
  BOMEntry: '',
  BOMDocNum: '',
  BOMType: '',
  ItemCode: '',
  ItemDescription: '',
  FullDescription: '',
  Quantity: '',
  ApprovedQuantity: 0,
  UoMCode: '',
  BOMQty: '',
  BOMOpenQty: '',
  MROpenQty: '',
  WarehouseCode: '',
  ProjectCode: '',
  IssuedQty: '',
  InStock: '',
  RequiredDate: '',
  Remark: '',
  IsBOMRow: false,
  IsChildRow: false
});

export const buildChildRow = (parentRow) => ({
  ...emptyRow(),
  IsChildRow: true,
  BOMLineNum: parentRow.BOMLineNum ?? '',
  ParentItemCode: parentRow.ItemCode,
  ParentRowId: parentRow.id
});

export const withTrailingEmptyRow = (rows) => {
  const last = rows[rows.length - 1];
  const isComplete = last && !last.IsChildRow && String(last.ItemCode || '').trim() && String(last.Quantity || '').trim();
  return isComplete ? [...rows, emptyRow()] : rows;
};

export const withTrailingChildSlot = (rows, childRowId) => {
  const idx = rows.findIndex((r) => r.id === childRowId);
  if (idx === -1) return rows;
  const cur = rows[idx];
  if (!cur.IsChildRow) return rows;
  const next = rows[idx + 1];
  const slotExists = next && next.IsChildRow && next.ParentRowId === cur.ParentRowId && !String(next.ItemCode || '').trim();
  if (slotExists) return rows;
  const slot = buildChildRow({ id: cur.ParentRowId, ItemCode: cur.ParentItemCode, BOMLineNum: cur.BOMLineNum });
  return [...rows.slice(0, idx + 1), slot, ...rows.slice(idx + 1)];
};

export const buildBomChildPicker = (parentCodes, parentLineMap, bomMeta = {}) => ({
  ...emptyRow(),
  IsChildRow: true,
  IsBomChildPicker: true,
  BomParentCodes: parentCodes,
  BomParentLineMap: parentLineMap,
  BOMEntry: bomMeta.BOMEntry ?? '',
  BOMDocNum: bomMeta.BOMDocNum ?? '',
  BOMType: bomMeta.BOMType ?? ''
});

export const withTrailingBomChildPicker = (rows) => {
  const pickers = rows.filter((r) => r.IsBomChildPicker);
  if (!pickers.length) return rows;
  if (pickers.some((r) => !String(r.ItemCode || '').trim())) return rows;
  const last = pickers[pickers.length - 1];
  return [
    ...rows,
    buildBomChildPicker(last.BomParentCodes, last.BomParentLineMap, {
      BOMEntry: last.BOMEntry,
      BOMDocNum: last.BOMDocNum,
      BOMType: last.BOMType
    })
  ];
};

export const groupBomLinesWithChildren = (rows, itemMap) => {
  const bomRows = [];
  const childRows = [];
  const parentLineMap = {};
  const parentCodesSet = new Set();

  for (const r of rows) {
    const parentCode = itemMap[r.ItemCode]?.U_HLB_ParItm || '';
    if (parentCode) {
      parentCodesSet.add(parentCode);
      if (parentLineMap[parentCode] === undefined) parentLineMap[parentCode] = r.BOMLineNum ?? '';
      childRows.push(r);
    } else {
      bomRows.push({ ...r, IsBOMRow: true, IsChildRow: false });
    }
  }

  const parentCodes = [...parentCodesSet];
  const childPickerRows = childRows.map((r) => ({
    ...r,
    IsBOMRow: false,
    IsChildRow: true,
    IsBomChildPicker: true,
    BomParentCodes: parentCodes,
    BomParentLineMap: parentLineMap
  }));

  const result = [...bomRows, ...childPickerRows];
  if (parentCodes.length) {
    result.push(buildBomChildPicker(parentCodes, parentLineMap));
  }
  return result;
};

export const fetchHasChildren = async (dispatch, itemCode) => {
  try {
    const children = await dispatch(getChildItems(itemCode)).unwrap();
    return children.length > 0;
  } catch {
    return false;
  }
};

export const mapApiToForm = (mr) => ({
  RequisitionNo: mr.DocEntry ?? '',
  RequisitionDate: mr.U_DocDate?.split('T')[0] ?? '',
  RequisitionTime: mr.U_ReqTime?.slice(0, 5) ?? '',
  RequiredDate: mr.U_ReqDate?.split('T')[0] ?? '',
  CardCode: mr.U_CardCode ?? '',
  CardName: mr.U_CardName ?? '',
  ProjectCode: mr.U_PrjCode ?? '',
  ProjectName: mr.U_PrjDesc ?? '',
  BOMNo: mr.U_SQDocNum ?? '',
  BOMDocEntry: '',
  RequestorType: mr.U_ReqType === 'E' ? 'Employee' : 'User',
  ReqCode: mr.U_ReqCode ?? '',
  RequestorName: mr.U_ReqName ?? '',
  Department: mr.U_Dept != null ? String(mr.U_Dept) : '',
  DeptId: mr.U_Dept != null ? String(mr.U_Dept) : '',
  Remark: mr.U_Remark ?? '',
  PreparedBy: mr.U_PreparedBy ?? '',
  DocStatus: mr.U_DocStatus ?? '',
  AprRemark: mr.U_Apr_remark ?? ''
});

export const mapApiLineToRow = (line, index) => ({
  id: line.LineId ?? Date.now() + index,
  LineId: line.LineId ?? null,
  BOMLineNum: line.U_SQlineNum ?? '',
  ItemCode: line.U_ItmSerCode ?? '',
  ItemDescription: line.U_ItemDesc ?? '',
  FullDescription: line.U_SerDesc ?? '',
  Quantity: line.U_MRQty ?? line.U_ReqQty ?? '',
  ApprovedQuantity: line.U_ReqQty ?? '',
  UoMCode: line.U_UOM ?? '',
  BOMQty: line.U_BOMQty ?? '',
  BOMOpenQty: line.U_BOMOpenQty ?? '',
  MROpenQty: line.U_MROpenQty ?? '',
  WarehouseCode: line.U_Whs ?? '',
  ProjectCode: line.U_Project ?? '',
  IssuedQty: line.U_IssuedQty ?? '',
  InStock: line.U_InStock ?? '',
  RequiredDate: line.U_ReqDate?.split('T')[0] ?? '',
  Remark: line.U_HLB_Rmarks ?? ''
});

export const buildPayload = (form, lines, user, { useApprovedQty = false } = {}) => ({
  U_DocDate: form.RequisitionDate ? `${form.RequisitionDate}T00:00:00Z` : null,
  U_ReqDate: form.RequiredDate ? `${form.RequiredDate}T00:00:00Z` : null,
  U_ReqTime: form.RequisitionTime ? `${form.RequisitionTime}:00` : null,
  U_CardCode: form.CardCode,
  U_CardName: form.CardName,
  U_PrjCode: form.ProjectCode,
  U_PrjDesc: form.ProjectName,
  U_Remark: form.Remark,
  U_ReqType: form.RequestorType === 'Employee' ? 'E' : 'U',
  U_ReqCode: form.ReqCode,
  U_ReqName: form.RequestorName,
  U_Dept: form.DeptId ? Number(form.DeptId) : null,
  U_SQDocNum: form.BOMNo ? String(form.BOMNo) : null,
  U_OEM_UID: user?.id ?? null,
  U_OEM_UEMAIL: user?.email ?? null,
  U_OEM_UName: [user?.first_name, user?.last_name].filter(Boolean).join(' ') || null,
  U_PreparedBy: [user?.first_name, user?.last_name].filter(Boolean).join(' ') || null,
  HLB_MRQ1Collection: lines
    .filter((r) => String(r.ItemCode || '').trim() && String(r.Quantity || '').trim())
    .map((r) => {
      const requestedQty = Number(r.Quantity) || 0;
      const approvedQty = Number(r.ApprovedQuantity) || 0;
      return {
        ...(r.LineId != null ? { LineId: r.LineId } : {}),
        U_ItmSerCode: r.ItemCode,
        U_ItemDesc: r.ItemDescription,
        U_SerDesc: r.FullDescription,
        U_MRQty: requestedQty,
        U_ReqQty: useApprovedQty ? approvedQty : requestedQty,
        U_UOM: r.UoMCode,
        U_Project: r.ProjectCode,
        U_Whs: r.WarehouseCode,
        U_SQlineNum: r.BOMLineNum ? String(r.BOMLineNum) : null,
        U_BOMEntry: r.BOMEntry !== '' && r.BOMEntry != null ? Number(r.BOMEntry) : null,
        U_BOMNum: r.BOMDocNum !== '' && r.BOMDocNum != null ? Number(r.BOMDocNum) : null,
        U_BOMLine: r.BOMLineNum !== '' && r.BOMLineNum != null ? String(r.BOMLineNum) : null,
        U_BOMType: r.BOMType || null,
        U_BOMQty: Number(r.BOMQty) || 0,
        U_BOMOpenQty: Number(r.BOMOpenQty) || 0,
        U_MROpenQty: Number(r.MROpenQty) || 0,
        U_IssuedQty: Number(r.IssuedQty) || 0,
        U_InStock: Number(r.InStock) || 0,
        U_ReqDate: r.RequiredDate ? `${r.RequiredDate}T00:00:00Z` : null,
        U_HLB_Rmarks: r.Remark
      };
    })
});
