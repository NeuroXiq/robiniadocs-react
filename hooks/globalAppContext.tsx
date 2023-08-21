import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Snackbar, Stack, Typography } from '@mui/material';
import { createContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'
import Urls from 'config/Urls';
import CloseIcon from '@mui/icons-material/Close';
import UseUser, { IUser } from '@/services/user';

export const GlobalAppContext = createContext<IGlobalAppContextValue>({} as IGlobalAppContextValue);

interface IGlobalAppContextValue {
    showSuccessMessage(msg: string): any,
    setGlobalMessages(msg: any): any,
    onUseApiCallPromiseCatch(err: any): any,
    onApiResultHasErrors(err: any): any,
    onApiFetchNotOk(fetchInfo: any): any,
    user: IUser,
    loginUser: any,
    logoutUser: any
};

export { type IGlobalAppContextValue };

export default function GlobalAppContextProvider({ children }: any) {
    const [gacState, setGacState] = useState<any>({
        globalError: null,
        fetchError: null,
        // globalAlertErrorText: null,
        // globaSuccessMessage: null,
        user: null
    });

    const [globalSnackError, setGlobalSnackError] = useState<string | null>('');
    const [globalSnackSuccess, setGlobalSnackSuccess] = useState<string | null>('');

    const router = useRouter();
    const { user, login: loginUser, logout: logoutUser } = UseUser();

    useEffect(() => {
        setGacState({
            ...gacState,
            user: user
        });
    }, [user]);

    const gacValue = {
        user: gacState.user,
        loginUser: loginUser,
        logoutUser: logoutUser,
        showSuccessMessage: function (msg: string) {
            if (!msg) {
                msg = 'Action succees';
            }
            setGlobalSnackSuccess(msg);
        },
        setGlobalMessages: (msg: any) => { },
        onUseApiCallPromiseCatch: (err: any) => {
            setGacState({
                ...gacState,
                apiCatchInfo: err
            });
        },
        onApiResultHasErrors: function (errors: any) {
            const errorText = errors.join(', ');
            setGlobalSnackError(errorText);
        },
        onApiFetchNotOk: (fetchInfo: any) => {
            const fetchResult = fetchInfo.fetchResult;
            const fetchConfig = fetchInfo.fetchConfig;

            let s = fetchResult.status;

            if (s === 401) {
                router.push(Urls.account.login(window.location.href))
                return;
            }

            setGacState({
                ...gacState,
                fetchError: {
                    fetchResult: fetchResult,
                    fetchConfig: fetchConfig
                }
            });
        }
    };

    let dialogTitle = 'Global Error';
    let dialogContent = null;

    if (gacState.apiCatchInfo) {
        const info = gacState.apiCatchInfo;
        dialogContent = <>
            <Stack spacing={1}>
                <Typography variant="h5" >Message:</Typography>
                <Typography variant="h6">{info.error.message}</Typography>
                <Typography variant="h6" >URL:</Typography>
                <Typography variant="body2">{info.url}</Typography>
                <Typography variant="h6" >Fetch Config:</Typography>
                <Typography variant="body2" component="pre">{info.fetchConfig ? JSON.stringify(info.fetchConfig, null, 2) : '<NULL>'}</Typography>
                <Typography variant="h5" >Stack:</Typography>
                <Typography variant="body2">
                    {info.error.stack}
                </Typography>
            </Stack>
        </>
    } else if (gacState.fetchError) {
        const fetchResult = gacState.fetchError.fetchResult;
        const fetchConfig = gacState.fetchError.fetchConfig;

        dialogTitle = 'Fetch Error';
        dialogContent = <>
            <Typography variant="h5" marginTop={2}>Status Code: {fetchResult.status}</Typography>
            <Typography variant="h6">Status Text: {fetchResult.statusText}</Typography>
            <Typography variant="h6">URL:</Typography>
            <Typography variant="body2">{fetchResult.url}</Typography>
            <Typography variant="h6">Fetch Config:</Typography>
            <Typography variant="body2" component="pre">{fetchConfig ? JSON.stringify(fetchConfig, null, 2) : null}</Typography>
        </>
    }

    const onErrorRefreshClick = function () {
        window.location.reload();
    }

    function onErrorSnackHide() {
        setGlobalSnackError(null);
    }

    function onSuccessSnackClose() {
        setGacState({ ...gacState, globalSuccessMessage: null });
    }

    return (
        <GlobalAppContext.Provider value={gacValue}>
            {children}
            {
                <Dialog open={!!dialogContent}>
                    <DialogTitle variant='h4' bgcolor="error.main" color="error.contrastText">{dialogTitle}</DialogTitle>
                    <DialogContent>{dialogContent}</DialogContent>
                    <DialogActions>
                        <Button
                            color="error"
                            onClick={onErrorRefreshClick}>Refresh Page</Button>
                    </DialogActions>
                </Dialog>
            }
            {<Snackbar
                    autoHideDuration={10000}
                    open={!!globalSnackError} onClose={onErrorSnackHide}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
                    <Alert
                        severity="error"
                        action={
                            <IconButton
                                size="small"
                                aria-label="close"
                                color="inherit"
                                onClick={onErrorSnackHide}
                            >
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        }>{globalSnackError}</Alert>
                </Snackbar>
            }
            {
                <Snackbar
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    autoHideDuration={5000}
                    open={!!globalSnackSuccess}
                    onClose={onSuccessSnackClose}>
                    <Alert severity="success">
                        {globalSnackSuccess}
                    </Alert>
                </Snackbar>
            }
        </GlobalAppContext.Provider>
    );
}