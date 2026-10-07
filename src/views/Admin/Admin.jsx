

import React, { useEffect } from 'react';
import {
  alpha,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';

import {
  People,
  AdminPanelSettings,
  PersonAdd,
  GroupAdd,
  ManageAccounts,
  Security,
  ArrowForward
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { getusers } from '../../store/slices/userSlice';
import { getroles } from '../../store/slices/roleSlice';
import { getcompanies } from '../../store/slices/companySlice';
import { getadminmenus } from '../../store/slices/MenuSlice';
import { useNavigate } from 'react-router';

const Admin = () => {
 const { user } = useSelector((s) => s.auth);
  const fullName = [user?.first_name, user?.last_name].filter(Boolean).join(' ') || 'there';
 

  const { adminusers,totalCount,loading } = useSelector((state) => state.users);
  const { roles, saveSuccess, error } = useSelector((state) => state.roles);
  const { menus } = useSelector((state) => state.menus);

  const { companies } = useSelector((state) => state.companies);
  const dispatch = useDispatch();
  const navigate=useNavigate();

  useEffect(() => {
    dispatch(getusers());
     dispatch(getroles());
        dispatch(getcompanies());
            dispatch(getadminmenus());
        
  }, [dispatch]);
  // Replace with Redux data
  const summary = {
    totalUsers: totalCount,
    totalRoles: roles.length,
    TotalCompanies: companies.length,
    totalMenus: menus.length
  };

  const recentUsers = [
    {
      id: 1,
      name: 'John Smith',
      email: 'john@test.com',
      role: 'Administrator',
      status: 'Active'
    },
    {
      id: 2,
      name: 'David Miller',
      email: 'david@test.com',
      role: 'Manager',
      status: 'Active'
    },
    {
      id: 3,
      name: 'Sarah Wilson',
      email: 'sarah@test.com',
      role: 'Employee',
      status: 'Inactive'
    },
    {
      id: 4,
      name: 'James Brown',
      email: 'james@test.com',
      role: 'Employee',
      status: 'Active'
    },
    {
      id: 5,
      name: 'Lisa Taylor',
      email: 'lisa@test.com',
      role: 'Manager',
      status: 'Active'
    }
  ];

  const cards = [
    {
      title: 'Total Users',
      value: summary.totalUsers,
      icon: <People fontSize="large" />,
      color: '#1976d2'
    },
    {
      title: 'Active Roles',
      value: summary.totalRoles,
      icon: <ManageAccounts fontSize="large" />,
      color: '#2e7d32'
    },
    {
      title: 'Total Companies',
      value: summary.TotalCompanies,
      icon: <GroupAdd fontSize="large" />,
      color: '#ef6c00'
    },
    {
      title: 'Total Menus',
      value: summary.totalMenus,
      icon: <AdminPanelSettings fontSize="large" />,
      color: '#6a1b9a'
    }
  ];
       const initials = fullName ? fullName.split(' ').map(n => n[0]).join('').toUpperCase() : '';
const greeting = fullName ? `Good morning, ${fullName.split(' ')[0]}!` : 'Good morning!';
const today = new Date().toLocaleDateString();

  return (
    <Box sx={{ p: 3 }}>

      {/* Header */}

      <Paper
              elevation={0}
              sx={{
                p: { xs: 3, md: 4 },
                mb: 4,
                borderRadius: 3,
                position: 'relative',
                overflow: 'hidden',
                border: '1px solid',
                borderColor: 'divider',
                borderLeft: (t) => `6px solid ${t.palette.primary.main}`,
                boxShadow: (t) => `0 6px 20px ${alpha(t.palette.primary.main, 0.12)}`,
                bgcolor: 'background.default'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, flexWrap: 'wrap' }}>
                <Avatar sx={{ width: 60, height: 60, bgcolor: 'primary.main', color: '#fff', fontWeight: 700, fontSize: 22 }}>{initials}</Avatar>
                <Box sx={{ flex: 1, minWidth: 220 }}>
                  <Typography variant="h2" sx={{ fontWeight: 700, lineHeight: 1.15 }}>
                    {greeting}, {fullName}!
                  </Typography>
                  <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                    {today} &nbsp;·&nbsp; Here&apos;s what needs your attention.
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                  <Button label="Pending" value={loading ? null : '26'} color="primary" />
      
                </Box>
              </Box>
            </Paper>

      {/* Summary Cards */}

      <Grid container spacing={3} mb={4}>

        {cards.map((card) => (

          <Grid item xs={12} sm={6} lg={3} key={card.title}>

            <Card
              elevation={2}
              sx={{
                borderRadius: 3,
                transition: '.3s',
                '&:hover': {
                  transform: 'translateY(-4px)'
                }
              }}
            >
              <CardContent>

                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >

                  <Box>

                    <Typography
                      color="text.secondary"
                      variant="body2"
                    >
                      {card.title}
                    </Typography>

                    <Typography
                      variant="h4"
                      fontWeight={700}
                      mt={1}
                    >
                      {card.value}
                    </Typography>

                  </Box>

                  <Avatar
                    sx={{
                      bgcolor: card.color,
                      width: 58,
                      height: 58
                    }}
                  >
                    {card.icon}
                  </Avatar>

                </Stack>

              </CardContent>

            </Card>

          </Grid>

        ))}

      </Grid>

      {/* Quick Actions */}

      <Paper
        elevation={2}
        sx={{
          p: 3,
          borderRadius: 3,
          mb: 4
        }}
      >

        <Typography
          variant="h6"
          fontWeight={600}
          mb={3}
        >
          Quick Actions
        </Typography>

        <Stack
          direction={{
            xs: 'column',
            sm: 'row'
          }}
          spacing={2}
        >

          <Button
            variant="contained"
            startIcon={<PersonAdd />}
            onClick={() => navigate('/User/create')}
          >
            Add User
          </Button>

          <Button
            variant="contained"
            color="secondary"
            startIcon={<GroupAdd />}
             onClick={() => navigate('/Roles/create')}
          >
            Create Role
          </Button>

          <Button
            variant="outlined"
            startIcon={<People />}
            onClick={() => navigate('/Users/list')}
          >
            User Management
          </Button>

          <Button
            variant="outlined"
            startIcon={<AdminPanelSettings />}
               onClick={() => navigate('/Roles/list')}
          >
            Role Management
          </Button>

        </Stack>

      </Paper>

      {/* Recent Users */}

      <Paper
        elevation={2}
        sx={{
          borderRadius: 3
        }}
      >

        <Box
          sx={{
            p: 2.5,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >

          <Typography
            variant="h6"
            fontWeight={600}
          >
            Recently Added Users
          </Typography>

          {/* <IconButton>
            <ArrowForward />
          </IconButton> */}

        </Box>

        <Divider />

        <TableContainer>

          <Table>

            <TableHead>

              <TableRow>

                <TableCell>Name</TableCell>

                <TableCell>Email</TableCell>

                <TableCell>Role</TableCell>

                <TableCell>Status</TableCell>

              </TableRow>

            </TableHead>

            <TableBody>
              {console.log("adminusers", adminusers)}
              {[...adminusers]
                .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
                .slice(0, 5)
                .map((user) => (

                  <TableRow
                    hover
                    key={user.id}
                  >

                    <TableCell>

                      <Stack
                        direction="row"
                        spacing={2}
                        alignItems="center"
                      >

                        <Avatar>
                          {user.first_name.charAt(0)}
                        </Avatar>

                        <Typography>
                          {user.first_name} {user.last_name}
                        </Typography>

                      </Stack>

                    </TableCell>

                    <TableCell>
                      {user.email}
                    </TableCell>

                    <TableCell>

                      <Chip
                        label={user.Roles.map((role) => role.name).join(', ')}
                        color="primary"
                        size="small"
                      />

                    </TableCell>

                    <TableCell>

                      <Chip
                        label={user.status == '1' ? 'Active' : 'Inactive'}
                        color={
                          user.status == '1'
                            ? 'success'
                            : 'error'
                        }
                        size="small"
                      />

                    </TableCell>

                  </TableRow>

                ))}

            </TableBody>

          </Table>

        </TableContainer>

      </Paper>

    </Box>
  )
}


export default Admin