var Fx03WFClient4All = (function (_super) {
    __extends(Fx03WFClient4All, _super);
    function Fx03WFClient4All(fx00CMNUtility, baseUrl, userName, password) {
        _super.call(this, fx00CMNUtility, baseUrl, userName, password);
    }
    Fx03WFClient4All.prototype.fxLoadWorkflowDefinitions = function (versionOptions, pageIndex, pageSize, orderDirection, callBack) {
        var endpoint = `/workflow-definitions?versionOptions=${versionOptions}&Page=${pageIndex}&PageSize=${pageSize}&OrderDirection=${orderDirection}`;
        var fullUrl = `${this.baseUrl}${endpoint}`;
        this.fx00CMNUtility.fxAjax(fullUrl, "GET", null, null, true, callBack);
    };
    Fx03WFClient4All.prototype.fxLoadWorkflowInstances = function (workflowDefinitionId, versionOptions, pageIndex, pageSize, orderDirection, callBack) {
        var endpoint = ``;
        if (workflowDefinitionId === null || workflowDefinitionId === undefined || workflowDefinitionId === "") {
            endpoint = `/workflow-instances?Page=${pageIndex}&PageSize=${pageSize}&OrderDirection=${orderDirection}`;
        } else {
            endpoint = `/workflow-instances?Page=${pageIndex}&PageSize=${pageSize}&OrderDirection=${orderDirection}&DefinitionIds=${workflowDefinitionId}`;
        }
        var fullUrl = `${this.baseUrl}${endpoint}`;
        this.fx00CMNUtility.fxAjax(fullUrl, "GET", null, null, true, callBack);
    };
    Fx03WFClient4All.prototype.fxLoadWorkflowDefinitionByDefinitionId = function (workflowDefinitionId, versionOptions, callBack) {
        if (versionOptions === null || versionOptions === undefined || versionOptions === "") {
            versionOptions = "Latest";
        } else {
            //do nothing
        }
        var endpoint = `/workflow-definitions/by-definition-id/${workflowDefinitionId}?includeCompositeRoot=False&versionOptions=${versionOptions}`;
        var fullUrl = `${this.baseUrl}${endpoint}`;
        this.fx00CMNUtility.fxAjax(fullUrl, "GET", null, null, true, callBack);
    };
    Fx00WFClientBase.prototype.fxNewID = function () {
        var rootUrl = this.fx00CMNUtility.fxRootUrl();
        var endpoint = `/Index001?handler=NewID`;
        var fullUrl = `${rootUrl}${endpoint}`;
        var newId = ""
        this.fx00CMNUtility.fxAjax(fullUrl, "GET", null, null, false, function tmp(jsonObject) {
            newId = jsonObject.id;
        });
        return newId;
    };
    Fx03WFClient4All.prototype.fxSaveAs = function (workflowDefinitionId, versionOptions) {
        var fxThis = this;
        if (versionOptions === null || versionOptions === undefined || versionOptions === "") {
            versionOptions = "Latest";
        } else {
            //do nothing
        }
        var endpoint = `/workflow-definitions/by-definition-id/${workflowDefinitionId}?includeCompositeRoot=False&versionOptions=${versionOptions}`;
        var fullUrl = `${this.baseUrl}${endpoint}`;
        var newStr = "";
        var newWorkflowName = "abc";
        this.fx00CMNUtility.fxAjax(fullUrl, "GET", null, null, false, function tmp(jsonObject) {
            //jsonObject.id = fxThis.fxNewID();
            //jsonObject.definitionId = fxThis.fxNewID();
            jsonObject.name = jsonObject.name + "::1";
            newWorkflowName = jsonObject.name;
            const invalidCharsRegex = /[<>:"/\\|?*]/g;
            newWorkflowName = newWorkflowName.replace(invalidCharsRegex, '-') + ".json";
            var allPropertyValues = fxThis.fxGetAllPropertyValues(jsonObject, "|id|definitionId|");
            newStr = JSON.stringify(jsonObject);
            allPropertyValues.forEach((item, index) => {
                var newId = fxThis.fxNewID();
                newStr = fxThis.fx00CMNUtility.fxReplaceAll(newStr, item, newId);
            });
        });
        fxThis.fx00CMNUtility.fxSaveStringToFile(newStr, newWorkflowName);
        return newStr;
    };
    return Fx03WFClient4All;
}(Fx00WFClientBase));