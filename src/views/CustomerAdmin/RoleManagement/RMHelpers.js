export const mapApiToForm = (userData, companies = []) => {
  console.log("companies",companies,userData)
  const company = companies.find(
    (c) => c.id === userData.companyId
  );

  return {
    id: userData.id,
    name: userData.name,

    companyId: userData.companyId,
    companyNames: company?.name || '',

    userMenuIds: userData.UserMenus?.filter(UM=>UM.parentUserMenuId!=="").map((menu) => menu.id) || [],
    menuNames: userData.UserMenus?.filter(UM=>UM.parentUserMenuId!=="").map((menu) => menu.name).join(', ') || '',

    status: userData.status===1?"1":"0"
  };
};

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

// export const buildPayload = (form) => ({
//  name: form.name,
//   companyId: form.companyId,
//    userMenuIds: form.userMenuIds?.map((id) =>
//      ({
//     menuId:id
//   })),
//   status: form.status,
 
// });
export const buildPayload = (form) => {
  const uniqueMenuIds = [
    ...(form.userMenuIds || []),
    ...(form.parentIds || []),
  ].filter((id, index, arr) => id && arr.indexOf(id) === index);

  return {
    name: form.name,
    companyId: form.companyId,
    userMenuIds: uniqueMenuIds.map((id) => ({
      menuId: id,
    })),
    status: form.status==="1"?1:0,
  };
};