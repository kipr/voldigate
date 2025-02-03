import * as React from 'react';
import { DARK, ThemeProps } from '../components/theme';
import { StyleProps } from '../style';

import { connect } from 'react-redux';

import { styled } from 'styletron-react';

import { LayoutProps } from './Layout/Layout';

import tr from '@i18n';

import { State as ReduxState } from '../state';

import Dict from '../Dict';

import LocalizedString from '../util/LocalizedString';

import { faFile, faFileCirclePlus, faFolderPlus } from '@fortawesome/free-solid-svg-icons';

import { Fa } from './Fa';
import axios from 'axios';
import DatabaseService, { ProjectType, IncludeType, SrcType, SrcData, UserData, IncludeData } from './DatabaseService';
import ProgrammingLanguage from '../ProgrammingLanguage';
import { useState } from 'react';

type UsersSection = string;

type Project = {
    projectName: string;
    binFolderFiles: string[];
    includeFolderFiles: string[];
    srcFolderFiles: string[];
    dataFolderFiles: string[];
}


export interface FileExplorerProps extends ThemeProps, StyleProps {
    onProjectSelected?: (userName: string, projectName: string, fileName: string, activeLanguage: ProgrammingLanguage, fileType: string) => void;
    onFileSelected?: (userName: string, projectName: string, fileName: string, activeLanguage: ProgrammingLanguage, fileType: string) => void;
    onUserSelected?: (userName: string, loadUserData: boolean) => void;
    onAddNewProject?: (userName: string) => void;
    onAddNewFile?: (userName: string, projectName: string, activeLanguage: ProgrammingLanguage, fileType: string) => void;
    onDeleteUser?: (userName: string, deleteUserFlag: boolean) => void;
    onDeleteProject?: (userName: string, project: Project, deleteProjectFlag: boolean) => void;
    onDeleteFile?: (userName: string, project: string, fileName: string, deleteFileFlag: boolean) => void;
    onDownloadUser?: (userName: string) => void;
    onDownloadProject?: (userName: string, project: Project) => void;
    onDownloadFile?: (userName: string, projectName: string, fileName: string) => void;
    propsSelectedProjectName?: string;
    propFileName?: string;
    propProjectName?: string;
    propActiveLanguage?: ProgrammingLanguage;
    propUserName?: string;
    addProjectFlag?: boolean;
    addFileFlag?: boolean;
    reloadFilesFlag?: boolean;
    userSelectedFlag?: boolean;
    userDeleteFlag?: boolean;

    propUsers: string[];
    propUserData: Project[];
}
interface SectionProps {
    selected?: boolean;
}
interface FileExplorerReduxSideLayoutProps {

    locale: LocalizedString.Language;
}

interface FileExplorerPrivateProps {
    locale: LocalizedString.Language;
}

interface FileExplorerState {
    includeFiles: [];
    srcFiles: [];
    userDataFiles: [];
    userName: string;
    users: string[];
    selectedSection: UsersSection;
    selectedProject: string;
    projects: [] | null;
    error: string | null;
    projectName: string;
    fileType: string;
    deleteUserFlag: boolean;
    activeLanguage: ProgrammingLanguage;
    showProjectFiles: boolean;
    showProjects: boolean;
    showUserContextMenu: boolean;
    showProjectContextMenu: boolean;
    showFileContextMenu: boolean;
    currentUserSelected: boolean;

    contextMenuUser?: string;
    contextMenuProject?: Project;
    contextMenuFile?: string;

    contextMenuPosition: { x: number; y: number } | null;
}

type Props = FileExplorerProps & FileExplorerPrivateProps;
type State = FileExplorerState;


const SectionName = styled('span', (props: ThemeProps & SectionProps) => ({
    // backgroundColor: props.selected ? `rgba(255, 255, 255, 0.1)` : undefined,
    // ':hover': {
    //     cursor: 'pointer',
    //     backgroundColor: `rgba(255, 255, 255, 0.1)`
    // },
    width: '100%',

    backgroundColor: "pink",
    transition: 'background-color 0.2s, opacity 0.2s',
    padding: `5px`,
    fontWeight: props.selected ? 400 : undefined,
    userSelect: 'none',
}));



const UsersContainer = styled('div', (props: ThemeProps) => ({

    left: '4%',
    top: '4.8%',
    height: '100%',
    width: '100%', 
    backgroundColor: 'blue', 
    zIndex: 1,
    boxShadow: '2px 0 5px rgba(0,0,0,0.2)',
}));

const SectionsColumn = styled('div', (props: ThemeProps) => ({
    display: 'flex',
    flexDirection: 'column',
    flex: '0 0 150px',
    borderRight: `1px solid ${props.theme.borderColor}`,
}));

const SidePanel = styled('div', (props: ThemeProps) => ({
    display: 'flex',
    flexWrap: 'wrap',
    flex: '1 0 0',
    left: '3.5%',
    top: '6%',
    height: '90%',
    backgroundColor: 'purple', 
    zIndex: 1,
    overflow: 'visible',
    boxShadow: '2px 0 5px rgba(0,0,0,0.2)',
    width: 'auto',
  }));
  

const ProjectContainer = styled('div', (props: ThemeProps) => ({
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'green',
    flex: '0 0 150px',
    padding: '5px',
}));

const ProjectHeaderContainer = styled('div', (props: ThemeProps) => ({
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: 'deeppink',


}));
const ProjectTitle = styled('h2', {
    fontSize: '1.2em',
    marginBottom: '0px',
    textAlign: 'left',
    paddingRight: '20px',
});

const AddProjectButtonContainer = styled('div', (props: ThemeProps & { selected: boolean }) => ({
    borderRadius: '5px',
    cursor: 'pointer',
    marginBottom: '0px',
    marginTop: '19px',
    height: '5px',
    alignItems: 'right',
    ':hover': {
        cursor: 'pointer',
        backgroundColor: `rgba(255, 255, 255, 0.1)`
    },
}));

const AddProjectItemIcon = styled(Fa, {
    paddingLeft: '3px',
    paddingRight: '5px',
    alignItems: 'center',
    height: '15px'
});
const ProjectItem = styled('li', (props: { selected: boolean }) => ({
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    cursor: 'pointer',
    backgroundColor: props.selected ? `rgba(255, 255, 255, 0.1)` : undefined,  // Highlight selected project
    padding: '1px',
    width: '100%',
    boxSizing: 'border-box',
    textOverflow: 'ellipsis',
    whiteSpace: 'normal',
    borderRadius: '5px',
    ':hover': {
        cursor: 'pointer',
        backgroundColor: `rgba(255, 255, 255, 0.1)`
    },
}));


const Container = styled('ul', {
    display: 'flex',
    flexDirection: 'column', /* Change to row if you want horizontal layout */
    flexWrap: 'wrap',
    overflow: 'hidden', /* Hide any overflow within the container */
    padding: '0',
    margin: '0px 0px 0px -30px',
    listStyleType: 'none',
});




const FileTypeContainer = styled('div', (props: ThemeProps) => ({
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'indigo',
    width: '100%',
    padding: '10px',
}));

const FileTypeItem = styled('li', (props: ThemeProps) => ({
    listStyleType: 'none',
    padding: '3px',
    borderRadius: '5px',

}));

const FileContainer = styled('div', (props: ThemeProps) => ({
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    backgroundColor: 'rosybrown',
    flex: '0 0 150px',

    marginLeft: '7px',
}));

const FileItemIcon = styled(Fa, {
    paddingRight: '3px',
    alignItems: 'center',
    height: '15px'
});


const IndividualFile = styled('div', (props: ThemeProps & { selected: boolean }) => ({
    listStyleType: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    padding: '3px',
    ':hover': {
        cursor: 'pointer',
        backgroundColor: `rgba(255, 255, 255, 0.1)`
    },
}));

const ContextMenu = styled('div', (props: ThemeProps & { x: number, y: number }) => ({
    position: "absolute",
    top: `${props.y}px`,
    left: `${props.x}px`,
    background: "#383838",
    border: "1px solid #ccc",
    borderRadius: "4px",
    boxShadow: "0px 4px 6px hsla(0, 0.00%, 0.00%, 0.10)",
    zIndex: 1000,
}));

const ContextMenuItem = styled('div', (props: ThemeProps) => ({
    listStyle: "none",
    padding: "10px",
    margin: 0,
    cursor: "pointer",
    ':hover': {
        cursor: 'pointer',
        backgroundColor: `rgba(255, 255, 255, 0.1)`
    },
}));



export class FileExplorer extends React.PureComponent<Props & FileExplorerReduxSideLayoutProps, State> {
    constructor(props: Props & FileExplorerReduxSideLayoutProps) {
        super(props);

        this.state = {
            userName: '',
            users: [],
            selectedSection: "",
            selectedProject: null,
            projects: null,
            error: null,
            projectName: '',
            activeLanguage: 'c',
            fileType: '',
            showProjectFiles: false,
            showProjects: false,
            currentUserSelected: false,
            includeFiles: [],
            srcFiles: [],
            userDataFiles: [],
            deleteUserFlag: false,
            contextMenuPosition: null,
            showUserContextMenu: false,
            showProjectContextMenu: false,
            showFileContextMenu: false

        };

    }

    // Handle right-click to show the context menu
    handleUserRightClick = (event: React.MouseEvent, user: string) => {
        event.preventDefault();
        this.setState({
            showUserContextMenu: true,
            showProjectContextMenu: false,
            showFileContextMenu: false,
            contextMenuPosition: {
                x: event.pageX,
                y: event.pageY,
            },
            contextMenuUser: user

        }, () => {
            // Add a global click listener to close the menu
            document.addEventListener('click', this.closeContextMenu);
        });
    };

    handleProjectRightClick = (event: React.MouseEvent, project: Project) => {
        event.preventDefault();
        this.setState({
            showProjectContextMenu: true,
            showUserContextMenu: false,
            showFileContextMenu: false,
            contextMenuPosition: {
                x: event.pageX,
                y: event.pageY,
            },

            contextMenuProject: project

        }, () => {
            // Add a global click listener to close the menu
            document.addEventListener('click', this.closeContextMenu);
        });
    };

    handleFileRightClick = (event: React.MouseEvent, file: string) => {
        event.preventDefault();
        this.setState({
            showFileContextMenu: true,
            showProjectContextMenu: false,
            showUserContextMenu: false,
            contextMenuPosition: {
                x: event.pageX,
                y: event.pageY,
            },

            contextMenuFile: file

        }, () => {
            // Add a global click listener to close the menu
            document.addEventListener('click', this.closeContextMenu);
        });
    };

    // Close the context menu
    closeContextMenu = () => {
        this.setState({ contextMenuPosition: null });
    };

    deleteUser = (user: string) => {
        console.log('Delete user clicked with user:', user);
        this.props.onDeleteUser(user, true);
    }

    deleteProject = (project: Project) => {
        console.log("Delete project with state.userName: ", this.state.selectedSection);
        console.log("Delete project clicked with project: ", project);
        this.props.onDeleteProject(this.state.selectedSection, project, true);
    }

    deleteFile = (file: string) => {
        console.log("Delete file with state.userName: ", this.state.selectedSection);
        console.log("Delete file clicked with state.project: ", this.state.selectedProject);
        console.log("Delete file clicked with file: ", file);
        this.props.onDeleteFile(this.state.selectedSection, this.state.selectedProject, file, true);
    }

    downloadUser = (user: string) => {
        console.log('Download user clicked with user:', user);
        this.props.onDownloadUser(user);

    }

    downloadProject = (project: Project) => {
        console.log('Download project clicked with user:', this.state.selectedSection);
        console.log("Download project clicked with project:", project);
        this.props.onDownloadProject(this.state.selectedSection, project);

    }

    downloadFile = (file: string) => {
        console.log('Download file clicked with user:', this.state.selectedSection);
        console.log("Download file clicked with project:", this.state.selectedProject);
        console.log("Download file clicked with file:", file);
        this.props.onDownloadFile(this.state.selectedSection, this.state.selectedProject, file);

    }


    renderUserContextMenu() {
        const { contextMenuPosition } = this.state;
        if (!contextMenuPosition) return null;

        const { x, y, } = contextMenuPosition;

        return (
            <ContextMenu x={x} y={y} theme={DARK} onClick={this.closeContextMenu}>
                <ContextMenuItem theme={DARK}>
                    <li
                        style={{ padding: "5px 10px" }}
                        onClick={() => {
                            this.deleteUser(this.state.contextMenuUser);
                        }}
                    >
                        Delete User
                    </li>
                </ContextMenuItem>

                <ContextMenuItem theme={DARK}>
                    <li
                        style={{ padding: "5px 10px" }}
                        onClick={() => {
                            this.downloadUser(this.state.contextMenuUser);
                        }}
                    >
                        Download User
                    </li>
                </ContextMenuItem>

            </ContextMenu>
        );
    }
    renderProjectContextMenu() {
        const { contextMenuPosition } = this.state;
        if (!contextMenuPosition) return null;

        const { x, y } = contextMenuPosition;

        return (
            <ContextMenu x={x} y={y} theme={DARK} onClick={this.closeContextMenu}>
                <ContextMenuItem theme={DARK}>
                    <li
                        style={{ padding: "5px 10px" }}
                        onClick={() => {
                            this.deleteProject(this.state.contextMenuProject);
                        }}
                    >
                        Delete Project
                    </li>
                </ContextMenuItem>
                <ContextMenuItem theme={DARK}>
                    <li
                        style={{ padding: "5px 10px" }}
                        onClick={() => {
                            this.downloadProject(this.state.contextMenuProject);
                        }}
                    >
                        Download Project
                    </li>
                </ContextMenuItem>
            </ContextMenu>

        );
    }
    renderFileContextMenu() {
        const { contextMenuPosition } = this.state;
        if (!contextMenuPosition) return null;

        const { x, y } = contextMenuPosition;

        return (
            <ContextMenu x={x} y={y} theme={DARK} onClick={this.closeContextMenu}>
                <ContextMenuItem theme={DARK}>
                    <li
                        style={{ padding: "5px 10px" }}
                        onClick={() => {
                            this.deleteFile(this.state.contextMenuFile);
                        }}
                    >
                        Delete File
                    </li>
                </ContextMenuItem>
                <ContextMenuItem theme={DARK}>
                    <li
                        style={{ padding: "5px 10px" }}
                        onClick={() => {
                            this.downloadFile(this.state.contextMenuFile);
                        }}
                    >
                        Download File
                    </li>
                </ContextMenuItem>
            </ContextMenu>

        );
    }


    async componentDidMount() {
        console.log("PropedUsers: ", this.props.propUsers);
    }
    async componentDidUpdate(prevProps: Props, prevState: State) {

        if (prevState.projectName !== this.state.projectName) {
            console.log("inside componentDidUpdate FileExplorer.tsx with prev state: ", prevState);
            console.log("inside componentDidUpdate FileExplorer.tsx with current state: ", this.state);
            this.getProjects(this.state.selectedSection);
            this.setState({

                // showProjectFiles: true,
                selectedProject: this.state.projectName
            });
        }

        if (prevProps.propUserData !== this.props.propUserData) {
            console.log("propUserData changed");
            console.log("propUserData: ", this.props.propUserData);

        }
        if (prevState.selectedSection !== this.state.selectedSection) {
            console.log("selectedSection changed");
            this.setState({ showProjects: true });
        }

        if (prevState.selectedProject !== this.state.selectedProject) {
            console.log("selectedProject changed");
            this.setState({ showProjectFiles: true });
        }
        if (prevProps.addProjectFlag !== this.props.addProjectFlag) {
            if (this.props.addProjectFlag == false) {
                this.getProjects(this.state.selectedSection);
                console.log("fileExplorer componentDidUpdate propProjectName: ", this.props.propProjectName);
                console.log("fileExplorer componentDidUpdate prevProps.propProjectName: ", prevProps.propProjectName);
                console.log("fileExplorer componentDidUpdate projects: ", this.state.projects);
            }
        }
        if (prevProps.userDeleteFlag !== this.props.userDeleteFlag) {
            console.log("FileExp componentDidUpdate userDeleteFlag: ", this.props.userDeleteFlag);
            //this.props.onDeleteUser("", false);
        }


        if (
            prevProps.propFileName !== this.props.propFileName ||
            prevProps.propProjectName !== this.props.propProjectName ||
            prevProps.propActiveLanguage !== this.props.propActiveLanguage ||
            prevProps.propUserName !== this.props.propUserName ||
            prevProps.addProjectFlag !== this.props.addProjectFlag ||
            prevProps.addFileFlag !== this.props.addFileFlag


        ) {
            console.log("inside componentDidUpdate FileExplorer.tsx with state: ", this.state);
            this.setState({

                projectName: this.props.propsSelectedProjectName
            });
            console.log("inside componentDidUpdate FileExplorer.tsx with props: ", this.props);




            if (this.props.addFileFlag == false) {

                try {
                    console.log("FileExp compDidUpdate addFileFlag == false");

                    const projects = await DatabaseService.getAllProjectsFromUser(this.state.userName);
                    const newProjectInfo = await DatabaseService.getProjectInfo(this.state.selectedSection, this.state.projectName);


                    this.setState({
                        projects: projects,
                        srcFiles: newProjectInfo.src.srcFiles,
                        includeFiles: newProjectInfo.include.includeFiles,
                        userDataFiles: newProjectInfo.userData.userDataFiles

                    }, () => {
                        // This callback is executed after the state has been updated
                        console.log("Updated state projects: ", this.state.projects);

                    });

                }
                catch (error) {
                    this.setState({ error: 'Failed to fetch projects' });
                    console.error(error);
                }


            }

        }
    }

    private handleProjectClick = async (projectId: string, user: string) => {
        console.log("handleProjectClick click");

        this.setState({
            showProjectFiles: !this.state.showProjectFiles,
            selectedProject: projectId,
            userName: user,
            projectName: projectId

        }, () => {
            console.log("handleProjectClick this.props.propUserData: ", this.props.propUserData);
            console.log("handleProjectClick state:", this.state);
        })
    };

    private handleFileClick = async (fileName: string) => {
        const { userName, projectName, activeLanguage } = this.state;

        const [name, extension] = fileName.split('.');
        console.log("this.state.projectName: ", this.state.projectName);
        console.log("fileName: ", fileName);
        console.log("FileExpl handleFileClick state:", this.state);


        console.log("extension is:", extension);
        this.setState({
            fileType: extension
        });

        switch (extension) {
            case 'c':
                this.setState({
                    activeLanguage: "c"
                }, () => {
                    console.log("activeLanguage set to: ", this.state.activeLanguage);
                    if (this.props.onFileSelected) {

                        this.props.onFileSelected(userName, projectName, fileName, this.state.activeLanguage, this.state.fileType);
                    }
                });
                break;
            case 'cpp':
                this.setState({
                    activeLanguage: "cpp"
                }, () => {
                    console.log("activeLanguage set to: ", this.state.activeLanguage);
                    if (this.props.onFileSelected) {

                        this.props.onFileSelected(userName, projectName, fileName, this.state.activeLanguage, this.state.fileType);
                    }
                });
                break;
            case 'py':
                this.setState({
                    activeLanguage: "python"
                }, () => {
                    console.log("activeLanguage set to: ", this.state.activeLanguage);
                    if (this.props.onFileSelected) {

                        this.props.onFileSelected(userName, projectName, fileName, this.state.activeLanguage, this.state.fileType);
                    }
                });
                break;
            case 'h':
                this.setState({
                    activeLanguage: "c"
                }, () => {
                    console.log("Header file clicked");
                    console.log("activeLanguage set to: ", this.state.activeLanguage);
                    if (this.props.onFileSelected) {

                        this.props.onFileSelected(userName, projectName, fileName, this.state.activeLanguage, this.state.fileType);
                    }
                });
                break;
            case 'txt':
                this.setState({
                    activeLanguage: "plaintext"
                }, () => {
                    console.log("User Data file clicked");
                    console.log("activeLanguage set to: ", this.state.activeLanguage);
                    if (this.props.onFileSelected) {

                        this.props.onFileSelected(userName, projectName, fileName, this.state.activeLanguage, this.state.fileType);
                    }
                });
                break;

        }


    }

    private addNewProject = async () => {
        console.log("addNewProject click");
        console.log("addNewProject currentState: ", this.state);
        console.log("addNewProject selectedSection: ", this.state.selectedSection);

        const { userName, projectName, activeLanguage, selectedSection } = this.state;

        if (this.props.onAddNewProject) {
            this.props.onAddNewProject(selectedSection);
        }

    }

    private addNewFile = async (fileType: string) => {
        console.log("addNewFile click");
        console.log("addNewFile fileType: ", fileType);
        const { activeLanguage, selectedSection, selectedProject } = this.state;
        console.log("FileExplorer addNewFile state:", this.state);
        if (this.props.onAddNewFile) {
            if (fileType == "python") {
                this.setState({ fileType: 'py' });
                this.props.onAddNewFile(selectedSection, selectedProject, activeLanguage, 'py');

            } else {
                this.setState({ fileType: fileType });
                this.props.onAddNewFile(selectedSection, selectedProject, activeLanguage, fileType);

            }

        }
    }



    private setSelectedSection = async (user: string) => {
        console.log("setSelectedSection click")
        if (this.state.userName !== user) {
            if (this.state.projectName !== this.state.selectedProject) {
                this.setState({ showProjects: null });
            }
        }

        console.log("setSelectedSection selectedSection: ", user);
        this.setState({
            selectedSection: user,
            showProjects: !this.state.showProjects
        })

        this.props.onUserSelected(user, true);

    };

    private getProjects = async (name: string) => {

        const { selectedSection } = this.state;
        this.setState({ error: null });
        try {
            console.log("selectedSection: ", selectedSection);
            console.log("state projects: ", this.state.projects);

        }
        catch (error) {
            this.setState({ error: 'Failed to fetch projects' });
            console.error(error);
        }

    }

    renderSrcFiles() {


        const theme = DARK;
        console.log("renderSrcFiles: ", this.state.srcFiles);
        return (
            <div>
                {this.state.srcFiles.map((srcFile, index) => (

                    <IndividualFile
                        theme={theme}
                        selected={false}
                        key={index}
                        onClick={() => { this.handleFileClick(srcFile) }}
                    >
                        <FileItemIcon icon={faFile} />
                        {srcFile}
                    </IndividualFile>
                ))}
            </div>
        )
    }

    renderIncludeFiles() {
        const theme = DARK;
        console.log("renderIncludeFiles: ", this.state.includeFiles);
        return (
            <div>
                {this.state.includeFiles.map((includeFile, index) => (

                    <IndividualFile
                        theme={theme}
                        selected={false}
                        key={index}
                        onClick={() => { this.handleFileClick(includeFile) }}
                    >
                        <FileItemIcon icon={faFile} />
                        {includeFile}
                    </IndividualFile>


                ))}
            </div>
        )
    }

    renderUserDataFiles() {
        const theme = DARK;
        return (
            <div>
                {this.state.userDataFiles.map((userData, index) => (

                    <IndividualFile
                        theme={theme}
                        selected={false}
                        key={index}
                        onClick={() => { this.handleFileClick(userData) }}
                    >
                        <FileItemIcon icon={faFile} />
                        {userData}
                    </IndividualFile>


                ))}
            </div>
        )
    }

    renderProjects = (projects: Project[]) => {
        const theme = DARK;
        console.log("insideRenderProjects");
        return (
            <div>
                <ProjectContainer theme={theme} key={this.state.selectedSection}>
                    <ProjectHeaderContainer theme={theme}>
                        <ProjectTitle>Projects</ProjectTitle>
                        <AddProjectButtonContainer
                            theme={theme}
                            selected={false}
                            onClick={() => this.addNewProject()}
                        >
                            <AddProjectItemIcon icon={faFolderPlus} />
                            {LocalizedString.lookup(tr('Add Project'), this.props.locale)}
                        </AddProjectButtonContainer>
                    </ProjectHeaderContainer>
                    <ul>
                        {projects.map((project, index) => (


                            <Container key={project.projectName}>
                                <ProjectItem

                                    selected={this.state.selectedProject === project.projectName}
                                    onClick={() => this.handleProjectClick(project.projectName, this.state.selectedSection)}
                                    style={{
                                        backgroundColor: this.state.projectName === project.projectName
                                            ? 'rgba(255, 255, 255, 0.3)' // Highlight color
                                            : 'transparent'
                                    }}
                                    onContextMenu={(e) => this.handleProjectRightClick(e, project)}
                                >
                                    {project.projectName}


                                </ProjectItem>

                                {this.state.selectedProject === project.projectName && this.state.showProjectFiles && (
                                    console.log('Rendering files for project:', project),
                                    <FileTypeContainer theme={theme}>
                                        <FileTypeItem theme={theme} key={`IncludeFileHeader-${project.projectName}`}>
                                            Include Files
                                            <FileContainer theme={theme}>
                                                {project.includeFolderFiles.map((file, i) => (
                                                    <IndividualFile key={`include-${i}`} theme={theme} selected={false} onClick={() => this.handleFileClick(file)} onContextMenu={(e) => this.handleFileRightClick(e, file)}>
                                                        {file}
                                                    </IndividualFile>
                                                ))}


                                                <IndividualFile theme={theme} selected={false} onClick={() => this.addNewFile("h")}>
                                                    <FileItemIcon icon={faFileCirclePlus} />

                                                    {LocalizedString.lookup(tr('Add File'), this.props.locale)}
                                                </IndividualFile>
                                            </FileContainer>
                                        </FileTypeItem>

                                        <FileTypeItem theme={theme} key={`SourceFileHeader-${project.projectName}`}>
                                            Source Files
                                            <FileContainer theme={theme}>
                                                {project.srcFolderFiles.map((file, i) => (
                                                    <IndividualFile key={`src-${i}`} theme={theme} selected={false} onClick={() => this.handleFileClick(file)} onContextMenu={(e) => this.handleFileRightClick(e, file)}>
                                                        {file}
                                                    </IndividualFile>
                                                ))}
                                                <IndividualFile theme={theme} selected={false} onClick={() => this.addNewFile(this.state.activeLanguage)}>
                                                    <FileItemIcon icon={faFileCirclePlus} />
                                                    {LocalizedString.lookup(tr('Add File'), this.props.locale)}
                                                </IndividualFile>
                                            </FileContainer>
                                        </FileTypeItem>

                                        <FileTypeItem theme={theme} key={`UserDataFileHeader-${project.projectName}`}>
                                            User Data Files
                                            <FileContainer theme={theme}>
                                                {project.dataFolderFiles.map((file, i) => (
                                                    <IndividualFile key={`data-${i}`} theme={theme} selected={false} onClick={() => this.handleFileClick(file)} onContextMenu={(e) => this.handleFileRightClick(e, file)}>
                                                        {file}
                                                    </IndividualFile>
                                                ))}
                                                <IndividualFile theme={theme} selected={false} onClick={() => this.addNewFile("txt")}>
                                                    <FileItemIcon icon={faFileCirclePlus} />
                                                    {LocalizedString.lookup(tr('Add File'), this.props.locale)}
                                                </IndividualFile>
                                            </FileContainer>
                                        </FileTypeItem>
                                    </FileTypeContainer>

                                )

                                }

                            </Container>

                        ))}
                    </ul>
                </ProjectContainer>
            </div>
        )

    }

    render() {
        const { props } = this;
        const {

            theme,
            locale,
            propUsers, 
            style
        } = props;

        const {
            users,
            selectedSection,
            projects,
            contextMenuPosition,
            showProjectContextMenu,
            showUserContextMenu,
            showFileContextMenu
        } = this.state;
        console.log("render() propUsers:", propUsers);

        const userSections = (propUsers || []).map((user: string) => {
            //console.log("Rendering user:", user);
            const projects = this.props.propUserData || [];
            console.log("userSections projects: ", projects);
            console.log("this.state.selectedSection: ", this.state.selectedSection);
            return (
                <SectionsColumn theme={theme} key={user}>
                    <SectionName
                        key={user}
                        theme={theme}
                        selected={selectedSection === user}
                        onClick={() => this.setSelectedSection(user)}
                        onContextMenu={(e) => this.handleUserRightClick(e, user)}
                    >
                        {LocalizedString.lookup(tr(user), locale)}
                    </SectionName>
                    {selectedSection === user && this.state.showProjects && this.renderProjects(projects)}

                </SectionsColumn>
            );
        });




        return (
            <div onClick={this.closeContextMenu}>
                <SidePanel
                    theme={theme}
                    style={{
                        flex: style.flex, // Pass flex dynamically from the parent
                    }}
                >
                    <h2>Explorer</h2>
                    <UsersContainer theme={theme}>
                        <SectionsColumn theme={theme}>


                        </SectionsColumn>
                        {userSections}
                    </UsersContainer>


                </SidePanel>
                {showUserContextMenu && this.renderUserContextMenu()}
                {showProjectContextMenu && this.renderProjectContextMenu()}
                {showFileContextMenu && this.renderFileContextMenu()}

            </div >
        );
    }
}

export const FileExplorerSideLayoutRedux = connect((state: ReduxState, { }: LayoutProps) => {


    return {

        locale: state.i18n.locale,
    };
}, dispatch => ({

}), null, { forwardRef: true })(FileExplorer) as React.ComponentType<FileExplorerProps>;