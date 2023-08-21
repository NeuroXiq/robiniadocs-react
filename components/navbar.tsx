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
import Link from 'next/link';
import MuiLink from '@mui/material/Link';
import UseUser from '../services/user';
import { useContext, useState } from 'react';
import { Divider, ListItemIcon, ListItemText } from '@mui/material';
import MUILink from '@mui/material/Link';
import { useRouter } from 'next/navigation'

import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import DashboardIcon from '@mui/icons-material/Dashboard';
import TableRowsIcon from '@mui/icons-material/TableRows';
import BrokenImageIcon from '@mui/icons-material/BrokenImage';
import { Dashboard } from '@mui/icons-material';
import Image from 'next/image'
import PageLoading from './PageLoading';
import { GlobalAppContext } from 'hooks/globalAppContext';
import Urls from 'config/Urls';

export default function Navbar() {
  const gac = useContext<any>(GlobalAppContext);
  const router = useRouter();
  const user = gac.user;

  let pages = [
    { title: 'Home', url: '/home', },
    { title: 'Projects', url: '/projects' },
    { title: 'Tutorial', url: Urls.other.robiniadocsTutorial }
  ];

  let loginPage = { title: 'Login', url: '/account/login', icon: <LoginIcon />, show: 'noauth' };
  let signOutPage = { title: 'Sign Out', url: '/account/logout', icon: <LogoutIcon />, show: 'auth' };

  let adminDashboard = { title: 'Dashboard', url: '/admin/', icon: <Dashboard />, isAdmin: true };
  let adminSql = { title: 'Logs', url: '/admin/logs', icon: <TableRowsIcon />, isAdmin: true };
  let adminLogs = { title: 'SQL', url: '/admin/sql', icon: <BrokenImageIcon />, isAdmin: true };

  let accountPages = [
    { title: 'My Account', url: '/account/details', icon: <AccountBoxIcon />, show: 'auth' },
    { title: 'Projects', url: '/account/projects', icon: <AccountTreeIcon />, show: 'auth' },
    adminDashboard,
    adminSql,
    adminLogs
  ];

  const [accountBtn, setAccountBtn] = useState<any>(null);

  const onAccountMenuClose = function (e: any) {
    setAccountBtn(null);
  }

  const handleAccountMenuItemClick = function (data: any) {
    setAccountBtn(null);
    router.push(data.url);
  }

  const onAccountButtonClick = (e: any) => {
    setAccountBtn(e.currentTarget);
  }

  const accountMenuLink = function (page: any): any {
    if ((page.show === 'auth' && !user.isAuthenticated) || (page.show === 'noauth' && user.isAuthenticated)
      || (page.isAdmin === true && user.isAdmin !== true)) {
      return null;
    }

    return (
      <MenuItem onClick={() => handleAccountMenuItemClick(page)} key={page.url}>
        <MuiLink href={page.url} style={{ textDecoration: 'none', display: 'flex' }}>
          {page.icon ? <ListItemIcon>{page.icon}</ListItemIcon> : null}
          <Typography textAlign="center">{page.title}</Typography>
        </MuiLink>
      </MenuItem>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <div style={{
            padding: 8,
            margin: '0.5rem 0.75rem 0.5rem 0',
            filter: "brightness(0) invert(1)",
            border: '2px solid white',
            borderRadius: '50%',
            objectFit: "contain",
            alignItems: 'center',
            justifyContent: 'center',
            display: 'flex',
          }}>
            <Image
              alt="sadf"
              width={28}
              height={28}
              src="/locust.png" />
          </div>

          <Typography
            variant="h5"
            component="h1"
            sx={{
              fontWeight: 700,
            }}
          >
            RobiniaDocs
          </Typography>
          <Divider></Divider>

          <Box sx={{ flexGrow: 1, alignItems: 'flex-start', marginLeft: '1rem' }}>
            {pages.map(p => (
              <Link href={p.url} key={p.title}>
                <Button sx={{ color: "white" }}>
                  {p.title}
                </Button>
              </Link>
            ))}
          </Box>

          <IconButton
            size="large"
            aria-label="account"
            arial-controls="menu-appbar"
            aria-haspopup="true"
            onClick={onAccountButtonClick}>
            <AccountCircle sx={{ color: 'primary.contrastText' }} />
          </IconButton>

          <Menu
            id="account-menu"
            anchorEl={accountBtn}
            anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
            open={Boolean(accountBtn)}
            onClose={onAccountMenuClose}>

            {accountMenuLink(loginPage)}
            {accountPages.map(p => (accountMenuLink(p)))}
            {user.isAuthenticated && <Divider />}
            {accountMenuLink(signOutPage)}
          </Menu>
        </Toolbar>
      </AppBar>
    </Box>
  )
}