"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
class FileManagerHelper {
    static saveJsonFile(path, data) {
        fs_1.writeFileSync(path, JSON.stringify(data));
    }
}
exports.FileManagerHelper = FileManagerHelper;
