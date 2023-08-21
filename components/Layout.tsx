'use client'
import { Box, Grid } from "@mui/material";
import Typoheader from "./Typoheader";

export default function Layout(props: any) {
    props = props || {};
    
    if (props.type === '') {
    }

    return (
        <Grid container sx={{ minHeight: '100vh' }}>
            <Grid item lg={2} xs={0}></Grid>
            <Grid item lg={8} xs={12}>
                {props.title && <Typoheader>{props.title}</Typoheader>}
                <Box>{props.children}</Box>
            </Grid>
            <Grid item lg={2} xs={0}></Grid>
        </Grid>
    );
}