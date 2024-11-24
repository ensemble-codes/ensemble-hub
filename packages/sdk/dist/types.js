"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskStatus = exports.TaskType = void 0;
var TaskType;
(function (TaskType) {
    TaskType[TaskType["SIMPLE"] = 0] = "SIMPLE";
    TaskType[TaskType["COMPLEX"] = 1] = "COMPLEX";
    TaskType[TaskType["COMPOSITE"] = 2] = "COMPOSITE";
})(TaskType || (exports.TaskType = TaskType = {}));
var TaskStatus;
(function (TaskStatus) {
    TaskStatus[TaskStatus["CREATED"] = 0] = "CREATED";
    TaskStatus[TaskStatus["ASSIGNED"] = 1] = "ASSIGNED";
    TaskStatus[TaskStatus["COMPLETED"] = 2] = "COMPLETED";
    TaskStatus[TaskStatus["FAILED"] = 3] = "FAILED";
})(TaskStatus || (exports.TaskStatus = TaskStatus = {}));
