import { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { Alert, Box, Breadcrumbs, Button, CircularProgress, Divider, Snackbar, Tab, Tabs, Typography } from '@mui/material';

import HomeIcon from '@mui/icons-material/Home';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

import MainCard from 'ui-component/cards/MainCard';
import { resetCustomerState } from '../../../store/slices/customerSlice';
import { createAdminRoles, resetAdminRoleState } from '../../../store/slices/cusAdminroleSlice';
import RoleForm from './RoleForm';
import { buildPayload } from './RMHelpers';

const today = new Date().toISOString().split('T')[0];
const nowTime = new Date().toTimeString().slice(0, 5);

const initialForm = () => ({
  RequisitionNo: '',
  RequisitionDate: today,
  RequisitionTime: nowTime,
  RequiredDate: today,
  CardCode: '',
  CardName: '',
  ProjectCode: '',
  ProjectName: '',
  BOMNo: '',
  BOMDocEntry: '',
  RequestorType: 'Role',
  ReqCode: '',
  RequestorName: '',
  Department: '',
  DeptId: '',
  Remark: ''
});



export default function RoleManagementCreate() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
    const {  roleloading,rolesaveSuccess,roleerror,createroleLoading } = useSelector((s) => s.cusAdminrole); 
  

  const [tabValue, setTabValue] = useState(0);
  const [form, setForm] = useState(initialForm());

  const [snackbar, setSnackbar] = useState({ open: false, severity: 'success', message: '' });



  useEffect(() => {
    if (rolesaveSuccess) {
      setSnackbar({ open: true, severity: 'success', message: 'Role created successfully!' });
      dispatch(resetAdminRoleState());
      setTimeout(() => navigate('/RoleManagement/list'), 1500);
    }
    if (roleerror) {
      setSnackbar({ open: true, severity: 'error', message: roleerror });
      dispatch(resetAdminRoleState());
    }
  }, [rolesaveSuccess, roleerror, dispatch, navigate]);





  const handleSubmit = () => {
    const payload =buildPayload(form);
    console.log("payload",payload,form)
    dispatch(createAdminRoles(payload));
  };

  return (
    <Box>
      {/* HEADER */}
      <MainCard content={false} sx={{ mb: 3 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', md: 'center' },
            flexDirection: { xs: 'column', md: 'row' },
            px: 3,
            py: 1.5,
            gap: 2
          }}
        >
          <Typography variant="h4">Role Management</Typography>
          <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <HomeIcon sx={{ fontSize: 18, color: 'secondary.main' }} />
            </Box>
            <Typography variant="body2" color="text.primary">
              Role Management 
            </Typography>
            <Typography variant="body2" color="secondary" fontWeight={600}>
              Create
            </Typography>
          </Breadcrumbs>
        </Box>
      </MainCard>

      {/* CONTENT */}
      <MainCard content={false}>
        

        <Box sx={{ p: 3 }}>
          {/* Always mounted — CSS show/hide avoids unmount errors on tab switch */}
          <Box sx={{ display: tabValue === 0 ? 'block' : 'none' }}>
                     <RoleForm data={form} setData={setForm} />
         
          </Box>
       

          <Divider sx={{ my: 4 }} />

          {/* Footer */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button variant="outlined" color="error" onClick={() => navigate('/RoleManagement/list')}>
                Cancel
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleSubmit}
                disabled={createroleLoading}
                startIcon={createroleLoading ? <CircularProgress size={16} color="inherit" /> : null}
              >
                Submit
              </Button>
            </Box>
          </Box>
        </Box>
      </MainCard>

     

      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => setSnackbar((p) => ({ ...p, open: false }))}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar((p) => ({ ...p, open: false }))}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}