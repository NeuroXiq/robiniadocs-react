'use client';
import { Box, Grid, TablePagination, alpha, styled } from '@mui/material';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Search } from '@mui/icons-material';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import Link from 'next/link';
import { useState } from 'react';
import UseApi, { useQueryEffect } from '@/services/Api';
import Layout from '@/components/Layout';
import PageLoading from '@/components/PageLoading';
import ProjectCard from '@/components/projectCard';
import Typoheader from '@/components/Typoheader';

export default function Index() {
  const api = UseApi();

  const { loading, result } = useQueryEffect(() => api.Home_GetAllProjects());

  if (loading) {
    return (<PageLoading open={true}></PageLoading>)
  }

  return (
    <Box>
      <Typoheader>All projects</Typoheader>
      <Grid container spacing={2}>
        {result.map((p: any) => (
          <Grid item md={4} key={p.id}>
            <ProjectCard project={p} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

/*
  return (
    <>
      <Paper sx={{ minWidth: 400, width: '60%', margin: '0 auto' }}>
        <TableContainer >
          <Table aria-label="all projects table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>RobiniaDocs</TableCell>
                <TableCell>Github Url</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map(r => (
                <TableRow key={r.id}>
                  <TableCell>{r.name}</TableCell>
                  <TableCell>
                    <Link href={r.githubUrl}>
                      <Button>robiniadocs</Button>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link href={r.githubUrl}>
                      <Button>github</Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination 
          rowsPerPageOptions={[10, 20, 50, 100]}
          count={rows.length}
          component="div"
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={onPageChange}
          onRowsPerPageChange={onRowsPerPageChange}>

        </TablePagination>
      </Paper>
    </>
  )
*/