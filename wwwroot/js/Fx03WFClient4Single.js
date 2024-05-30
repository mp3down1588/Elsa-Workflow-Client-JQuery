var Fx03WFClient4Single = (function (_super) {
    __extends(Fx03WFClient4Single, _super);
    function Fx03WFClient4Single(fx00CMNUtility, baseUrl, userName, password, workflowDefinitionId, userGuid, userName) {
        _super.call(this, fx00CMNUtility, baseUrl, userName, password);
        this.workflowDefinitionId = workflowDefinitionId;
        this.userGuid = userGuid;
        this.userName = userName;
        this.workflowInstanceId = "";
        this.sheetId = "";
        this.wfSchemeEntities = {};
        this.workflowDefinition = {};
        this.workflowPermission = {};
        this.workflowInstance = {};
        this.workflowInstanceJournal = {};
        this.definitionVersion = 0;
        this.definitionVersionId = "";
    }
    //待扩展
    Fx03WFClient4Single.prototype.fxCreateJsonObject4Execute = function () {

    };
    //待扩展
    Fx03WFClient4Single.prototype.fxCreateJsonObject4TriggerEvent = function (eventName, sheetID, eventInput, eventUser, eventMessage, sheetData) {

    };
    //待扩展
    Fx03WFClient4Single.prototype.fxShowWorkflowInfo = function () {

    };
    Fx03WFClient4Single.prototype.fxRefresh = function (sheetId, callBack4DisplayWorkflowDefinition, callBack4DisplayWorkflowInstanceJournal) {
        var fxThis = this;
        fxThis.sheetId = sheetId;
        fxThis.fxLoadWFSchemeEntities(sheetId, function tmp01(jsonObject01) {
            fxThis.wfSchemeEntities = jsonObject01;
            if (jsonObject01.length > 0) {
                fxThis.workflowInstanceId = jsonObject01[0].WFSchemeEntityID;
            } else {
                //fxThis.workflowInstanceId = "";//do nothing(便于测试)
            }
            fxThis.fxLoadWorkflowInstance(function tmp02(jsonObject02) {
                fxThis.workflowInstance = jsonObject02;
                var version = fxThis.workflowInstance.version;
                if (version === "" || version === null || version === undefined) {
                    version = "Latest";
                } else {
                    //do nothing
                }
                fxThis.fxLoadWorkflowDefinitionByDefinitionId(version, function tmp03(jsonObject03) {
                    fxThis.workflowDefinition = jsonObject03;
                    var needActivities = fxThis.fxGetAllActivities(fxThis.workflowDefinition, "|Elsa.FxEvent003|Elsa.Event|");
                    needActivities.forEach((item, index) => {
                        var activity = item;
                        fxThis.fxGetOneActivityExecutions(activity.nodeId, function tmp0301(jsonObject0301) {
                            activity.ActivityExecutions = jsonObject0301;
                        });
                    });
                    fxThis.fxLoadWorkflowPermissionByDefinitionId(function tmp04(jsonObject04) {
                        fxThis.workflowPermission = jsonObject04;
                        fxThis.fxLoadWorkflowInstanceJournal(function tmp05(jsonObject05) {
                            fxThis.workflowInstanceJournal = jsonObject05;
                            if (typeof (callBack4DisplayWorkflowDefinition) === "function" && callBack4DisplayWorkflowDefinition) {
                                callBack4DisplayWorkflowDefinition();
                            } else {
                                //do nothing
                            }
                            if (typeof (callBack4DisplayWorkflowInstanceJournal) === "function" && callBack4DisplayWorkflowInstanceJournal) {
                                callBack4DisplayWorkflowInstanceJournal();
                            } else {
                                //do nothing
                            }
                        });
                    });
                });
            });
        });
    };
    Fx03WFClient4Single.prototype.fxLoadWorkflowDefinitionByDefinitionId = function (versionOptions, callBack) {
        if (versionOptions === null || versionOptions === undefined || versionOptions === "") {
            versionOptions = "Latest";
        } else {
            //do nothing
        }
        var endpoint = `/workflow-definitions/by-definition-id/${this.workflowDefinitionId}?includeCompositeRoot=False&versionOptions=${versionOptions}`;
        var fullUrl = `${this.baseUrl}${endpoint}`;
        this.fx00CMNUtility.fxAjax(fullUrl, "GET", null, null, true, callBack);
    };
    Fx03WFClient4Single.prototype.fxLoadWorkflowInstance = function (callBack) {
        var fxThis = this;
        if (fxThis.workflowInstanceId === null || fxThis.workflowInstanceId === "" || fxThis.workflowInstanceId === undefined) {
            if (typeof (callBack) === "function" && callBack) {
                callBack({});
            } else {
                //do nothing
            }
        } else {
            var endpoint = `/workflow-instances/${this.workflowInstanceId}`;
            var fullUrl = `${this.baseUrl}${endpoint}`;
            this.fx00CMNUtility.fxAjax(fullUrl, "GET", null, null, true, callBack);
        }
    };
    Fx03WFClient4Single.prototype.fxLoadWorkflowInstanceJournal = function (callBack) {
        var fxThis = this;
        var endpoint = `/workflow-instances/${this.workflowInstanceId}/journal?Page=0&PageSize=9999999&Skip=0&Take=9999999`;
        var fullUrl = `${this.baseUrl}${endpoint}`;
        this.fx00CMNUtility.fxAjax(fullUrl, "GET", null, null, true, callBack);
    };
    Fx03WFClient4Single.prototype.fxLoadWFSchemeEntities = function (sheetId, callBack) {
        var fxThis = this;
        fxThis.sheetId = sheetId;
        if (fxThis.sheetId === null || fxThis.sheetId === "" || fxThis.sheetId === undefined) {
            if (typeof (callBack) === "function" && callBack) {
                callBack({});
            } else {
                //do nothing
            }
        } else {
            var rootUrl = fxThis.fx00CMNUtility.fxRootUrl();
            var endpoint = `/Index001?handler=fxLoadWFSchemeEntities&workflowDefinitionId=${this.workflowDefinitionId}&sheetId=${sheetId}`;
            var fullUrl = `${rootUrl}${endpoint}`;
            this.fx00CMNUtility.fxAjax(fullUrl, "GET", null, null, true, callBack);
        }
    };
    Fx03WFClient4Single.prototype.fxLoadWorkflowPermissionByDefinitionId = function (callBack) {
        var fxThis = this;
        var rootUrl = fxThis.fx00CMNUtility.fxRootUrl();
        var endpoint = `/Index001?handler=fxLoadWorkflowPermissionByDefinitionId&workflowDefinitionId=${fxThis.workflowDefinitionId}&userGuid=${fxThis.userGuid}`;
        var fullUrl = `${rootUrl}${endpoint}`;
        this.fx00CMNUtility.fxAjax(fullUrl, "GET", null, null, true, callBack);
    };
    Fx03WFClient4Single.prototype.fxGetOneActivityExecutions = function (activityNodeId, callBack) {
        var fxThis = this;
        var endpoint = `/activity-executions/list?workflowInstanceId=${this.workflowInstanceId}&activityNodeId=${activityNodeId}`;
        var fullUrl = `${this.baseUrl}${endpoint}`;
        this.fx00CMNUtility.fxAjax(fullUrl, "GET", null, null, false, callBack);//必须是同步获得
    };
    Fx03WFClient4Single.prototype.fxGetLatestEventNameFromExecutions = function (activity) {
        var eventName = "";
        if (activity === null || activity === undefined) return eventName;
        if (activity.name === null || activity.name === undefined) return eventName;
        if (activity.ActivityExecutions === null || activity.ActivityExecutions === undefined) return eventName;
        var items = activity.ActivityExecutions.items;
        for (var i = items.length - 1; i >= 0; i--) {
            var item = items[i];
            if (item.activityId === activity.id && item.activityState !== null && item.activityState !== undefined) {
                if (item.activityState.EventName !== null && item.activityState.EventName !== undefined) {
                    return item.activityState.EventName;
                } else {
                    //do nothing
                }
            } else {
                //do nothing
            }
        }
        return eventName;
    };
    Fx03WFClient4Single.prototype.fxGetLatestSheetIDFromExecutions = function (activity) {
        var sheetID = "";
        if (activity === null || activity === undefined) return sheetID;
        if (activity.name === null || activity.name === undefined) return sheetID;
        if (activity.ActivityExecutions === null || activity.ActivityExecutions === undefined) return sheetID;
        var items = activity.ActivityExecutions.items;
        for (var i = items.length - 1; i >= 0; i--) {
            var item = items[i];
            if (item.activityId === activity.id && item.activityState !== null && item.activityState !== undefined) {
                if (item.activityState.EventSheetID !== null && item.activityState.EventSheetID !== undefined) {
                    return item.activityState.EventSheetID;
                } else {
                    //do nothing
                }
            } else {
                //do nothing
            }
        }
        return sheetID;
    };
    Fx03WFClient4Single.prototype.fxGetLatestActivityStateFromExecutions = function (activity) {
        var activityState = {};
        if (activity === null || activity === undefined) return activityState;
        if (activity.name === null || activity.name === undefined) return activityState;
        if (activity.ActivityExecutions === null || activity.ActivityExecutions === undefined) return activityState;
        var items = activity.ActivityExecutions.items;
        for (var i = items.length - 1; i >= 0; i--) {
            var item = items[i];
            if (item.activityId === activity.id && item.activityState !== null && item.activityState !== undefined) {
                activityState = item.activityState;
                break;
            } else {
                //do nothing
            }
        }
        return activityState;
    };
    Fx03WFClient4Single.prototype.fxGetLatestMessageFromExecutions = function (activity) {
        var message = "";
        if (activity === null || activity === undefined) return message;
        if (activity.name === null || activity.name === undefined) return message;
        if (activity.ActivityExecutions === null || activity.ActivityExecutions === undefined) return message;
        var items = activity.ActivityExecutions.items;
        for (var i = items.length - 1; i >= 0; i--) {
            var item = items[i];
            if (item.activityId === activity.id && item.activityState !== null && item.activityState !== undefined) {
                if (item.activityState.EventMessage !== null && item.activityState.EventMessage !== undefined) {
                    return item.activityState.EventMessage;
                } else {
                    //do nothing
                }
            } else {
                //do nothing
            }
        }
        return message;
    };
    Fx03WFClient4Single.prototype.fxGetLatestStatusFromJournal = function (activity) {
        var status = 0;
        if (activity === null || activity === undefined) return status;
        if (activity.name === null || activity.name === undefined) return status;
        if (activity.ActivityExecutions === null || activity.ActivityExecutions === undefined) return status;
        var items = this.workflowInstanceJournal.items;
        if (items === null || items === undefined) return status;
        //items.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));//升序排序
        var currActivityItems = [];
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            if (item.activityId === activity.id) {
                currActivityItems.push(item);
            } else {
                //do nothing
            }
        }
        for (var i = items.length - 1; i >= 0; i--) {
            var item = items[i];
            if (item.activityId === activity.id) {
                switch (item.eventName.toLowerCase()) {
                    case "started":
                    case "suspended":
                        status = 1;
                        break;
                    case "resumed":
                    case "completed":
                        status = 2;
                        break;
                    default:
                        status = 0;
                }
                return status;
            } else {
                //do nothing
            }
        }
        return status;
    };
    Fx03WFClient4Single.prototype.fxGetPermission = function (activity) {
        var permission = 0;
        if (activity === null || activity === undefined) return permission;
        if (activity.name === null || activity.name === undefined) return permission;
        if (this.workflowPermission === null || this.workflowPermission === undefined) return permission;
        var items = this.workflowPermission;
        for (var i = items.length - 1; i >= 0; i--) {
            var item = items[i];
            if (item === activity.id) {
                return 1;
            } else {
                //do nothing
            }
        }
        return permission;
    };
    Fx03WFClient4Single.prototype.fxExecuteWorkflowNew = function (jsonObject4Input, callBack) {
        var fxThis = this;
        workflowDefinitionId = this.workflowDefinitionId;
        var endpoint = `/workflow-definitions/${workflowDefinitionId}/execute`
        var fullUrl = `${this.baseUrl}${endpoint}`;
        var data = {
            Input: jsonObject4Input.Input
        };
        this.fx00CMNUtility.fxAjax(fullUrl, "POST", data, 'application/json', true, function tmp(jsonObj) {
            fxThis.workflowInstanceId = jsonObj.workflowState.id;
            fxThis.definitionVersion = jsonObj.workflowState.definitionVersion;
            fxThis.definitionVersionId = jsonObj.workflowState.definitionVersionId;
            if (typeof (callBack) === "function" && callBack) {
                callBack(jsonObj);
            } else {
                //do nothing
            }
        });
    };
    Fx03WFClient4Single.prototype.fxTriggerEventNew = function (eventName, jsonObject4Input) {
        var fxThis = this;
        var endpoint = `/events/${eventName}/trigger`;
        var fullUrl = `${this.baseUrl}${endpoint}`;
        var data = {
            EventName: eventName,
            //ActivityInstanceId: activityInstanceId,
            WorkflowInstanceId: fxThis.workflowInstanceId,
            WorkflowExecutionMode: 0,
            Input: jsonObject4Input.Input
        };
        this.fx00CMNUtility.fxAjax(fullUrl, "POST", data, 'application/json', true, function tmp(jsonObj) {
            fxThis.fxShowWorkflowInfo();
        });
    };
    Fx03WFClient4Single.prototype.fxTriggerEvent003 = function (eventName, sheetID, eventInput, eventUser, eventMessage) {
        var fxThis = this;
        var endpoint = `/fxevents/${eventName}/fxtrigger`;
        var fullUrl = `${this.baseUrl}${endpoint}`;
        if (eventInput === null || eventInput === undefined) eventInput = "";
        if (eventUser === null || eventUser === undefined) eventUser = "";
        if (eventMessage === null || eventMessage === undefined) eventMessage = "";
        var data = {
            EventName: eventName,
            //ActivityInstanceId: activityInstanceId,
            WorkflowInstanceId: fxThis.workflowInstanceId,
            WorkflowExecutionMode: 1,
            Input: {
                FxSheetID: "FxSheetID001-" + eventName,
                FxCurrEventInput: eventName + "::" + eventInput.toString(),
                FxCurrEventUser: eventUser.toString(),
                FxCurrEventMessage: eventMessage.toString(),
            }
        };
        this.fx00CMNUtility.fxAjax(fullUrl, "POST", data, 'application/json', true, function tmp(jsonObj) {
            fxThis.fxShowWorkflowInfo();
        });
    };
    Fx03WFClient4Single.prototype.fxTriggerEvent003New = function (eventName, jsonObject4Input) {
        var fxThis = this;
        var endpoint = `/fxevents/${eventName}/fxtrigger`;
        var fullUrl = `${this.baseUrl}${endpoint}`;
        //if (eventInput === null || eventInput === undefined) eventInput = "";
        //if (eventUser === null || eventUser === undefined) eventUser = "";
        //if (eventMessage === null || eventMessage === undefined) eventMessage = "";
        var data = {
            EventName: eventName,
            //ActivityInstanceId: activityInstanceId,
            WorkflowInstanceId: fxThis.workflowInstanceId,
            WorkflowExecutionMode: 0,
            Input: jsonObject4Input.Input
        };
        this.fx00CMNUtility.fxAjax(fullUrl, "POST", data, 'application/json', true, function tmp(jsonObj) {
            fxThis.fxShowWorkflowInfo();
        });
    };
    return Fx03WFClient4Single;
}(Fx00WFClientBase));