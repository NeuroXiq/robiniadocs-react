'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { CardActionArea, CardMedia, Divider, Grid, Paper } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import GitHubIcon from '@mui/icons-material/GitHub';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import ProjectCard from '../../../components/projectCard';
import Image from 'next/image';
import styles from './styles.module.css';
import Link from 'next/link';
import Typoheader from '@/components/Typoheader';
import UseApi, { useQueryEffect } from '@/services/Api';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import Urls from 'config/Urls';
import MuiLink from '@mui/material/Link';

export default function Index() {
  const api = UseApi();

  const { loading: rpLoading, result: recentProjects } = useQueryEffect(() => api.Home_GetRecentProjects());

  const infoCard = function (title: string, text: string, img: any, url: string) {
    return (
      <Card className={styles.infocard} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            {img}
            <Typography variant="h5">{title}</Typography>
          </Box>
          <Typography margin={1} variant="body1">{text}</Typography>
        </CardContent>
        <CardActions>
            <Button href={url} target='_blank' fullWidth variant="outlined" size="large">Read More</Button>
        </CardActions>
      </Card>
    )
  };

  function howToUseImg(name: string) {
    return (
      <Image src={name}
        width={0} height={0} sizes='1' style={{ width: '100%', height: 'auto' }} alt='gif'></Image>)
  }

  return (
    <>
      <Typoheader variant="h2">
        Welcome on RobiniaDocs!
      </Typoheader>
      <Typoheader bgcolor="secondary.main" align="center" variant="h6" >
        Free online documentation hosting platform for .NET Core projects
      </Typoheader>

      <Box sx={{ display: 'flex' }}>
        {infoCard(
          'Host Your docs with RobiniaDocs!',
          'Host project API explorer, XML documentation and custom markdown pages use DOCFX page generator tool',
          <CloudUploadIcon fontSize='large' color="secondary" />,
          Urls.other.robiniadocsTutorial)
        }
        {infoCard('All Projects',
          'Explore all projects hosted on RobiniaDocs',
          <AccountTreeIcon fontSize='large' color="secondary" />,
          Urls.home.projects)}
        {infoCard(
          'Github',
          'See RobiniaDocs github page',
          <GitHubIcon fontSize='large' color="secondary" />,
          Urls.other.robiniadocsGithubRepository)}
      </Box>

      <Typoheader>How to use</Typoheader>
      <Grid container spacing={1}>
        <Grid item md={6}>
          <Typoheader variant="h5" bgcolor="secondary.main">1. Login with Github account</Typoheader>
          {howToUseImg('/howtouse-1.png')}
        </Grid>
        <Grid item md={6}>
          <Typoheader variant="h5" bgcolor="secondary.main">2. Create a new project</Typoheader>
          {howToUseImg('/howtouse-2.png')}
        </Grid>
        <Grid item md={6}>
          <Typoheader variant="h5" bgcolor="secondary.main">3. Build project</Typoheader>
          {howToUseImg('/howtouse-3.png')}
        </Grid>
        <Grid item md={6}>
          <Typoheader variant="h5" bgcolor="secondary.main">4. Docfx Api Explorer is hosted online!</Typoheader>
          <Image src="/docfx-gif.gif" width={0} height={0} sizes='1' style={{ width: '100%', height: 'auto', objectFit: 'contain' }} alt='gif'></Image>
        </Grid>
      </Grid>

      <Typoheader variant="h4">Explore recent projects</Typoheader>
      <Grid container spacing={2}>
        {!rpLoading && recentProjects.map((p: any) => {
          return (
            <Grid item key={p.id} xs={4}>
              <ProjectCard project={p}></ProjectCard>
            </Grid>
          );
        })}
      </Grid>

      <Box sx={{ marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Link href="/projects/">
          <Button
            sx={{ display: 'flex', alignItems: 'center', alignContent: 'center' }}
            variant="contained"
            endIcon={<KeyboardDoubleArrowRightIcon />}>Explore all RobiniaDocs projects</Button>
        </Link>
      </Box>
    </>
  )
}