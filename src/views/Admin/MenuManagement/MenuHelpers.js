export const mapApiToForm = (menuData,company,menu,form) => ({
  
    id: menuData.id,
    name: menuData.name || '',
    display_name: menuData.display_name || '',
    scope: menuData.scope || '',
    status: menuData.status,
    order_number: menuData.order_number ?? false,

    // Company
    companyId: menuData.companyId || [],
    companyNames: company?.filter(c => String(menuData.companyId)===String(c.id))?.map(c => c.name).join(', ') || '',

    // Role
    menuId: menuData.parentUserMenuId,
    MenuNames: menu?.filter(m => String(menuData.parentUserMenuId)===String(m.id))?.map((m) => m.name).join(', ') || '',

    // Project
    formId: menuData.formId,
    formNames: form?.filter(f => String(menuData.formId)===String(f.id))?.map((p) => p.Name).join(', ') || ''
});


export const buildPayload = (form) => ({
    name: form.name || '',
    display_name: form.display_name || '',
    scope: form.scope || '',
    status: form.status,
    order_number: form.order_number ?? false,
    companyId: form.companyId ||'',
    parentUserMenuId: form.MenuId || '',
    formId: form.FormId ||'',
});
export const updatebuildPayload = (form) => ({
id: form.id,
    name: form.name || '',
    display_name: form.display_name || '',
    scope: form.scope || '',
    status: form.status,
    order_number: form.order_number ?? false,
    companyId: form.companyId || [],
    parentUserMenuId: form.parentUserMenuId || [],
    formId: form.formId || [],
});