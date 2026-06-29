import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { PieChart, Pie, Cell } from 'recharts';
import { getMyMRList } from '../../../store/slices/materialRequestSlice';
import { getMyGRPOList } from '../../../store/slices/goodsReceiptPOSlice';


const COLORS = ['#4caf50', '#ff9800'];

export default function Dashboard() {
    const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const fullName = [user?.first_name, user?.last_name].filter(Boolean).join(' ') || 'there';
   const { list, totalCount, listLoading } = useSelector((s) => s.materialRequest);
    
   
     
     const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 25 });
 
 useEffect(() => {
    dispatch(
      getMyMRList({
        top: paginationModel.pageSize,
        skip: paginationModel.page * paginationModel.pageSize,
        email: user?.email || ''
      })
    );
    dispatch(
        getMyGRPOList({
          top: paginationModel.pageSize,
          skip: paginationModel.page * paginationModel.pageSize,
          email: user?.email || ''
        })
      );
  }, [paginationModel, user?.email, dispatch]);
  
   const {
    list: goodsReceiptList,
    totalCount: goodsReceiptTotak,
    listLoading: goodsReceiptLoading
  } = useSelector((state) => state.goodsReceiptPO);
  const {
    list: materialRequestList,
    totalCount: materialRequestTotal,
    listLoading: materialRequestLoading
  } = useSelector((state) => state.materialRequest);

  const {
    list: purchaseRequestList,
    totalCount: purchaseRequestTotal,
    listLoading: purchaseRequestLoading
  } = useSelector((state) => state.purchaseRequest);

  const dashboard = useMemo(() => {
    
    const totalMR = materialRequestList.length;
     const totalPO = purchaseRequestList.length;
     const totalGR = goodsReceiptList.length;
    console.log("totalMR",totalGR)

    const pendingMR = materialRequestList.filter((x) => x.status === 'Pending').length;

    const approvedMR = materialRequestList.filter((x) => x.status === 'Approved').length;

    const pendingPO = purchaseRequestList.filter((x) => x.status === 'Pending').length;

    const approvedPO = purchaseRequestList.filter((x) => x.status === 'Approved').length;

    const completedGR = goodsReceiptList.filter((x) => x.status === 'Completed').length;

    return {
      totalMR,
      totalPO,
      totalGR,
      pendingMR,
      approvedMR,
      pendingPO,
      approvedPO,
      completedGR
    };
  }, [materialRequestList, purchaseRequestList, goodsReceiptList]);
  const progressData = [
    {
      name: 'MR',
      count: dashboard.totalMR
    },
    {
      name: 'PO',
      count: dashboard.totalPO
    },
    {
      name: 'GR',
      count: dashboard.totalGR
    }
  ];
  const approvalData = [
    {
      name: 'Approved',
      value: dashboard.approvedMR
    },
    {
      name: 'Pending',
      value: dashboard.pendingMR
    }
  ];
  const projects = {};

  materialRequestList.forEach((mr) => {
    if (!projects[mr.projectName]) {
      projects[mr.projectName] = {
        project: mr.projectName,
        MR: 0,
        PO: 0,
        GR: 0
      };
    }

    projects[mr.projectName].MR++;
  });

  purchaseRequestList.forEach((po) => {
    if (!projects[po.projectName]) {
      projects[po.projectName] = {
        project: po.projectName,
        MR: 0,
        PO: 0,
        GR: 0
      };
    }

    projects[po.projectName].PO++;
  });

  goodsReceiptList.forEach((gr) => {
    if (!projects[gr.projectName]) {
      projects[gr.projectName] = {
        project: gr.projectName,
        MR: 0,
        PO: 0,
        GR: 0
      };
    }

    projects[gr.projectName].GR++;
  });

  const projectData = Object.values(projects);
  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Material Requests</Typography>
              <Typography variant="h3">{dashboard.totalMR}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Purchase Orders</Typography>
              <Typography variant="h3">{dashboard.totalPO}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Goods Receipt</Typography>
              <Typography variant="h3">{dashboard.totalGR}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Pending MR</Typography>
              <Typography variant="h3">{dashboard.pendingMR}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={progressData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#1976d2" />
        </BarChart>
      </ResponsiveContainer>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={approvalData} dataKey="value" nameKey="name" outerRadius={100}>
            {approvalData.map((entry, index) => (
              <Cell key={index} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>MR No</TableCell>
              <TableCell>Project</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {materialRequestList
              .filter((x) => x.status === 'Pending')
              .slice(0, 5)
              .map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.documentNo}</TableCell>
                  <TableCell>{row.projectName}</TableCell>
                  <TableCell>{row.status}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={projectData}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="project" />

          <YAxis />

          <Tooltip />

          <Legend />

          <Bar dataKey="MR" fill="#2196f3" />

          <Bar dataKey="PO" fill="#ff9800" />

          <Bar dataKey="GR" fill="#4caf50" />
        </BarChart>
      </ResponsiveContainer>
    </>
  );
}
