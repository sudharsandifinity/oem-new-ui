const today = new Date().toISOString().split('T')[0];

export const mapApiToForm = (pr) => ({
  MRNo: pr.U_MRNo ?? '',
  MRDocEntry: pr.U_MRNo ?? null,
  ProjectCode: pr.U_PrjCode ?? '',
  ProjectName: pr.U_PrjDesc ?? '',
  DocDate: pr.DocDate?.split('T')[0] ?? today,
  RequiredDate: pr.RequriedDate?.split('T')[0] ?? '',
  ReqCode: pr.ReqCode ?? '',
  ReqType: pr.ReqType ?? null,
  RequestorTypeLabel: pr.ReqType === 'E' ? 'Employee' : pr.ReqType === 'U' ? 'User' : '',
  RequestorName: pr.RequesterName ?? '',
  Department: pr.U_Dept != null ? String(pr.U_Dept) : '',
  Comments: pr.Comments ?? ''
});

export const mapApiLineToRow = (line, index) => ({
  id: line.LineNum ?? Date.now() + index,
  MRLine: line.U_MRLine ?? '',
  ItemCode: line.ItemCode ?? '',
  ItemDescription: line.ItemDescription ?? '',
  FullDescription: line.U_HLB_FullDesc ?? '',
  Quantity: line.Quantity ?? '',
  UoMCode: line.UoMCode ?? '',
  BOMQty: '',
  BOMOpenQty: '',
  MROpenQty: '',
  PROpenQty: '',
  WarehouseCode: line.WarehouseCode ?? '',
  ProjectCode: line.ProjectCode ?? '',
  RequiredDate: line.RequiredDate?.split('T')[0] ?? '',
  Remark: line.U_HLB_Rmarks ?? ''
});

export const mrLineToPRRow = (mrLine) => ({
  id: Date.now() + Math.random(),
  MRLine: mrLine.LineId ?? mrLine.id ?? '',
  ItemCode: mrLine.ItemCode ?? '',
  ItemDescription: mrLine.ItemDescription ?? '',
  FullDescription: mrLine.FullDescription ?? '',
  Quantity: mrLine.Quantity ?? '',
  UoMCode: mrLine.UoMCode ?? '',
  BOMQty: mrLine.BOMQty ?? '',
  BOMOpenQty: mrLine.BOMOpenQty ?? '',
  MROpenQty: mrLine.MROpenQty ?? '',
  PROpenQty: '',
  WarehouseCode: mrLine.WarehouseCode ?? '',
  ProjectCode: mrLine.ProjectCode ?? '',
  RequiredDate: '',
  Remark: mrLine.Remark ?? ''
});

export const buildPRPayload = (form, lines) => ({
  DocDate: form.DocDate ? `${form.DocDate}T00:00:00Z` : null,
  RequriedDate: form.RequiredDate ? `${form.RequiredDate}T00:00:00Z` : null,
  Comments: form.Comments ?? '',
  ReqType: form.RequestorTypeLabel === 'User' ? 12 : form.RequestorTypeLabel === 'Employee' ? 171 : null,
  ReqCode: form.ReqCode ?? '',
  RequesterName: form.RequestorName ?? '',
  RequesterDepartment: form.Department ? Number(form.Department) : null,
  SendNotification: 'tNO',
  U_MRNo: form.MRNo ? Number(form.MRNo) : null,
  U_OEM_UID: null,
  U_PrjCode: form.ProjectCode ?? '',
  U_PrjDesc: form.ProjectName ?? '',
  U_OEM_UEMAIL: null,
  DocumentLines: lines.map((line) => ({
    ItemCode: line.ItemCode,
    ItemDescription: line.ItemDescription,
    U_HLB_FullDesc: line.FullDescription,
    Quantity: Number(line.Quantity) || 0,
    ProjectCode: line.ProjectCode,
    WarehouseCode: line.WarehouseCode,
    UoMCode: line.UoMCode,
    U_MRDocEntry: form.MRDocEntry ? Number(form.MRDocEntry) : null,
    U_MRLine: line.MRLine !== '' && line.MRLine != null ? Number(line.MRLine) : null,
    RequiredDate: line.RequiredDate ? `${line.RequiredDate}T00:00:00Z` : null,
    U_HLB_Rmarks: line.Remark
  }))
});
