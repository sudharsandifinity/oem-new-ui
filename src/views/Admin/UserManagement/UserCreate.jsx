import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { mapApiToForm, mapApiLineToRow, buildPayload, updatebuildPayload } from './UserHelpers';

import { Alert, Box, Breadcrumbs, Button, CircularProgress, Divider, Skeleton, Snackbar, Tab, Tabs, Typography } from '@mui/material';

import HomeIcon from '@mui/icons-material/Home';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import RefreshIcon from '@mui/icons-material/Refresh';

import MainCard from 'ui-component/cards/MainCard';
import UserForm from './UserForm';
import { createUser, resetUserState } from '../../../store/slices/userSlice';


function ContentSkeleton() {
  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 4 }}>
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} variant="rounded" height={40} />
          ))}
        </Box>
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} variant="rounded" height={40} />
          ))}
        </Box>
      </Box>
      <Skeleton variant="rounded" height={180} sx={{ mt: 4 }} />
    </Box>
  );
}

export default function UserCreate() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

    const { currentUser, currentUserloading, currentUserError, updateLoading, saveSuccess, error } = useSelector((s) => s.users);
  const { companies, listLoading } = useSelector((state) => state.companies);
  


  const [tabValue, setTabValue] = useState(0);
  const [form, setForm] = useState(null);
  const [lines, setLines] = useState([]);
  const [prModalOpen, setPrModalOpen] = useState(false);
  const [stockLoading, setStockLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, severity: 'success', message: '' });



  useEffect(() => {
    if (saveSuccess) {
      setSnackbar({ open: true, severity: 'success', message: 'User updated successfully!' });
      dispatch(resetUserState());
      setTimeout(() => navigate(`/User/list`), 1500);
    }
    if (error) {
      setSnackbar({ open: true, severity: 'error', message: error });
      dispatch(resetUserState());
    }
  }, [saveSuccess, error, dispatch, navigate]);

 

  const handleSubmit = () => {
    console.log("handlesubmit", form,buildPayload(form))
    dispatch(createUser( buildPayload(form) ));
  };



  const loading = currentUser || !form;

  return (
    <Box>
      {/* HEADER — always visible */}
      <MainCard content={false} sx={{ mb: 3 }}>
        <Box
          sx={{
            px: 3,
            py: 1.5,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', md: 'center' },
            flexDirection: { xs: 'column', md: 'row' },
            gap: 2
          }}
        >
          <Typography variant="h4">User management </Typography>
          <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
            <Box sx={{ display: 'flex', alignItems: 'center' }} onClick={() => navigate('/')}>
              <HomeIcon sx={{ fontSize: 18, color: 'secondary.main', cursor: 'pointer'  }} />
            </Box>
            <Typography variant="body2" color="text.primary">
              User Management 
            </Typography>
            <Typography variant="body2" color="secondary" fontWeight={600}>
              Edit
            </Typography>
          </Breadcrumbs>
        </Box>
      </MainCard>

      {/* CONTENT */}
      <MainCard content={false}>
       
{console.log("formedit",form)}
        <Box sx={{ p: 3 }}>
          {currentUserError ? (
            <Box sx={{ py: 6, textAlign: 'center' }}>
              <Typography color="error" variant="h5">
                Failed to load User Management 
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 1 }}>
                {currentUserError}
              </Typography>
            </Box>
          ) : updateLoading ? (
            <ContentSkeleton />
          ) : (
            <>
              {/* Always mounted — CSS show/hide avoids unmount errors on tab switch */}
              <Box sx={{ display: tabValue === 0 ? 'block' : 'none' }}>
                <UserForm data={form} setData={setForm}  />
              </Box>
             
            </>
          )}

          <Divider sx={{ my: 4 }} />

          {/* Footer — always visible */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button variant="outlined" color="error" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleSubmit}
                disabled={loading || updateLoading}
                startIcon={updateLoading ? <CircularProgress size={16} color="inherit" /> : null}
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
