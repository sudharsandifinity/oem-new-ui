const today = new Date().toISOString().split('T')[0];

export const mapApiToForm = (grpo) => ({
  VendorCode: grpo.CardCode ?? '',
  VendorName: grpo.CardName ?? '',
  ContactPerson: grpo.ContactPersonCode ?? '',
  DocDate: grpo.DocDate?.split('T')[0] ?? today,
  ProjectCode: grpo.U_PrjCode ?? '',
  ProjectName: grpo.U_PrjDesc ?? '',
  Comments: grpo.Comments ?? ''
});

export const mapApiLineToRow = (line, index) => ({
  id: line.LineNum ?? Date.now() + index,
  POLineNum: line.U_POLineNum ?? '',
  ItemCode: line.ItemCode ?? '',
  ItemDescription: line.ItemDescription ?? '',
  FullDescription: line.U_HLB_FullDesc ?? '',
  Quantity: line.Quantity ?? '',
  UoMEntry: line.UoMEntry ?? null,
  UoMCode: line.UoMCode ?? '',
  POQty: line.U_POQty ?? '',
  POOpenQty: line.U_POOpenQty ?? '',
  WarehouseCode: line.WarehouseCode ?? '',
  ProjectCode: line.ProjectCode ?? '',
  IssuedQty: line.U_IssuedQty ?? '',
  InStock: line.U_InStock ?? '',
  Remark: line.U_HLB_Rmarks ?? ''
});

export const poLineToGRPORow = (poLine) => ({
  id: Date.now() + Math.random(),
  POLineNum: poLine.LineNum ?? '',
  ItemCode: poLine.ItemCode ?? '',
  ItemDescription: poLine.ItemDescription ?? '',
  FullDescription: poLine.U_HLB_FullDesc ?? '',
  Quantity: poLine.Quantity ?? '',
  UoMEntry: poLine.UoMEntry ?? null,
  UoMCode: poLine.UoMCode ?? '',
  POQty: poLine.Quantity ?? '',
  POOpenQty: poLine.OpenQuantity ?? '',
  WarehouseCode: poLine.WarehouseCode ?? '',
  ProjectCode: poLine.ProjectCode ?? '',
  IssuedQty: '',
  InStock: '',
  Remark: ''
});

export const buildGRPOPayload = (form, lines) => ({
  DocDate: form.DocDate ? `${form.DocDate}T00:00:00Z` : null,
  CardCode: form.VendorCode ?? '',
  CardName: form.VendorName ?? '',
  Comments: form.Comments ?? '',
  U_MRNo: null,
  U_OEM_UID: null,
  U_PrjCode: form.ProjectCode ?? '',
  U_PrjDesc: form.ProjectName ?? '',
  U_OEM_UEMAIL: null,
  DocumentLines: lines.map((line) => ({
    ItemCode: line.ItemCode,
    ItemDescription: line.ItemDescription,
    WarehouseCode: line.WarehouseCode,
    UoMEntry: line.UoMEntry ?? null,
    UoMCode: line.UoMCode,
    U_MRDocEntry: null,
    U_MRLine: null,
    U_HLB_FullDesc: line.FullDescription,
    U_HLB_Rmarks: line.Remark
  }))
});
