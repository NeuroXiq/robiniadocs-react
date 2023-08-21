import Config from "./Config";

const baseurl = Config?.backendUrl + 'api'

const getUrl = function (controller: string, action: string, routeParams: any = null) {

    let url = `${baseurl}/${controller}/${action}`;

    if (routeParams) {
        url += '?' + new URLSearchParams(routeParams);
    }

    return url;
}

// const addUrl  = function (controller : string, action : string, args: any | undefined = null) {
//     let url = getUrl(controller, action, args);

//     if (!urls[controller]) {
//         urls[controller] = { };
//     }

//     urls[controller][action] = url;
// }
let myaccount = 'myAccount';
let projectmanage = 'projectmanage';
let admin = 'admin'
let auth = 'auth';
let home = 'home';


let urls = {
    home: {
        GetRecentProjects: getUrl(home, 'GetRecentProjects'),
        GetAllProjects: getUrl(home, 'GetAllProjects'),
    },
    myAccount: {
        requestProject: getUrl(myaccount, 'requestProject'),
        getAccountDetails: getUrl(myaccount, 'getAccountDetails'),
        getmyprojects: getUrl(myaccount, 'getMyProjects')
    },
    projectmanage: {
        DeleteProject: getUrl(projectmanage, 'DeleteProject'),
        GetProjectById: getUrl(projectmanage, 'GetProjectById'),
        BuildDocfxProject: getUrl(projectmanage, 'BuildDocfxProject'),
        DocfxGetDocfxProjectDetails: getUrl(projectmanage, 'DocfxGetDocfxProjectDetails'),
        DocfxCreateFile: getUrl(projectmanage, 'DocfxCreateFile'),
        GetDocfxContentItems: (projectid: number) => getUrl(projectmanage, 'GetDocfxContentItems', { projectid: projectid }),
        DocfxGetFileContent: (projectid: number, vpath: string) => getUrl(projectmanage, 'DocfxGetFileContent', { projectid: projectid, vpath: vpath }),
        DocfxUpdateFile: getUrl(projectmanage, 'DocfxUpdateFile'),
        DocfxMoveFile: getUrl(projectmanage, 'DocfxMoveFile'),
        DocfxCreateDirectory: getUrl(projectmanage, 'DocfxCreateDirectory'),
        DocfxMoveDirectory: getUrl(projectmanage, 'DocfxMoveDirectory'),
        DocfxUploadFile: getUrl(projectmanage, 'DocfxUploadFile'),
        DocfxRemoveFile: getUrl(projectmanage, 'DocfxRemoveFile'),
        DocfxRemoveDirectory: getUrl(projectmanage, 'DocfxRemoveDirectory'),
    },
    auth: {
        adminLogin: getUrl(auth, 'adminLogin'),
        CallbackGithubOAuth: getUrl(auth, 'CallbackGithubOAuth'),
        Logout: getUrl(auth, 'Logout')
    },
    admin: {
        BackgroundWorkerForceRun: getUrl(admin, 'BackgroundWorkerForceRun'),
        BackgroundWorkerRunCheckProjectsHttpStatus: getUrl(admin, 'BackgroundWorkerRunCheckProjectsHttpStatus'),
        BackgroundWorkerRebuildAllProjects: getUrl(admin, 'BackgroundWorkerRebuildAllProjects'),
        executeRawSql: getUrl(admin, 'ExecuteRawSql'),
        getDashboardInfo: getUrl(admin, 'GetDashboardInfo'),
        getProjectFiles: (id: number) => getUrl(admin, 'GetProjectFiles', { id: id }),
        getTableData: getUrl(admin, 'GetTableData')
    }
} as any;


// addUrl(myaccount, 'requestProject');
// addUrl(myaccount, 'getAccountDetails');
// addUrl(myaccount, 'getmyprojects');

// addUrl(projectmanage, 'docfxgetdocfxinfo')


// addUrl(auth, 'adminLogin');

export default urls;