'use client';
import { Backdrop, Box, Button, Card, Checkbox, FormControl, FormControlLabel, FormLabel, Input, InputLabel, Paper, Radio, RadioGroup, Snackbar, TextField, Typography } from "@mui/material";
import { useState } from "react";
import Api from '../../../../services/Api';
import PageLoading from "../../../../components/PageLoading";
import UploadFilesButton from "../../../../components/UploadFilesButton";
import RequestProjectModel from "../../../../services/ApiModels/RequestProjectModel";
import getConfig from "next/config";
import { CheckBox } from "@mui/icons-material";
import UseApi from "../../../../services/Api";
import { useRouter } from "next/navigation";
import Urls from "config/Urls";

export default function Index() {
    const [formInput, setFormInput] = useState<any>({
        filessource: 'filesfromnuget',
        projectname: '',
        githuburl: '',
        robiniaurlprefix: '',
        nugetpackagename: '',
        projectfiles: []
    });

    const api = UseApi();
    const router = useRouter();

    const [formErrors, setFormErrors] = useState<any>({});
    const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isCustomPrefix, setRcuDisabled] = useState<boolean>(false);

    const onInput = function (e: any) {
        let name = e.target.name;
        let newv = e.target.value;

        let news = { ...formInput, [name]: newv };

        if (name === 'projectname' && !isCustomPrefix) {
            news.robiniaurlprefix = newv;
        }

        if (name === 'filessource' && newv === 'filesfromdisk') {
            news.nugetpackagename = '';
        }

        if (name === 'projectfiles') {
            news.projectfiles = e.target.files;
        }

        news.robiniaurlprefix = normalizeUrlPrefix(news.robiniaurlprefix);

        setFormInput(news);
    }

    const normalizeUrlPrefix = function (val: string) {
        if (!val) {
            return '';
        }

        val = val.toLowerCase();
        let result = '';

        for (let i = 0; i < val.length; i++) {
            if (val[i] >= 'a' && val[i] <= 'z') {
                result += val[i];
            } else {
                result += '-';
            }
        }

        return result;
    }

    const onSubmit = function (e: any) {
        e.preventDefault();
        setIsLoading(true);

        let formData = new FormData();
        formData.append('projectname', formInput.projectname);
        formData.append('description', formInput.description);
        formData.append('githuburl', formInput.githuburl);
        formData.append('robiniaurlprefix', formInput.robiniaurlprefix);
        formData.append('nugetpackagename', formInput.nugetpackagename);

        for (let i = 0; i < formInput.projectfiles.length; i++) {
            formData.append(
                'projectfiles',
                formInput.projectfiles[i],
                formInput.projectfiles[i].name);
        }

        api.requestProject(formData)
            .then((r: any) => {
                setIsLoading(false);
                setFormErrors(r.error);
                if (r.success) {
                    setSubmitSuccess(true);
                    router.push(Urls.account.details);
                }
            });
    }

    const submitOkSnackbar = function () {
        return (<Snackbar open={submitSuccess} autoHideDuration={6000} message="Submit success" />);
    }

    let filesFromNuget = formInput.filessource === 'filesfromnuget';

    const getFieldError = function (field: string) {
        if ((formErrors?.fieldErrors?.length ?? 0) === 0) {
            return null;
        }

        return formErrors?.fieldErrors.find((e: any) => e.fieldName.toLowerCase() === field);
    }

    const onCustomUrlCheckbox = function (e: any) {
        let isCustom = e.target.checked;

        setRcuDisabled(isCustom);
        setFormInput({ ...formInput, ['robiniaurlprefix']: normalizeUrlPrefix(formInput.projectname) });
    }

    const hasError = function (field: string) {
        return getFieldError(field) != null;
    }

    const errorText = function (field: string) {
        const errors = getFieldError(field)?.errors;

        if (errors?.length > 0) {
            return errors.join('. ');
        }
    }

    return (
        <>
            {submitSuccess && submitOkSnackbar()}
            <PageLoading open={isLoading} />
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Paper sx={{ padding: '', minWidth: '50vw', maxWidth: '50vw' }}>
                    <Typography bgcolor="primary.main" color="white" variant="h4" align="center" padding={'0.5rem'}>Create new project</Typography>
                    <Box sx={{ padding: '1rem', '& button': { marginTop: '16px', marginBottom: '8px' } }}>
                        <form onSubmit={onSubmit}>
                            <FormControl variant="outlined" fullWidth margin="normal">
                                <TextField
                                    name="projectname"
                                    error={hasError('projectname')}
                                    helperText={errorText('projectname')}
                                    onChange={onInput}
                                    margin="normal"
                                    variant="outlined"
                                    fullWidth
                                    id="projectname" type="text" label="Project name"></TextField>

                                <TextField
                                    error={hasError('description')}
                                    helperText={errorText('description')}
                                    onChange={onInput}
                                    margin="normal"
                                    variant="outlined"
                                    name="description"
                                    fullWidth
                                    id="description"
                                    rows={2} type="text"
                                    multiline
                                    label="Description"></TextField>

                                <FormControlLabel control={<Checkbox onChange={onCustomUrlCheckbox} />} label="Custom url prefix"></FormControlLabel>
                                <TextField
                                    name="robiniaurlprefix"
                                    disabled={!isCustomPrefix}
                                    error={hasError('robiniaurlprefix')}
                                    helperText={errorText('robiniaurlprefix')}
                                    onChange={onInput}
                                    margin="normal"
                                    variant="outlined"
                                    fullWidth
                                    id="robiniaurlprefix"
                                    type="text"
                                    label="Robinia Url Prefix"
                                    value={formInput['robiniaurlprefix']}>

                                </TextField>
                                <TextField
                                    name="githuburl"
                                    helperText={errorText('githuburl')}
                                    error={hasError('githuburl')}
                                    onChange={onInput}
                                    margin="normal"
                                    variant="outlined"
                                    fullWidth
                                    id="githuburl"
                                    type="text"
                                    label="Github Url"></TextField>
                                <FormLabel id="files-source">Files Source</FormLabel>

                                <RadioGroup
                                    onChange={onInput}
                                    row name="filessource" defaultValue="filesfromnuget">
                                    <FormControlLabel value="filesfromdisk" control={<Radio />} label={'Upload files from disk'} />
                                    <FormControlLabel value="filesfromnuget" control={<Radio />} label={'Nuget Package'} />
                                </RadioGroup>

                                <TextField
                                    error={hasError('nugetpackagename')}
                                    helperText={errorText('nugetpackagename')}
                                    onChange={onInput}
                                    margin="normal"
                                    fullWidth
                                    name="nugetpackagename"
                                    id="nugetpackagename"
                                    type="text"
                                    label="Nuget Package Name"
                                    disabled={!filesFromNuget} />
                                <UploadFilesButton
                                    disabled={filesFromNuget}
                                    onChange={onInput}
                                    name="projectfiles"
                                    hasError={hasError('projectfiles')}
                                    errorText={errorText('projectfiles')}/>
                                <Button variant="contained" type="submit" disabled={submitSuccess}>Submit</Button>
                            </FormControl>
                        </form>
                    </Box>
                </Paper>
            </Box>
        </>

    );
}