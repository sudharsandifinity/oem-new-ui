import { getItems } from '../../store/slices/itemSlice';
import { getTaxCodes } from '../../store/slices/taxCodeSlice';
import { getProjects } from '../../store/slices/projectSlice';
import { getWarehouses } from '../../store/slices/warehouseSlice';
import { getCustomers } from '../../store/slices/customerSlice';

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
            data: state.project.projects,
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
    }
};