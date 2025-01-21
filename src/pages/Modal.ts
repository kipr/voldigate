import construct from '../util/construct';


export namespace Modal {
  export enum Type {
    Settings,
    About,
    Exception,
    OpenScene,
    Feedback,
    FeedbackSuccess,
    None,
    NewScene,
    CopyScene,
    SettingsScene,
    DeleteRecord,
    ResetCode,
    CreateFile,
    CreateUser,
    CreateProject,
    DeleteUserProjectFile,
    DownloadUserProjectFile,
    OpenUsers
  }
  
  export interface Settings {
    type: Type.Settings;
  }
  
  export const SETTINGS: Settings = { type: Type.Settings };
  
  export interface About {
    type: Type.About;
  }
  
  export const ABOUT: About = { type: Type.About };
  
  export interface Feedback {
    type: Type.Feedback;
  }
  
  export const FEEDBACK: Feedback = { type: Type.Feedback };
  
  export interface FeedbackSuccess {
    type: Type.FeedbackSuccess;
  }
  
  export const FEEDBACKSUCCESS: FeedbackSuccess = { type: Type.FeedbackSuccess };
  
  export interface Exception {
    type: Type.Exception;
    error: Error;
    info?: React.ErrorInfo;
  }
  
  export const exception = (error: Error, info?: React.ErrorInfo): Exception => ({ type: Type.Exception, error, info });

  
  export interface None {
    type: Type.None;
  }
  
  export const NONE: None = { type: Type.None };
  
  export interface CreateProject {
    type: Type.CreateProject;
  }

  export const CREATEPROJECT: CreateProject = { type: Type.CreateProject };


  export interface CreateFile {
    type: Type.CreateFile;
  }

  export const CREATEFILE: CreateFile = { type: Type.CreateFile };

  export interface CreateUser {
    type: Type.CreateUser;
  }

  export const CREATEUSER: CreateUser = { type: Type.CreateUser };

  export interface OpenUsers {
    type: Type.OpenUsers;
  }

  export const OPENUSERS: OpenUsers = { type: Type.OpenUsers };

  export interface DeleteUserProjectFile {
    type: Type.DeleteUserProjectFile;
  }

  export const DELETEUSERPROJECTFILE: DeleteUserProjectFile = { type: Type.DeleteUserProjectFile };


  export interface DownloadUserProjectFile {
    type: Type.DownloadUserProjectFile;
  }

  export const DOWNLOADUSERPROJECTFILE: DownloadUserProjectFile = { type: Type.DownloadUserProjectFile };

}
  
export type Modal = (
  Modal.Settings |
  Modal.About |
  Modal.Exception |
  Modal.Feedback |
  Modal.FeedbackSuccess |
  Modal.None |

  Modal.CreateProject |
  Modal.CreateFile |
  Modal.CreateUser |
  Modal.OpenUsers |
  Modal.DeleteUserProjectFile |
  Modal.DownloadUserProjectFile

);