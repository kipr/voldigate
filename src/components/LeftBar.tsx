import * as React from 'react';

import { styled } from 'styletron-react';
import { StyleProps } from '../style';
import { Spacer } from './common';
import { Fa } from './Fa';
import { DARK, ThemeProps } from './theme';

import { faCog, faFolderTree } from '@fortawesome/free-solid-svg-icons';

import { connect } from 'react-redux';
import { DEFAULT_SETTINGS, Settings } from '../Settings';
import SettingsDialog from './SettingsDialog';
import { State as ReduxState } from '../state';
import { Modal } from '../pages/Modal';

import LocalizedString from '../util/LocalizedString';

import { Size } from './Widget';
import { FileExplorer } from './FileExplorer';
import ProgrammingLanguage from 'ProgrammingLanguage';
import { Slider } from './Slider';
import Root from './Root';
import { file } from 'jszip';

export interface LeftBarPublicProps extends StyleProps, ThemeProps {

  propedSelectedProjectName: string;
  propedOnProjectSelected: (userName: string, projectName: string, fileName: string, activeLanguage: ProgrammingLanguage, fileType: string) => void;
  propedOnFileSelected: (userName: string, projectName: string, fileName: string, language: ProgrammingLanguage, fileType: string) => void;
  propedOnUserSelected: (userName: string, loadUserData: boolean) => void;
  propedOnAddNewProject: (userName: string) => void;
  propedOnAddNewFile: (userName: string, projectName: string, activeLanguage: ProgrammingLanguage, fileType: string) => void;
  propedOnDeleteUser: (userName: string, deleteUserFlag: boolean) => void;
  propedOnDeleteProject: (userName: string, projectName: Project, deleteProjectFlag: boolean) => void;
  propedOnDeleteFile: (userName: string, projectName: string, fileName: string, deleteFileFlag: boolean) => void;
  propedOnDownloadUser: (userName: string) => void;
  propedOnDownloadProject: (userName: string, project: Project) => void;
  propedOnDownloadFile: (userName: string, projectName: string, fileName: string) => void;
  propedAddProjectFlag: boolean;
  propedAddFileFlag: boolean;
  propedUserDeleteFlag: boolean;
  propedReloadFilesFlag: boolean;
  propedUsers: string[];
  propedUserData: Project[];



  rootSelectedProject: string;
  rootIsLeftBarOpen: boolean;
  rootFileName: string;
  rootProjectName: string;
  rootActiveLanguage: ProgrammingLanguage;
  rootUserName: string;
  rootContextMenuUser: string;
  rootContextMenuProject: Project;
  rootContextMenuFile: string;
  rootAddNewProject: boolean;
  rootAddNewFile: boolean;
  rootClickFile: boolean;
  rootOtherFileType: string;
  rootSetAddNewProject: (addNewProject: boolean) => void;
  rootSetAddNewFile: (addNewFile: boolean) => void;
  rootSetClickFile: (clickFile: boolean) => void;
  rootSetFileName_: (fileName: string) => void;
  rootChangeProjectName: (projectName: string) => void;
  rootOnUserUpdate: (users: string[]) => void;
  rootLoadUserDataFlag: boolean;
  rootOnLoadUserData: (project: Project[]) => void;
  rootDeleteUserFlag: boolean;
  rootDeleteProjectFlag: boolean;
  rootDeleteFileFlag: boolean;
  rootDownloadUserFlag: boolean;
  rootDownloadProjectFlag: boolean;
  rootDownloadFileFlag: boolean;

  rootSetDeleteUserFlag: (deleteUserFlag: boolean) => void;
  rootSetDeleteProjectFlag: (deleteProjectFlag: boolean) => void;
  rootSetDeleteFileFlag: (deleteFileFlag: boolean) => void;
  rootSetDownloadUserFlag: (downloadUserFlag: boolean) => void;
  rootSetDownloadProjectFlag: (downloadProjectFlag: boolean) => void;
  rootSetDownloadFileFlag: (downloadFileFlag: boolean) => void;


}

interface LeftBarPrivateProps {
  locale: LocalizedString.Language;
}

interface LeftBarState {
  modal: Modal;
  settings: Settings;
  activePanel: number;
  sidePanelSize: Size.Type;
  sliderSizes: [number, number];
  isPanelVisible: boolean;

}
type Project = {
  projectName: string;
  binFolderFiles: string[];
  includeFolderFiles: string[];
  srcFolderFiles: string[];
  dataFolderFiles: string[];
  projectLanguage: ProgrammingLanguage;
}

type Props = LeftBarPublicProps & LeftBarPrivateProps;
type State = LeftBarState;
const sizeDict = (sizes: Size[]) => {
  const forward: { [type: number]: number } = {};

  for (let i = 0; i < sizes.length; ++i) {
    const size = sizes[i];
    forward[size.type] = i;
  }

  return forward;
};


const Container = styled('div', (props: ThemeProps) => ({
  backgroundColor: props.theme.backgroundColor,
  color: props.theme.color,
  height: '98%',
  lineHeight: '28px',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-start',
  borderRight: `1px solid ${props.theme.borderColor}`,
  zIndex: 0,
  width: '100vh',
  flexGrow: 1,
}));

interface ClickProps {
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  disabled?: boolean;
}

const Item = styled('div', (props: ThemeProps & ClickProps) => ({
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'row',
  borderRight: `1px solid ${props.theme.borderColor}`,

  paddingRight: '20px',
  marginBottom: '70px',
  height: '45px',
  opacity: props.disabled ? '0.5' : '1.0',
  ':last-child': {
    borderRight: 'none'
  },
  fontWeight: 400,
  ':hover': props.onClick && !props.disabled ? {
    cursor: 'pointer',
    backgroundColor: `rgba(255, 255, 255, 0.1)`
  } : {},
  userSelect: 'none',
  transition: 'background-color 0.2s, opacity 0.2s'
}));

const ItemIcon = styled(Fa, {
  paddingLeft: '8px',
  alignItems: 'center',
  height: '30px'
});



export class LeftBar extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      modal: Modal.NONE,
      settings: DEFAULT_SETTINGS,
      activePanel: 0,
      sidePanelSize: Size.Type.Minimized,
      sliderSizes: [2, 9],
      isPanelVisible: false,

    }
  }

  private onSettingsChange_ = (changedSettings: Partial<Settings>) => {
    const nextSettings: Settings = {
      ...this.state.settings,
      ...changedSettings
    }

    this.setState({ settings: nextSettings });
  };

  private onModalClick_ = (modal: Modal) => () => this.setState({ modal });
  private onModalClose_ = () => this.setState({ modal: Modal.NONE });

  private togglePanelVisibility = () => {
    console.log("LeftBar clicked, triggering toggle");

    // Toggle visibility of FileExplorer
    this.setState((prevState) => {
      const newIsPanelVisible = !prevState.isPanelVisible;

      return {
        isPanelVisible: newIsPanelVisible,

      };
    }, () => {
      console.log("Leftbar sliderSizes: ", this.state.sliderSizes);
    });

  };
  render() {
    const { className, style, locale, } = this.props;
    const theme = DARK;
    const {
      propedSelectedProjectName,
      propedOnProjectSelected,
      propedOnFileSelected,
      propedOnUserSelected,
      propedOnAddNewProject,
      propedOnAddNewFile,
      propedOnDeleteUser,
      propedOnDeleteProject,
      propedOnDeleteFile,
      propedOnDownloadUser,
      propedOnDownloadProject,
      propedOnDownloadFile,
      propedAddProjectFlag,
      propedAddFileFlag,
      propedUserDeleteFlag,
      propedReloadFilesFlag,
      propedUsers,
      propedUserData,

      rootSelectedProject,
      rootIsLeftBarOpen,
      rootFileName,
      rootProjectName,
      rootActiveLanguage,
      rootUserName,
      rootContextMenuUser,
      rootContextMenuProject,
      rootContextMenuFile,
      rootAddNewProject,
      rootAddNewFile,
      rootClickFile,
      rootOtherFileType,
      rootSetAddNewProject,
      rootSetAddNewFile,
      rootSetClickFile,
      rootSetFileName_,
      rootChangeProjectName,
      rootOnUserUpdate,
      rootLoadUserDataFlag,
      rootOnLoadUserData,
      rootDeleteUserFlag,
      rootDeleteProjectFlag,
      rootDeleteFileFlag,
      rootDownloadUserFlag,
      rootDownloadProjectFlag,
      rootDownloadFileFlag,
      rootSetDeleteUserFlag,
      rootSetDeleteProjectFlag,
      rootSetDeleteFileFlag,
      rootSetDownloadUserFlag,
      rootSetDownloadProjectFlag,
      rootSetDownloadFileFlag



    } = this.props;
    const {
      settings,
      modal,
      activePanel,
      sidePanelSize,
      sliderSizes,
      isPanelVisible

    } = this.state;

    let rootContent: JSX.Element;
    rootContent = (
      <div style={{height: '80%', flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Root
          key={rootSelectedProject}
          isLeftBarOpen={rootIsLeftBarOpen}
          history={undefined}
          location={undefined}
          match={undefined}

          propFileName={rootFileName}
          propProjectName={rootProjectName}
          propActiveLanguage={rootActiveLanguage}
          propUserName={rootUserName}
          propContextMenuUser={rootContextMenuUser}
          propContextMenuProject={rootContextMenuProject}
          propContextMenuFile={rootContextMenuFile}

          addNewProject={rootAddNewProject}
          addNewFile={rootAddNewFile}
          clickFile={rootClickFile}
          otherFileType={rootOtherFileType}
          setAddNewProject={rootSetAddNewProject}
          setAddNewFile={rootSetAddNewFile}
          setClickFile={rootSetClickFile}
          setFileName_={rootSetFileName_}
          changeProjectName={rootChangeProjectName}
          onUserUpdate={rootOnUserUpdate}
          loadUserDataFlag={rootLoadUserDataFlag}
          onLoadUserData={rootOnLoadUserData}


          deleteUserFlag={rootDeleteUserFlag}
          deleteProjectFlag={rootDeleteProjectFlag}
          deleteFileFlag={rootDeleteFileFlag}

          downloadUserFlag={rootDownloadUserFlag}
          downloadProjectFlag={rootDownloadProjectFlag}
          downloadFileFlag={rootDownloadFileFlag}

          resetDeleteUserFlag={rootSetDeleteUserFlag}
          resetDeleteProjectFlag={rootSetDeleteProjectFlag}
          resetDeleteFileFlag={rootSetDeleteFileFlag}

          resetDownloadUserFlag={rootSetDownloadUserFlag}
          resetDownloadProjectFlag={rootSetDownloadProjectFlag}
          resetDownloadFileFlag={rootSetDownloadFileFlag} />
      </div>
    )

    let fileExplorerContent: JSX.Element;

    fileExplorerContent = (
      <div style={{ flex: '1 1 0', display: 'flex', flexDirection: 'column', overflow: 'visible', height: '100%' }}>
        <FileExplorer
          theme={theme}
          locale="en-US"
          propsSelectedProjectName={propedSelectedProjectName}
          onProjectSelected={propedOnProjectSelected}
          onFileSelected={propedOnFileSelected}
          onUserSelected={propedOnUserSelected}
          onAddNewProject={propedOnAddNewProject}
          onAddNewFile={propedOnAddNewFile}
          onDeleteUser={propedOnDeleteUser}
          onDeleteProject={propedOnDeleteProject}
          onDeleteFile={propedOnDeleteFile}
          onDownloadUser={propedOnDownloadUser}
          onDownloadProject={propedOnDownloadProject}
          onDownloadFile={propedOnDownloadFile}
          addProjectFlag={propedAddProjectFlag}
          addFileFlag={propedAddFileFlag}
          userDeleteFlag={propedUserDeleteFlag}
          reloadFilesFlag={propedReloadFilesFlag}
          propUsers={propedUsers}
          propUserData={propedUserData}
          style={{
            flex: 1,
            width: `${sliderSizes[0] * 100}%`,
            height: '100%',

            zIndex: 1,
          }}
        />
      </div>
    );


    // Inside LeftBar component



    return (

      <Container className={className} theme={theme}>



        <div style={{ display: 'flex', flexDirection: 'column', width: '50px', flex: '1 1 0' }}>
          <Item theme={theme} onClick={this.togglePanelVisibility}>
            <ItemIcon icon={faFolderTree} />
          </Item>

          <Spacer style={{ marginBottom: '650px', borderBottom: `1px solid ${theme.borderColor}` }} />

          <Item style={{ marginBottom: '10px' }} theme={theme} onClick={this.onModalClick_(Modal.SETTINGS)}>
            <ItemIcon icon={faCog} />
          </Item>
        </div>

        <Slider
          isVertical={true}
          theme={theme}
          minSizes={[50, 0]}
          sizes={this.state.sliderSizes} // Dynamic sizing based on FileExplorer visibility
          visible={[isPanelVisible, true]}

        >
          {fileExplorerContent}
          {rootContent}
        </Slider>


      </Container >

    );
  }
}

export default connect((state: ReduxState) => ({
  locale: state.i18n.locale
}))(LeftBar) as React.ComponentType<LeftBarPublicProps>;