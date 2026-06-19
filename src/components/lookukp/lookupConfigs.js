import { getItems } from '../../store/slices/itemSlice';
import { getTaxCodes } from '../../store/slices/taxCodeSlice';
import { getProjects } from '../../store/slices/projectSlice';
import { getWarehouses } from '../../store/slices/warehouseSlice';
import { getCustomers } from '../../store/slices/customerSlice';
import { getadminCompanies, getmenus } from '../../store/slices/commonCustomerSlice';
import { getadminRoles } from '../../store/slices/roleSlice';


export const LOOKUP_CONFIGS = {
  item: {
    title: 'Item Selection',

    selector: (state) => ({
      data: state.item.items,
      loading: state.item.loading,
      error: state.item.error
    }),

    loadAction: getItems,

    filters: [
      {
        key: 'itemCode',
        label: 'Item Code',
        dataKey: 'ItemCode'
      },
      {
        key: 'itemName',
        label: 'Item Name',
        dataKey: 'ItemName'
      }
    ],

    columns: [
      {
        field: 'ItemCode',
        label: 'Item Code'
      },
      {
        field: 'ItemName',
        label: 'Item Name'
      }
    ]
  },

  tax: {
    title: 'Tax Selection',

    selector: (state) => ({
      data: state.taxCode.taxCodes,
      loading: state.taxCode.loading,
      error: state.taxCode.error
    }),

    loadAction: getTaxCodes,

    filters: [
      {
        key: 'taxCode',
        label: 'Tax Code',
        dataKey: 'Code'
      },
      {
        key: 'taxName',
        label: 'Tax Name',
        dataKey: 'Name'
      }
    ],

    columns: [
      {
        field: 'Code',
        label: 'Code'
      },
      {
        field: 'Name',
        label: 'Name'
      }
    ]
  },

  customer: {
    title: 'Customer Selection',

    selector: (state) => ({
      data: state.customer.customers,
      loading: state.customer.loading,
      error: state.customer.error
    }),

    loadAction: getCustomers,

    filters: [
      {
        key: 'code',
        label: 'Customer Code',
        dataKey: 'CardCode'
      },
      {
        key: 'name',
        label: 'Customer Name',
        dataKey: 'CardName'
      },
      {
        key: 'contact',
        label: 'Contact Person',
        dataKey: 'ContactPerson'
      }
    ],

    columns: [
      {
        field: 'CardCode',
        label: 'Code'
      },
      {
        field: 'CardName',
        label: 'Name'
      },
      {
        field: 'ContactPerson',
        label: 'Contact Person'
      }
    ]
  },

  project: {
    title: 'Project Selection',

    selector: (state) => ({
      data: state.project.projects.map((pr) => ({
        id: pr.Code,
        Active: pr.Active,
        Code: pr.Code,
        Name: pr.Name,
        ValidFrom: pr.ValidFrom
      })),

      loading: state.project.loading,
      error: state.project.error
    }),

    loadAction: getProjects,

    filters: [
      {
        key: 'projectCode',
        label: 'Project Code',
        dataKey: 'Code'
      },
      {
        key: 'projectName',
        label: 'Project Name',
        dataKey: 'Name'
      }
    ],

    columns: [
      {
        field: 'Code',
        label: 'Code'
      },
      {
        field: 'Name',
        label: 'Name'
      }
    ]
  },
  cusadminproject: {
  title: 'Project Selection',

  selector: (state) => ({
    data:
      state.auth.user?.Projects?.map((pr) => ({
        id: pr.id,
        Active: pr.Active,
        Code: pr.Code,
        Name: pr.Name,
        ValidFrom: pr.ValidFrom
      })) || [],

    loading: false,
    error: null
  }),

  loadAction: null,

  filters: [
    {
      key: 'projectCode',
      label: 'Project Code',
      dataKey: 'Code'
    },
    {
      key: 'projectName',
      label: 'Project Name',
      dataKey: 'Name'
    }
  ],

  columns: [
    {
      field: 'Code',
      label: 'Code'
    },
    {
      field: 'Name',
      label: 'Name'
    }
  ]
},
  warehouse: {
    title: 'Warehouse Selection',

    selector: (state) => ({
      data: state.warehouse.warehouses,
      loading: state.warehouse.loading,
      error: state.warehouse.error
    }),

    loadAction: getWarehouses,

    filters: [
      {
        key: 'warehouseCode',
        label: 'Warehouse Code',
        dataKey: 'WhsCode'
      },
      {
        key: 'warehouseName',
        label: 'Warehouse Name',
        dataKey: 'WhsName'
      }
    ],

    columns: [
      {
        field: 'WarehouseCode',
        label: 'Code'
      },
      {
        field: 'WarehouseName',
        label: 'Name'
      }
    ]
  },
  UOM: {
    title: 'UOM Selection',

    selector: (state) => ({
      data: state.item.items?.flatMap((item) => item?.OEM?.UOM || []),
      loading: state.item.loading,
      error: state.item.error
    }),

    loadAction: getItems,

    filters: [
      {
        key: 'Code',
        label: ' Code',
        dataKey: 'Code'
      },
      {
        key: 'Name',
        label: ' Name',
        dataKey: 'Name'
      }
    ],

    columns: [
      {
        field: 'Code',
        label: 'Code'
      },
      {
        field: 'Name',
        label: 'Name'
      }
    ]
  },
  company: {
    title: 'Company Selection',

    selector: (state) => ({
      data: state.commonCustomer.companies,
      loading: state.commonCustomer.companyLoading,
      error: state.commonCustomer.error
    }),

    loadAction: getadminCompanies,

    filters: [
      {
        key: 'company_code',
        label: ' Company Code',
        dataKey: 'company_code'
      },
      {
        key: 'name',
        label: ' Name',
        dataKey: 'name'
      }
    ],

    columns: [
      {
        field: 'company_code',
        label: 'Company code'
      },
      {
        field: 'name',
        label: 'Name'
      }
    ]
  },
  role: {
    title: 'Role Selection',

    selector: (state) => ({
      data: state.role.roles,
      loading: state.role.roleloading,
      error: state.role.roleerror
    }),

    loadAction: getadminRoles,

    filters: [
      {
        key: 'status',
        label: 'Status',
        dataKey: 'status'
      },
      {
        key: 'name',
        label: ' Name',
        dataKey: 'name'
      }
    ],

    columns: [
      {
        field: 'status',
        label: 'Status'
      },
      {
        field: 'name',
        label: 'Name'
      }
    ]
  },
  UserMenuproject: {
  title: 'Menu Selection',

  selector: (state) => ({
    data: [
      ...(state.commonCustomer.menus || []).map((menu) => ({
        id: menu.id,
        name: menu.name,
        status: menu.status
      })),

      ...(state.commonCustomer.menus || []).flatMap(
        (menu) =>
          (menu.children || []).map((child) => ({
            id: child.id,
            name: `${child.name}`,
            status: child.status
          }))
      )
    ],

    loading: state.commonCustomer.menuLoading,
    error: state.commonCustomer.menuError
  }),

  loadAction: getmenus,

  filters: [
    {
      key: 'status',
      label: 'Status',
      dataKey: 'status'
    },
    {
      key: 'name',
      label: 'Name',
      dataKey: 'name'
    }
  ],

  columns: [
    {
      field: 'status',
      label: 'Status'
    },
    {
      field: 'name',
      label: 'Name'
    }
  ]
}
};
