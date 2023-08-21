'use client'
import AddIcon from '@mui/icons-material/Add';
import BasicTable from "@/components/BasicTable";
import DetailsList from "@/components/DetailsList";
import Layout from "@/components/Layout";
import Typoheader from "@/components/Typoheader";
import { Box, Button, Grid, Link, List, ListItemButton, ListItemIcon, ListItemText, Paper, Typography } from "@mui/material";
import Urls from "config/Urls";
import useApiCallEffect from "hooks/useApiCall";
import { useEffect, useState } from "react";
import useApi from "services/Api";
import { useQueryEffect } from "services/Api";
import MuiLink from '@mui/material/Link';
import { EID, UIName } from '@/services/ApiModels/Enums';

export default function Details() {
    const listConfig = [
        { title: 'Id', key: 'id' },
        { title: 'Login', key: 'login' },
        { title: 'Email', key: 'primaryEmail' },
    ];

    const api = useApi();

    const {  loading: ldAccount, result: resultAccount }  = useQueryEffect(() => api.MyAccountGetAccountDetails());
    const { loading: ldProjs, result: rProjs }  = useQueryEffect(() => api.getAllUserProjects());

    let resultProjects: any = [];

    if (!ldProjs) {
        resultProjects = rProjs.map((r: any) => {
            return {
                ...r,
                status: UIName(EID.ProjectStatus, r.status),
                manageDocfx: <Link href={Urls.project.docfxMain(r.id)}>Manage Docfx</Link>,
                robiniadocs: <Link href={Urls.robiniadocsUrl(r.robiniaUrlPrefix)}>Robiniadocs</Link>,
                deleteProject: <MuiLink color="error" href={Urls.project.delete(r.id)}><Button color="error">DELETE</Button></MuiLink>
            }
        });
    }


    const tableConfig = {
        idKey: 'id',
        data: resultProjects || [],
        cols: [{
            title: 'Id',
            key: 'id'
        }, {
            title: 'Project Name',
            key: 'projectName'
        }, {
            title: 'Github Url',
            key: 'githubUrl'
        }, {
            title: 'RobiniaDocs Url Prefix',
            key: 'robiniaUrlPrefix'
        }, {
            title: 'Status',
            key: 'status'
        },{
            title: 'Manage Docfx',
            key: 'manageDocfx'
        }, {
            title: 'RobiniaDocs',
            key: 'robiniadocs'
        }, {
            title: 'Delete',
            key: 'deleteProject'
        }],
    };

    return (
        <Layout title="Account Details">
            {<DetailsList loading={ldAccount} itemsConfig={listConfig} data={resultAccount}></DetailsList>}
            <Paper sx={{ mt: 2, p: 2 }}>
                <Typography variant="h6" textAlign="center">All Projects</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Link href={Urls.project.createProject}>
                        <Button startIcon={<AddIcon />} variant="outlined" sx={{ m: '1rem 0' }}>
                            Create New Project
                        </Button>
                    </Link>
                </Box>
                <BasicTable config={tableConfig} loading={ldProjs}>
                </BasicTable>
            </Paper>

        </Layout>
    )
}