import { Link } from 'react-router-dom';

import useMediaQuery from '@mui/material/useMediaQuery';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project imports
import AuthWrapper1 from './AuthWrapper1';
import AuthCardWrapper from './AuthCardWrapper';

import Logo from '../../../assets/images/logo.png';
import AuthFooter from 'ui-component/cards/AuthFooter';
import AuthLogin from '../auth-forms/AuthLogin';

import bgImage from '../../../assets/images/3.jpg';

// ================================|| AUTH3 - LOGIN ||================================ //

export default function Login() {
  const downMD = useMediaQuery((theme) => theme.breakpoints.down('md'));

  return (
    <AuthWrapper1>
      <Stack
        sx={{
          justifyContent: 'flex-end',
          minHeight: '100vh',
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <Stack sx={{ justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 68px)' }}>
          <Box sx={{ m: { xs: 1, sm: 3 }, mb: 0 }}>
            <AuthCardWrapper sx={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
              <Stack sx={{ alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                <Box sx={{ mb: 3 }}>
                  <Link to="#" aria-label="logo">
                    <img src={Logo} alt="logo" height="76" />
                  </Link>
                </Box>
                <Stack sx={{ alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                  <Typography variant={downMD ? 'h3' : 'h2'}>Hi, Welcome Back</Typography>
                  <Typography variant="caption" sx={{ fontSize: '16px', textAlign: { xs: 'center', md: 'inherit' } }}>
                    Enter your credentials to continue
                  </Typography>
                </Stack>
                <Box sx={{ width: 1 }}>
                  <AuthLogin />
                </Box>
                {/* <Divider sx={{ width: 1 }} />
                <Stack sx={{ alignItems: 'center' }}>
                  <Typography component={Link} to="/pages/register" variant="subtitle1" sx={{ textDecoration: 'none' }}>
                    Don&apos;t have an account?
                  </Typography>
                </Stack> */}
              </Stack>
            </AuthCardWrapper>
          </Box>
        </Stack>
        <Box sx={{ px: 3, my: 3 }}>
          <AuthFooter />
        </Box>
      </Stack>
    </AuthWrapper1>
  );
}
