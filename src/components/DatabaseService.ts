
import PouchDB from 'pouchdb';
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
interface ProjectType {
    project_id: string;
    include: IncludeType;
    src: SrcType;
    userData: UserData;
}

// Define the Include type inside Project type
interface IncludeType {
    includeFiles: string[];
}

// Define the Src type inside Project type
interface SrcType {
    srcFiles: SrcData[];
}

// Define the SrcData type inside Src type
interface SrcData{
    fileName: string;
    content: string;
}

// Define the UserData type inside Project type
interface UserData {
    userData: string[];
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

    // // Adds a new SrcType to a specific project within a user document
    // static addSrcToProject = async (userId: string, projectId: string, newSrcFiles: string[]) => {
    //     try {
    //         // Fetch the user's document from the database
    //         const userDoc = await userDB.get<UserType>(userId);

    //         // Find the project by projectId
    //         const project = userDoc.projects.find(project => project._id === projectId);
    //         if (!project) {
    //             console.error('Project not found');
    //             return -1;
    //         }

    //         // Update the src field with new files
    //         project.src.srcFiles.push(...newSrcFiles);

    //         // Save the updated user document back to the database
    //         const response = await userDB.put(userDoc);
    //         console.log('SrcType added successfully to the project:', response);

    //     } catch (error) {
    //         if (error.status === 404) {
    //             console.error('User not found, cannot add SrcType:', error);
    //         } else {
    //             console.error('Failed to add SrcType to project:', error);
    //         }
    //     }
    // };

    static addSrcContent = async(userName: string, projectId: string, fileName: string, content: string) => {
        try {

            //Get user from user database
            const userDoc = await userDB.get<UserType>(userName);
            console.log('UserDoc:', userDoc);

            //get project inside user database
            const projectDoc = userDoc.projects.find(project => project.project_id === projectId);
            console.log('ProjectDoc:', projectDoc);

            const existingFile = projectDoc.src.srcFiles.find(file => file.fileName === fileName);

           if(!existingFile){
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
        }
        catch(error) {
            console.error('Failed to add src content:', error);
        }

    };

    static updateSrcContent = async (projectId: string, fileName: string, newContent: string) => {
        try {
            const projectDoc = await userDB.get<ProjectType>(projectId);

            projectDoc.src.srcFiles = projectDoc.src.srcFiles.map((file: any) => {
                if (file.fileName === fileName) {
                   return{
                          ...file,
                          content: newContent
                   }
                }
                return file;

            });

            const response = await userDB.put(projectDoc);
            console.log('Src content updated successfully:', response);
        }
        catch (error) {
            console.error('Failed to update src content:', error);
        }
    };

    // Adds a project to the user in the User database
    static addProjectToUser = async (userName: string, projectName: string) => {

        try {
            const userDoc = await userDB.get<UserType>(userName);

            const existingProject = userDoc.projects.find(project => project._id === projectName);

            if (existingProject) {
                console.log('Project already exists');
                return -1;
            }
            const newProject: ProjectType = {
                project_id: projectName,
                include: { includeFiles: [] },
                src: { srcFiles: [] },
                userData: { userData: [] }
            };



            userDoc.projects.push(newProject);

            const response = await userDB.put(userDoc);
            console.log('Project added successfully:', response);

            this.addSrcContent(userName, projectName, "main.cpp", ProgrammingLanguage.DEFAULT_CODE.c);

        }
        catch (error) {
            if (error.status === 404) {
                console.error('User not found, cannot add project:', error);
            } else {
                console.error('Failed to add project to user:', error);
            }
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