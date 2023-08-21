import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Urls from 'config/Urls';
import Link from 'next/link';
import MUILink from '@mui/material/Link';

import { Divider, Grid } from '@mui/material';


export default function Footer() {

  const muLink = function (title: any, url: any) {
    return (<MUILink underline='none' variant="body2" href={url}>{title}</MUILink>)
  };

  return (
    <Box component="footer" sx={{ mt: 2, borderColor: 'green' }}>
      <Divider />
      <Grid container spacing={1} sx={{ mt: 0 }}>
        <Grid item xs={2} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {muLink('Home', Urls.home.index)}
          {muLink('How to use', Urls.home.howToUse)}
          {muLink('Terms of service', Urls.home.termsOfService)}
          {muLink('All Projects', Urls.home.projects)}
        </Grid>
        <Grid item xs={10}>
          <Typography marginBottom={1} variant="h6" textAlign="center">
            RobiniaDocs - Free online documentation hosting platform for .NET Core projects
          </Typography>
          <Typography variant="body2" textAlign="center">
            RobiniaDocs is a free .NET core documentation hosting platform.
            Content is maintained by owners of Projects or by RobiniaDocs Administrator.
            References, examples and projects are reviewed to avoid errors,
            but we cannot warrant full correctness of all contents, bugs and
            unexpected system behaviour.
            By using RobiniaDocs, you agree to have read and accepted terms of use, cookie and privacy policy.
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Divider/>
          <Typography margin={1} variant="body2" textAlign="center">Powered by  <a>RobiniaDocs</a> /
            &copy; Copyright 2023 - {(new Date().getFullYear())}. All Rights Reserved</Typography>
        </Grid>
      </Grid>
    </Box>
  );
}