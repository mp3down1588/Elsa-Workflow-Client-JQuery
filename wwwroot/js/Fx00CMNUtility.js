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
var Fx00CMNUtility = (function () {
    function Fx00CMNUtility() {
        this.accessToken = "";
    }
    Fx00CMNUtility.prototype.fxRootUrl = function () {
        var protocol = window.location.protocol;
        var hostname = window.location.hostname;
        var port = window.location.port;
        var rootUrl = protocol + "//" + hostname + (port ? ":" + port : "");
        return rootUrl;
    };
    Fx00CMNUtility.prototype.fxReplaceAll = function (str, search, replacement) {
        // Escape special characters in the search string
        const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        // Create a regular expression with the global flag
        const regex = new RegExp(escapedSearch, 'g');
        // Return the string with all occurrences replaced
        return str.replace(regex, replacement);
    };
    Fx00CMNUtility.prototype.fxSaveStringToFile = function (content, filename) {
        // Create a Blob containing the string content
        const blob = new Blob([content], { type: 'text/plain' });

        // Create a temporary anchor element
        const a = document.createElement('a');
        const url = URL.createObjectURL(blob);

        // Set the anchor's href to the Blob URL
        a.href = url;
        a.download = filename;

        // Programmatically click the anchor element to trigger download
        document.body.appendChild(a);
        a.click();

        // Clean up
        URL.revokeObjectURL(url);
        document.body.removeChild(a);
    };
    Fx00CMNUtility.prototype.fxAjax = function (url, method, data, contentType, async, callBack) {
        var xhr = new XMLHttpRequest();
        xhr.open(method, url, async);
        if (contentType === null || contentType === undefined || contentType === "") {
            //do nothing
        } else {
            xhr.setRequestHeader('Content-Type', contentType);
        }
        xhr.setRequestHeader('Authorization', 'Bearer ' + this.accessToken);
        xhr.withCredentials = true;
        if (async) {
            xhr.onload = function () {
                if (xhr.status >= 200 && xhr.status < 300) {
                    var responseText = xhr.responseText;
                    if (responseText === null || responseText === undefined || responseText === "") {
                        responseText = "{}";
                    } else {
                        //do nothing
                    }
                    var responseData = JSON.parse(responseText);
                    console.log(responseData);
                    if (typeof (callBack) === "function" && callBack) {
                        callBack(responseData);
                    } else {
                        //do nothing
                    }
                } else {
                    console.error('Request failed with status:', xhr.status);
                }
            };
            xhr.onerror = function () {
                console.error('Request failed');
            };
        } else {
            //do nothing
        }
        if (data === null || data === undefined || data === "") {
            xhr.send();
        } else {
            xhr.send(JSON.stringify(data));
        }
        if (!async) {
            if (xhr.status >= 200 && xhr.status < 300) {
                var responseText = xhr.responseText;
                if (responseText === null || responseText === undefined || responseText === "") {
                    responseText = "{}";
                } else {
                    //do nothing
                }
                var responseData = JSON.parse(responseText);
                console.log(responseData);
                if (typeof (callBack) === "function" && callBack) {
                    callBack(responseData);
                } else {
                    //do nothing
                }
            } else {
                console.error('Request failed with status:', xhr.status);
            }
        } else {
            //do nothing
        }
    };
    return Fx00CMNUtility;
}());