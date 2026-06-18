const today = new Date().toISOString().split('T')[0];

export const mapApiToForm = (grpo) => ({
  VendorCode: grpo.CardCode ?? '',
  VendorName: grpo.CardName ?? '',
  ContactPerson: grpo.ContactPersonCode ?? '',
  DocDate: grpo.DocDate?.split('T')[0] ?? today,
  DocDueDate: grpo.DocDueDate?.split('T')[0] ?? today,
  VendorRefNo: grpo.NumAtCard ?? '',
  PONumber: grpo.U_PONo ?? '',
  ProjectCode: grpo.U_PrjCode ?? '',
  ProjectName: grpo.U_PrjDesc ?? '',
  Comments: grpo.Comments ?? '',
  ReceivedBy: grpo.U_ReceivedBy ?? ''
});

export const mapApiLineToRow = (line, index) => ({
  id: line.LineNum ?? Date.now() + index,
  ItemCode: line.ItemCode ?? '',
  ItemDescription: line.ItemDescription ?? '',
  FullDescription: line.U_HLB_FullDesc ?? '',
  Quantity: line.Quantity ?? '',
  UoMEntry: line.UoMEntry ?? null,
  UoMCode: line.UoMCode ?? '',
  BaseEntry: line.BaseEntry ?? '',
  POQty: line.U_POQty ?? '',
  POOpenQty: line.U_POOpenQty ?? '',
  WarehouseCode: line.WarehouseCode ?? '',
  ProjectCode: line.ProjectCode ?? '',
  InStock: line.U_InStock ?? '',
  Remark: line.U_HLB_Rmarks ?? ''
});

export const poLineToGRPORow = (poLine, baseEntry = '') => ({
  id: Date.now() + Math.random(),
  ItemCode: poLine.ItemCode ?? '',
  ItemDescription: poLine.ItemDescription ?? '',
  FullDescription: poLine.U_HLB_FullDesc ?? '',
  Quantity: poLine.Quantity ?? '',
  UoMEntry: poLine.UoMEntry ?? null,
  UoMCode: poLine.UoMCode ?? '',
  BaseEntry: baseEntry,
  BaseLine: poLine.LineNum ?? 0,
  POQty: poLine.Quantity ?? '',
  POOpenQty: poLine.OpenQuantity ?? '',
  WarehouseCode: poLine.WarehouseCode ?? '',
  ProjectCode: poLine.ProjectCode ?? '',
  InStock: '',
  Remark: ''
});

export const buildGRPOFormData = (form, lines, attachments = [], user) => {
  const { DocumentLines, ...scalarFields } = buildGRPOPayload(form, lines, user);
  const fd = new FormData();
  Object.entries(scalarFields).forEach(([key, value]) => {
    if (value !== undefined && value !== null) fd.append(key, value);
  });
  fd.append('DocumentLines', JSON.stringify(DocumentLines));
  attachments.forEach((row) => {
    if (row.file) fd.append('Attachments2_Lines', row.file, row.fileName);
  });
  return fd;
};

export const buildGRPOPayload = (form, lines, user) => ({
  DocDate: form.DocDate ? `${form.DocDate}T00:00:00Z` : null,
  DocDueDate: form.DocDueDate ? `${form.DocDueDate}T00:00:00Z` : null,
  CardCode: form.VendorCode ?? '',
  CardName: form.VendorName ?? '',
  ContactPersonCode: form.ContactPerson ? Number(form.ContactPerson) : undefined,
  NumAtCard: form.VendorRefNo ?? '',
  Comments: form.Comments ?? '',
  U_PONo: form.PONumber ?? '',
  U_PrjCode: form.ProjectCode ?? '',
  U_PrjDesc: form.ProjectName ?? '',
  U_ReceivedBy: form.ReceivedBy ?? '',
  U_MRNo: null,
  U_OEM_UID: user?.id ?? null,
  U_OEM_UEMAIL: user?.email ?? null,
  DocumentLines: lines.map((line) => ({
    ItemCode: line.ItemCode,
    ItemDescription: line.ItemDescription,
    Quantity: line.Quantity !== '' && line.Quantity != null ? Number(line.Quantity) : undefined,
    WarehouseCode: line.WarehouseCode,
    UoMEntry: line.UoMEntry ?? null,
    UoMCode: line.UoMCode,
    BaseType: line.BaseEntry ? 22 : undefined,
    BaseEntry: line.BaseEntry || undefined,
    BaseLine: line.BaseLine ?? undefined,
    ProjectCode: line.ProjectCode || undefined,
    U_HLB_FullDesc: line.FullDescription,
    U_HLB_Rmarks: line.Remark
  }))
});
