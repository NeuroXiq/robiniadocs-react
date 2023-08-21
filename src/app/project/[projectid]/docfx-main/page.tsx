'use client'
import { useParams } from "next/navigation";
import Api from "../../../../../services/Api"
import useApiCallEffect from "../../../../../hooks/useApiCall";
import PageLoading from "../../../../../components/PageLoading";
import Layout from "../../../../../components/Layout";
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Card, CardContent, CardMedia, Divider, Grid, List, ListItemButton, ListItemIcon, ListItemText, Paper, Typography } from "@mui/material";
import BasicTable from "../../../../../components/BasicTable";
import DetailsList from "../../../../../components/DetailsList";
import RefreshIcon from '@mui/icons-material/Refresh';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import Urls from "../../../../../config/Urls";
import UseApi from "../../../../../services/Api";
import { useQueryEffect } from "../../../../../services/Api";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { EID, ProjectStatus, UIName, BgProjectHealthCheckStatus } from '../../../../../services/ApiModels/Enums';
import { dateTimeUI, dateUI } from "services/Helpers";
import Link from "next/link";
import { useContext, useState } from "react";
import { GlobalAppContext, IGlobalAppContextValue } from "hooks/globalAppContext";

export default function DocfxMain() {
    const projectid = +(useParams() || {}).projectid;
    const api = UseApi();
    const gc = useContext<IGlobalAppContextValue>(GlobalAppContext);
    // const { loading, result, error } = useApiCallEffect(() => Api.docfxGetMainInfo(projectid));
    const [loading, setLoading] = useState<boolean>(false);
    const [refresh, setRefresh] = useState<number>(1);
    const { loading: detailsLoading, result } = useQueryEffect(() => api.DocfxGetDocfxProjectDetails(projectid), [refresh]);


    let project: any = {};
    let bgCheckOk = true;
    let statusOk = true;
    let lastBuildErrorText = 'Last Build Error';
    let docfxInfo = result?.docfxInfo;

    if (result?.project) {
        bgCheckOk = result.project.bgHealthCheckHttpGetStatus === BgProjectHealthCheckStatus.HttpGetOk;
        statusOk = result.project.status === ProjectStatus.Active;
        const rdocsUrl = Urls.robiniadocsUrl(result.project.robiniaUrlPrefix);
        const p = result.project;
        
        project = {
            ...result.project,
            bgHealthCheckHttpGetStatus: UIName(EID.BgProjectHealthCheckStatus, result.project.bgHealthCheckHttpGetStatus),
            statusUI: UIName(EID.ProjectStatus, result.project.status),
            lastDocfxBuildTime: dateUI(result.project.lastDocfxBuildTime),
            bgHealthCheckHttpGetDateTime: dateUI(p.bgHealthCheckHttpGetDateTime),
            robiniadocsHref: <Link href={rdocsUrl}>{rdocsUrl}</Link>,
        };

        docfxInfo = {
            ...docfxInfo,
            isDirty: docfxInfo.isDirty.toString()
        }

        if (p.lastDocfxBuildErrorDateTime) {
            const buildErrorDate = new Date(p.lastDocfxBuildErrorDateTime);
            const buildErrorDateUI = dateTimeUI(buildErrorDate);

            if (new Date().toDateString() === buildErrorDate.toDateString()) {
                lastBuildErrorText += ' - TODAY: ' + buildErrorDateUI;
            } else {
                lastBuildErrorText += ' ' + buildErrorDateUI;
            }
        }
    }

    let projectConfig = [
        { title: 'Project Id', key: 'id' },
        { title: 'Name', key: 'projectName' },
        { title: 'Description', key: 'description' },
        { title: 'Github Url', key: 'githubUrl' },
        { title: 'Nuget Package Name', key: 'nugetPackageName' },
        { title: 'Nuget Package Version', key: 'nugetPackageVersion' },
    ];

    let projectConfig2 = [
        { title: 'Last Build Time', key: 'lastDocfxBuildTime' },
        { title: 'Background Health Date', key: 'bgHealthCheckHttpGetDateTime' },
        { title: 'Background Health Status', key: 'bgHealthCheckHttpGetStatus', stp: bgCheckOk ? null : 'error' },
        { title: 'RobiniaDocs Url Prefix', key: 'robiniaUrlPrefix', },
        { title: 'Status', key: 'statusUI', stp: statusOk ? null : 'warning' },
        { title: 'RobiniaDocs URL', key: 'robiniadocsHref' }
    ]

    let docfxInfoConfig = [
        { title: 'Rebuild Needed', key: 'isDirty' },
        { title: 'Total Site Items', key: 'totalSiteItemsCount' },
    ]

    const onRebuildClick = function () {
        setLoading(true);
        api.ProjectManage_BuildDocfxProject(projectid).then(r => {
            setLoading(false);
            setRefresh(refresh + 1);
            gc.showSuccessMessage('Action success');
        });
    }

    return (
        <Layout title="Docfx">
            <PageLoading open={loading || detailsLoading} />
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <DetailsList title="Details 1" loading={detailsLoading} itemsConfig={projectConfig} data={project} />
                </Grid>

                <Grid item xs={6}>
                    <DetailsList title="Details 2" loading={detailsLoading} itemsConfig={projectConfig2} data={project} />
                </Grid>
                <Grid item xs={6}>
                    <DetailsList title="Docfx Info" loading={detailsLoading} itemsConfig={docfxInfoConfig} data={docfxInfo} />
                </Grid>
                <Grid item xs={6}>
                    <Paper>
                        <Typography variant="h6" align="center" padding={1}>Actions</Typography>
                        <div style={{ padding: '0 1rem' }}>
                            <Divider />
                        </div>
                        <List>
                            <ListItemButton onClick={onRebuildClick} disabled={project.status === ProjectStatus.Building}>
                                <ListItemIcon>
                                    <RefreshIcon />
                                </ListItemIcon>
                                <ListItemText primary="Rebuild"></ListItemText>
                            </ListItemButton>
                            <ListItemButton href={Urls.project.docfxFilesExplorer(projectid)}>
                                <ListItemIcon>
                                    <OpenInNewIcon />
                                </ListItemIcon>
                                <ListItemText primary="Edit Content"></ListItemText>
                            </ListItemButton>
                        </List>
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography>{lastBuildErrorText}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography variant="body2" component="pre" sx={{ whiteSpace: "pre-wrap" }}>
                                {project.lastDocfxBuildErrorLog}
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                </Grid>
                <Grid item xs={12}>
                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography>Docfx JSON</Typography>
                        </AccordionSummary>
                        <AccordionDetails sx={{ maxHeight: '90vh', overflowY: 'auto' }}>
                            <Typography variant="body2" component="pre" sx={{ whiteSpace: "pre-wrap" }}>{docfxInfo?.docfxJson}</Typography>
                        </AccordionDetails>
                    </Accordion>
                </Grid>
            </Grid>
        </Layout>
    );
}