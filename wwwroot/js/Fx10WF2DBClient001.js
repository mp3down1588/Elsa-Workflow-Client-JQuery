var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Fx10WF2DBClient001 = (function () {
    function Fx10WF2DBClient001(fx00CMNUtility, baseUrl4WF2DB, baseUrl4WorkflowDefinition, userName, password) {
        this.fx00CMNUtility = fx00CMNUtility;
        this.baseUrl4WF2DB = baseUrl4WF2DB;
        this.baseUrl4WorkflowDefinition = baseUrl4WorkflowDefinition;
        this.workflowDefinition = {};
        this.accessToken = localStorage.getItem("fxWFAccessToken");
        if (this.accessToken === "" || this.accessToken === undefined || this.accessToken === null) {
            this.fxLogin(userName, password);
        } else {
            //do nothing
        }
    }
    Fx10WF2DBClient001.prototype.fxLogin = function (userName, password, callBack) {
        var fxThis = this;
        var endpoint = "/identity/login";
        var fullUrl = `${this.baseUrl}${endpoint}`;
        var data = {
            Username: userName,
            Password: password
        };
        this.fx00CMNUtility.fxAjax(fullUrl, "POST", data, 'application/json', false, function (responseData) {
            localStorage.setItem("fxWFAccessToken", responseData.accessToken);
            fxThis.accessToken = responseData.accessToken;
        });
    };
    Fx10WF2DBClient001.prototype.fxWriteWF2DB = function (workflowDefinitionId, versionOptions) {
        var fxThis = this;
        if (versionOptions === null || versionOptions === undefined || versionOptions === "") {
            versionOptions = "Latest";
        } else {
            //do nothing
        }
        var endpoint = `/workflow-definitions/by-definition-id/${workflowDefinitionId}?includeCompositeRoot=False&versionOptions=${versionOptions}`;
        var fullUrl = `${this.baseUrl4WorkflowDefinition}${endpoint}`;
        this.fx00CMNUtility.fxAjax(fullUrl, "GET", null, null, true, function tmp(jsonObject) {
            fxThis.workflowDefinition = jsonObject;
            fxThis.fxWrite2DB4WFScheme();
            fxThis.fxWrite2DB4WFTransitionScheme();
            fxThis.fxWrite2DB4WFTransitionSchemeVersion();
        });
    };
    Fx10WF2DBClient001.prototype.fxWrite2DB4WFScheme = function () {
        var fxThis = this;
        var description = fxThis.workflowDefinition.description;
        if (description === "" || description === undefined || description === null) {
            description = "{}";
        }
        var descObj = {};
        try {
            descObj = JSON.parse(description);
        } catch (error) {
            console.error("An error occurred:", error.message);
        } finally {
            //nothing
        }
        var currObj = fxThis.workflowDefinition;
        var endpoint = `FxWrite2DB4WFScheme` +
            `&WFSchemeID=${fxThis.fxEncode(currObj.definitionId)}` +
            `&WorkFlowName=${fxThis.fxEncode(currObj.name)}` +
            `&GroupName=${fxThis.fxEncode(descObj.groupname)}` +
            `&AssemblyName=${fxThis.fxEncode('')}` +
            `&TypeName=${fxThis.fxEncode('')}` +
            `&Status=${fxThis.fxEncode('1')}` +
            `&CurrVersion=${fxThis.fxEncode(currObj.version)}` +
            `&FlagDelete=${fxThis.fxEncode('0')}` +
            `&AppModuleID=${fxThis.fxEncode('')}` +
            `&Description=${fxThis.fxEncode(descObj.description)}` +
            `&SortID=${fxThis.fxEncode('100')}` +
            `&CreateDate=${fxThis.fxEncode('')}` +
            `&CreateUserID=${fxThis.fxEncode('')}` +
            `&UpdateDate=${fxThis.fxEncode('')}` +
            `&UpdateUserID=${fxThis.fxEncode('')}`
        var fullUrl = `${this.baseUrl4WF2DB}${endpoint}`;
        this.fx00CMNUtility.fxAjax(fullUrl, "GET", null, null, true, function tmp(jsonObject) {
            console.log("fxWrite2DB4WFScheme::" + jsonObject);
        });
    };
    Fx10WF2DBClient001.prototype.fxWrite2DB4WFTransitionScheme = function () {
        var fxThis = this;
        var needActivities = fxThis.fxGetAllActivities(fxThis.workflowDefinition, "|Elsa.FxEvent003|Elsa.Event|");
        needActivities.forEach((item, index) => {
            var currObj = item;
            var endpoint = `FxWrite2DB4WFTransitionScheme` +
                `&WFTransitionSchemeID=${fxThis.fxEncode(currObj.id)}` +
                `&WFSchemeID=${fxThis.fxEncode(fxThis.workflowDefinition.definitionId)}` +
                `&TransitionName=${fxThis.fxEncode(currObj.name)}` +
                `&OpName=${fxThis.fxEncode(fxThis.fxGetActivityDisplayText(currObj))}` +
                `&BookMarkName=${fxThis.fxEncode(fxThis.fxGetActivityDisplayText(currObj))}` +
                `&WFScreenAssemblyName=${fxThis.fxEncode('')}` +
                `&WFScreenTypeName=${fxThis.fxEncode('')}` +
                `&WFInputScreenAssemblyName=${fxThis.fxEncode('')}` +
                `&WFInputScreenTypeName=${fxThis.fxEncode('')}` +
                `&WFValidatorAssemblyName=${fxThis.fxEncode('')}` +
                `&WFValidatorTypeName=${fxThis.fxEncode('')}` +
                `&CheckPermission=${fxThis.fxEncode('1')}` +
                `&WFInputScreenBtnsInJSON=${fxThis.fxEncode(fxThis.fxGetActivityDescription(currObj))}` +
                `&FromStatusID=${fxThis.fxEncode('')}` +
                `&ToStatusID=${fxThis.fxEncode('')}` +
                `&WFScreenID=${fxThis.fxEncode('')}` +
                `&RelationID=${fxThis.fxEncode('')}` +
                `&RelationText=${fxThis.fxEncode('')}` +
                `&FlagDelete=${fxThis.fxEncode('0')}` +
                `&EnableBack=${fxThis.fxEncode('1')}` +
                `&SortID=${fxThis.fxEncode((index + 1) * 100)}` +
                `&DWObject4ExecuteValidate=${fxThis.fxEncode('')}` +
                `&DWObject4BackValidate=${fxThis.fxEncode('')}` +
                `&DWObject4Mail=${fxThis.fxEncode('')}` +
                `&DWObject4Task=${fxThis.fxEncode('')}` +
                `&SPAfterExecute=${fxThis.fxEncode('')}` +
                `&CreateDate=${fxThis.fxEncode('')}` +
                `&CreateUserID=${fxThis.fxEncode('')}` +
                `&UpdateDate=${fxThis.fxEncode('')}` +
                `&UpdateUserID=${fxThis.fxEncode('')}` +
                `&NextWFSchemeIDS=${fxThis.fxEncode('')}` +
                `&WFExecutorScreenid=${fxThis.fxEncode('')}` +
                `&SendWFTskTo=${fxThis.fxEncode('')}` +
                `&WFTaskUserRule=${fxThis.fxEncode('')}` +
                `&Sql4EntityLoad=${fxThis.fxEncode('')}` +
                `&Xslt4TaskUrl=${fxThis.fxEncode('')}` +
                `&Xslt4TaskDescription=${fxThis.fxEncode('')}` +
                `&Xslt4Mail=${fxThis.fxEncode('')}` +
                `&Xslt4Message=${fxThis.fxEncode('')}` +
                `&Xslt4TaskRelationID=${fxThis.fxEncode('')}` +
                `&EntityViewName=${fxThis.fxEncode('')}` +
                `&HideIfNoPermission=${fxThis.fxEncode('0')}` 
            var fullUrl = `${this.baseUrl4WF2DB}${endpoint}`;
            this.fx00CMNUtility.fxAjax(fullUrl, "GET", null, null, true, function tmp(jsonObject) {
                console.log("fxWrite2DB4WFTransitionScheme::" + jsonObject);
            });
        });
    };
    Fx10WF2DBClient001.prototype.fxWrite2DB4WFTransitionSchemeVersion = function () {
        var fxThis = this;
        var needActivities = fxThis.fxGetAllActivities(fxThis.workflowDefinition, "|Elsa.FxEvent003|Elsa.Event|");
        needActivities.forEach((item, index) => {
            var currObj = item;
            var endpoint = `FxWrite2DB4WFTransitionSchemeVersion` +
                `&WFSchemeID=${fxThis.workflowDefinition.definitionId}` +
                `&WFTransitionSchemeID=${fxThis.fxEncode(currObj.id)}` +
                `&Version=${fxThis.fxEncode(fxThis.workflowDefinition.version)}` 
            var fullUrl = `${this.baseUrl4WF2DB}${endpoint}`;
            this.fx00CMNUtility.fxAjax(fullUrl, "GET", null, null, true, function tmp(jsonObject) {
                console.log("fxWrite2DB4WFTransitionSchemeVersion::" + jsonObject);
            });
        });
    };
    //activityTypes='|Elsa.FxEvent003|Elsa.Event|'
    Fx10WF2DBClient001.prototype.fxGetAllActivities = function (jsonObject4WorkflowDefinition, activityTypes) {
        var fxThis = this;
        var activities = [];
        if (jsonObject4WorkflowDefinition === null || jsonObject4WorkflowDefinition === undefined) return activities;
        if (jsonObject4WorkflowDefinition.root === null || jsonObject4WorkflowDefinition.root === undefined) return activities;
        jsonObject4WorkflowDefinition.root.activities.forEach((item, index) => {
            fxThis.fxGetActivitiesByType(item, activityTypes, activities);
        });
        return activities;
    };
    Fx10WF2DBClient001.prototype.fxGetActivitiesByType = function (activity, activityTypes, retActivities) {
        var fxThis = this;
        if (activity === null || activity === undefined) return retActivities;
        var lowerActivityTypes = activityTypes.toLowerCase();
        var currentActivityType = activity.type.toLowerCase();
        // Perform the index search on the lowercase string
        var idx = lowerActivityTypes.indexOf(currentActivityType);
        if (idx >= 0) {
            retActivities.push(activity);
        } else {
            //do nothing
        }
        if (activity.activities === null || activity.activities === undefined) return retActivities;
        activity.activities.forEach((item, index) => {
            fxThis.fxGetActivitiesByType(item, activityType, retActivities);
        });
    };
    Fx10WF2DBClient001.prototype.fxEncode = function (input) {
        if (input === null || input === "" || input === undefined) {
            return "";
        } else {
            return encodeURIComponent(input);
        }
    };
    Fx10WF2DBClient001.prototype.fxGetActivityDisplayText = function (activity) {
        if (activity === null || activity === undefined) return "";
        if (activity.metadata === null || activity.metadata === undefined) return "";
        if (activity.metadata.displayText === null || activity.metadata.displayText === undefined) {
            return "";
        } else {
            return activity.metadata.displayText;
        }
    };
    Fx10WF2DBClient001.prototype.fxGetActivityDescription = function (activity) {
        if (activity === null || activity === undefined) return "{}";
        if (activity.metadata === null || activity.metadata === undefined) return "{}";
        if (activity.metadata.description === null || activity.metadata.description === undefined) {
            return "{}";
        } else {
            return activity.metadata.description;
        }
    };
    return Fx10WF2DBClient001;
}());
var Fx10WF2DBClient001Ext = (function (_super) {
    __extends(Fx10WF2DBClient001Ext, _super);
    function Fx10WF2DBClient001Ext(fx00CMNUtility, baseUrl4WF2DB, baseUrl4WorkflowDefinition, userName, password) {
        _super.call(this, fx00CMNUtility, baseUrl4WF2DB, baseUrl4WorkflowDefinition, userName, password);
    }
    return Fx10WF2DBClient001Ext;
}(Fx10WF2DBClient001));