import Config from "./Config";

const account = 'account';
const project = 'project';
const home = 'home';

let robiniadocsDocfx = Config?.backendUrl + 'd';
let robiniadocsTutorial = robiniadocsDocfx + '/robiniadocs';

const Urls = {
    other: {
        robiniadocsTutorial: robiniadocsTutorial,
        robiniadocsGithubRepository: 'https://github.com/NeuroXiq/RobiniaDocs'
    },
    robiniadocsUrl: function (urlPrefix: any) { return `${robiniadocsDocfx}/${urlPrefix}/` },
    account: {
        login: (returnUrl : string = '/') => `/${account}/login?return=${returnUrl}`,
        details: `/${account}/details`
    },
    project: {
        createProject: `/${project}/create-project`,
        docfxMain: (id : number) => `/${project}/${id}/docfx-main`,
        docfxFilesExplorer: (id : number) => `/${project}/${id}/docfx-files-explorer`,
        docfxEditFile: (id : number) => `/${project}/${id}/docfx-edit-file`,
        delete: (id: number) => `/${project}/${id}/delete`
    },
    home: {
        index: `/${home}/`,
        howToUse: `/${home}/how-to-use`,
        termsOfService: `/${home}/terms-of-service`,
        projects: `/projects`,
    }
};

export default Urls;