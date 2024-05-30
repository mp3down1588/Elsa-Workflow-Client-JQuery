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
var Fx00WFClientBase = (function () {
    function Fx00WFClientBase(fx00CMNUtility, baseUrl, userName, password) {
        this.fx00CMNUtility = fx00CMNUtility;
        this.baseUrl = baseUrl;
        this.accessToken = localStorage.getItem("fxWFAccessToken");
        if (this.accessToken === "" || this.accessToken === undefined || this.accessToken === null) {
            this.fxLogin(userName, password);
        } else {
            this.fx00CMNUtility.accessToken = this.accessToken;
        }
    }
    Fx00WFClientBase.prototype.fxLogin = function (userName, password, callBack) {
        var fxThis = this;
        var endpoint = "/identity/login";
        var fullUrl = `${this.baseUrl}${endpoint}`;
        var data = {
            Username: userName,
            Password: password
        };
        this.fx00CMNUtility.fxAjax(fullUrl, "POST", data, 'application/json', false, function (responseData) {
            localStorage.setItem("fxWFAccessToken", responseData.accessToken);
            fxThis.fx00CMNUtility.accessToken = responseData.accessToken;
        });
    };
    //properties example:|id|definitionId|
    Fx00WFClientBase.prototype.fxGetAllPropertyValues = function (jsonObject, properties) {
        let values = [];
        // Recursive function to traverse the object
        function traverse(obj, props) {
            for (let key in obj) {
                if (typeof obj[key] === 'object' && obj[key] !== null) {
                    // If the value is an object (excluding null), recursively traverse it
                    traverse(obj[key], props);
                } else {
                    if (key !== "" && key !== null && key !== undefined) {
                        // Otherwise, push the value to the array
                        if (props.toLowerCase().indexOf("|" + key.toLowerCase() + "|") >= 0) {
                            values.push(obj[key]);
                        } else {
                            //do nothing
                        }
                    } else {
                        //do nothing
                    }
                }
            }
        }
        // Start traversing the object
        traverse(jsonObject, properties);
        return values;
    };
    Fx00WFClientBase.prototype.fxGetActivity = function (rootActivity, activityId) {
        var fxCurrClient = this;
        if (rootActivity === null || rootActivity === undefined) return {};
        if (rootActivity.activities === null || rootActivity.activities === undefined) return {};
        var retValue = null;
        rootActivity.activities.forEach((item, index) => {
            if (item.id === activityId) {
                retValue = item;
            } else {
                //do nothing
            }
        });
        if (retValue === null) {
            //find next level
            rootActivity.activities.forEach((item, index) => {
                fxCurrClient.fxGetActivity(item, activityId);
            });
        } else {
            return retValue;
        }
    };
    Fx00WFClientBase.prototype.fxGetActivityDescription = function (activity) {
        if (activity === null || activity === undefined) return "{}";
        if (activity.metadata === null || activity.metadata === undefined) return "{}";
        if (activity.metadata.description === null || activity.metadata.description === undefined) {
            return "{}";
        } else {
            return activity.metadata.description;
        }
    };
    Fx00WFClientBase.prototype.fxGetActivityDisplayText = function (activity) {
        if (activity === null || activity === undefined) return "";
        if (activity.metadata === null || activity.metadata === undefined) return "";
        if (activity.metadata.displayText === null || activity.metadata.displayText === undefined) {
            return "";
        } else {
            return activity.metadata.displayText;
        }
    };
    Fx00WFClientBase.prototype.fxGetActivityName = function (activity) {
        if (activity === null || activity === undefined) return "";
        if (activity.name === null || activity.name === undefined) return "";
        return activity.name;
    };
    Fx00WFClientBase.prototype.fxGetActivityDescription = function (activity) {
        if (activity === null || activity === undefined) return "{}";
        if (activity.metadata === null || activity.metadata === undefined) return "{}";
        if (activity.metadata.description === null || activity.metadata.description === undefined) {
            return "{}";
        } else {
            return activity.metadata.description;
        }
    };
    Fx00WFClientBase.prototype.fxGetActivityDesignerPositionY = function (activity) {
        if (activity === null || activity === undefined) return 0;
        if (activity.metadata === null || activity.metadata === undefined) return 0;
        if (activity.metadata.designer === null || activity.metadata.designer === undefined) return 0;
        if (activity.metadata.designer.position === null || activity.metadata.designer.position === undefined) return 0;
        if (activity.metadata.designer.position.y === null || activity.metadata.designer.position.y === undefined) return 0;
        return activity.metadata.designer.position.y;
    };
    //activityTypes='|Elsa.FxEvent003|Elsa.Event|'
    Fx00WFClientBase.prototype.fxGetAllActivities = function (jsonObject4WorkflowDefinition, activityTypes) {
        var fxThis = this;
        var activities = [];
        if (jsonObject4WorkflowDefinition === null || jsonObject4WorkflowDefinition === undefined) return activities;
        if (jsonObject4WorkflowDefinition.root === null || jsonObject4WorkflowDefinition.root === undefined) return activities;
        jsonObject4WorkflowDefinition.root.activities.forEach((item, index) => {
            fxThis.fxGetActivitiesByType(item, activityTypes, activities);
        });
        //取得y坐标按照y坐标排序,确保顺序准确（默认顺序可能不准）
        activities.forEach((item, index) => {
            item.fxPositionY = fxThis.fxGetActivityDesignerPositionY(item);
        });
        activities.sort((a, b) => a.fxPositionY - b.fxPositionY);
        return activities;
    };
    Fx00WFClientBase.prototype.fxGetActivitiesByType = function (activity, activityTypes, retActivities) {
        var fxThis = this;
        if (activity === null || activity === undefined) return retActivities;
        var lowerActivityTypes = activityTypes.toLowerCase();
        var currentActivityType = activity.type.toLowerCase();
        // Perform the index search on the lowercase string
        var idx = lowerActivityTypes.indexOf("|" + currentActivityType + "|");
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
    return Fx00WFClientBase;
}());