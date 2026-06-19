import { getChildItems } from '../../store/slices/itemSlice';

export const emptyRow = () => ({
  id: Date.now() + Math.random(),
  LineId: null,
  BOMLineNum: '',
  ItemCode: '',
  ItemDescription: '',
  FullDescription: '',
  Quantity: '',
  UoMCode: '',
  BOMQty: '',
  BOMOpenQty: '',
  MROpenQty: '',
  WarehouseCode: '',
  ProjectCode: '',
  IssuedQty: '',
  InStock: '',
  Remark: ''
});

export const buildChildRow = (parentRow) => ({
  ...emptyRow(),
  IsChildRow: true,
  ParentItemCode: parentRow.ItemCode,
  ParentRowId: parentRow.id
});

export const fetchHasChildren = async (dispatch, itemCode) => {
  try {
    const children = await dispatch(getChildItems(itemCode)).unwrap();
    return children.length > 0;
  } catch {
    return false;
  }
};

export const mapApiToForm = (mr) => ({
  RequisitionNo: mr.DocNum ?? mr.DocEntry ?? '',
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
  Remark: mr.U_Remark ?? ''
});

export const mapApiLineToRow = (line, index) => ({
  id: line.LineId ?? Date.now() + index,
  LineId: line.LineId ?? null,
  BOMLineNum: line.U_SQlineNum ?? '',
  ItemCode: line.U_ItmSerCode ?? '',
  ItemDescription: line.U_ItemDesc ?? '',
  FullDescription: line.U_SerDesc ?? '',
  Quantity: line.U_ReqQty ?? '',
  UoMCode: line.U_UOM ?? '',
  BOMQty: line.U_BOMQty ?? '',
  BOMOpenQty: line.U_BOMOpenQty ?? '',
  MROpenQty: line.U_MROpenQty ?? '',
  WarehouseCode: line.U_Whs ?? '',
  ProjectCode: line.U_Project ?? '',
  IssuedQty: line.U_IssuedQty ?? '',
  InStock: line.U_InStock ?? '',
  Remark: line.U_HLB_Rmarks ?? ''
});

export const buildPayload = (form, lines, user) => ({
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
  HLB_MRQ1Collection: lines.map((r) => ({
    ...(r.LineId != null ? { LineId: r.LineId } : {}),
    U_ItmSerCode: r.ItemCode,
    U_ItemDesc: r.ItemDescription,
    U_SerDesc: r.FullDescription,
    U_ReqQty: Number(r.Quantity) || 0,
    U_UOM: r.UoMCode,
    U_Project: r.ProjectCode,
    U_Whs: r.WarehouseCode,
    U_SQlineNum: r.BOMLineNum ? String(r.BOMLineNum) : null,
    U_BOMQty: Number(r.BOMQty) || 0,
    U_BOMOpenQty: Number(r.BOMOpenQty) || 0,
    U_MROpenQty: Number(r.MROpenQty) || 0,
    U_IssuedQty: Number(r.IssuedQty) || 0,
    U_InStock: Number(r.InStock) || 0,
    U_HLB_Rmarks: r.Remark
  }))
});
