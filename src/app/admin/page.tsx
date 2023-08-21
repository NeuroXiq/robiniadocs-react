'use client'
import DetailsList from "@/components/DetailsList";
import Layout from "@/components/Layout";
import { Button, Grid, List, ListItemButton, ListItemIcon, ListItemText, Paper, Typography } from "@mui/material";
import RotateRightIcon from '@mui/icons-material/RotateRight';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import useApiCallEffect, { apiCallNoEffect } from "hooks/useApiCall";
import Api from "services/Api";
import UseApi from "services/Api";
import { useQueryEffect } from "services/Api";
import BasicTable from "@/components/BasicTable";
import Link from "next/link";
import MUILink from "@mui/material/Link";
import ApiUrls from "config/ApiUrls";
import { useContext, useState } from "react";
import FileDownloadDialog from "@/components/FileDownloadDialog";
import Urls from "config/Urls";
import AddLinkIcon from '@mui/icons-material/AddLink';
import { GlobalAppContext, IGlobalAppContextValue } from "hooks/globalAppContext";
import { EID, UIName } from "@/services/ApiModels/Enums";

export default function AdminDashboard() {
    const gc = useContext<IGlobalAppContextValue>(GlobalAppContext);
    const { loading: ldbi, result: dbi } = useQueryEffect(() => api.Admin_GetDashboardInfo());

    let projects = [];


    const bgworkerConfig = [
        { title: 'Is Normal Running', key: 'backgroundDoWorkIsRunning' },
        { title: 'Is Important Running', key: 'backgroundDoImportantWorkIsRunning' },
        { title: 'Waiting to save App Logs Count', key: 'backgroundQueueHttpLogsCount' },
        { title: 'Waiting to save HTTP Logs Count', key: 'backgroundQueueAppLogsCount' },
        { title: 'Status Text', key: 'backgroundStatusText' },
    ]

    const statsListConfig = [
        { title: 'Problems Count', key: 'problemsCount' },
        { title: 'Unique Visitors 24H', key: 'uniqueVisitors24H' },
        { title: 'Unique Visitors 7 Days', key: 'uniqueVisitors7Days' },
        { title: 'In Memory Queued Logs To Save', key: 'inMemoryQueuedLogsToSave' },
        { title: 'App Logs Count', key: 'appLogsCount' },
        { title: 'HttpLogsCount', key: 'httpLogsCount' },
    ];

    const projectsTableConfig = {
        idKey: 'id',
        data: [],
        cols: [
            { id: 'id', title: 'Id', key: 'id' },
            { id: 'name', title: 'Name', key: 'projectName' },
            { id: 'status', title: 'Status', key: 'status' },
            { id: 'rurl', title: 'RobiniaDocs', key: 'robiniadocsUrl' },
            { id: 'dtf', title: 'Download Tenant Files', key: 'downloadTenantFiles' },
            { id: 'hs', title: 'Health status', key: 'bgHealthCheckHttpGetStatus' },
            { id: 'ht', title: 'Health Check Date', key: 'bgHealthCheckHttpGetDateTime' },
            { id: 'gurl', title: 'Github', key: 'githubUrl' },
        ],
        colSelecting: {
            initialColumns: ['id', 'name', 'status', 'rurl', 'dtf']
        }
    };

    const api = UseApi();
    const [downloadDialog, setDownloadDialog] = useState<any>({ state: 'wait_confirm', show: false, fileName: '', projectId: -1 });

    const getProjectFiles = function (projectid: any) {
        setDownloadDialog({ state: 'wait_confirm', show: true, fileName: 'Project ' + projectid, projectId: projectid })
    }

    if (!ldbi) {
        let data = dbi.projects.result.map((r: any) => {
            return {
                ...r,
                bgHealthCheckHttpGetStatus: UIName(EID.BgProjectHealthCheckStatus, r.bgHealthCheckHttpGetStatus),
                status: UIName(EID.ProjectStatus, r.status),
                robiniadocsUrl: <MUILink href={Urls.robiniadocsUrl(r.robiniaUrlPrefix)}>{r.robiniaUrlPrefix}</MUILink>,
                downloadTenantFiles: <Button onClick={() => getProjectFiles(r.id)}>Download</Button>
            }
        });
        projectsTableConfig.data = data;
    }

    const onForceRunBgWorker = function () {
        api.Admin_BackgroundWorkerForceRun().then(r => {
            gc.showSuccessMessage("Action handled");
        });
    }

    const bgRebuildAllProjs = function () {
        api.Admin_BackgroundWorkerRunCheckProjectsHttpStatus().then(r => {
            gc.showSuccessMessage('Action handled');
        });
    }

    const bgCheckHttpProjStatus = function () {
        api.Admin_BackgroundWorkerRunCheckProjectsHttpStatus().then(r => {
            gc.showSuccessMessage('action handled');
        });
    }

    function onAttachTenantClick() {
    }

    const onConfirmDownloadClick = function () {
        setDownloadDialog({
            ...downloadDialog,
            state: 'inprogress'
        });

        api.Admin_GetProjectFiles(downloadDialog.projectId)
            .then(fileUrl => {
                window.open(fileUrl, '_blank');
                setDownloadDialog({ ...downloadDialog, state: 'completed_ok' });
            });
    }

    const onAbortDownloadClick = function () {

    }

    const onCancelDownloadClick = function () { setDownloadDialog({ ...downloadDialog, show: false }) }

    return (
        <Layout title="Dashboard">
            <FileDownloadDialog
                show={downloadDialog.show}
                fileName={downloadDialog.fileName}
                onConfirmClick={onConfirmDownloadClick}
                onCancelClick={onCancelDownloadClick}
                state={downloadDialog.state} />
            <Grid container spacing={2}>
                <Grid item md={6}>
                    <DetailsList loading={ldbi} data={dbi} itemsConfig={statsListConfig}></DetailsList>
                </Grid>
                <Grid item md={6}>
                    <DetailsList loading={ldbi} data={dbi} itemsConfig={bgworkerConfig}></DetailsList>
                </Grid>
                <Grid item md={6}>
                    <Paper>
                        <Typography textAlign="center" variant="h5">Actions</Typography>
                        <List>
                            <ListItemButton onClick={bgRebuildAllProjs}>
                                <ListItemIcon>
                                    <RotateRightIcon />
                                </ListItemIcon>
                                <ListItemText primary="Rebuild all projects"></ListItemText>
                            </ListItemButton>
                            <ListItemButton onClick={bgCheckHttpProjStatus}>
                                <ListItemIcon>
                                    <RotateRightIcon />
                                </ListItemIcon>
                                <ListItemText primary="Refresh HTTP status"></ListItemText>
                            </ListItemButton>
                            <ListItemButton onClick={onForceRunBgWorker}>
                                <ListItemIcon>
                                    <PlayCircleOutlineIcon />
                                </ListItemIcon>
                                <ListItemText primary="Force run background worker"></ListItemText>
                            </ListItemButton>
                            <ListItemButton onClick={onAttachTenantClick}>
                                <ListItemIcon>
                                    <AddLinkIcon />
                                </ListItemIcon>
                                <ListItemText primary="Attach Tenant"></ListItemText>
                            </ListItemButton>
                        </List>
                    </Paper>
                </Grid>
                <Grid md={12} item>
                    <Paper>
                        <BasicTable config={projectsTableConfig}></BasicTable>
                    </Paper>
                </Grid>
            </Grid>
        </Layout>
    );
}