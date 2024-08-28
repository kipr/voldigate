

import { db, userDB } from './Database';
import ProgrammingLanguage from '../ProgrammingLanguage';

// Define the Database type
interface DatabaseType {
    _id: string;
    title: string;
}

// Define the User type
interface UserType {
    _id: string;
    title: string;
    projects: ProjectType[];

}

// Define the Project type inside User
export interface ProjectType {
    project_id: string;
    language: string;
    include: IncludeType;
    description: string;
    src: SrcType;
    userData: UserDataType;
}

// Define the Include type inside Project type
export interface IncludeType {
    includeFiles: IncludeData[];
}

//Define the IncludeData type inside Include type
export interface IncludeData {
    fileName: string;
    content: string;
}

// Define the Src type inside Project type
export interface SrcType {
    srcFiles: SrcData[];
}

// Define the SrcData type inside Src type
export interface SrcData {
    fileName: string;
    content: string;
}


// Define the UserData type inside Project type
export interface UserDataType {
    userDataFiles: UserData[];
}

//Define the UserData type inside UserData type
export interface UserData {
    fileName: string;
    content: string;
}



export class DatabaseService {

    private name: string;
    private dataBase: DatabaseType;

    public constructor(name: string) {
        this.name = name;

        this.dataBase = {
            _id: this.name,
            title: this.name,
        };

        this.addDatabase(this.dataBase);

    }


    // Adding a database
    addDatabase = async (dataBase: DatabaseType) => {
        try {
            const response = await db.put(this.dataBase);
            console.log('Document added successfully:', response);
        } catch (error) {
            console.error('Error adding document:', error);
        }
    }

    // Getting a database
    static getDatabase = async (name: string) => {
        try {
            const response = await db.get<UserType>(name);
            console.log('Document fetched successfully:', response);
        } catch (error) {
            console.error('Error fetching document:', error);
        }
    }

    //Get User info
    static getUserInfo = async (name: string) => {
        try {
            const response = await userDB.get<UserType>(name);
            console.log('User fetched successfully:', response);
            return response;
        } catch (error) {
            console.error('Error fetching user:', error);
            return null;
        }
    }

    // Checks for User database
    static checkForUserDatabase = async () => {
        try {
            const response = await db.get<UserType>("wombat_users");
            console.log('Document fetched successfully:', response);
        } catch (error) {
            console.error('Error fetching document:', error);
            this.createUserDatabase();
            return false;
        }

    }

    // Creates User database
    static createUserDatabase = async () => {
        try {
            new DatabaseService("wombat_users");
            console.log('User database created.');
        } catch (error) {
            console.error('Failed to create user database:', error);
        }
    }

    // Adds a user to the User database
    static addUsertoDatabase = async (name: string) => {
        const newUser: UserType = {
            _id: name,
            title: "Wombat User",
            projects: []

        };
        try {

            if (await userDB.get(name)) {
                console.log('User already exists');
                return -1;
            }

        }
        catch (error) {
            if (error.error == 'not_found') {
                console.log('User not found');
                console.log("Adding user to database");
                await userDB.put(newUser);
            }
        }
    }

    //Get project info from project
    static getProjectInfo = async (userName: string, projectId: string) => {
        try {
            console.log("getProjectInfo userName: ", userName);
            console.log("getProjectInfo projectId: ", projectId);
            const userDoc = await userDB.get<UserType>(userName);
            const projectDoc = userDoc.projects.find(project => project.project_id === projectId);
            console.log('ProjectDoc:', projectDoc);

            return projectDoc;
        }
        catch (error) {
            console.error('Failed to get project info:', error);
            return null;
        }
    }
    //Get project srcFile content from User
    static getContentFromSrcFile = async (userName: string, projectId: string, fileName: string) => {
        try {
            const userDoc = await userDB.get<UserType>(userName);
            const projectDoc = userDoc.projects.find(project => project.project_id === projectId);
            const srcFile = projectDoc.src.srcFiles.find(file => file.fileName === fileName);

            return srcFile.content;
        }
        catch (error) {
            console.error('Failed to get src content:', error.error);
            return null;
        }
    }

    //Get project includeFile content from User
    static getContentfromIncludeFile = async (userName: string, projectId: string, fileName: string) => {
        try {
            const userDoc = await userDB.get<UserType>(userName);
            const projectDoc = userDoc.projects.find(project => project.project_id === projectId);
            const includeFile = projectDoc.include.includeFiles.find(file => file.fileName === fileName);
            console.log("Include file content: ", includeFile.content);
            return includeFile.content;
        }
        catch (error) {
            console.error('Failed to get include content:', error.error);
            return null;
        }
    }

    //Get project userDataFile content from User
    static getContentFromUserDataFile = async (userName: string, projectId: string, fileName: string) => {
        try {
            const userDoc = await userDB.get<UserType>(userName);
            const projectDoc = userDoc.projects.find(project => project.project_id === projectId);
            const userDataFile = projectDoc.userData.userDataFiles.find(file => file.fileName === fileName);
            console.log("User Data file content: ", userDataFile.content);
            return userDataFile.content;
        }
        catch (error) {
            console.error('Failed to get include content:', error.error);
            return null;
        }
    }

    // Add include content
    static addIncludeContent = async (userName: string, projectId: string, fileName: string, content: string) => {
        try {

            //Get user from user database
            const userDoc = await userDB.get<UserType>(userName);
            console.log('addIncludeContent UserDoc:', userDoc);

            //get project inside user database
            const projectDoc = userDoc.projects.find(project => project.project_id === projectId);
            console.log('addIncludeContent ProjectDoc:', projectDoc);

            const existingFile = projectDoc.include.includeFiles.find(file => file.fileName === fileName);

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

            const response = await userDB.put(userDoc);
            console.log('Include content added successfully:', response);
            return 1;
        }
        catch (error) {
            console.error('Failed to add include content:', error);
            return -1;
        }

    };

    //Update include content
    static updateIncludeContent = async (userName: string, projectId: string, fileName: string, newContent: string) => {
        try {
            const userDoc = await userDB.get<UserType>(userName);
            const projectDoc = userDoc.projects.find(project => project.project_id === projectId);

            console.log("updateIncludeContent userName: ", userName);
            console.log("updateIncludeContent projectId: ", projectId);
            console.log("updateIncludeContent fileName: ", fileName);
            console.log("updateIncludeContent newcontent: ", newContent);
            projectDoc.include.includeFiles = projectDoc.include.includeFiles.map((file: any) => {
                if (file.fileName === fileName) {
                    return {
                        ...file,
                        content: newContent
                    }
                }
                return file;

            });

            const response = await userDB.put(userDoc);
            console.log('Include content updated successfully:', response);
            console.log('Updated code: ', projectDoc.src.srcFiles);
        }
        catch (error) {
            console.error('Failed to update include content:', error);
        }
    };

    // Add src content
    static addSrcContent = async (userName: string, projectId: string, fileName: string, content: string) => {
        try {

            //Get user from user database
            const userDoc = await userDB.get<UserType>(userName);
            //console.log('UserDoc:', userDoc);

            //get project inside user database
            const projectDoc = userDoc.projects.find(project => project.project_id === projectId);
            // console.log('ProjectDoc:', projectDoc);

            const existingFile = projectDoc.src.srcFiles.find(file => file.fileName === fileName);

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

            const response = await userDB.put(userDoc);
            console.log('Src content added successfully:', response);
            return 1;
        }
        catch (error) {
            console.error('Failed to add src content:', error);
            return -1;
        }

    };

    //Update src content
    static updateSrcContent = async (userName: string, projectId: string, fileName: string, newContent: string) => {
        try {
            const userDoc = await userDB.get<UserType>(userName);
            const projectDoc = userDoc.projects.find(project => project.project_id === projectId);

            console.log("updateSrcContent userName: ", userName);
            console.log("updateSrcContent projectId: ", projectId);
            console.log("updateSrcContent fileName: ", fileName);
            console.log("updateSrcContent newcontent: ", newContent);
            projectDoc.src.srcFiles = projectDoc.src.srcFiles.map((file: any) => {
                if (file.fileName === fileName) {
                    return {
                        ...file,
                        content: newContent
                    }
                }
                return file;

            });

            const response = await userDB.put(userDoc);
            console.log('Src content updated successfully:', response);
            console.log('Updated code: ', projectDoc.src.srcFiles);
        }
        catch (error) {
            console.error('Failed to update src content:', error);
        }
    };

    //Update user data content
    static updateUserDataContent = async (userName: string, projectId: string, fileName: string, newContent: string) => {
        try {
            const userDoc = await userDB.get<UserType>(userName);
            const projectDoc = userDoc.projects.find(project => project.project_id === projectId);

            console.log("updateUserDataContent userName: ", userName);
            console.log("updateUserDataContent projectId: ", projectId);
            console.log("updateUserDataContent fileName: ", fileName);
            console.log("updateUserDataContent newcontent: ", newContent);
            projectDoc.userData.userDataFiles = projectDoc.userData.userDataFiles.map((file: any) => {
                if (file.fileName === fileName) {
                    return {
                        ...file,
                        content: newContent
                    }
                }
                return file;

            });

            const response = await userDB.put(userDoc);
            console.log('User Data content updated successfully:', response);
            console.log('Updated code: ', projectDoc.src.srcFiles);
        }
        catch (error) {
            console.error('Failed to update user data content:', error);
        }
    };
    //Add User Data content
    static addUserDataContent = async (userName: string, projectId: string, fileName: string, content: string) => {
        try {

            //Get user from user database
            const userDoc = await userDB.get<UserType>(userName);
            //console.log('UserDoc:', userDoc);

            //get project inside user database
            const projectDoc = userDoc.projects.find(project => project.project_id === projectId);
            // console.log('ProjectDoc:', projectDoc);

            const existingFile = projectDoc.userData.userDataFiles.find(file => file.fileName === fileName);

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

            const response = await userDB.put(userDoc);
            console.log('User Data content added successfully:', response);
            return 1;
        }
        catch (error) {
            console.error('Failed to add user data content:', error);
            return -1;
        }

    };


    // Adds a project to the user in the User database
    static addProjectToUser = async (userName: string, projectName: string, language: ProgrammingLanguage) => {

        try {
            const userDoc = await userDB.get<UserType>(userName);

            const existingProject = userDoc.projects.find(project => project._id === projectName);

            if (existingProject) {
                console.log('Project already exists');
                return -1;
            }
            const newProject: ProjectType = {
                project_id: projectName,
                description: "Project Description",
                language: language,
                include: { includeFiles: [] },
                src: { srcFiles: [] },
                userData: { userDataFiles: [] }
            };



            userDoc.projects.push(newProject);

            const response = await userDB.put(userDoc);
            // console.log('Project added successfully:', response);
            // console.log("addProjectUser language: ", language);
            // console.log("projectUser added language: ", ProgrammingLanguage.FILE_EXTENSION[language]);
            // console.log("addProjectUser language code: ", ProgrammingLanguage.DEFAULT_CODE["python"]);
            // this.addSrcContent(userName, projectName, `main.${language}`, ProgrammingLanguage.DEFAULT_CODE[language]);
            // if(language.toString() === "py"){
            //     this.addSrcContent(userName, projectName, `main.${language}`, ProgrammingLanguage.DEFAULT_CODE["python"]);
            // }
            // else {

            // }


            const addSrc = await this.addSrcContent(userName, projectName, `main.${ProgrammingLanguage.FILE_EXTENSION[language]}`, ProgrammingLanguage.DEFAULT_CODE[language]);
            console.log("addSrc: ", addSrc);
            if (addSrc == 1) {
                return 1;
            }
        }
        catch (error) {
            if (error.status === 404) {
                console.error('User not found, cannot add project:', error);
            } else {
                console.error('Failed to add project to user:', error);
            }
        }
    }

    //Get project from user
    static getAllProjectsFromUser = async (userName: string) => {
        try {
            const userDoc = await userDB.get<UserType>(userName);
            console.log('UserDoc:', userDoc);

            return userDoc.projects;
        }
        catch (error) {
            console.error('Failed to get projects for user:', error);
            return null;
        }
    }

    //Get src fileName from Project from User
    static getSrcFileNameFromProject = async (userName: string, projectId: string) => {
        try {
            const userDoc = await userDB.get<UserType>(userName);
            const projectDoc = userDoc.projects.find(project => project.project_id === projectId);
            // console.log('ProjectDoc:', projectDoc);

            return projectDoc.src.srcFiles;
        }
        catch (error) {
            console.error('Failed to get src files from project:', error);
            return null;
        }
    }

    // Gets all the users from the User database
    static getAllUsers = async () => {
        try {


            const response = await userDB.allDocs({ include_docs: true });
            const dbLength = response.rows.length;
            const userList = [];
            console.log("All Users: ");
            for (let i = 0; i < dbLength; i++) {
                console.log(response.rows[i].id);
                userList.push(response.rows[i].id);
            }
            return userList;

        } catch (error) {
            console.error('Failed to fetch all users:', error);
        }
    }

}
export default DatabaseService;