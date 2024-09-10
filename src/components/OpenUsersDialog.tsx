import React, { useEffect, useState } from 'react';
import { styled } from 'styletron-react';
import { StyleProps } from '../style';
import { Dialog } from './Dialog';
import { ThemeProps } from './theme';
import KIPR_LOGO_BLACK from '../assets/KIPR-Logo-Black-Text-Clear-Large.png';
import KIPR_LOGO_WHITE from '../assets/KIPR-Logo-White-Text-Clear-Large.png';
import tr from '@i18n';
import { connect } from 'react-redux';
import { State as ReduxState } from '../state';
import LocalizedString from '../util/LocalizedString';
import ScrollArea from './ScrollArea';
import { ProjectType, DatabaseService } from './DatabaseService';
import ComboBox from './ComboBox';
import { Settings } from '../Settings';
import ProgrammingLanguage from '../ProgrammingLanguage';
type SettingsSection = string;


export interface OpenUsersDialogPublicProps extends ThemeProps, StyleProps {
  onClose: () => void;
  projectLanguage: ProgrammingLanguage;
  settings: Settings;
  onOpenUserProject: (name: string, projectName: string, fileName: string, projectLanguage: string) => void;
  onSettingsChange: (settings: Partial<Settings>) => void;
}

interface OpenUsersDialogPrivateProps {
  locale: LocalizedString.Language;
  onLocaleChange: (locale: LocalizedString.Language) => void;
}

interface OpenUsersDialogState {
  selectedSection: SettingsSection;
  users: string[];
  projects: ProjectType[] | null;
  loading: boolean;
  error: string | null;
  selectedProject: string | null;
  projectName: string;
  activeLanguage: ProgrammingLanguage;

 

}
interface SectionProps {
  selected?: boolean;
}

type Props = OpenUsersDialogPublicProps & OpenUsersDialogPrivateProps;
type State = OpenUsersDialogState;
namespace Modal {
  export enum Type {
    Settings,
    CreateUser,
    RepeatUser,
    None,
    OpenUsers
  }
  export interface None {
    type: Type.None;
  }

  export const NONE: None = { type: Type.None };

  export interface Settings {
    type: Type.Settings;
  }

  export const SETTINGS: Settings = { type: Type.Settings };

  export interface CreateUser {
    type: Type.CreateUser;
  }

  export const CREATEUSER: CreateUser = { type: Type.CreateUser };

  export interface RepeatUser {
    type: Type.RepeatUser;
  }

  export const REPEATUSER: RepeatUser = { type: Type.RepeatUser };


  export interface OpenUsers {
    type: Type.OpenUsers;
  }

  export const OPENUSERS: OpenUsers = { type: Type.OpenUsers };
}

export type Modal = (
  Modal.Settings |
  Modal.CreateUser |
  Modal.None |
  Modal.RepeatUser
);

const Logo = styled('img', {
  width: '150px',
  height: 'auto',
});


const Container = styled('div', (props: ThemeProps) => ({
  display: 'flex',
  flexDirection: 'row',
  color: props.theme.color,
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
    backgroundColor: `rgba(255, 255, 255, 0.1)`
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
  textAlign: 'center', // 
});
const ProjectItem = styled('li', (props: { selected: boolean }) => ({
  cursor: 'pointer',
  backgroundColor: props.selected ? `rgba(255, 255, 255, 0.1)` : undefined,  // Highlight selected project
  padding: '5px',
  margin: '5px 0',
  borderRadius: '5px',
  ':hover': {
    cursor: 'pointer',
    backgroundColor: `rgba(255, 255, 255, 0.1)`
  },
}));
const BottomButtonContainer = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  marginTop: '20px', // Add some space above the button
});


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
  }
  private setSelectedSection = (selectedSection: SettingsSection) => {
    this.setState({ selectedSection }, this.getProjects);
    this.setState({ selectedProject: null });
  };
 
  private handleProjectClick = async(projectId: string) => {
    const projectInfo = await DatabaseService.getProjectInfo(this.state.selectedSection,projectId);
    console.log("Project Info: ", projectInfo);
    console.log("Project ID: ", projectInfo.project_id);
    console.log("Project activeLanguage: ", projectInfo.language);
    this.setState({ 
      selectedProject: projectId,
      projectName: projectInfo.project_id,
      activeLanguage: projectInfo.language
    });

    //console.log("handleProjectClick activeLanguage: ", this.props.projectLanguage);
   
  };
  private getProjects = async () => {
    this.setState({ loading: true, error: null });
    try {
      const projects = await DatabaseService.getAllProjectsFromUser(this.state.selectedSection);
      this.setState({ projects });
    }
    catch (error) {
      this.setState({ error: 'Failed to fetch projects' });
      console.error(error);
    }
    finally {
      this.setState({ loading: false });
    }
  }

  componentDidMount() {
    this.loadUsers();
    this.getProjects();
  }

  private async loadUsers() {
    const users = await DatabaseService.getAllUsers();
    this.setState({ users }); // Store users in state
  }

  renderProjects() {
    const { projects, loading, error, selectedProject } = this.state;

    if (loading) {
      return <div>Loading...</div>;
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
              key={project.project_id}
              selected = {selectedProject === project.project_id}
              onClick={() => this.handleProjectClick(project.project_id)}>
                {project.project_id}
            </ProjectItem>
          ))}
        </ul>
        {
          selectedProject && (
            <BottomButtonContainer>
              <button onClick={() => this.props.onOpenUserProject(this.state.selectedSection, this.state.selectedProject, `main.${ProgrammingLanguage.FILE_EXTENSION[this.state.activeLanguage]}`,this.state.activeLanguage )}>
                Open Project
              </button>
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