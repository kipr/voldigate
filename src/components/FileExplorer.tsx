import * as React from 'react';
import tr from '@i18n';
import LocalizedString from '../util/LocalizedString';
import ProgrammingLanguage from '../ProgrammingLanguage';
import { Project } from '../types/projectTypes';
import { DARK, ThemeProps } from '../components/theme';
import { StyleProps } from '../style';
import { connect } from 'react-redux';
import { styled } from 'styletron-react';
import { LayoutProps } from './Layout/Layout';
import { State as ReduxState } from '../state';
import { faFile, faFileCirclePlus, faFolderPlus } from '@fortawesome/free-solid-svg-icons';
import { Fa } from './Fa';

export interface FileExplorerProps extends ThemeProps, StyleProps {
    propsSelectedProjectName?: string;
    propFileName?: string;
    propProjectName?: string;
    propUserName?: string;
    propedFromRootFileName?: string;
    addProjectFlag?: boolean;
    addFileFlag?: boolean;
    reloadFilesFlag?: boolean;
    userSelectedFlag?: boolean;
    userDeleteFlag?: boolean;
    propActiveLanguage?: ProgrammingLanguage;
    propUsers: string[];
    propUserData: Project[];

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
    selectedSection: string;
    selectedProject: string;
    selectedFile: string
    userName: string;
    error: string | null;
    projectName: string;
    fileType: string;
    contextMenuUser?: string;
    contextMenuFile?: string;
    deleteUserFlag: boolean;
    showProjectFiles: boolean;
    showProjects: boolean;
    showUserContextMenu: boolean;
    showProjectContextMenu: boolean;
    showFileContextMenu: boolean;
    currentUserSelected: boolean;
    activeLanguage: ProgrammingLanguage;
    contextMenuProject?: Project;
    contextMenuPosition: { x: number; y: number } | null;
    includeFiles: [];
    srcFiles: [];
    userDataFiles: [];
    projects: [] | null;
    users: string[];
}

type Props = FileExplorerProps & FileExplorerPrivateProps;
type State = FileExplorerState;


const SectionName = styled('span', (props: ThemeProps & SectionProps & { selected: boolean }) => ({
    ':hover': {
        cursor: 'pointer',
        backgroundColor: props.theme.hoverOptionBackground
    },
    width: '100%',

    backgroundColor: props.selected ? props.theme.selectedUserBackground : props.theme.unselectedBackground,
    boxShadow: props.theme.themeName === 'DARK' ? '0px 10px 13px -6px rgba(0, 0, 0, 0.2), 0px 20px 31px 3px rgba(0, 0, 0, 0.14), 0px 8px 38px 7px rgba(0, 0, 0, 0.12)' : undefined,
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
    margin: '5px',
    zIndex: 1,
}));

const SectionsColumn = styled('div', (props: ThemeProps) => ({
    display: 'flex',
    flexDirection: 'column',
    flex: '0 0 150px',
    border: `3px solid ${props.theme.borderColor}`,
}));

const SidePanel = styled('div', (props: ThemeProps) => ({
    display: 'flex',
    flexWrap: 'wrap',
    flex: '1 0 0',
    left: '3.5%',
    top: '6%',
    zIndex: 1,
    overflow: 'hidden',
    width: 'auto',
}));

const ProjectContainer = styled('div', (props: ThemeProps) => ({
    display: 'flex',
    flexDirection: 'column',

    position: 'relative',
    flex: '0 0 150px',
    padding: '5px',
    marginLeft: '3px',
    boxShadow: '4px 4px 4px rgba(0,0,0,0.2)',
    width: '99%'
}));

const ProjectHeaderContainer = styled('div', (props: ThemeProps) => ({
    display: 'flex',
    flexDirection: 'row',
    borderBottom: `3px solid ${props.theme.borderColor}`,
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
    marginTop: '10px',
    padding: '5px 10px 30px 10px',
    height: '20px',
    alignItems: 'right',
    ':hover': {
        cursor: 'pointer',
        backgroundColor: props.theme.hoverOptionBackground
    },
}));

const AddProjectItemIcon = styled(Fa, {
    paddingLeft: '3px',
    paddingRight: '5px',
    alignItems: 'center',
    height: '15px'
});

const ProjectItem = styled('li', (props: ThemeProps & { selected: boolean }) => ({
    display: 'flex',
    flexDirection: 'column',
    background: props.selected ? props.theme.selectedProjectBackground : props.theme.unselectedBackground,
    flexWrap: 'wrap',
    cursor: 'pointer',
    padding: '5px',
    width: '100%',
    boxSizing: 'border-box',
    textOverflow: 'ellipsis',
    whiteSpace: 'normal',
    borderRadius: '5px',
    ':hover': {
        cursor: 'pointer',
        backgroundColor: props.theme.hoverFileBackground
    },
}));

const Container = styled('ul', {
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    overflow: 'hidden',
    padding: '0',
    margin: '0px 0px 0px -30px',
    listStyleType: 'none',
});

const FileTypeTitleContainer = styled('div', (props: ThemeProps) => ({
    width: '100%',
    transition: 'background-color 0.2s, opacity 0.2s',
    padding: `5px`,
    fontWeight: 400,
    userSelect: 'none',
}));

const FileTypeContainer = styled('span', (props: ThemeProps & { selected: boolean }) => ({
    width: '100%',
    backgroundColor: props.selected ? props.theme.selectedUserBackground : props.theme.unselectedBackground,
    transition: 'background-color 0.2s, opacity 0.2s',
    padding: `5px`,
    border: `3px solid ${props.theme.borderColor}`,
    userSelect: 'none',
}));

const FileTypeItem = styled('li', (props: ThemeProps) => ({
    listStyleType: 'none',
    padding: '3px',
    borderRadius: '5px',
    boxShadow: props.theme.themeName === "DARK" ? ' 0px 7px 8px -4px rgba(0, 0, 0, 0.2), 0px 12px 17px 2px rgba(0, 0, 0, 0.14), 0px 5px 22px 4px rgba(0, 0, 0, 0.12)' : undefined,
}));

const FileContainer = styled('div', (props: ThemeProps) => ({
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
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
    width: '99%',
    backgroundColor: (props.selected) ? props.theme.selectedFileBackground : undefined,
    padding: '3px',
    ':hover': {
        cursor: 'pointer',
        backgroundColor: props.theme.hoverFileBackground
    },
}));

const ContextMenu = styled('div', (props: ThemeProps & { x: number, y: number }) => ({
    position: "absolute",
    top: `${props.y}px`,
    left: `${props.x}px`,
    background: props.theme.contextMenuBackground,
    border: `2px solid ${props.theme.borderColor}`,
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
        backgroundColor: `${props.theme.hoverFileBackground}`
    },
}));

export class FileExplorer extends React.PureComponent<Props & FileExplorerReduxSideLayoutProps, State> {

    private selectedFileRefFE: React.MutableRefObject<string>;
    private previousSelectedFileFE: React.MutableRefObject<string>;
    constructor(props: Props & FileExplorerReduxSideLayoutProps) {
        super(props);

        this.state = {
            userName: '',
            users: [],
            selectedSection: "",
            selectedProject: null,
            selectedFile: null,
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
        this.selectedFileRefFE = React.createRef();
        this.previousSelectedFileFE = React.createRef();

    }

    async componentDidUpdate(prevProps: Props, prevState: State) {
        if (this.props.propFileName !== this.selectedFileRefFE.current) {
            this.selectedFileRefFE.current = this.props.propFileName;
            this.setState({ selectedFile: this.selectedFileRefFE.current });

        }

        if (prevState.projectName !== this.state.projectName) {
            this.getProjects(this.state.selectedSection);
            this.setState({
                selectedProject: this.state.projectName
            });
        }

        if (prevState.selectedSection !== this.state.selectedSection) {
            this.setState({ showProjects: true });
        }

        if (prevState.selectedProject !== this.state.selectedProject) {
            this.setState({ showProjectFiles: true });
        }
        if (prevProps.addProjectFlag !== this.props.addProjectFlag) {
            if (this.props.addProjectFlag == false) {
                this.getProjects(this.state.selectedSection);
            }
        }

        if (
            prevProps.propFileName !== this.props.propFileName ||
            prevProps.propProjectName !== this.props.propProjectName ||
            prevProps.propActiveLanguage !== this.props.propActiveLanguage ||
            prevProps.propUserName !== this.props.propUserName ||
            prevProps.addProjectFlag !== this.props.addProjectFlag ||
            prevProps.addFileFlag !== this.props.addFileFlag
        ) {
            this.setState({

                projectName: this.props.propsSelectedProjectName
            });
        }
    }

    /**
     * Right click handler for Users
     * @param event - right click event
     * @param user - user name
     */
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
            document.addEventListener('click', this.closeContextMenu);
        });
    };

    /**
     * Right click handler for Projects
     * @param event - right click event
     * @param project - project name
     */
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
            document.addEventListener('click', this.closeContextMenu);
        });
    };

    /**
     * Right click handler for Files
     * @param event - right click event
     * @param file - file name
     */
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
            document.addEventListener('click', this.closeContextMenu);
        });
    };

    closeContextMenu = () => {
        this.setState({ contextMenuPosition: null });
    };

    deleteUser = (user: string) => {
        this.props.onDeleteUser(user, true);
    }

    deleteProject = (project: Project) => {
        this.props.onDeleteProject(this.state.selectedSection, project, true);
    }

    deleteFile = (file: string) => {
        ;
        this.props.onDeleteFile(this.state.selectedSection, this.state.selectedProject, file, true);
    }

    downloadUser = (user: string) => {
        this.props.onDownloadUser(user);
    }

    downloadProject = (project: Project) => {
        this.props.onDownloadProject(this.state.selectedSection, project);
    }

    downloadFile = (file: string) => {
        this.props.onDownloadFile(this.state.selectedSection, this.state.selectedProject, file);
    }

    renderUserContextMenu() {
        const { contextMenuPosition } = this.state;
        const { theme } = this.props;
        if (!contextMenuPosition) return null;

        const { x, y, } = contextMenuPosition;

        return (
            <ContextMenu x={x} y={y} theme={theme} onClick={this.closeContextMenu}>
                <ContextMenuItem theme={theme}>
                    <li
                        style={{ padding: "5px 10px" }}
                        onClick={() => {
                            this.deleteUser(this.state.contextMenuUser);
                        }}
                    >
                        Delete User
                    </li>
                </ContextMenuItem>

                <ContextMenuItem theme={theme}>
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
        const { theme } = this.props;
        if (!contextMenuPosition) return null;

        const { x, y } = contextMenuPosition;

        return (
            <ContextMenu x={x} y={y} theme={theme} onClick={this.closeContextMenu}>
                <ContextMenuItem theme={theme}>
                    <li
                        style={{ padding: "5px 10px" }}
                        onClick={() => {
                            this.deleteProject(this.state.contextMenuProject);
                        }}
                    >
                        Delete Project
                    </li>
                </ContextMenuItem>
                <ContextMenuItem theme={theme}>
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
        const { theme } = this.props;
        if (!contextMenuPosition) return null;

        const { x, y } = contextMenuPosition;

        return (
            <ContextMenu x={x} y={y} theme={theme} onClick={this.closeContextMenu}>
                <ContextMenuItem theme={theme}>
                    <li
                        style={{ padding: "5px 10px" }}
                        onClick={() => {
                            this.deleteFile(this.state.contextMenuFile);
                        }}
                    >
                        Delete File
                    </li>
                </ContextMenuItem>
                <ContextMenuItem theme={theme}>
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

    private handleProjectClick = async (projectId: string, user: string, language: ProgrammingLanguage) => {
        this.setState((prevState) => ({
            showProjectFiles: prevState.selectedProject === projectId ? false : true,
            selectedProject: prevState.selectedProject === projectId ? null : projectId,
            userName: prevState.selectedProject === projectId ? null : user,
            projectName: prevState.selectedProject === projectId ? null : projectId,
            activeLanguage: prevState.selectedProject === projectId ? null : language
        }));

    };

    private handleFileClick = async (fileName: string, projectDetails?: Project) => {
        const { userName, projectName, activeLanguage } = this.state;

        if (this.previousSelectedFileFE.current === null) {
            this.previousSelectedFileFE.current = fileName;
        }
        else {
            this.previousSelectedFileFE.current = this.selectedFileRefFE.current;
        }
        this.selectedFileRefFE.current = fileName;

        const [name, extension] = fileName.split('.');
        this.setState({
            fileType: extension,
            selectedFile: fileName
        });
        switch (extension) {
            case 'c':
                this.setState({
                    activeLanguage: "c"
                }, () => {
                    if (this.props.onFileSelected) {
                        this.props.onFileSelected(userName, projectName, fileName, this.state.activeLanguage, this.state.fileType);
                    }
                });
                break;
            case 'cpp':
                this.setState({
                    activeLanguage: "cpp"
                }, () => {
                    if (this.props.onFileSelected) {

                        this.props.onFileSelected(userName, projectName, fileName, this.state.activeLanguage, this.state.fileType);
                    }
                });
                break;
            case 'py':
                this.setState({
                    activeLanguage: "python"
                }, () => {
                    if (this.props.onFileSelected) {
                        this.props.onFileSelected(userName, projectName, fileName, this.state.activeLanguage, this.state.fileType);
                    }
                });
                break;
            case 'h':
                this.setState({
                    activeLanguage: projectDetails.projectLanguage
                }, () => {
                    if (this.props.onFileSelected) {
                        this.props.onFileSelected(userName, projectName, fileName, this.state.activeLanguage, this.state.fileType);
                    }
                });
                break;
            case 'txt':
                this.setState({
                    activeLanguage: "plaintext"
                }, () => {
                    if (this.props.onFileSelected) {
                        this.props.onFileSelected(userName, projectName, fileName, this.state.activeLanguage, this.state.fileType);
                    }
                });
                break;
        }
    }

    /**
     * Add new project to previously selected user
     */
    private addNewProject = async () => {
        const { selectedSection } = this.state;

        if (this.props.onAddNewProject) {
            this.props.onAddNewProject(selectedSection);
        }

    }

    /**
     * Add new file to previously selected project based on the file type
     * @param fileType - type of file (header, src, data)
     */
    private addNewFile = async (fileType: string) => {
        const { activeLanguage, selectedSection, selectedProject } = this.state;
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

    /**
     * Sets the state user based on the user selected
     * @param user - user name
     */
    private setSelectedSection = async (user: string) => {
        if (this.state.userName !== user) {
            if (this.state.projectName !== this.state.selectedProject) {
                this.setState({ showProjects: null });
            }
        }

        this.setState((prevState) => ({
            selectedSection: prevState.selectedSection === user ? null : user,
            showProjects: !this.state.showProjects
        }));
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
        const { theme } = this.props;

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
        const { theme } = this.props;

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
        const { theme } = this.props;
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
        const { theme } = this.props;

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
                        {projects.map((project) => (


                            <Container key={project.projectName}>
                                <ProjectItem

                                    selected={this.state.selectedProject === project.projectName}
                                    onClick={() => this.handleProjectClick(project.projectName, this.state.selectedSection, project.projectLanguage)}

                                    onContextMenu={(e) => this.handleProjectRightClick(e, project)} theme={theme}
                                >
                                    {project.projectName}
                                </ProjectItem>

                                {this.state.selectedProject === project.projectName && this.state.showProjectFiles && (
                                    console.log('Rendering files for project:', project),
                                    <FileTypeContainer theme={theme} selected={false}>
                                        {project.projectLanguage != "python" && (
                                            <FileTypeItem theme={theme} key={`IncludeFileHeader-${project.projectName}`}>
                                                <FileTypeTitleContainer theme={theme} >
                                                    Include Files
                                                </FileTypeTitleContainer>
                                                <FileContainer theme={theme}>
                                                    {project.includeFolderFiles.map((file, i) => (
                                                        <IndividualFile
                                                            key={`include-${i}`}
                                                            theme={theme}
                                                            selected={this.selectedFileRefFE.current === file}
                                                            onClick={() => this.handleFileClick(file, project)} onContextMenu={(e) => this.handleFileRightClick(e, file)}>
                                                            {file}
                                                        </IndividualFile>
                                                    ))}
                                                    <IndividualFile theme={theme} selected={false} onClick={() => this.addNewFile("h")}>
                                                        <FileItemIcon icon={faFileCirclePlus} />
                                                        {LocalizedString.lookup(tr('Add File'), this.props.locale)}
                                                    </IndividualFile>
                                                </FileContainer>
                                            </FileTypeItem>
                                        )}

                                        <FileTypeItem theme={theme} key={`SourceFileHeader-${project.projectName}`}>
                                            <FileTypeTitleContainer theme={theme}>
                                                Source Files
                                            </FileTypeTitleContainer>
                                            <FileContainer theme={theme}>
                                                {project.srcFolderFiles.map((file, i) => (
                                                    <IndividualFile
                                                        key={`src-${i}`}
                                                        theme={theme}
                                                        selected={this.selectedFileRefFE.current === file}
                                                        onClick={() => this.handleFileClick(file, project)} onContextMenu={(e) => this.handleFileRightClick(e, file)}>
                                                        {file}
                                                    </IndividualFile>
                                                ))}
                                                <IndividualFile theme={theme} selected={false} onClick={() => this.addNewFile(project.projectLanguage)}>
                                                    <FileItemIcon icon={faFileCirclePlus} />
                                                    {LocalizedString.lookup(tr('Add File'), this.props.locale)}
                                                </IndividualFile>
                                            </FileContainer>
                                        </FileTypeItem>

                                        <FileTypeItem theme={theme} key={`UserDataFileHeader-${project.projectName}`}>
                                            <FileTypeTitleContainer theme={theme}>
                                                User Data Files
                                            </FileTypeTitleContainer>
                                            <FileContainer theme={theme}>
                                                {project.dataFolderFiles.map((file, i) => (
                                                    <IndividualFile
                                                        key={`data-${i}`}
                                                        theme={theme}
                                                        selected={this.state.selectedFile === file}
                                                        onClick={() => this.handleFileClick(file, project)} onContextMenu={(e) => this.handleFileRightClick(e, file)}>
                                                        {file}
                                                    </IndividualFile>
                                                ))}
                                                <IndividualFile
                                                    theme={theme}
                                                    selected={false}
                                                    onClick={() => this.addNewFile("txt")}>
                                                    <FileItemIcon icon={faFileCirclePlus} />
                                                    {LocalizedString.lookup(tr('Add File'), this.props.locale)}
                                                </IndividualFile>
                                            </FileContainer>
                                        </FileTypeItem>
                                    </FileTypeContainer>
                                )}
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
        } = props;

        const {
            selectedSection,
            showProjectContextMenu,
            showUserContextMenu,
            showFileContextMenu
        } = this.state;

        const userSections = (propUsers || []).map((user: string) => {
            const projects = this.props.propUserData || [];

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
                        flex: 1,
                        overflowY: 'hidden',
                    }}
                >
                    <h2 style={{ marginLeft: '6px' }}>Explorer</h2>
                    <UsersContainer theme={theme}>
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