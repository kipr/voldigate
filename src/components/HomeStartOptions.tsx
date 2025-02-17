
import { styled } from 'styletron-react';
import { StyleProps } from '../style';
import { Fa } from './Fa';
import {ThemeProps } from './theme';
import CreateUserDialog from './CreateUserDialog';
import { faBookReader, faFilePen, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import tr from '@i18n';
import KIPR_LOGO_WHITE from '../assets/KIPR-Logo-White-Text-Clear-Large.png';
import React from 'react';
import LocalizedString from '../util/LocalizedString';
import { DEFAULT_SETTINGS, Settings } from '../Settings';
import SettingsDialog from './SettingsDialog';
import OpenUsersDialog from './OpenUsersDialog';
import ProgrammingLanguage from 'ProgrammingLanguage';
import { Modal } from '../pages/Modal';
import OpenFileDialog from './OpenFileDialog';

type Project = {
    projectName: string;
    binFolderFiles: string[];
    includeFolderFiles: string[];
    srcFolderFiles: string[];
    dataFolderFiles: string[];
    projectLanguage: ProgrammingLanguage;
}

export interface HomeStartOptionsPublicProps extends StyleProps, ThemeProps {
    onClearConsole: () => void;
    activeLanguage: ProgrammingLanguage;
    onEditorPageOpen: () => void;
    onChangeProjectName: (projectName: string) => void;
    onCreateProjectDialog: (name: string) => void;
    onOpenUserProject: (name: string, projectName: string, fileName: string, projectLanguage: string) => void;
    onLoadUsers: () => Promise<string[]>;
    onLoadUserData: (openedUserDialog: boolean, desiredUser: string) => Promise<Project[]>;
    onOpenFile: (userName: string, projectName: string, fileName: string, projectLanguage: string) => void;
}

interface HomeStartOptionsPrivateProps {
    locale: LocalizedString.Language;
}

interface HomeStartOptionsState {
    modal: Modal;
    language: ProgrammingLanguage;
    settings: Settings;

}

type Props = HomeStartOptionsPublicProps & HomeStartOptionsPrivateProps;
type State = HomeStartOptionsState;


const Container = styled('div', (props: ThemeProps) => ({

    color: props.theme.color,
    width: '50%',
    height: '80%',
    marginTop: '3%',
    marginLeft: '19%',
    lineHeight: '28px',
    display: 'flex',
    alignContent: 'flex-start',
    poisition: 'relative',
    flexDirection: 'column',
    zIndex: 1,



}));

const HomeStartContainer = styled('div', (props: ThemeProps) => ({
    backgroundColor: props.theme.homeStartContainerBackground,
    border: `2px solid ${props.theme.borderColor}`,
    color: props.theme.color,
    width: '45%',
    height: '50%',
    marginTop: '3%',
    marginLeft: '23%',
    lineHeight: '28px',
    display: 'flex',
    alignContent: 'flex-start',
    poisition: 'relative',
    flexDirection: 'column',
    zIndex: 1,
    boxShadow: '0px 10px 13px -6px rgba(0, 0, 0, 0.2), 0px 20px 31px 3px rgba(0, 0, 0, 0.14), 0px 8px 38px 7px rgba(0, 0, 0, 0.12)'



}));



const StartContainer = styled('div', (props: ThemeProps) => ({
    backgroundColor: props.theme.startContainerBackground,
    color: props.theme.color,
    width: '45%',
    height: '90%',
    marginTop: '5%',
    marginLeft: '10%',
    padding: '10px 5px 10px 5px',
    lineHeight: '28px',
    display: 'flex',
    alignContent: 'start',
    poisition: 'relative',
    flexDirection: 'column',
    zIndex: 4,
    boxShadow: '0px 3px 5px -1px rgba(0, 0, 0, 0.2), 0px 5px 8px 0px rgba(0, 0, 0, 0.14), 0px 1px 14px 0px rgba(0, 0, 0, 0.12)'


}));

interface ClickProps {
    onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
    disabled?: boolean;
}

const Item = styled('div', (props: ThemeProps & ClickProps) => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    fontSize: '25px',
    padding: '30px 20px 30px 20px',
    marginBottom: '16px',
    height: '45px',
    userSelect: 'none',
    transition: 'background-color 0.2s, opacity 0.2s',
    cursor: 'grab',
    ':hover': props.onClick && !props.disabled ? {
        cursor: 'pointer',
        backgroundColor: props.theme.hoverOptionBackground
      } : {},
}));
const Title = styled('div', (props: ThemeProps & ClickProps) => ({
    display: 'flex',
    alignItems: 'start',
    flexDirection: 'row',
    paddingRight: '20px',
    marginLeft: '30%',
    marginBottom: '12px',
    height: '45px',
    userSelect: 'none',
    transition: 'background-color 0.2s, opacity 0.2s'
}));
const ItemIcon = styled(Fa, {
    display: 'flex',
    justifyContent: 'center',
    paddingRight: '12px',
    alignItems: 'center',

    height: '30px'
});

const ItemIconContainer = styled('div', {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '60px'
});


const LogoContainer = styled('div', (props: ThemeProps) => ({
    position: 'relative',
    top: '10px',
    display: 'flex',
    flexWrap: 'wrap',
    marginLeft: '10%',
    flexDirection: 'column',

    width: '80%',
    height: '40%',
    zIndex: 0,

}));

const Logo = styled('img', (props: ThemeProps) => ({
    position: 'relative',
    backgroundColor: '#373737',
    alignItems: 'flex-end',
    width: '250px',
    height: '250px',
    marginLeft: '6%',
 
    userSelect: 'none',
    transition: 'background-color 0.2s, opacity 0.2s'
}));
const IDEName = styled('div', (props: ThemeProps) => ({
    position: 'relative',

    display: 'flex',

    marginLeft: '5%',
    marginTop: '17%',    
    flexDirection: 'row',

    fontFamily: "bebas-neue-pro-semiexpanded, sans-serif",
    fontStyle: 'normal',
    fontWeight: 600,
    fontSize: "500",
    width: '500px',
    height: '50%',
    zIndex: 0,
}));



export class HomeStartOptions extends React.Component<Props, State> {
    static username: string;

    constructor(props: Props) {
        super(props);

        this.state = {
            modal: Modal.NONE,
            settings: DEFAULT_SETTINGS,
            language: props.activeLanguage

        }

        console.log("HomeStartOptions constructor language: ", this.state.language);
    }  

    componentDidMount(): void {
        console.log("HomeStartOptions mount with theme: ", this.props.theme);
    }


    componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<HomeStartOptionsState>, snapshot?: any): void {
        console.log("HomeStartOptions compDidUpdate prevProps: ", prevProps);
    }
    handleNewFileClick = () => {
        this.props.onEditorPageOpen();
        // Additional logic for opening the NewFileDialog
    };

    private onSettingsChange_ = (changedSettings: Partial<Settings>) => {
        const nextSettings: Settings = {
            ...this.state.settings,
            ...changedSettings
        }

        this.setState({ settings: nextSettings });
    };
    private onModalClick_ = (modal: Modal) => () => this.setState({ modal });
    private onModalClose_ = () => this.setState({ modal: Modal.NONE });


    render() {
        const {
            className,
            style,
            locale,
            theme
        } = this.props;

        const {
            settings,
            modal,

        } = this.state;

        console.log("HomeStartOptions render with theme: ", theme);


        return (


            <>
                <Container className={className} style={style} theme={theme}>
                    <LogoContainer theme={theme}>
                        <Logo src={KIPR_LOGO_WHITE as string} theme={theme} />
                        <IDEName style={{ fontSize: 50 }} theme={theme}>KISS IDE</IDEName>
                    </LogoContainer>
                    <HomeStartContainer theme={theme}>
                        <StartContainer theme={theme}>
                            <Title theme={theme} style={{ fontSize: 35 }}>Start</Title>
                            <Item onClick={this.onModalClick_(Modal.CREATEUSER)} theme={theme}><ItemIcon icon={faUserPlus}></ItemIcon>{LocalizedString.lookup(tr('New User...'), locale)}</Item>
                            <Item onClick={this.onModalClick_(Modal.OPENFILE)} theme={theme}><ItemIcon icon={faFilePen}></ItemIcon>{LocalizedString.lookup(tr('Open File...'), locale)}</Item>
                            <Item onClick={this.onModalClick_(Modal.OPENUSERS)} theme={theme}><ItemIcon style={{ paddingRight: '9%' }} icon={faBookReader}></ItemIcon>{LocalizedString.lookup(tr('Open User...'), locale)}</Item>


                        </StartContainer>
                    </HomeStartContainer>

                </Container>
                {modal.type === Modal.Type.Settings && (
                    <SettingsDialog
                        theme={theme}
                        settings={settings}
                        onSettingsChange={this.onSettingsChange_}
                        onClose={this.onModalClose_}
                    />
                )}
                {modal.type === Modal.Type.CreateUser && (
                    <CreateUserDialog
                        theme={theme}
                        onClose={this.onModalClose_}
                        userName={''}
                        showRepeatUserDialog={false}
                        onCreateProjectDialog={this.props.onCreateProjectDialog} />

                )}
                {modal.type === Modal.Type.OpenUsers && (
                    <OpenUsersDialog
                        theme={theme}
                        onClose={this.onModalClose_}
                        settings={settings}
                        onSettingsChange={this.onSettingsChange_}
                        onOpenUserProject={this.props.onOpenUserProject}
                        onLoadUsers={this.props.onLoadUsers}
                        onLoadUserData={this.props.onLoadUserData}
                        projectLanguage={this.props.activeLanguage}
                    />
                )}
                 {modal.type === Modal.Type.OpenFile && (
                    <OpenFileDialog
                        theme={theme}
                        onClose={this.onModalClose_}
                        settings={settings}
                        onSettingsChange={this.onSettingsChange_}
                        onOpenUserProject={this.props.onOpenUserProject}
                        onLoadUsers={this.props.onLoadUsers}
                        onLoadUserData={this.props.onLoadUserData}
                        projectLanguage={this.props.activeLanguage}
                        onOpenFile={this.props.onOpenFile}
                    />
                )}


            </>

        );
    }
}