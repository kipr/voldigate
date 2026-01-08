import React from 'react';
import KIPR_LOGO_BLACK from '../assets/KIPR-Logo-Black-Text-Clear-Large.png';
import KIPR_LOGO_WHITE from '../assets/KIPR-Logo-White-Text-Clear-Large.png';
import tr from '@i18n';
import LocalizedString from '../util/LocalizedString';
import ScrollArea from './ScrollArea';
import ProgrammingLanguage from '../ProgrammingLanguage';
import { styled } from 'styletron-react';
import { StyleProps } from '../style';
import { Dialog } from './Dialog';
import { ThemeProps } from './theme';
import { connect } from 'react-redux';
import { State as ReduxState } from '../state';
import { Settings } from '../Settings';
import { Project } from 'ivygate/dist/types/project';
import { User } from 'ivygate/dist/types/user';
import { InterfaceMode } from '../types/interfaceModes';
import { JSX } from 'react';

export interface OpenFileDialogPublicProps extends ThemeProps, StyleProps {
  projectLanguage: ProgrammingLanguage;
  settings: Settings;
  onClose: () => void;
  onOpenUserProject: (name: User, project: Project, fileName: string, projectLanguage: string) => void;
  onSettingsChange: (settings: Partial<Settings>) => void;
  onLoadUsers: () => Promise<User[]>;
  onLoadUserData: (openedUserDialog: boolean, createdUserDialog: boolean, desiredUser: User) => Promise<Project[]>;
  onOpenFile: (userName: User, project: Project, fileName: string, projectLanguage: string) => void;
}

interface ClickProps {
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  disabled?: boolean;
}

interface OpenFileDialogPrivateProps {
  locale: LocalizedString.Language;
  onLocaleChange: (locale: LocalizedString.Language) => void;
}

interface OpenFileDialogState {
  loading: boolean;
  showUserProjectFiles: boolean;
  selectedUser: User;

  projectName: string;
  error: string | null;
  selectedProject: Project | null;
  selectedFile: string | null;
  activeLanguage: ProgrammingLanguage;
  selectedProjectFiles: Project | null;
  users: User[];
  projects: Project[] | null;
}

interface SectionProps {
  selected?: boolean;
}

type Props = OpenFileDialogPublicProps & OpenFileDialogPrivateProps;
type State = OpenFileDialogState;

const Logo = styled('img', {
  width: '150px',
  height: 'auto',
});

const Container = styled('div', (props: ThemeProps) => ({
  display: 'flex',
  flexDirection: 'row',
  color: props.theme.color,
  backgroundColor: props.theme.backgroundColor,
  minHeight: '300px',
  maxHeight: '50vh',
}));

const SettingContainer = styled('div', (props: ThemeProps) => ({
  display: 'flex',
  flexDirection: 'row',
  padding: `${props.theme.itemPadding * 2}px`,
}));

const SettingInfoContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  flex: '1 0',
});


const StyledScrollArea = styled(ScrollArea, ({ theme }: ThemeProps) => ({
  flex: 1,
  maxWidth: '12em',
}));


interface SectionProps {
  selected?: boolean;
}

const SectionsColumn = styled('div', (props: ThemeProps) => ({
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  width: '100%',
  borderRight: `1px solid ${props.theme.borderColor}`,
}));

const SectionName = styled('span', (props: ThemeProps & SectionProps) => ({
  backgroundColor: props.selected ? `rgba(255, 255, 255, 0.1)` : undefined,
  ':hover': {
    cursor: 'pointer',
    backgroundColor: props.theme.hoverOptionBackground
  },
  transition: 'background-color 0.2s, opacity 0.2s',
  padding: `${props.theme.itemPadding * 2}px`,
  fontWeight: props.selected ? 400 : undefined,
  wordBreak: 'break-word',
  overflowWrap: 'anywhere',
  userSelect: 'none',
}));

const SettingsColumn = styled(ScrollArea, {
  flex: '1 1',
});

const ProjectTitle = styled('h2', {
  marginTop: '0px',
  marginBottom: '10px',
  fontSize: '1.2em',
  textAlign: 'center',
  maxWidth: '50em',
  wordBreak: 'break-word',
  overflowWrap: 'anywhere',
});

const ProjectFileTitle = styled('h3', {
  marginTop: '0px',
  marginBottom: '10px',
  fontSize: '1.0em',
  textAlign: 'center',
  maxWidth: '25em',
  wordBreak: 'break-word',
  overflowWrap: 'anywhere',
  textDecoration: 'underline',
});

const FileTypeHeader = styled('div', {
  fontSize: '1.0em',
  textAlign: 'start',
  fontWeight: 400,
});

const ProjectItem = styled('li', (props: ThemeProps & { selected: boolean }) => ({
  cursor: 'pointer',
  backgroundColor: props.selected ? props.theme.selectedUserBackground : props.theme.unselectedBackground,
  padding: '10px 20px',
  margin: '5px 0',
  maxWidth: '30em',
  wordBreak: 'break-word',
  overflowWrap: 'anywhere',
  borderRadius: '5px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  ':hover': {
    backgroundColor: props.theme.hoverOptionBackground,
  },
  boxShadow: props.theme.themeName === "DARK" ? ' 0px 7px 8px -4px rgba(0, 0, 0, 0.2), 0px 12px 17px 2px rgba(0, 0, 0, 0.14), 0px 5px 22px 4px rgba(0, 0, 0, 0.12)' : '2px 2px 4px rgba(0,0,0,0.9)',
}));

const ProjectFileContainer = styled('div', (props: ThemeProps) => ({
  cursor: 'pointer',
  leftMargin: '50px',
  borderRadius: '5px',
  display: 'flex',
  flexDirection: 'column',
  maxWidth: '30em',
  justifyContent: 'space-between',
}));

const ProjectFileItem = styled('li', (props: ThemeProps) => ({
  cursor: 'pointer',
  ':hover': {
    backgroundColor: props.theme.hoverOptionBackground,
  },
  maxWidth: '30em',
  wordBreak: 'break-word',
  overflowWrap: 'anywhere',
  paddingBottom: '5px',
  paddingTop: '5px',
  borderRadius: '5px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}));

const Button = styled('button', {
  margin: '0 10px',
  padding: '10px 20px',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
});

// Styled component button for the "Yes" button
const OpenFileButton = styled(Button, (props: ThemeProps & ClickProps) => ({
  marginRight: '70px',
  backgroundColor: props.theme.yesButtonColor.standard,
  minWidth: '7em',
  maxWidth: '20em',
  border: `1px solid ${props.theme.yesButtonColor.border}`,
  ':hover':
    props.onClick && !props.disabled
      ? {
        backgroundColor: props.theme.yesButtonColor.hover,
      }
      : {},
  color: props.theme.yesButtonColor.textColor,
  textShadow: props.theme.yesButtonColor.textShadow,
  boxShadow: '2px 2px 4px rgba(0,0,0,0.9)',
  ':active': props.onClick && !props.disabled
    ? {
      boxShadow: '1px 1px 2px rgba(0,0,0,0.7)',
      transform: 'translateY(1px, 1px)',
    }
    : {},
}));

class OpenFileDialog extends React.PureComponent<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      selectedUser: null,
      users: [],
      projects: null,
      loading: true,
      error: null,
      selectedProject: null,
      projectName: '',
      activeLanguage: 'c',
      showUserProjectFiles: false,
      selectedProjectFiles: null,
      selectedFile: null,

    };
  }

  private setSelectedUser = (selectedUser: User) => {
    this.setState({
      selectedUser,
      selectedProject: {
        projectName: '',
        projectLanguage: 'c',
        includeFolderFiles: [],
        srcFolderFiles: [],
        dataFolderFiles: [],
      }
    }, this.getProjects);

  };

  private handleProjectClick = async (project: Project) => {
    this.setState((prevState) => ({
      selectedProject: project,
      projectName: project.projectName,
      activeLanguage: this.state.projects!.find(project => project.projectName === project.projectName)!.projectLanguage,
      selectedProjectFiles: project,
    }));
  };

  private handleFileClick = async (fileId: string) => {
    this.setState({
      showUserProjectFiles: true,
      selectedFile: fileId,
    })
  };

  private handleButtonClick(file) {
    this.props.onOpenFile(this.state.selectedUser, this.state.selectedProject, file, this.state.activeLanguage);
  }

  private getProjects = async () => {
    this.setState({
      projects: await this.props.onLoadUserData(true, false, this.state.selectedUser),
      loading: false,
    })
  }

  async componentDidMount() {
    try {
      const userDirectories = await this.props.onLoadUsers();

      this.setState({
        users: userDirectories,
      });

    } catch (error) {
      console.error("Error loading users in OpenFileDialog:", error);
    }
  }

  renderProjects() {
    const { projects, loading, error, selectedProject } = this.state;
    const { theme } = this.props;

    if (loading) {
      return <div>Select User to see projects</div>;
    }

    if (error) {
      return <div>Error: {error}</div>;
    }

    if (!projects || projects.length === 0) {
      return <div>No projects found.</div>;
    }

    return (
      <div>
        <ProjectTitle>Projects for {this.state.selectedUser.userName}</ProjectTitle>
        <ul>
          {projects.map((project) => (
               <div key={project.projectName}>
              <ProjectItem
                selected={selectedProject.projectName === project.projectName}
                onClick={() => this.handleProjectClick(project)}
                theme={theme}>
                {project.projectName}
              </ProjectItem>
              {selectedProject.projectName === project.projectName && this.renderFiles()}
            </div>
          ))}
        </ul>

      </div>
    );
  }


  renderFiles() {
    return (
      <div>
        <ProjectFileTitle>Files for {this.state.selectedProject.projectName}</ProjectFileTitle>
        {this.state.selectedUser.interfaceMode === InterfaceMode.SIMPLE ? (
          <ul>
            <FileTypeHeader>src:</FileTypeHeader>
            <ProjectFileContainer theme={this.props.theme} >
              {this.state.selectedProjectFiles?.srcFolderFiles.map((file) => (
                <ProjectFileItem key={file} theme={this.props.theme} onClick={() => this.handleFileClick(file)}>
                  {file}
                  {this.state.selectedFile === file && (
                    <OpenFileButton
                      onClick={(e) => {
                        e.stopPropagation();
                        this.handleButtonClick(file)
                      }}
                      theme={this.props.theme}>
                      Open File
                    </OpenFileButton>
                  )}
                </ProjectFileItem>
              ))}
            </ProjectFileContainer>
          </ul>
        ) : this.state.selectedUser.interfaceMode === InterfaceMode.ADVANCED ? (
          <ul>
            <FileTypeHeader>include:</FileTypeHeader>

            <ProjectFileContainer theme={this.props.theme} >
              {this.state.selectedProjectFiles?.includeFolderFiles.map((file) => (
                <ProjectFileItem key={file} theme={this.props.theme} onClick={() => this.handleFileClick(file)}>
                  {file}
                  {this.state.selectedFile === file && (
                    <OpenFileButton
                      onClick={(e) => {
                        e.stopPropagation();
                        this.handleButtonClick(file)
                      }}
                      theme={this.props.theme}>
                      Open File
                    </OpenFileButton>
                  )}
                </ProjectFileItem>
              ))}
            </ProjectFileContainer>

            <FileTypeHeader>src:</FileTypeHeader>
            <ProjectFileContainer theme={this.props.theme} >
              {this.state.selectedProjectFiles?.srcFolderFiles.map((file) => (
                <ProjectFileItem key={file} theme={this.props.theme} onClick={() => this.handleFileClick(file)}>
                  {file}
                  {this.state.selectedFile === file && (
                    <OpenFileButton
                      onClick={(e) => {
                        e.stopPropagation();
                        this.handleButtonClick(file)
                      }}
                      theme={this.props.theme}>
                      Open File
                    </OpenFileButton>
                  )}
                </ProjectFileItem>
              ))}
            </ProjectFileContainer>

            <FileTypeHeader>data:</FileTypeHeader>
            <ProjectFileContainer theme={this.props.theme} >
              {this.state.selectedProjectFiles?.dataFolderFiles.map((file) => (
                <ProjectFileItem key={file} theme={this.props.theme} onClick={() => this.handleFileClick(file)}>
                  {file}
                  {this.state.selectedFile === file && (
                    <OpenFileButton
                      onClick={(e) => {
                        e.stopPropagation();
                        this.handleButtonClick(file)
                      }}
                      theme={this.props.theme}>
                      Open File
                    </OpenFileButton>
                  )}
                </ProjectFileItem>
              ))}
            </ProjectFileContainer>

          </ul>
        ) : null}


      </div>



    );
  }

  render() {
    const { props, state } = this;
    const { style, className, theme, onClose, locale } = props;
    const { selectedUser, users } = state;
    console.log('OpenFileDialog render props: ', props);
    console.log('OpenFileDialog render state: ', state);

    let logo: JSX.Element;

    switch (theme.foreground) {
      case 'black': {
        logo = <Logo src={KIPR_LOGO_WHITE as string} />;
        break;
      }
      case 'white': {
        logo = <Logo src={KIPR_LOGO_BLACK as string} />;
        break;
      }
    }

    const userSections = Object.values(users).map((user) => (
      <SectionName
        key={user.userName}
        theme={theme}
        selected={selectedUser === user}
        onClick={() => this.setSelectedUser(user)}
      >
        {LocalizedString.lookup(tr(user.userName), locale)}
      </SectionName>
    ));

    return (
      <Dialog
        theme={theme}
        name={LocalizedString.lookup(tr('Open File'), locale)}
        style={{ color: theme.whiteText }}
        onClose={onClose}
      >
        <Container theme={theme} style={style} className={className}>


          <StyledScrollArea theme={theme} >
            <SectionsColumn theme={theme}>

              {userSections}

            </SectionsColumn>
          </StyledScrollArea>
          <SettingsColumn theme={theme}>
            <SettingContainer theme={theme}>
              <SettingInfoContainer>
                {this.renderProjects()}

              </SettingInfoContainer>
            </SettingContainer>
          </SettingsColumn>
        </Container>
      </Dialog>
    );
  }
}

export default connect((state: ReduxState) => ({
  locale: state.i18n.locale,
}))(OpenFileDialog) as React.ComponentType<OpenFileDialogPublicProps>;