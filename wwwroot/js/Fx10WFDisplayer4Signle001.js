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
var Fx10WFDisplayer4Signle001 = (function () {
    function Fx10WFDisplayer4Signle001(fx00CMNUtility) {
        this.fx00CMNUtility = fx00CMNUtility;
        this.fxStatusIcon = {};
        this.fxStatusIcon["000"] = `<span class="bi bi-clock color-blue-grey-100" style="width:18px;"></span>`;
        this.fxStatusIcon["001"] = `<span class="bi bi-clock color-blue-grey-100" style="width:18px;"></span>`;
        this.fxStatusIcon["010"] = `<span class="bi bi-clock color-blue-grey-100" style="width:18px;"></span>`;
        this.fxStatusIcon["011"] = `<span class="bi bi-clock color-blue-grey-100" style="width:18px;"></span>`;
        this.fxStatusIcon["100"] = `<span class="bi bi-lock color-red-500" style="width:18px;"></span>`;
        this.fxStatusIcon["101"] = `<span class="bi bi-lock color-red-500" style="width:18px;"></span>`;
        this.fxStatusIcon["110"] = `<span class="bi bi-check-circle color-orange-500" style="width:18px;"></span>`;
        this.fxStatusIcon["111"] = `<span class="bi bi-check-circle text-primary" style="width:18px;"></span>`;
        this.fxStatusIcon["200"] = `<span class="bi bi-check-circle color-teal-500" style="width:18px;"></span>`;
        this.fxStatusIcon["201"] = `<span class="bi bi-check-circle color-teal-500" style="width:18px;"></span>`;
        this.fxStatusIcon["210"] = `<span class="bi bi-check-circle color-teal-500" style="width:18px;"></span>`;
        this.fxStatusIcon["211"] = `<span class="bi bi-check-circle color-teal-500" style="width:18px;"></span>`;
    }
    Fx10WFDisplayer4Signle001.prototype.fxShowWorkflowDefinition = function (displayerID, fxCurr03WFClient4Single, varName4fxCurr03WFClient4Single) {
        var fxThis = this;
        var activities = fxCurr03WFClient4Single.fxGetAllActivities(fxCurr03WFClient4Single.workflowDefinition, "|Elsa.FxEvent003|Elsa.Event|");
        var html = "";
        activities.forEach((item, index) => {
            var activity = item;
            var eventNameInDefinition = fxCurr03WFClient4Single.fxGetActivityName(activity);
            var displayText = fxCurr03WFClient4Single.fxGetActivityDisplayText(activity);
            if (displayText === null || displayText === undefined || displayText === "") {
                displayText = eventNameInDefinition;
            } else {
                //do nothing
            }
            var eventName = fxCurr03WFClient4Single.fxGetLatestEventNameFromExecutions(activity);
            var sheetID = fxCurr03WFClient4Single.fxGetLatestSheetIDFromExecutions(activity);
            var description = fxCurr03WFClient4Single.fxGetActivityDescription(activity);
            var status = fxCurr03WFClient4Single.fxGetLatestStatusFromJournal(activity);
            var permission = fxCurr03WFClient4Single.fxGetPermission(activity);
            permission = 1;//临时设置为有权限
            var transferUI = 1;//不需要切换页面
            var statusIcon = `${status}${permission}${transferUI}`;
            var buttonsHtml = "";
            if (activity.type === "Elsa.FxEvent003") {
                var descriptionObject = JSON.parse(description);
                if (descriptionObject !== null && descriptionObject !== undefined && Array.isArray(descriptionObject.buttons)) {
                    descriptionObject.buttons.forEach((btn, index) => {
                        buttonsHtml += `<input type='button' style="width:100%;" class="btn btn-sm w-100 mb-1 btn-primary" onclick="${varName4fxCurr03WFClient4Single}.fxTriggerEvent003New('${eventName}',${varName4fxCurr03WFClient4Single}.fxCreateJsonObject4TriggerEvent('${eventName}','${sheetID}','${btn.input}','admin123','${btn.msg}',''))" value='${btn.txt}'>`;
                    });
                } else {
                    buttonsHtml += `<input type='button' style="width:100%;" class="btn btn-sm w-100 mb-1 btn-primary" onclick="${varName4fxCurr03WFClient4Single}.fxTriggerEvent003New('${eventName}', ${varName4fxCurr03WFClient4Single}.fxCreateJsonObject4TriggerEvent('${eventName}','','','','',''))" value='通过(默认)'>`;
                    buttonsHtml += `<input type='button' style="width:100%;" class="btn btn-sm w-100 mb-1 btn-primary" onclick="${varName4fxCurr03WFClient4Single}.fxTriggerEvent003New('${eventName}', ${varName4fxCurr03WFClient4Single}.fxCreateJsonObject4TriggerEvent('${eventName}','','','','',''))" value='驳回(默认)'>`;
                }
            } else if (activity.type === "Elsa.Event") {
                buttonsHtml += `<input type='button' style="width:100%;" class="btn btn-sm w-100 mb-1 btn-primary" onclick="${varName4fxCurr03WFClient4Single}.fxTriggerEventNew('${eventName}', ${varName4fxCurr03WFClient4Single}.fxCreateJsonObject4TriggerEvent('${eventName}','','','','',''))" value='${eventName}'>`;
            }
            if (eventNameInDefinition === null || eventNameInDefinition === undefined || eventNameInDefinition === "") {
                // html += `
                //     <div class="fxItem" style="cursor:pointer;">
                //         <span>${item.id}</span><br/>
                //         <span>${item.activityType}&nbsp;${item.eventName}</span>&nbsp
                //     </div>
                //     `
            } else {
                html += `
                        <div class="fxRow" style="cursor:pointer;">
                            <div class="fxCell" style="width:30px;">
                                <!--<i class="bi bi-check-circle-fill" style="font-size: 16px; color: #009688;"></i>-->
                                ${fxThis.fxStatusIcon[statusIcon]}
                            </div>
                            <div class="fxCell">
                                <span>${displayText}</span>
                            </div>
                        </div>
                        
                        `;
                //节点挂起，且有权限，且不需要切换页面
                if (status === 1 && permission === 1 && transferUI === 1) {
                    html += `
                        <div class="fxRow" style="cursor:pointer;">
                            <div class="fxCell" style="width:30px;">

                            </div>
                            <div class="fxCell">
                                <textarea type="text" class="form-control" style="margin-bottom:5px;width:100%;" value="${displayText}" placeholder="Message"></textarea>
                            </div>
                        </div>
                        <div class="fxRow" style="cursor:pointer;">
                            <div class="fxCell" style="width:30px;">
                                
                            </div>
                            <div class="fxCell">
                                ${buttonsHtml}
                            </div>
                        </div>
                    `;
                } else {
                    //do nothing
                }
            }
        });
        $("#" + displayerID).html(`
            <div style="padding-left:16px;padding-right:16px;">
                <div class="fxTable">
                ${html}
                </div>
            </div>`);
    };
    Fx10WFDisplayer4Signle001.prototype.fxDuration = function (startTime, endTime) {
        let difference = endTime.getTime() - startTime.getTime();

        // Convert the difference to hours, minutes, and seconds
        const days = Math.floor(difference / (24 * 1000 * 60 * 60));
        const d = days > 0 ? days.toString() + "天" : "";
        if (d.length > 0) return d;
        difference %= 24 * 1000 * 60 * 60;
        const hours = Math.floor(difference / (1000 * 60 * 60));
        const h = (days > 0 ? hours.toString() + "小时" : (hours > 0 ? hours.toString() + "小时" : ""));
        if (h.length > 0) return h;
        difference %= 1000 * 60 * 60;
        const minutes = Math.floor(difference / (1000 * 60));
        const m = (days > 0 || hours > 0 ? minutes.toString() + "分" : (minutes > 0 ? minutes.toString() + "分" : ""));
        if (m.length > 0) return m;
        difference %= 1000 * 60;
        const seconds = Math.floor(difference / 1000);
        const s = (days > 0 || hours > 0 || minutes > 0 ? seconds.toString() + "秒" : (seconds > 0 ? seconds.toString() + "秒" : ""));
        if (s.length > 0) return s;
        var duration = `${d}${h}${m}${s}`
        return duration;
    };
    Fx10WFDisplayer4Signle001.prototype.fxShowWorkflowInstanceJournal = function (displayerID, fxCurr03WFClient4Single) {
        var fxThis = this;
        var items = fxCurr03WFClient4Single.workflowInstanceJournal.items;
        var html = ``;
        fxCurr03WFClient4Single.workflowInstanceJournal.items.forEach((item, index) => {
            var eventName = "";
            var eventMessage = "";
            var eventUser = "";
            var activity = fxCurr03WFClient4Single.fxGetActivity(fxCurr03WFClient4Single.workflowDefinition.root, item.activityId);
            var name = fxCurr03WFClient4Single.fxGetActivityName(activity);
            var displayText = fxCurr03WFClient4Single.fxGetActivityDisplayText(activity);
            if (displayText === null || displayText === undefined || displayText === "") {
                displayText = name;
            } else {
                //do nothing
            }
            var eventName = fxCurr03WFClient4Single.fxGetLatestEventNameFromExecutions(activity);
            var sheetID = fxCurr03WFClient4Single.fxGetLatestSheetIDFromExecutions(activity);
            var eventMessage = fxCurr03WFClient4Single.fxGetLatestMessageFromExecutions(activity);
            var description = fxCurr03WFClient4Single.fxGetActivityDescription(activity);
            var activityState = fxCurr03WFClient4Single.fxGetLatestActivityStateFromExecutions(activity);
            if (eventName === null || eventName === undefined || eventName === "") {
                if (index === 0) {
                    var endTime = item.timestamp;
                    var endTimeLocal = new Date(Date.parse(endTime.toLocaleString()));
                    var year = endTimeLocal.getFullYear();
                    var month = String(endTimeLocal.getMonth() + 1).padStart(2, '0');
                    var day = String(endTimeLocal.getDate()).padStart(2, '0');
                    var hours = String(endTimeLocal.getHours()).padStart(2, '0');
                    var minutes = String(endTimeLocal.getMinutes()).padStart(2, '0');
                    var seconds = String(endTimeLocal.getSeconds()).padStart(2, '0');

                    var endTimeLocalString = `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
                    html += `
                        <div class="fxRow">
                            <div class="fxCell fx-verticle-line-2" style="width:30px;border:0px solid red;text-align:center;">
                                <div>
                                    <i class="bi bi-clock" style="font-size: 20px;color:#3a89ff;background-color:#ffffff;"></i>
                                </div>
                            </div>
                            <div class="fxCell">
                                <strong>${endTimeLocalString}</strong>
                                <div>开始</div>
                            </div>
                        </div>
                        `
                }
            } else {
                if (item.eventName == "Completed") {
                    var startTime = Date();
                    for (var i = index - 1; i >= 0; i--) {
                        var tmp = fxCurr03WFClient4Single.workflowInstanceJournal.items[i];
                        if (tmp.eventName === "Started" && tmp.activityId === item.activityId) {
                            startTime = tmp.timestamp;
                            break;
                        } else {
                            //do nothing
                        }
                    }
                    var endTime = item.timestamp;
                    var endTimeLocal =new Date(Date.parse(endTime.toLocaleString()));
                    var year = endTimeLocal.getFullYear();
                    var month = String(endTimeLocal.getMonth() + 1).padStart(2, '0');
                    var day = String(endTimeLocal.getDate()).padStart(2, '0');
                    var hours = String(endTimeLocal.getHours()).padStart(2, '0');
                    var minutes = String(endTimeLocal.getMinutes()).padStart(2, '0');
                    var seconds = String(endTimeLocal.getSeconds()).padStart(2, '0');

                    var endTimeLocalString= `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
                    var duration = fxThis.fxDuration(new Date(startTime.toString()), new Date(endTime.toString()));
                    html += `
                        <div class="fxRow">
                            <div class="fxCell fx-verticle-line-2" style="width:30px;border:0px solid red;text-align:center;">
                                <div>
                                    <i class="bi bi-clock" style="font-size: 20px;color:#3a89ff;background-color:#ffffff;"></i>
                                </div>
                            </div>
                            <div class="fxCell">
                                <strong>${endTimeLocalString}</strong>&nbsp;
                                <span style="background-color:#ff0000;color:white;border-radius: 5px;">&nbsp;${duration}&nbsp;</span>
                                <div>${displayText}</div>
                                <div>${eventMessage}</div>
                                <div>${eventUser}</div>
                                <hr />
                                <div>${fxThis.fx00CMNUtility.fxReplaceAll(JSON.stringify(activityState), ',"', ',<br/>"')}</div>
                                <hr />
                            </div>
                        </div>
                        `
                } else {
                    //do nothing
                }
                
            }
        });
        $("#" + displayerID).html(`<div class="fxTable">${html}</div>`);
    };
    return Fx10WFDisplayer4Signle001;
}());
var Fx10WFDisplayer4Signle001Ext = (function (_super) {
    __extends(Fx10WFDisplayer4Signle001Ext, _super);
    function Fx10WFDisplayer4Signle001Ext() {
        _super.call(this);
    }
    return Fx10WFDisplayer4Signle001Ext;
}(Fx10WFDisplayer4Signle001));