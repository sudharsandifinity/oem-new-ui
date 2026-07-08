import {
  Box,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Switch,
  TextField
} from '@mui/material';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import { useLookup } from '../../../context/LookupContext';
import { useEffect, useMemo, useState } from 'react';
import styled from '@emotion/styled';
import { DataGrid } from '@mui/x-data-grid';
import Checkbox from '@mui/material/Checkbox';
import { getadminmenus } from '../../../store/slices/MenuSlice';
import { useDispatch, useSelector } from 'react-redux';
import { MaterialReactTable } from 'material-react-table';

const today = new Date().toISOString().split('T')[0];
const nowTime = new Date().toTimeString().slice(0, 5);
const Android12Switch = styled(Switch)(({ theme }) => ({
  padding: 8,
  '& .MuiSwitch-track': {
    borderRadius: 22 / 2,
    '&::before, &::after': {
      content: '""',
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      width: 16,
      height: 16
    },
    '&::before': {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main)
      )}" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
      left: 12
    },
    '&::after': {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main)
      )}" d="M19,13H5V11H19V13Z" /></svg>')`,
      right: 12
    }
  },
  '& .MuiSwitch-thumb': {
    boxShadow: 'none',
    width: 16,
    height: 16,
    margin: 2
  }
}));
const modules = [
  {
    id: 1,
    module: 'User',
    can_list: false,
    can_view: false,
    can_create: false,
    can_edit: false,
    can_delete: false
  },
  {
    id: 2,
    module: 'Role',
    can_list: false,
    can_view: false,
    can_create: false,
    can_edit: false,
    can_delete: false
  }
];

export default function RoleForm({ data, setData,rows, setRows, readOnly = false, lockCompanyPassword = false }) {
  const dispatch = useDispatch();
  const { openLookup } = useLookup();
  const isDisabled = readOnly;
  const [is_super_company, setIs_super_company] = useState('0');
  const [is_com_admin, setIs_com_admin] = useState('0');
  const { menus, listLoading } = useSelector((state) => state.menus);
  useEffect(() => {
    dispatch(getadminmenus());
  }, [dispatch]);

  const menuListData = useMemo(() => {
    const list = [];
    (data?.companyId !== ""
      ? menus.filter((m) => m.companyId === String(data?.companyId))
      : menus
    ).forEach((menu) => {
      list.push({
        Module: menu.name,
        id: menu.id,
        isParent: true,
        can_list: false,
        can_view: false,
        can_create: false,
        can_edit: false,
        can_delete: false
      });

      (menu.children || [])   .filter((child) => !data?.companyId || child.companyId === String(data?.companyId)).forEach((child) => {
        list.push({
          Module: child.name,
          id: child.id,
          parentId: menu.id,
          isParent: false,
          can_list: false,
          can_view: false,
          can_create: false,
          can_edit: false,
          can_delete: false
        });
      });
    });

    return list;
  }, [menus,data]);
useEffect(() => {
  setRows(menuListData);
}, [menuListData]);

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5
  });

  const handleChange = (field, value) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const idDisabled = readOnly;
  const passwordDisabled = readOnly || lockCompanyPassword;

  const handleOpenUserMenuLookup = () => {
    openLookup({
      type: 'UserMenuproject',
      multiSelect: true,
      selectedIds: data.userMenuIds || [],

      onSelect: (menu) => {
        const menus = Array.isArray(menu) ? menu : [menu];
        console.log('Selected menus', menus);
        const uniqueMenus = Array.from(new Map(menus.map((item) => [item.id, item])).values());

        setData((prev) => ({
          ...prev,
          userMenuIds: uniqueMenus.map((p) => p.id),
          menuNames: uniqueMenus.map((p) => p.name).join(', '),
          parentIds: [...new Set(uniqueMenus.map((p) => p.parentId).filter(Boolean))],
          parentNames: [...new Set(uniqueMenus.map((p) => p.parentname).filter(Boolean))].join(', ')
        }));
      }
    });
  };
  const handleOpenCompanyLookup = () => {
    openLookup({
      type: 'admincompany',
      //multiSelect: true,
      onSelect: (company) => {
        const project = Array.isArray(company) ? company : [company];
        console.log('Selected company', company);
        setData((prev) => ({
          ...prev,
          //projects: projects,
          companyId: company.id,
          companyNames: company.name
        }));
      }
    });
  };

  const handleOpenRoleLookup = () => {
    openLookup({
      type: 'role',
      multiSelect: true,
      selectedIds: data.roleIds || [],
      onSelect: (role) => {
        const roles = Array.isArray(role) ? role : [role];
        console.log('Selected Roles', roles);
        setData((prev) => ({
          ...prev,
          //roles: role,
          roleIds: roles?.map((r) => r.id),
          roleNames: roles?.map((r) => r.name).join(', ')
        }));
      }
    });
  };

  const handleOpenProjectLookup = () => { 
    openLookup({
      type: 'cusadminproject',
      multiSelect: true,
      selectedIds: data.projectIds || [],

      onSelect: (projects) => {
        const project = Array.isArray(projects) ? projects : [projects];
        console.log('Selected projects', projects);
        setData((prev) => ({
          ...prev,
          //projects: projects,
          projectIds: project.map((p) => p.id),
          projectNames: project.map((p) => p.Name).join(', ')
        }));
      }
    });
  };

  const handlePermissionChange = (id, field, value) => {
    console.log("handlepermission",id,field,value)
    
    setRows((prev) => {
      const updatedRows = prev.map((row) =>
        row.id === id
          ? {
              ...row,
              [field]: value
            }
          : row
      );

      const currentRow = updatedRows.find((r) => r.id === id);

      // Child List checkbox selected
      if (!currentRow.isParent && field === 'can_list') {
        updatedRows.forEach((row) => {
          if (row.id === currentRow.parentId) {
            row.can_list = value;
          }
        });

        // Optional: Uncheck parent if no child is selected
        if (!value) {
          const hasCheckedChild = updatedRows.some((r) => r.parentId === currentRow.parentId && r.can_list);

          if (!hasCheckedChild) {
            updatedRows.forEach((row) => {
              if (row.id === currentRow.parentId) {
                row.can_list = false;
              }
            });
          }
        }
      }

      return [...updatedRows];
    });
    
  };
  useEffect(() => {
  if (!menuListData.length) return;
  const updatedRows = menuListData.map((row) => {
    const permission = data?.permissions?.find(
      (m) => m.id === String(row.id)
    );
console.log("permission",permission,row.id)
    return {
      ...row,
      can_list: permission?.RoleMenu?.can_list_view ?? false,
      can_view: permission?.RoleMenu?.can_view ?? false,
      can_create: permission?.RoleMenu?.can_create ?? false,
      can_edit: permission?.RoleMenu?.can_edit ?? false,
      can_delete: permission?.RoleMenu?.can_delete ?? false
    };
  });
console.log("updatedRows",updatedRows)
  setRows(updatedRows);
  
}, [menuListData, data?.permissions]);
  const columns = [
    {
      accessorKey: 'Module',
      header: 'Module',
      width: 400
    },
    {
      accessorKey: 'can_list',
      header: 'List',
      width: 200,
      Cell: ({ cell }) => (
        <Checkbox
          disabled={isDisabled}

          checked={cell.row.original.can_list}
          onChange={(e) => handlePermissionChange(cell.row.original.id, 'can_list', e.target.checked)}
        />
      )
    },
    {
      accessorKey: 'can_view',
      header: 'View',
      width: 200,
      Cell: ({ cell }) => (
        <Checkbox
          disabled={cell.row.original.isParent||isDisabled}
          checked={cell.row.original.can_view}
          onChange={(e) => handlePermissionChange(cell.row.original.id, 'can_view', e.target.checked)}
        />
      )
    },
    {
      accessorKey: 'can_create',
      header: 'Create',
      width: 200,
      Cell: ({ cell }) => (
        <Checkbox
          disabled={cell.row.original.isParent||isDisabled}
          checked={cell.row.original.can_create}
          onChange={(e) => handlePermissionChange(cell.row.original.id, 'can_create', e.target.checked)}
        />
      )
    },
    {
      accessorKey: 'can_edit',
      header: 'Edit',
      width: 200,
      Cell: ({ cell }) => (
        <Checkbox
          disabled={cell.row.original.isParent||isDisabled}
          checked={cell.row.original.can_edit}
          onChange={(e) => handlePermissionChange(cell.row.original.id, 'can_edit', e.target.checked)}
        />
      )
    },
    {
      accessorKey: 'can_delete',
      header: 'Delete',
      width: 200,
      Cell: ({ cell }) => (
        <Checkbox
          disabled={cell.row.original.isParent||isDisabled}
          checked={cell.row.original.can_delete}
          onChange={(e) => handlePermissionChange(cell.row.original.id, 'can_delete', e.target.checked)}
        />
      )
    }
  ];
  return (
    <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }} flexDirection="column">
      {console.log('selectedrowsrows', rows)}
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          alignItems: 'center',
          flexWrap: 'nowrap'
        }}
      >
        <TextField
          fullWidth
          label="Name"
          value={data?.name || ''}
          disabled={isDisabled}
          onChange={(e) => setData((prev) => ({ ...prev, name: e.target.value }))}
        />

        <TextField
          fullWidth
          label="Company"
          value={data?.companyNames || ''}
          disabled={isDisabled}
          InputProps={{
            readOnly: true,
            endAdornment: (
              <InputAdornment position="end">
                <IconButton disabled={isDisabled} onClick={!isDisabled ? handleOpenCompanyLookup : undefined}>
                  <PersonSearchIcon />
                </IconButton>
              </InputAdornment>
            )
          }}
        />

        <FormControl fullWidth disabled={readOnly}>
          <InputLabel>Status</InputLabel>
          <Select label="Status" value={data?.status || '1'} onChange={(e) => setData((prev) => ({ ...prev, status: e.target.value }))}>
            <MenuItem value="1">Active</MenuItem>
            <MenuItem value="0">Inactive</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Paper variant="outlined" sx={{ flex: 1, minHeight: 0, width: '100%', borderRadius: 2, overflow: 'hidden' }}>
        <MaterialReactTable
          data={rows}
          columns={columns}
          state={{ pagination }}
          onPaginationChange={setPagination}
          enableColumnResizing={true}
          autoResetPageIndex={false}
          layoutMode={'grid'}
          defaultColumn={{
            minSize: 80,
            size: 150,
            maxSize: 500
          }}
          loading={listLoading}
          muiTableHeadCellProps={{
            sx: {
              fontWeight: 'bold',
              // color: '#eef2f6',
              background: '#e7e7e7',
              //borderBottom: '1px solid #bdbdbd',
              //borderRight: '1px solid #d0d0d0', // Vertical separator
              '&:last-child': {
                borderRight: 'none'
              }
            }
          }}
          muiTableBodyRowProps={{ sx: { '&:hover': { backgroundColor: '#f3e5f5' } } }}
          muiTableBodyCellProps={{ sx: { borderColor: '#f1f1f1' } }}
          muiBottomToolbarProps={{ sx: { borderTop: '1px solid #e0e0e0', backgroundColor: '#fafafa' } }}
        />
      </Paper>
    </Box>
  );
}
