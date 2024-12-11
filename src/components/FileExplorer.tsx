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

import DatabaseService, { ProjectType, IncludeType, SrcType, SrcData, UserData, IncludeData } from './DatabaseService';
import ProgrammingLanguage from '../ProgrammingLanguage';

type UsersSection = string;



export interface FileExplorerProps extends ThemeProps, StyleProps {
    onProjectSelected?: (userName: string, projectName: string, fileName: string, activeLanguage: ProgrammingLanguage, fileType: string) => void;
    onFileSelected?: (userName: string, projectName: string, fileName: string, activeLanguage: ProgrammingLanguage, fileType: string) => void;
    onUserSelected?: (userName: string) => void;
    onAddNewProject?: (userName: string) => void;
    onAddNewFile?: (userName: string, activeLanguage: ProgrammingLanguage, fileType: string) => void;

    propsSelectedProjectName?: string;
    propFileName?: string;
    propProjectName?: string;
    propActiveLanguage?: ProgrammingLanguage;
    propUserName?: string;
    addProjectFlag?: boolean;
    addFileFlag?: boolean;
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
    includeFiles: IncludeData[];
    srcFiles: SrcData[];
    userDataFiles: UserData[];
    userName: string;
    users: string[];
    selectedSection: UsersSection;
    selectedProject: string;
    projects: ProjectType[] | null;
    error: string | null;
    projectName: string;
    fileType: string;
    activeLanguage: ProgrammingLanguage;
    showProjectFiles: boolean;
    currentUserSelected: boolean;
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
    position: 'absolute',
    left: '4%',
    top: '4.8%',
    height: '80%',
    width: '100%', // Adjust width as needed
    backgroundColor: 'blue', // Customize as needed
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
    position: 'absolute',
    display: 'flex',
    flexWrap: 'wrap',
    left: '3.5%',
    top: '6%',
    height: '90%',
    width: '10%', // Adjust width as needed
    backgroundColor: 'purple', // Customize as needed
    zIndex: 1,
    boxShadow: '2px 0 5px rgba(0,0,0,0.2)',
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

export class FileExplorer extends React.PureComponent<Props & FileExplorerReduxSideLayoutProps, State> {
    constructor(props: Props & FileExplorerReduxSideLayoutProps) {
        super(props);

        this.state = {
            userName: '',
            users: [],
            selectedSection: null,
            selectedProject: null,
            projects: null,
            error: null,
            projectName: '',
            activeLanguage: 'c',
            fileType: '',
            showProjectFiles: false,
            currentUserSelected: false,
            includeFiles: [],
            srcFiles: [],
            userDataFiles: []
        };

    }
    componentDidMount() {
        this.loadUsers();
        //this.getProjects();
        console.log("Projects: ", this.state.projects);
        console.log("fileExplorer mount this.state.showProjectfiles: ", this.state.showProjectFiles);
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
        if (prevProps.addProjectFlag !== this.props.addProjectFlag) {
            if (this.props.addProjectFlag == false) {
                this.getProjects(this.state.selectedSection);
                console.log("fileExplorer componentDidUpdate propProjectName: ", this.props.propProjectName);
                console.log("fileExplorer componentDidUpdate prevProps.propProjectName: ", prevProps.propProjectName);
                console.log("fileExplorer componentDidUpdate projects: ", this.state.projects);
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
            console.log("inside componentDidUpdate FileExplorer.tsx with state: ", this.state);
            this.setState({

                projectName: this.props.propsSelectedProjectName
            });
            console.log("inside componentDidUpdate FileExplorer.tsx with props: ", this.props);




            if (this.props.addFileFlag == false) {

                try {

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
    private handleProjectClick = async (projectId: string) => {

        const projectInfo = await DatabaseService.getProjectInfo(this.state.selectedSection, projectId);
        console.log("Project Info: ", projectInfo);
        console.log("this.state.showProjectFiles before state: ", this.state.showProjectFiles);

        this.setState((prevState) => ({
            userName: prevState.selectedSection,
            selectedProject: projectId,
            projectName: projectInfo.project_id,
            activeLanguage: projectInfo.language,
            showProjectFiles: true,
            srcFiles: projectInfo.src.srcFiles,
            includeFiles: projectInfo.include.includeFiles,
            userDataFiles: projectInfo.userData.userDataFiles
        }));
        if (this.props.onProjectSelected) {

            this.props.onProjectSelected(this.state.selectedSection, projectInfo.project_id, `main.${ProgrammingLanguage.FILE_EXTENSION[projectInfo.language]}`, projectInfo.language, this.state.fileType);
        }

        console.log("this.state.selectedProject: ", this.state.selectedProject);
        console.log("this.state.showProjectFiles: ", this.state.showProjectFiles);


    };
    private handleFileClick = async (fileName: string) => {
        const { userName, projectName } = this.state;
        const projectInfo = await DatabaseService.getProjectInfo(userName, projectName);
        const [name, extension] = fileName.split('.');

        console.log("extension is:", extension);
        this.setState({
            fileType: extension
        });

        if (extension == 'txt') {
            this.setState({
                activeLanguage: 'plaintext'
            });
        }
        else {
            this.setState({
                activeLanguage: projectInfo.language
            });
        }
        console.log("file name inside handleFileClick: ", fileName);
        console.log("handleFileClick current fileType: ", this.state.fileType);
        console.log("Project Info inside handleFileclick: ", projectInfo);

        if (this.props.onFileSelected) {

            this.props.onFileSelected(userName, projectInfo.project_id, fileName, this.state.activeLanguage, this.state.fileType);
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
        const { activeLanguage, selectedSection } = this.state;
        if (this.props.onAddNewFile) {
            if (fileType == "python") {
                this.setState({ fileType: 'py' });
                this.props.onAddNewFile(selectedSection, activeLanguage, 'py');

            } else {
                this.setState({ fileType: fileType });
                this.props.onAddNewFile(selectedSection, activeLanguage, fileType);

            }

        }
    }

    private async loadUsers() {
        const users = await DatabaseService.getAllUsers();
        this.setState({ users }); // Store users in state
    }


    private setSelectedSection = async (selectedSection: UsersSection) => {
        console.log("setSelectedSection click")
        if (this.state.userName !== selectedSection) {
            if (this.state.projectName !== this.state.selectedProject) {
                this.setState({ showProjectFiles: null });
            }
        }

        console.log("setSelectedSection selectedSection: ", selectedSection);


        const userInfo = await DatabaseService.getUserInfo(selectedSection);
        const allUserProjects = await DatabaseService.getAllProjectsFromUser(selectedSection);
        console.log("setSelectedSection allUserProjects: ", allUserProjects);

        this.setState({
            projects: allUserProjects,
            selectedSection: selectedSection,
        });

        this.setState({
            userName: selectedSection,
            selectedProject: null,
            projectName: '',
            activeLanguage: 'c',
            showProjectFiles: false,
        })
        console.log("setSelectedSection state: ", this.state);

    };



    private getProjects = async (name: string) => {

        const { selectedSection } = this.state;
        this.setState({ error: null });
        try {
            console.log("selectedSection: ", selectedSection);
            const projects = await DatabaseService.getAllProjectsFromUser(name);
            console.log("Projects: ", projects);
            this.setState({
                projects: projects
            })

            console.log("state projects: ", this.state.projects);

        }
        catch (error) {
            this.setState({ error: 'Failed to fetch projects' });
            console.error(error);
        }

    }



    renderSrcFiles() {


        const theme = DARK;
        return (
            <div>
                {this.state.srcFiles.map((srcFile, index) => (

                    <IndividualFile
                        theme={theme}
                        selected={false}
                        key={index}
                        onClick={() => { this.handleFileClick(srcFile.fileName) }}
                    >
                        <FileItemIcon icon={faFile} />
                        {srcFile.fileName}
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
                        onClick={() => { this.handleFileClick(includeFile.fileName) }}
                    >
                        <FileItemIcon icon={faFile} />
                        {includeFile.fileName}
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
                        onClick={() => { this.handleFileClick(userData.fileName) }}
                    >
                        <FileItemIcon icon={faFile} />
                        {userData.fileName}
                    </IndividualFile>


                ))}
            </div>
        )
    }

    renderProjects = (selectedSection: UsersSection | null) => {
        const theme = DARK;
        console.log("insideRenderProjects");
        // console.log("Projects: ", this.state.projects);
        // console.log("selectedProject: ", this.state.selectedProject);
        // console.log("state projectName: ", this.state.projectName);
        return (
            <div>
                <ProjectContainer theme={theme} key={selectedSection}>
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
                        {this.state.projects.map((project) => (


                            <Container key={project.project_id}>
                                <ProjectItem

                                    selected={this.state.selectedProject === project.project_id}
                                    onClick={() => this.handleProjectClick(project.project_id)}
                                    style={{
                                        backgroundColor: this.state.projectName === project.project_id
                                            ? 'rgba(255, 255, 255, 0.3)' // Highlight color
                                            : 'transparent'
                                    }}
                                >
                                    {project.project_id}

                                </ProjectItem>

                                {((this.state.showProjectFiles && this.state.selectedProject === project.project_id) || (this.state.projectName === project.project_id)) && (
                                    console.log('Rendering files for project:', project.project_id),
                                    <FileTypeContainer theme={theme}>
                                        <FileTypeItem theme={theme} key={`IncludeFileHeader-${project.project_id}`}>
                                            Include Files
                                            <FileContainer theme={theme}>
                                                {this.renderIncludeFiles()}
                                                <IndividualFile theme={theme} selected={false} onClick={() => this.addNewFile("h")}>
                                                    <FileItemIcon icon={faFileCirclePlus} />

                                                    {LocalizedString.lookup(tr('Add File'), this.props.locale)}
                                                </IndividualFile>
                                            </FileContainer>
                                        </FileTypeItem>
                                        <FileTypeItem theme={theme} key={`SourceFileHeader-${project.project_id}`}>
                                            Source Files
                                            <FileContainer theme={theme}>
                                                {this.renderSrcFiles()}
                                                <IndividualFile theme={theme} selected={false} onClick={() => this.addNewFile(this.state.activeLanguage)}>
                                                    <FileItemIcon icon={faFileCirclePlus} />
                                                    {LocalizedString.lookup(tr('Add File'), this.props.locale)}
                                                </IndividualFile>
                                            </FileContainer>
                                        </FileTypeItem>
                                        <FileTypeItem theme={theme} key={`UserDataFileHeader-${project.project_id}`}>
                                            User Data Files
                                            <FileContainer theme={theme}>
                                                {this.renderUserDataFiles()}
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
            locale
        } = props;

        const {
            users,
            selectedSection,
            projects
        } = this.state;


        const userSections = users.map((user) => (

            <SectionsColumn theme={theme} key={user}>
                <SectionName
                    key={user}
                    theme={theme}
                    selected={selectedSection === user}
                    onClick={() => this.setSelectedSection(user)}
                >
                    {LocalizedString.lookup(tr(user), locale)}

                </SectionName>
                {selectedSection === user && this.renderProjects(user)}
            </SectionsColumn>
        ));



        return (
            <div>
                <SidePanel theme={theme}>
                    <h2>Explorer</h2>
                    <UsersContainer theme={theme}>
                        <SectionsColumn theme={theme}>


                        </SectionsColumn>
                        {userSections}
                    </UsersContainer>


                </SidePanel>
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