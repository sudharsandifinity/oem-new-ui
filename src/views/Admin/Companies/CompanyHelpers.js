export const mapApiToForm = (userData) => ({

    id: userData.id,
    name: userData.name || '',
    company_db_name: userData.company_db_name || '',
    company_code: userData.company_code || '',
    base_url: userData.base_url,
    sap_username: userData.sap_username ?? false,
    secret_key:userData.secret_key||'',
    status:userData.status,

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

export const buildPayload = (form) => ({
 name: form.name,
  company_db_name: form.company_db_name,
  company_code: form.company_code,
  base_url: form.base_url,
  sap_username: form.sap_username,
  secret_key: form.secret_key,
  status: form.status,
});
export const updatebuildPayload = (form) => ({
 name: form.name,
  company_db_name: form.company_db_name,
  company_code: form.company_code,
  base_url: form.base_url,
  sap_username: form.sap_username,
  secret_key: form.secret_key,
  status: form.status,
});

