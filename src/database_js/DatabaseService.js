"use strict";

var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.DatabaseService = void 0;
//var Database_1 = require("./Database.js");

const {userDB} = require('./Database.js');
var ProgrammingLanguage_1 = require("../ProgrammingLanguage.js");
var DatabaseService = /** @class */ (function () {
    function DatabaseService(name) {
        var _this = this;
        // Adding a database
        this.addDatabase = function (dataBase) { return __awaiter(_this, void 0, void 0, function () {
            var response, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, Database_1.db.put(this.dataBase)];
                    case 1:
                        response = _b.sent();
                        console.log('Document added successfully:', response);
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _b.sent();
                        console.error('Error adding document:', error_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        this.name = name;
        this.dataBase = {
            _id: this.name,
            title: this.name
        };
        this.addDatabase(this.dataBase);
    }
    var _a;
    _a = DatabaseService;
    // Getting a database
    DatabaseService.getDatabase = function (name) { return __awaiter(void 0, void 0, void 0, function () {
        var response, error_2;
        return __generator(_a, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, Database_1.db.get(name)];
                case 1:
                    response = _b.sent();
                    console.log('Document fetched successfully:', response);
                    return [3 /*break*/, 3];
                case 2:
                    error_2 = _b.sent();
                    console.error('Error fetching document:', error_2);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    //Get User info
    DatabaseService.getUserInfo = function (name) { return __awaiter(void 0, void 0, void 0, function () {
        var response, error_3;
        return __generator(_a, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, Database_1.userDB.get(name)];
                case 1:
                    response = _b.sent();
                    console.log('User fetched successfully:', response);
                    return [2 /*return*/, response];
                case 2:
                    error_3 = _b.sent();
                    console.error('Error fetching user:', error_3);
                    return [2 /*return*/, null];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    // Checks for User database
    DatabaseService.checkForUserDatabase = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, error_4;
        return __generator(_a, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, Database_1.db.get("wombat_users")];
                case 1:
                    response = _b.sent();
                    console.log('Document fetched successfully:', response);
                    return [3 /*break*/, 3];
                case 2:
                    error_4 = _b.sent();
                    console.error('Error fetching document:', error_4);
                    this.createUserDatabase();
                    return [2 /*return*/, false];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    // Creates User database
    DatabaseService.createUserDatabase = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(_a, function (_b) {
            try {
                new DatabaseService("wombat_users");
                console.log('User database created.');
            }
            catch (error) {
                console.error('Failed to create user database:', error);
            }
            return [2 /*return*/];
        });
    }); };
    // Adds a user to the User database
    DatabaseService.addUsertoDatabase = function (name) { return __awaiter(void 0, void 0, void 0, function () {
        var newUser, error_5;
        return __generator(_a, function (_b) {
            switch (_b.label) {
                case 0:
                    newUser = {
                        _id: name,
                        title: "Wombat User",
                        projects: []
                    };
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 6]);
                    return [4 /*yield*/, Database_1.userDB.get(name)];
                case 2:
                    if (_b.sent()) {
                        console.log('User already exists');
                        return [2 /*return*/, -1];
                    }
                    return [3 /*break*/, 6];
                case 3:
                    error_5 = _b.sent();
                    if (!(error_5.error == 'not_found')) return [3 /*break*/, 5];
                    console.log('User not found');
                    console.log("Adding user to database");
                    return [4 /*yield*/, Database_1.userDB.put(newUser)];
                case 4:
                    _b.sent();
                    _b.label = 5;
                case 5: return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    //Get project info from project
    DatabaseService.getProjectInfo = function (userName, projectId) { return __awaiter(void 0, void 0, void 0, function () {
        var userDoc, projectDoc, error_6;
        return __generator(_a, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    console.log("getProjectInfo userName: ", userName);
                    console.log("getProjectInfo projectId: ", projectId);
                    return [4 /*yield*/, Database_1.userDB.get(userName)];
                case 1:
                    userDoc = _b.sent();
                    projectDoc = userDoc.projects.find(function (project) { return project.project_id === projectId; });
                    console.log('ProjectDoc:', projectDoc);
                    return [2 /*return*/, projectDoc];
                case 2:
                    error_6 = _b.sent();
                    console.error('Failed to get project info:', error_6);
                    return [2 /*return*/, null];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    //Get project srcFile content from User
    DatabaseService.getContentFromSrcFile = function (userName, projectId, fileName) { return __awaiter(void 0, void 0, void 0, function () {
        var userDoc, projectDoc, srcFile, error_7;
        return __generator(_a, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, Database_1.userDB.get(userName)];
                case 1:
                    userDoc = _b.sent();
                    projectDoc = userDoc.projects.find(function (project) { return project.project_id === projectId; });
                    srcFile = projectDoc.src.srcFiles.find(function (file) { return file.fileName === fileName; });
                    return [2 /*return*/, srcFile.content];
                case 2:
                    error_7 = _b.sent();
                    console.error('Failed to get src content:', error_7.error);
                    return [2 /*return*/, null];
                case 3: return [2 /*return*/];
            }
        });
    }); };

    module.exports.getContentFromSrcFile = async function (userName, projectId, fileName) {
        console.log("inside module.exports.getContentFromSrcFile");
        try{
            const userDoc = await userDB.get(userName);
            const projectDoc = userDoc.projects.find(project => project.project_id === projectId);
            const srcFile = projectDoc.src.srcFiles.find(file => file.fileName === fileName);
            //console.log("Src file content: ", srcFile.content);
            return srcFile.content

        }
        catch(error) {
            console.error("Failed to get src content:", error.error);
            throw error;
        }

    };


    //Get project includeFile content from User
    DatabaseService.getContentfromIncludeFile = function (userName, projectId, fileName) { return __awaiter(void 0, void 0, void 0, function () {
        var userDoc, projectDoc, includeFile, error_8;
        return __generator(_a, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, Database_1.userDB.get(userName)];
                case 1:
                    userDoc = _b.sent();
                    projectDoc = userDoc.projects.find(function (project) { return project.project_id === projectId; });
                    includeFile = projectDoc.include.includeFiles.find(function (file) { return file.fileName === fileName; });
                    console.log("Include file content: ", includeFile.content);
                    return [2 /*return*/, includeFile.content];
                case 2:
                    error_8 = _b.sent();
                    console.error('Failed to get include content:', error_8.error);
                    return [2 /*return*/, null];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    //Get project userDataFile content from User
    DatabaseService.getContentFromUserDataFile = function (userName, projectId, fileName) { return __awaiter(void 0, void 0, void 0, function () {
        var userDoc, projectDoc, userDataFile, error_9;
        return __generator(_a, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, Database_1.userDB.get(userName)];
                case 1:
                    userDoc = _b.sent();
                    projectDoc = userDoc.projects.find(function (project) { return project.project_id === projectId; });
                    userDataFile = projectDoc.userData.userDataFiles.find(function (file) { return file.fileName === fileName; });
                    console.log("User Data file content: ", userDataFile.content);
                    return [2 /*return*/, userDataFile.content];
                case 2:
                    error_9 = _b.sent();
                    console.error('Failed to get include content:', error_9.error);
                    return [2 /*return*/, null];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    // Add include content
    DatabaseService.addIncludeContent = function (userName, projectId, fileName, content) { return __awaiter(void 0, void 0, void 0, function () {
        var userDoc, projectDoc, existingFile, response, error_10;
        return __generator(_a, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, Database_1.userDB.get(userName)];
                case 1:
                    userDoc = _b.sent();
                    console.log('addIncludeContent UserDoc:', userDoc);
                    projectDoc = userDoc.projects.find(function (project) { return project.project_id === projectId; });
                    console.log('addIncludeContent ProjectDoc:', projectDoc);
                    existingFile = projectDoc.include.includeFiles.find(function (file) { return file.fileName === fileName; });
                    if (!existingFile) {
                        //Add new file to srcFiles
                        projectDoc.include.includeFiles.push({
                            fileName: fileName,
                            content: content
                        });
                        //(fileName);
                        console.log('Updated ProjectDoc:', projectDoc);
                    }
                    else {
                        console.log("File already exists");
                    }
                    return [4 /*yield*/, Database_1.userDB.put(userDoc)];
                case 2:
                    response = _b.sent();
                    console.log('Include content added successfully:', response);
                    return [2 /*return*/, 1];
                case 3:
                    error_10 = _b.sent();
                    console.error('Failed to add include content:', error_10);
                    return [2 /*return*/, -1];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    //Update include content
    DatabaseService.updateIncludeContent = function (userName, projectId, fileName, newContent) { return __awaiter(void 0, void 0, void 0, function () {
        var userDoc, projectDoc, response, error_11;
        return __generator(_a, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, Database_1.userDB.get(userName)];
                case 1:
                    userDoc = _b.sent();
                    projectDoc = userDoc.projects.find(function (project) { return project.project_id === projectId; });
                    console.log("updateIncludeContent userName: ", userName);
                    console.log("updateIncludeContent projectId: ", projectId);
                    console.log("updateIncludeContent fileName: ", fileName);
                    console.log("updateIncludeContent newcontent: ", newContent);
                    projectDoc.include.includeFiles = projectDoc.include.includeFiles.map(function (file) {
                        if (file.fileName === fileName) {
                            return __assign(__assign({}, file), { content: newContent });
                        }
                        return file;
                    });
                    return [4 /*yield*/, Database_1.userDB.put(userDoc)];
                case 2:
                    response = _b.sent();
                    console.log('Include content updated successfully:', response);
                    console.log('Updated code: ', projectDoc.src.srcFiles);
                    return [3 /*break*/, 4];
                case 3:
                    error_11 = _b.sent();
                    console.error('Failed to update include content:', error_11);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    // Add src content
    DatabaseService.addSrcContent = function (userName, projectId, fileName, content) { return __awaiter(void 0, void 0, void 0, function () {
        var userDoc, projectDoc, existingFile, response, error_12;
        return __generator(_a, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, Database_1.userDB.get(userName)];
                case 1:
                    userDoc = _b.sent();
                    projectDoc = userDoc.projects.find(function (project) { return project.project_id === projectId; });
                    existingFile = projectDoc.src.srcFiles.find(function (file) { return file.fileName === fileName; });
                    if (!existingFile) {
                        //Add new file to srcFiles
                        projectDoc.src.srcFiles.push({
                            fileName: fileName,
                            content: content
                        });
                        //(fileName);
                        console.log('Updated ProjectDoc:', projectDoc);
                    }
                    else {
                        console.log("File already exists");
                    }
                    return [4 /*yield*/, Database_1.userDB.put(userDoc)];
                case 2:
                    response = _b.sent();
                    console.log('Src content added successfully:', response);
                    return [2 /*return*/, 1];
                case 3:
                    error_12 = _b.sent();
                    console.error('Failed to add src content:', error_12);
                    return [2 /*return*/, -1];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    //Update src content
    DatabaseService.updateSrcContent = function (userName, projectId, fileName, newContent) { return __awaiter(void 0, void 0, void 0, function () {
        var userDoc, projectDoc, response, error_13;
        return __generator(_a, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, Database_1.userDB.get(userName)];
                case 1:
                    userDoc = _b.sent();
                    projectDoc = userDoc.projects.find(function (project) { return project.project_id === projectId; });
                    console.log("updateSrcContent userName: ", userName);
                    console.log("updateSrcContent projectId: ", projectId);
                    console.log("updateSrcContent fileName: ", fileName);
                    console.log("updateSrcContent newcontent: ", newContent);
                    projectDoc.src.srcFiles = projectDoc.src.srcFiles.map(function (file) {
                        if (file.fileName === fileName) {
                            return __assign(__assign({}, file), { content: newContent });
                        }
                        return file;
                    });
                    return [4 /*yield*/, Database_1.userDB.put(userDoc)];
                case 2:
                    response = _b.sent();
                    console.log('Src content updated successfully:', response);
                    console.log('Updated code: ', projectDoc.src.srcFiles);
                    return [3 /*break*/, 4];
                case 3:
                    error_13 = _b.sent();
                    console.error('Failed to update src content:', error_13);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    //Update user data content
    DatabaseService.updateUserDataContent = function (userName, projectId, fileName, newContent) { return __awaiter(void 0, void 0, void 0, function () {
        var userDoc, projectDoc, response, error_14;
        return __generator(_a, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, Database_1.userDB.get(userName)];
                case 1:
                    userDoc = _b.sent();
                    projectDoc = userDoc.projects.find(function (project) { return project.project_id === projectId; });
                    console.log("updateUserDataContent userName: ", userName);
                    console.log("updateUserDataContent projectId: ", projectId);
                    console.log("updateUserDataContent fileName: ", fileName);
                    console.log("updateUserDataContent newcontent: ", newContent);
                    projectDoc.userData.userDataFiles = projectDoc.userData.userDataFiles.map(function (file) {
                        if (file.fileName === fileName) {
                            return __assign(__assign({}, file), { content: newContent });
                        }
                        return file;
                    });
                    return [4 /*yield*/, Database_1.userDB.put(userDoc)];
                case 2:
                    response = _b.sent();
                    console.log('User Data content updated successfully:', response);
                    console.log('Updated code: ', projectDoc.src.srcFiles);
                    return [3 /*break*/, 4];
                case 3:
                    error_14 = _b.sent();
                    console.error('Failed to update user data content:', error_14);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    //Add User Data content
    DatabaseService.addUserDataContent = function (userName, projectId, fileName, content) { return __awaiter(void 0, void 0, void 0, function () {
        var userDoc, projectDoc, existingFile, response, error_15;
        return __generator(_a, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, Database_1.userDB.get(userName)];
                case 1:
                    userDoc = _b.sent();
                    projectDoc = userDoc.projects.find(function (project) { return project.project_id === projectId; });
                    existingFile = projectDoc.userData.userDataFiles.find(function (file) { return file.fileName === fileName; });
                    if (!existingFile) {
                        //Add new file to srcFiles
                        projectDoc.userData.userDataFiles.push({
                            fileName: fileName,
                            content: content
                        });
                        //(fileName);
                        console.log('Updated ProjectDoc:', projectDoc);
                    }
                    else {
                        console.log("File already exists");
                    }
                    return [4 /*yield*/, Database_1.userDB.put(userDoc)];
                case 2:
                    response = _b.sent();
                    console.log('User Data content added successfully:', response);
                    return [2 /*return*/, 1];
                case 3:
                    error_15 = _b.sent();
                    console.error('Failed to add user data content:', error_15);
                    return [2 /*return*/, -1];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    // Adds a project to the user in the User database
    DatabaseService.addProjectToUser = function (userName, projectName, language) { return __awaiter(void 0, void 0, void 0, function () {
        var userDoc, existingProject, newProject, response, addSrc, error_16;
        return __generator(_a, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 4, , 5]);
                    return [4 /*yield*/, Database_1.userDB.get(userName)];
                case 1:
                    userDoc = _b.sent();
                    existingProject = userDoc.projects.find(function (project) { return project._id === projectName; });
                    if (existingProject) {
                        console.log('Project already exists');
                        return [2 /*return*/, -1];
                    }
                    newProject = {
                        project_id: projectName,
                        description: "Project Description",
                        language: language,
                        include: { includeFiles: [] },
                        src: { srcFiles: [] },
                        userData: { userDataFiles: [] }
                    };
                    userDoc.projects.push(newProject);
                    return [4 /*yield*/, Database_1.userDB.put(userDoc)];
                case 2:
                    response = _b.sent();
                    return [4 /*yield*/, this.addSrcContent(userName, projectName, "main.".concat(ProgrammingLanguage_1["default"].FILE_EXTENSION[language]), ProgrammingLanguage_1["default"].DEFAULT_CODE[language])];
                case 3:
                    addSrc = _b.sent();
                    console.log("addSrc: ", addSrc);
                    if (addSrc == 1) {
                        return [2 /*return*/, 1];
                    }
                    return [3 /*break*/, 5];
                case 4:
                    error_16 = _b.sent();
                    if (error_16.status === 404) {
                        console.error('User not found, cannot add project:', error_16);
                    }
                    else {
                        console.error('Failed to add project to user:', error_16);
                    }
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    //Get project from user
    DatabaseService.getAllProjectsFromUser = function (userName) { return __awaiter(void 0, void 0, void 0, function () {
        var userDoc, error_17;
        return __generator(_a, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, Database_1.userDB.get(userName)];
                case 1:
                    userDoc = _b.sent();
                    console.log('UserDoc:', userDoc);
                    return [2 /*return*/, userDoc.projects];
                case 2:
                    error_17 = _b.sent();
                    console.error('Failed to get projects for user:', error_17);
                    return [2 /*return*/, null];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    //Get src fileName from Project from User
    DatabaseService.getSrcFileNameFromProject = function (userName, projectId) { return __awaiter(void 0, void 0, void 0, function () {
        var userDoc, projectDoc, error_18;
        return __generator(_a, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, Database_1.userDB.get(userName)];
                case 1:
                    userDoc = _b.sent();
                    projectDoc = userDoc.projects.find(function (project) { return project.project_id === projectId; });
                    // console.log('ProjectDoc:', projectDoc);
                    return [2 /*return*/, projectDoc.src.srcFiles];
                case 2:
                    error_18 = _b.sent();
                    console.error('Failed to get src files from project:', error_18);
                    return [2 /*return*/, null];
                case 3: return [2 /*return*/];
            }
        });
    }); };


    // Gets all the users from the User database
    module.exports.getAllUsers = async function () {
        console.log("inside module.exports.getAllUsers");
        try {
            const response = await userDB.allDocs({ include_docs: true });
            const userList = response.rows.map(row => row.id);
            return userList;
        } catch (error) {
            console.error('Failed to fetch all users:', error);
            throw error;
        }
    };
    
    
    return DatabaseService;
}());
exports.DatabaseService = DatabaseService;
exports["default"] = DatabaseService;
