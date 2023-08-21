'use client'
import BasicTable from "@/components/BasicTable";
import Layout from "@/components/Layout";
import { Box, Button, FormControlLabel, Grid, Radio, RadioGroup, TextField, Typography } from "@mui/material";
import { useContext, useState } from "react";
import FormLabel from '@mui/material/FormLabel';
import UseApi from '@/services/Api';
import { GlobalAppContext, IGlobalAppContextValue } from "hooks/globalAppContext";

export default function Sql() {
    const api = UseApi();
    const gc = useContext<IGlobalAppContextValue>(GlobalAppContext);

    const [state, setState] = useState<any>({
        mode: 1,
        sqlCode: '',
        dbname: 'app/appdb.sqlite'
    });

    const [tableConfig, setTableConfig] = useState<any>({
        cols: [],
        data: []
    });

    const [error, setError] = useState<any>(null);

    const onSqlChange = function (e: any) {
        setState({ ...state, sqlCode: e.target.value })
    }

    const onModeChange = function (e: any) {
        setState({ ...state, mode: e.target.value });
    }

    const onKeyDown = function (e: any) {
        if (e.ctrlKey && e.keyCode === 13) {
            executeSql();
        }
    }

    const executeSql = function () {
        const form = {
            ...state,
            mode: +state.mode
        }

        api.Admin_ExecuteRawSql(form).then(r => {
            const result = r.result;
            if (result.success) {
                setError(null);

                if (form.mode === 2) {
                    gc.showSuccessMessage("action success");
                    return;
                }

                let idKey = result.columns.indexOf((c: any) => c === 'id');
                if (idKey < 0) {
                    idKey = null;
                }

                const newConfig = {
                    cols: result.columns.map((c: any, i: any) => { return { id: i, title: c, key: i } }),
                    idKey: idKey,
                    data: result.rows
                }

                setTableConfig(newConfig);
            } else {
                setError(result.exception);
            }
        });
    }

    const onDbNameChange = function (e: any) {
        setState({ ...state, dbname: e.target.value });
    }

    return (
        <Grid container>
            <Grid item md={4}>
                <TextField
                    onKeyDown={onKeyDown}
                    onChange={onSqlChange}
                    multiline
                    rows={8}
                    fullWidth
                    value={state.sqlCode}
                    margin="normal">
                </TextField>

                <Grid container marginTop={1} spacing={2}>
                    <Grid item md={6}>
                        <FormLabel>Mode</FormLabel>
                        <RadioGroup
                            onChange={onModeChange}
                            value={state.mode}
                            row>
                            <FormControlLabel value={1} control={<Radio />} label="Execute Reader" />
                            <FormControlLabel value={2} control={<Radio />} label="Execute Non Query" />
                        </RadioGroup>
                    </Grid>
                    <Grid item md={6}>
                        <FormLabel>Execute code</FormLabel>
                        <Button variant="outlined" fullWidth onClick={executeSql}>Execute (ctrl + enter)</Button>
                    </Grid>
                    <Grid item md={6}>
                        <FormLabel>Db name</FormLabel>
                        <TextField
                            fullWidth
                            margin="normal"
                            value={state.dbname}
                            onChange={onDbNameChange}></TextField>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item md={8}>
                <BasicTable config={tableConfig} tableContainerSx={{ maxHeight: '80vh' }}></BasicTable>
            </Grid>
            <Grid item md={12}>
                <Typography color="error.main">
                    {error}
                </Typography>
            </Grid>
        </Grid>
    );
}