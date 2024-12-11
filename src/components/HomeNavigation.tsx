import * as React from 'react';
import { DARK, ThemeProps } from '../components/theme';
import { StyleProps } from '../style';
import { styled } from 'styletron-react';
import MainMenu from '../components/MainMenu';
import LeftBar from '../components/LeftBar';
import { RouteComponentProps } from 'react-router';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import LocalizedString from '../util/LocalizedString';
import Root from './Root';
import { State as ReduxState } from '../state';
import { FileExplorer } from './FileExplorer';
import ProgrammingLanguage from '../ProgrammingLanguage';


export interface HomeNavigationPublicProps extends RouteComponentProps, ThemeProps, StyleProps {

}

interface HomeNavigationPrivateProps {
  onTutorialsClick: () => void;
  onSimulatorClick: () => void;
  locale: LocalizedString.Language;
}

interface HomeNavigationState {
  isleftbaropen__: boolean;
  isPanelVisible: boolean;
  isAddNewProject: boolean;
  isAddNewFile: boolean;
  isClickFile: boolean;
  selectedProject: string;
  fileName: string;
  userName: string;
  activeLanguage: ProgrammingLanguage;
  projectName: string;
  fileType?: string;
}


type Props = HomeNavigationPublicProps & HomeNavigationPrivateProps;
type State = HomeNavigationState;
const Container = styled('div', (props: ThemeProps) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'left',
  justifyContent: 'center',
  width: '100%',
  height: '100%',
  backgroundColor: props.theme.backgroundColor,
  color: props.theme.color,
}));


const HomeNavigationContainer = styled('div', (props: ThemeProps) => ({

  alignItems: 'left',
  justifyContent: 'center',
  width: '100%',
  height: '100vh',
  backgroundColor: props.theme.backgroundColor,
  color: props.theme.color,
}));

const LeftBarContainer = styled('div', (props: ThemeProps) => ({

  alignItems: 'left',
  justifyContent: 'center',
  width: '100%',
  height: '100vh',
  backgroundColor: props.theme.backgroundColor,
  color: props.theme.color,
}));


const RootContainer = styled('div', (props: { theme: any; isleftbaropen_: string }) => {
  //const marginLeft = props.isleftbaropen_ ? '15%' : '4%';
  const marginLeft = props.isleftbaropen_ === "true"
    ? `${(window.innerWidth * 0.12)}px` // 13% of window.innerWidth
    : `${(window.innerWidth * 0.01)}px`; // 4% of window.innerWidth

  return {
    position: 'absolute',
    top: '4%',
    left: '2%',
    display: 'flex',
    flexWrap: 'wrap',
    // marginLeft: props.isleftbaropen_ == "true" ? '13%' : '4%', // Shift based on LeftBar state
    marginLeft: marginLeft,
    flexDirection: 'row',
    justifyContent: 'start',
    width: '30%',
    height: '30%',
    zIndex: 0,
  };
});

class HomeNavigation extends React.PureComponent<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      isleftbaropen__: false,
      isPanelVisible: false,
      isAddNewProject: false,
      isAddNewFile: false,
      isClickFile: false,
      fileName: '',
      userName: '',
      activeLanguage: 'c',
      projectName: '',
      selectedProject: ''
    };

  }

  componentDidMount(): void {
    console.log('Inside componentDidMount in HomeNavigation.tsx with state:', this.state);
   
    
  }

  async initializeRepo() {

  }
  componentDidUpdate() {
    console.log('Inside componentDidUpdate in HomeNavigation.tsx with state:', this.state);
  }
  private toggleLeftBar_ = () => {
    this.setState((prevState) => ({
      isleftbaropen__: !prevState.isleftbaropen__,
      isPanelVisible: !prevState.isPanelVisible,
    }));
  };

  private onProjectSelected = (userName: string, projectName: string, fileName: string, activeLanguage: ProgrammingLanguage, fileType: string) => {
    console.log("Selected project:", projectName);
    console.log("Selected file:", fileName);
    console.log("Selected language:", activeLanguage);
    console.log("onProjectSelected selected fileType:", fileType);

    console.log("onProjectSelected current state:", this.state);
    console.log("previous state fileName:", this.state.fileName);


    this.setState({
      userName,
      projectName,
      fileName: fileName,
      activeLanguage: activeLanguage,
      selectedProject: projectName
    }, () => {
      console.log('Inside onProjectSelected in HomeNavigation.tsx with state:', this.state);
    });

    // console.log('Inside onProjectSelected in HomeNavigation.tsx with userName:', userName, 'projectName:', projectName, 'fileName:', fileName, 'activeLanguage:', activeLanguage);


  };

  private onFileSelected = (selectedUserName: string, selectedProjectName: string, selectedFileName: string, selectedLanguage: ProgrammingLanguage, selectedFileType: string) => {
    console.log("Selected project:", selectedProjectName);
    console.log("Selected file:", selectedFileName);
    console.log("Selected language:", selectedLanguage);
    console.log("Selected fileType:", selectedFileType);

    console.log("onFileSelected current state:", this.state);
    console.log("previous state fileName:", this.state.fileName);

    this.setState({
      userName: selectedUserName,
      projectName: selectedProjectName,
      fileName: selectedFileName,
      activeLanguage: selectedLanguage,
      fileType: selectedFileType,
      isClickFile: true
    }, () => {
      console.log('Inside onFileSelected in HomeNavigation.tsx with state:', this.state);
    });

    // console.log('Inside onProjectSelected in HomeNavigation.tsx with userName:', userName, 'projectName:', projectName, 'fileName:', fileName, 'activeLanguage:', activeLanguage);
  };

  private onChangeProjectName_ = (projectName: string) => {

    console.log("onChangeProjectName_ projectName:", projectName);
    this.setState({
      projectName
    });
  }
  private onAddNewProject_ = (userName: string) => {

    console.log("homeNavigation onAddNewProject_ passed userName:", userName);

    this.setState({
      isAddNewProject: true,
      userName: userName,
    });

  };

  private onAddNewFile_ = (userName: string, activeLanguage: ProgrammingLanguage, fileType: string) => {
    console.log("homeNavigation onAddNewFile_ passed userName:", userName);
    console.log("homeNavigation onAddNewFile_ passed activeLanguage:", activeLanguage);
    console.log("homeNavigation onAddNewFile_ passed fileType: ", fileType);
    this.setState({
      isAddNewFile: true,
      userName: userName,
      activeLanguage: activeLanguage,
      fileType: fileType
    });
  };

  private setAddNewProject_ = (isAddNewProject: boolean) => {
    this.setState({
      isAddNewProject: isAddNewProject
    });

    console.log("setAddNewProject_ isAddNewProject:", isAddNewProject);
  }

  private setAddNewFile_ = (isAddNewFile: boolean) => {
    this.setState({
      isAddNewFile: isAddNewFile
    });

    console.log("setAddNewFile_ isAddNewFile:", isAddNewFile);
  }

  private setClickFile_ = (isClickFile: boolean) => {
    this.setState({
      isClickFile: isClickFile
    });

    console.log("setClickFile_ isClickFile:", isClickFile);
  }

  private onUserSelected = (userName: string) => {
    this.setState({
      userName,
    });
  };

  render() {
    const { props, state } = this;
    const { className, style } = props;
    const {
      isPanelVisible,
      activeLanguage,
      fileName,
      projectName,
      userName,
      isAddNewProject,
      isAddNewFile,
      isClickFile,
      fileType
    } = state;
    const theme = DARK;

    return (
      <HomeNavigationContainer theme={theme}>
        <Container className={className} style={style} theme={theme}>
          <MainMenu theme={theme} />
          <LeftBarContainer theme={theme}>

            <LeftBar theme={theme} onToggle={this.toggleLeftBar_} />

            {isPanelVisible && (
              <FileExplorer
                theme={theme}
              
                locale={'en-US'}
                propsSelectedProjectName={this.state.projectName}
                onProjectSelected={this.onProjectSelected}
                onFileSelected={this.onFileSelected}
                onUserSelected={this.onUserSelected}
                onAddNewProject={this.onAddNewProject_}
                onAddNewFile={this.onAddNewFile_}
                addProjectFlag={isAddNewProject}
                addFileFlag={isAddNewFile}
              />

            )}
          </LeftBarContainer>

          <RootContainer theme={theme} isleftbaropen_={this.state.isleftbaropen__ ? "true" : "false"}>

            <Root
              key={this.state.selectedProject}
              isLeftBarOpen={this.state.isleftbaropen__}
              history={undefined}
              location={undefined}
              match={undefined}
              propFileName={fileName}
              propProjectName={projectName}
              propActiveLanguage={activeLanguage}
              propUserName={userName}
              addNewProject={isAddNewProject}
              addNewFile={isAddNewFile}
              clickFile={isClickFile}
              otherFileType={fileType}
              setAddNewProject={this.setAddNewProject_}
              setAddNewFile={this.setAddNewFile_}
              setClickFile={this.setClickFile_}
              changeProjectName={this.onChangeProjectName_}
            />
          </RootContainer>
        </Container>

      </HomeNavigationContainer>
    );
  }
}

export default connect((state: ReduxState) => ({
  locale: state.i18n.locale,
}), dispatch => ({
  onTutorialsClick: () => dispatch(push('/tutorials')),
  onSimulatorClick: () => dispatch(push('/scene/jbcSandboxA')),
}))(HomeNavigation) as React.ComponentType<HomeNavigationPublicProps>;