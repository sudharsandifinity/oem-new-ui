import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { RouterProvider } from 'react-router-dom';

// routing
import router from 'routes';

// project imports
import NavigationScroll from 'layout/NavigationScroll';

import ThemeCustomization from 'themes';
import { LookupProvider } from './context/LookupContext';
import LookupProviderRenderer from './components/lookukp/LookupProviderRenderer';
import { sessionExpired } from './store/slices/authSlice';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

// auth provider

// ==============================|| APP ||============================== //

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const handleSessionExpired = () => dispatch(sessionExpired());
    window.addEventListener('session-expired', handleSessionExpired);
    return () => window.removeEventListener('session-expired', handleSessionExpired);
  }, [dispatch]);

  return (
    <ThemeCustomization>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <NavigationScroll>
          <LookupProvider>
            <RouterProvider router={router} />
            <LookupProviderRenderer />
          </LookupProvider>
        </NavigationScroll>
      </LocalizationProvider>
    </ThemeCustomization>
  );
}
