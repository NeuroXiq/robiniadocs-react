'use client';
import { Divider, List, ListItemText, Paper, Skeleton, Typography } from "@mui/material";
import React from "react";

export default function DetailsList(props: any): any {
    let data = props.data;
    let itemsConfig = props.itemsConfig;
    const title = props.title || 'Details';

    const getReactKey = function (item: any, index: number) {
        let a = item.reactKey || index.toString();
        return a;
    }

    const getValueFromKey = function (key: string): any {
        if (!(key in data)) {
            throw new Error(`'${key}' not found in object`);
        }

        if (typeof data[key] === 'boolean') {
            return data[key].toString();
        }

        return (data[key] || ' ');
    }

    function getSecondaryTypographyProps(c: any): any {
        const stp = c.stp;
        if (!stp) {
            return null;
        }

        const res: any = {};

        if (stp === 'error') {
            res.color = "error";
        } else if (stp === 'warning') {
            res.color = "warning.main";
        }

        return res;
    }

    function getContent(c: any, index: number) {
        return (<React.Fragment key={getReactKey(c, index)}>
            <ListItemText
                primary={c.title}
                secondary={getValueFromKey(c.key)}
                secondaryTypographyProps={getSecondaryTypographyProps(c)}>
            </ListItemText>
            {index < itemsConfig.length - 1 ? <Divider /> : null}
        </React.Fragment>)
    }

    return (
        <Paper sx={{ padding: '0 1rem' }}>
            <Typography variant="h6" align="center" padding={1}>{title}</Typography>
            <Divider />
            {props.loading &&
                itemsConfig.map((a: any, i: number) => (
                    <Skeleton key={i} variant="text" sx={{ fontSize: '3rem' }} />
                ))
            }

            {!props.loading && <List>
                {itemsConfig.map((c: any, index: number) => (getContent(c, index)))}
            </List>}
        </Paper>
    )
} 