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
import { Project } from '../types/projectTypes';

export interface OpenUsersDialogPublicProps extends ThemeProps, StyleProps {
  projectLanguage: ProgrammingLanguage;
  settings: Settings;
  onClose: () => void;
  onOpenUserProject: (name: string, projectName: string, fileName: string, projectLanguage: string) => void;
  onSettingsChange: (settings: Partial<Settings>) => void;
  onLoadUsers: () => Promise<string[]>;
  onLoadUserData: (openedUserDialog: boolean, desiredUser: string) => Promise<Project[]>;
}

interface ClickProps {
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  disabled?: boolean;
}

interface OpenUsersDialogPrivateProps {
  locale: LocalizedString.Language;
  onLocaleChange: (locale: LocalizedString.Language) => void;
}

interface OpenUsersDialogState {
  loading: boolean;
  selectedSection: string;
  projectName: string;
  selectedProject: string | null;
  error: string | null;
  activeLanguage: ProgrammingLanguage;
  users: string[];
  projects: Project[] | null;
}

interface SectionProps {
  selected?: boolean;
}

type Props = OpenUsersDialogPublicProps & OpenUsersDialogPrivateProps;
type State = OpenUsersDialogState;

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

interface SectionProps {
  selected?: boolean;
}

const SectionsColumn = styled('div', (props: ThemeProps) => ({
  display: 'flex',
  flexDirection: 'column',
  flex: '0 0 150px',
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
});

const ProjectItem = styled('li', (props: ThemeProps & { selected: boolean }) => ({
  cursor: 'pointer',
  backgroundColor: props.selected ? `rgba(255, 255, 255, 0.1)` : undefined, 
  padding: '5px',
  margin: '5px 0',
  borderRadius: '5px',
  ':hover': {
    cursor: 'pointer',
    backgroundColor: props.theme.hoverOptionBackground
  },
}));

const BottomButtonContainer = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  marginTop: '20px', 
});

const Button = styled('button', {
  margin: '0 10px',
  padding: '10px 20px',
  border: 'none', 
  borderRadius: '5px', 
  cursor: 'pointer', 
});

// Styled component button for the "Yes" button
const OpenProjectButton = styled(Button, (props: ThemeProps & ClickProps) => ({
  backgroundColor: props.theme.yesButtonColor.standard,
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

class OpenUsersDialog extends React.PureComponent<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      selectedSection: 'Default User',
      users: [],
      projects: null,
      loading: true,
      error: null,
      selectedProject: null,
      projectName: '',
      activeLanguage: 'c'

    };
  };

  private setSelectedSection = (selectedSection: string) => {
    this.setState({ selectedSection }, this.getProjects);
    this.setState({ selectedProject: null });
  };

  private handleProjectClick = async (projectId: string) => {
    this.setState({
      selectedProject: projectId,
      projectName: projectId,
      activeLanguage: this.state.projects!.find(project => project.projectName === projectId)!.projectLanguage
    });
  };

  private getProjects = async () => {
    this.setState({
      projects: await this.props.onLoadUserData(true, this.state.selectedSection),
      loading: false,
    })
  };

  async componentDidMount() {
    try {
      const userDirectories = await this.props.onLoadUsers();

      this.setState({
        users: userDirectories,
      });

    } catch (error) {
      console.error("Error loading users in OpenUsersDialog:", error);
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
        <ProjectTitle>Projects for {this.state.selectedSection}</ProjectTitle>
        <ul>
          {projects.map((project) => (
            <ProjectItem
              key={project.projectName}
              selected={selectedProject === project.projectName}
              onClick={() => this.handleProjectClick(project.projectName)}
              theme={this.props.theme}>
              {project.projectName}
            </ProjectItem>
          ))}
        </ul>
        {
          selectedProject && (
            <BottomButtonContainer>
              <OpenProjectButton onClick={() => this.props.onOpenUserProject(this.state.selectedSection, this.state.selectedProject, `main.${ProgrammingLanguage.FILE_EXTENSION[this.state.activeLanguage]}`, this.state.activeLanguage)} theme={theme}>
                Open Project
              </OpenProjectButton>
            </BottomButtonContainer>
          )
        }
      </div>
    );
  }

  render() {
    const { props, state } = this;
    const { style, className, theme, onClose, locale } = props;
    const { selectedSection, users } = state;

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

    const userSections = users.map((user) => (
      <SectionName
        key={user}
        theme={theme}
        selected={selectedSection === user}
        onClick={() => this.setSelectedSection(user)}
      >
        {LocalizedString.lookup(tr(user), locale)}
      </SectionName>
    ));

    return (
      <Dialog
        theme={theme}
        name={LocalizedString.lookup(tr('Open Users'), locale)}
        style={{ color: theme.whiteText }}
        onClose={onClose}
      >
        <Container theme={theme} style={style} className={className}>
          <SectionsColumn theme={theme}>
            {userSections}
          </SectionsColumn>
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
}))(OpenUsersDialog) as React.ComponentType<OpenUsersDialogPublicProps>;