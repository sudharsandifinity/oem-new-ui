import { useDispatch, useSelector } from 'react-redux';
import React, { Fragment } from "react";
import {
  Box,
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemText,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography, Divider,
  CircularProgress
} from '@mui/material';
import {
  Chip,
  LinearProgress,
} from '@mui/material';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, FunnelChart, Funnel, LabelList, PieChart, Pie, Cell, } from "recharts";
import { useEffect, useMemo, useState } from 'react';
import { CartesianGrid, Tooltip, Legend } from 'recharts';
import { getPRList } from '../../../store/slices/purchaseRequestSlice';
import { getPurchaseQuotations } from '../../../store/slices/purchaseQuotationSlice';
import { getSalesOrders } from '../../../store/slices/salesOrderSlice';
import {getSalesQuotations} from '../../../store/slices/salesQuotationSlice'


const COLORS = ['#4caf50', '#ff9800'];

export default function Dashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const fullName = [user?.first_name, user?.last_name].filter(Boolean).join(' ') || 'there';
  const { loading, error, orders ,totalCount:salesordercount} = useSelector((state) => state.salesOrder);
  const { quotationlist, totalCount:salesquotationcount, listLoading } = useSelector((s) => s.salesQuotation);
  const { list, totalCount:prCount } = useSelector((s) => s.purchaseRequest);
  const { orders: purchaseQuoatationList,
    error: purchaseQuoatationError,
    loading: purchaseQuotationLoading,
    totalCount: purchaseQuotationCount
  } = useSelector(
      (state) => state.PurchaseQuotation
    );
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 25 });

const [dashboardLoading, setDashboardLoading] = useState(true);

useEffect(() => {
  if (!user?.email) return;

  const loadDashboard = async () => {
    try {
      setDashboardLoading(true);

      await Promise.all([
        dispatch(getSalesOrders()).unwrap(),
        dispatch(
          getSalesQuotations({
            page: paginationModel.page + 1,
            limit: paginationModel.pageSize,
          })
        ).unwrap(),
        dispatch(
          getPRList({
            top: paginationModel.pageSize,
            skip: paginationModel.page * paginationModel.pageSize,
            email: user.email,
          })
        ).unwrap(),
        dispatch(getPurchaseQuotations()).unwrap(),
      ]);
    } catch (err) {
      console.error("Dashboard load failed:", err);
    } finally {
      setDashboardLoading(false);
    }
  };

  loadDashboard();
}, [dispatch, user?.email]);



  const stats = [
  {
    title: "Sales Orders",
    value: dashboardLoading ? "..." : salesordercount || 0,
    color: "#1976d2",
  },
  {
    title: "Sales Quotations",
    value: dashboardLoading ? "..." : salesquotationcount || 0,
    color: "#fb8c00",
  },
  {
    title: "Purchase Requests",
    value: dashboardLoading ? "..." : prCount || 0,
    color: "#43a047",
  },
  {
    title: "Purchase Quotations",
    value: dashboardLoading ? "..." : purchaseQuotationCount || 0,
    color: "#e53935",
  },
];
  const recentRequests = [{
    id: 'MR-1001', type: 'Sales Order',
    requester: 'Warehouse', status: 'Pending'
  },
  { id: 'PR-2001', type: 'Purchase Request', requester: 'Production', status: 'Approved' },
  { id: 'GRPO-3001', type: 'Purchase Quotation', requester: 'Supplier Receipt', status: 'Posted' },];
  //
  const completion = 62;
  const progressData = [{ stage: "MR", qty: 1000, },
  { stage: "PO", qty: 850, }, { stage: "GRPO", qty: 620, },];
  const materialConsumption = [{ material: "Concrete", consumed: 650, },
  { material: "Sand", consumed: 420, }, { material: "Steel", consumed: 310, },
  { material: "Blocks", consumed: 180, },];
  const funnelData = [{ value: 450, name: "MR", }, { value: 380, name: "PR", },
  { value: 350, name: "PO", }, { value: 290, name: "GRPO", },];
  const pendingMR = [{ docNum: 104, project: "CIV 731", requester: "AL Avon", days: 2, },
  { docNum: 105, project: "CIV 180", requester: "Sudharsan", days: 1, },];
  const pieData = [{ name: "Received", value: 18200 }, { name: "Balance", value: 6800 },];
  const COLORS = ["#1976d2", "#ff9800"];


  return (
    <>
{console.log("salesordercount",salesordercount,salesquotationcount,prCount,purchaseQuotationCount)}
      <Box sx={{ p: 3, color: 'bg-blue-500', minHeight: '90vh' }}>
        <Typography variant="h4" fontWeight={700}>
          SAP Procurement Dashboard
        </Typography>

        <Typography color="text.secondary" mb={4}>
         Sales Order, Sales Quotation, Purchase Request and Purchase Quotatioin Overview
        </Typography>

        {/* KPI Cards */}
        <Grid container spacing={3} mb={3}>
          {stats.map((item) => (
            <Grid item xs={12} sm={6} md={3} key={item.title}>
              <Card sx={{ borderRadius: 4 }}>
                <CardContent>
                  <Box
                    sx={{
                      width: 14,
                      height: 14,
                      bgcolor: item.color,
                      borderRadius: '50%',
                      mb: 2
                    }}
                  />

                  <Typography color="text.secondary">
                    {item.title}
                  </Typography>

                 <Typography variant="h4" fontWeight={700}>
  {dashboardLoading ? <CircularProgress size={25} /> : item.value}
</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Progress */}

        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 4 }}>
              <CardContent>

                <Typography variant="h6" mb={3}>
                  Process Flow Status
                </Typography>

                <Box mb={3}>
                  <Box display="flex" justifyContent="space-between">
                    <Typography>Sales Order</Typography>
                    <Typography>75%</Typography>
                  </Box>

                  <LinearProgress
                    variant="determinate"
                    value={75}
                    sx={{ height: 10, borderRadius: 5 }}
                  />
                </Box>

                <Box mb={3}>
                  <Box display="flex" justifyContent="space-between">
                    <Typography>Purchase Request</Typography>
                    <Typography>60%</Typography>
                  </Box>

                  <LinearProgress
                    color="warning"
                    variant="determinate"
                    value={60}
                    sx={{ height: 10, borderRadius: 5 }}
                  />
                </Box>

                <Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography>Sales Quotation Completion</Typography>
                    <Typography>90%</Typography>
                  </Box>

                  <LinearProgress
                    color="success"
                    variant="determinate"
                    value={90}
                    sx={{ height: 10, borderRadius: 5 }}
                  />
                </Box>

              </CardContent>
            </Card>
          </Grid>


          <Grid item xs={12} md={6} direction="row">
            <Card sx={{ borderRadius: 4 }}>
              <CardContent>

                <Typography variant="h6" mb={3}>
                  Approval Summary
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <Paper
                      sx={{
                        bgcolor: '#fff8e1',
                        textAlign: 'center',
                        p: 3,
                        borderRadius: 3
                      }}
                    >
                      <Typography variant="h4">17</Typography>
                      <Typography>Pending</Typography>
                    </Paper>
                  </Grid>

                  <Grid item xs={4}>
                    <Paper
                      sx={{
                        bgcolor: '#e8f5e9',
                        textAlign: 'center',
                        p: 3,
                        borderRadius: 3
                      }}
                    >
                      <Typography variant="h4">52</Typography>
                      <Typography>Approved</Typography>
                    </Paper>
                  </Grid>

                  <Grid item xs={4}>
                    <Paper
                      sx={{
                        bgcolor: '#ffebee',
                        textAlign: 'center',
                        p: 3,
                        borderRadius: 3
                      }}
                    >
                      <Typography variant="h4">5</Typography>
                      <Typography>Rejected</Typography>
                    </Paper>
                  </Grid>
                </Grid>

              </CardContent>
            </Card>
            {/*<Grid container spacing={3}>
              <Grid container spacing={3} mt={1}> <Grid item xs={12} lg={8}>
                <Card sx={{
                  height: "100%",
                  borderRadius: 3,
                  boxShadow: 2,
                }}>
                  <CardContent>
                    <Typography variant="h6" mb={3}> MR → PO → GRPO Progress </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={progressData}> <XAxis dataKey="stage" /> <YAxis /> <Tooltip />
                        <Bar dataKey="qty" fill="#1976d2" /> </BarChart> </ResponsiveContainer>
                    <Typography mt={2}> Overall Completion : {completion}% </Typography>
                    <LinearProgress variant="determinate" value={completion} sx={{ mt: 1, height: 10, borderRadius: 2 }} />
                  </CardContent>
                </Card>
              </Grid>
                <Grid item xs={12} lg={4}>
                  <Card sx={{
                    height: "100%",
                    borderRadius: 3,
                    boxShadow: 2,
                  }}>
                    <CardContent>
                      <Typography variant="h6"> Quantity Balance </Typography>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie data={pieData} dataKey="value" outerRadius={100} label > {pieData.map((entry, index) => (<Cell key={index} fill={COLORS[index]} />))} </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
              <Grid container spacing={3} mt={1}> <Grid item xs={12} lg={6}>
                <Card sx={{
                  height: "100%",
                  borderRadius: 3,
                  boxShadow: 2,
                }}> <CardContent> <Typography variant="h6" mb={2}> Procurement Funnel </Typography>
                    <ResponsiveContainer width="100%" height={300}> <FunnelChart> <Tooltip />
                      <Funnel dataKey="value" data={funnelData} isAnimationActive > <LabelList position="right" fill="#000" stroke="none" dataKey="name" /> </Funnel>
                    </FunnelChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>
                <Grid item xs={12} lg={6}>
                  <Card sx={{
                    height: "100%",
                    borderRadius: 3,
                    boxShadow: 2,
                  }}>
                    <CardContent>
                      <Typography variant="h6" mb={2}> Material Consumption </Typography>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={materialConsumption}> <XAxis dataKey="material" /> <YAxis />
                          <Tooltip /> <Bar dataKey="consumed" fill="#2e7d32" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Grid>*/}
          </Grid>
        </Grid>


        <Card sx={{ borderRadius: 4 }}>
          <CardContent>

            <Typography variant="h6" mb={2}>
              Recent Transactions
            </Typography>

            <TableContainer>

              <Table>

                <TableHead>
                  <TableRow>
                    <TableCell>Document No</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Requester</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>

                  {recentRequests.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{row.id}</TableCell>
                      <TableCell>{row.type}</TableCell>
                      <TableCell>{row.requester}</TableCell>

                      <TableCell>
                        <Chip
                          label={row.status}
                          color={
                            row.status === 'Pending'
                              ? 'warning'
                              : row.status === 'Approved'
                                ? 'success'
                                : 'primary'
                          }
                        />
                      </TableCell>

                    </TableRow>
                  ))}

                </TableBody>

              </Table>

            </TableContainer>

          </CardContent>
        </Card>

        {/* Progress section */}


      </Box>
    </>
  );
}
