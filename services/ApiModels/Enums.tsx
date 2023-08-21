enum ProjectStatus {
    New = 1,
    Active = 2,
    Blocked = 3,
    Requested = 4,
    DeployStarted = 5,
    DeployFailed = 6,
    Building = 7,
    BuildFailed = 8,
}

enum BgProjectHealthCheckStatus {
    Undefined = 0,
    HttpGetOk = 1,
    HttpGetFail = 2,
    SystemFailedToInvokeGet = 3,
    IgnoredBecauseStatusNotActive = 4
}

const ProjectStatusUINames = {
    [ProjectStatus.New]: 'New',
    [ProjectStatus.Active]: 'Active',
    [ProjectStatus.Blocked]: 'Blocked',
    [ProjectStatus.Requested]: 'Requested',
    [ProjectStatus.DeployStarted]: 'Deploy Started',
    [ProjectStatus.DeployFailed]: 'Deploy Failed',
    [ProjectStatus.Building]: 'Building',
    [ProjectStatus.BuildFailed]: 'Build Failed',
}

const BgProjectHealthCheckStatusUINames = {
    [BgProjectHealthCheckStatus.Undefined]: 'UNDEFINED',
    [BgProjectHealthCheckStatus.HttpGetOk]: 'HTTP GET OK',
    [BgProjectHealthCheckStatus.HttpGetFail]: 'HTTP GET FAIL',
    [BgProjectHealthCheckStatus.SystemFailedToInvokeGet]: 'System Failed To Invoke Get',
    [BgProjectHealthCheckStatus.IgnoredBecauseStatusNotActive]: 'Ignored'
}

const einfo: any = {
    ProjectStatus: {
        UIName: ProjectStatusUINames
    },
    BgProjectHealthCheckStatus: {
        UIName: BgProjectHealthCheckStatusUINames
    }
}

const EID = {
    ProjectStatus: 'ProjectStatus',
    BgProjectHealthCheckStatus: 'BgProjectHealthCheckStatus'
}

const UIName = function (eid: any, value: any) {
    let error = '';

    if (!eid) {
        error = 'eid is null or empty';
    } else if (value === null || value === undefined) {
        error = 'value is null or empty';
    } else if (!einfo[eid]) {
        error = 'Enum with id: "${eid}" not found';
    }

    if (error) {
        throw new Error(error);
    }

    return einfo[eid].UIName[value] || value;
}

enum ContentType {
    Folder = 1,
    Yml = 2,
    Md = 3
}

export {
    EID,
    UIName,
    ContentType,
    ProjectStatus,
    BgProjectHealthCheckStatus,
}