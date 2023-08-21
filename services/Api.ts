'use client'
import { useContext, useEffect, useState } from 'react';
import ApiUrls from '../config/ApiUrls';
import RequestProjectModel from './ApiModels/RequestProjectModel';
import { GlobalAppContext } from 'hooks/globalAppContext';

class Api {
    gctx: any;

    constructor(gctx: any) {
        this.gctx = gctx;
    }

    fetchGet(url: string, queryParams: any = null): any {
        const config = {
            method: 'GET',
            headers: { 'accept': 'application/json' }
        };

        let qurl = url;

        if (queryParams) {
            qurl += '?' + new URLSearchParams(queryParams);
        }

        let p = this.fetch(qurl, config);

        return {
            then: function (callback: any) {
                p.then(callback);
            },
            thenResult: function (callback: any) {
                p.then(r => callback(r.result));
            }
        }
    }

    fetchPost(url: string, config: any): Promise<any> {
        config = {
            ...config,
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            }
        };

        if (config.isMultipartFormData) {
            delete config.headers['content-type'];
        }

        return this.fetch(url, config);
    }

    fetch(url: any, config: any): Promise<any> {
        let fconfig = {
            method: config.method,
            body: config.body,
            headers: config.headers || {}
        };

        const jwt = localStorage.getItem('jwt');

        if (jwt) {
            fconfig.headers['Authorization'] = 'Bearer ' + jwt;
        }

        // let action = () => { return fetch(url, fconfig); }
        let res: any, reje;

        let promise = new Promise(function (rs, rj) {
            res = rs;
            reje = rj;
        });

        let cancel = false;

        try {
            fetch(url, fconfig).then((result: any) => {
                if (cancel) {
                    return;
                }

                if (!result.ok) {
                    const info = {
                        fetchResult: result,
                        fetchConfig: fconfig,
                    };

                    this.gctx.onApiFetchNotOk(info);
                    return;
                }

                if (config.rawFetchResult) {
                    res(result);
                } else {
                    result.json().then((r: any) => {
                        if (!r.success && r.error?.errors?.length > 0) {
                            this.gctx.onApiResultHasErrors(r.error.errors);
                        }

                        res(r);
                    });
                }
            })
                .catch((e: any) => {
                    this.gctx.onUseApiCallPromiseCatch({
                        error: e,
                        url: url,
                        fetchConfig: fconfig
                    });
                });

        } catch (err) {
            this.gctx.onUseApiCallPromiseCatch(err);
        } finally {

        }

        return promise;
    }

    mockPromise(result: any = null, time = 1500): Promise<any> {
        let pres;
        let promise = new Promise((resolve, reject) => {
            setTimeout(() => resolve(result), time);
        });

        return promise;
    }

    public createProject(form: any): Promise<any> {
        return this.mockPromise();
    }

    public getProjectById(id: number) {
        return this.mockPromise({
            name: 'projectname',
            description: 'description',
            createdOn: 'creatdOn',
            lastModified: 'lastModified',
            githubUrl: 'https://www.github.com/project/id',
        });
    }

    public getAllUserProjects() {
        return this.fetchGet(ApiUrls.myAccount.getmyprojects);
    }

    public DocfxGetDocfxProjectDetails(id: number) {
        return this.fetchGet(ApiUrls.projectmanage.DocfxGetDocfxProjectDetails, { projectid: id });
    }

    public requestProject(model: FormData): Promise<any> {
        return this.fetchPost(ApiUrls.myAccount.requestProject, {
            body: model,
            isMultipartFormData: true
        });
    }

    public adminLogin(password: string): Promise<any> {
        return this.fetchPost(ApiUrls.auth.adminLogin, {
            body: JSON.stringify(password)
        });
    }

    public MyAccountGetAccountDetails(): Promise<any> {
        return this.fetchGet(ApiUrls.myAccount.getAccountDetails);
    }

    public Admin_GetDashboardInfo(): Promise<any> {
        return this.fetchGet(ApiUrls.admin.getDashboardInfo);
    }

    public Admin_GetProjectFiles(projectId: number): Promise<any> {
        return this.fetch(ApiUrls.admin.getProjectFiles(projectId), {
            method: 'GET',
            rawFetchResult: true
        })
            .then(r => r.blob())
            .then(r => {
                let fileUrl = window.URL.createObjectURL(r);
                return fileUrl;
            })
    }

    public Admin_ExecuteRawSql(form: any) {
        return this.fetchPost(ApiUrls.admin.executeRawSql, {
            body: JSON.stringify(form)
        });
    }

    public Admin_GetTableData(form: any) {
        return this.fetchPost(ApiUrls.admin.getTableData, {
            body: JSON.stringify(form)
        });
    }

    public ProjectManage_GetDocfxContentItems(projectid: number) {
        return this.fetchGet(ApiUrls.projectmanage.GetDocfxContentItems(projectid));
    }

    public ProjectManage_DocfxCreateFile(form: any) {
        return this.fetchPost(ApiUrls.projectmanage.DocfxCreateFile, {
            body: JSON.stringify(form)
        });
    }

    public ProjectManage_DocfxGetFileContent(projectid: number, vpath: string) {
        return this.fetchGet(ApiUrls.projectmanage.DocfxGetFileContent(projectid, vpath));
    }

    public ProjectManage_DocfxUpdateFile(form: any) {
        return this.fetchPost(ApiUrls.projectmanage.DocfxUpdateFile, {
            body: JSON.stringify(form)
        });
    }

    public ProjectManage_DocfxMoveFile(form: any) {
        return this.fetchPost(ApiUrls.projectmanage.DocfxMoveFile, {
            body: JSON.stringify(form)
        });
    }

    public ProjectManage_DocfxCreateDirectory(form: any) {
        return this.fetchPost(ApiUrls.projectmanage.DocfxCreateDirectory, {
            body: JSON.stringify(form)
        });
    }

    public ProjectManage_DocfxMoveDirectory(form: { vpathSrc: string; vpathDest: string; projectId: any; }) {
        return this.fetchPost(ApiUrls.projectmanage.DocfxMoveDirectory, {
            body: JSON.stringify(form)
        })
    }

    public ProjectManage_DocfxUploadFile(form: any) {
        return this.fetchPost(ApiUrls.projectmanage.DocfxUploadFile, {
            body: form,
            isMultipartFormData: true
        })
    }

    public ProjectManage_BuildDocfxProject(projectid: number) {
        return this.fetchPost(ApiUrls.projectmanage.BuildDocfxProject, {
            body: JSON.stringify(projectid)
        });
    }

    public Admin_BackgroundWorkerForceRun() {
        return this.fetchPost(ApiUrls.admin.BackgroundWorkerForceRun, {});
    }

    public Admin_BackgroundWorkerRunCheckProjectsHttpStatus() {
        return this.fetchPost(ApiUrls.admin.BackgroundWorkerRunCheckProjectsHttpStatus, {});
    }

    public ProjectManage_GetProjectById(projectid: number) {
        return this.fetchPost(ApiUrls.projectmanage.GetProjectById, {
            body: JSON.stringify(projectid)
        })
    }

    public ProjectManage_DeleteProject(projectid: number) {
        return this.fetchPost(ApiUrls.projectmanage.DeleteProject, {
            body: JSON.stringify(projectid)
        });
    }

    public Auth_CallbackGithubOAuth(githubCode: string) {
        return this.fetchPost(ApiUrls.auth.CallbackGithubOAuth, {
            body: JSON.stringify(githubCode)
        })
    }

    public Auth_Logout() {
        return this.fetchPost(ApiUrls.auth.Logout, {});
    }

    public Home_GetRecentProjects() {
        return this.fetchGet(ApiUrls.home.GetRecentProjects);
    }

    public Home_GetAllProjects() {
        return this.fetchGet(ApiUrls.home.GetAllProjects);

    }

    public ProjectManage_DocfxRemoveFile(form: any) {
        return this.fetchPost(ApiUrls.projectmanage.DocfxRemoveFile, {
            body: JSON.stringify(form)
        });
    }

    public ProjectManage_DocfxRemoveDirectory(form: any) {
        return this.fetchPost(ApiUrls.projectmanage.DocfxRemoveDirectory, {
            body: JSON.stringify(form)
        });
    }
}

// export Api new Api(null);

export default function UseApi() {
    const globalContext = useContext(GlobalAppContext);

    return new Api(globalContext);
}

export function useQueryEffect(action: any, useEffectParam: any = []) {
    const [loading, setLoading] = useState<boolean>(true);
    const [result, setResult] = useState<any>(null);
    const [response, setResponse] = useState<any>(null);

    useEffect(() => {
        action().then((r: any) => {
            setLoading(false);
            setResult(r.result);
            setResponse(r);
        });
    }, useEffectParam);

    return { loading, result, response }
}