

import React from 'react';
import {
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

const CustomerAdmin = () => {

  // Replace with Redux data
  const summary = {
    totalUsers: 125,
    activeUsers: 110,
    inactiveUsers: 15,
    totalRoles: 8
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
      title: 'Active Users',
      value: summary.activeUsers,
      icon: <ManageAccounts fontSize="large" />,
      color: '#2e7d32'
    },
    {
      title: 'Inactive Users',
      value: summary.inactiveUsers,
      icon: <Security fontSize="large" />,
      color: '#ef6c00'
    },
    {
      title: 'Roles',
      value: summary.totalRoles,
      icon: <AdminPanelSettings fontSize="large" />,
      color: '#6a1b9a'
    }
  ];

  return (
   <Box sx={{ p: 3 }}>

      {/* Header */}

      <Typography variant="h4" fontWeight={700}>
        Customer Admin Dashboard
      </Typography>

      <Typography
        color="text.secondary"
        sx={{ mb: 4 }}
      >
        Manage users and roles from one place.
      </Typography>

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
          >
            Add User
          </Button>

          <Button
            variant="contained"
            color="secondary"
            startIcon={<GroupAdd />}
          >
            Create Role
          </Button>

          <Button
            variant="outlined"
            startIcon={<People />}
          >
            User Management
          </Button>

          <Button
            variant="outlined"
            startIcon={<AdminPanelSettings />}
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

          <IconButton>
            <ArrowForward />
          </IconButton>

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

              {recentUsers.map((user) => (

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
                        {user.name.charAt(0)}
                      </Avatar>

                      <Typography>
                        {user.name}
                      </Typography>

                    </Stack>

                  </TableCell>

                  <TableCell>
                    {user.email}
                  </TableCell>

                  <TableCell>

                    <Chip
                      label={user.role}
                      color="primary"
                      size="small"
                    />

                  </TableCell>

                  <TableCell>

                    <Chip
                      label={user.status}
                      color={
                        user.status === 'Active'
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

export default CustomerAdmin