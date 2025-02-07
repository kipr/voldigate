
import { styled } from 'styletron-react';
import { StyleProps } from '../style';

import { Fa } from './Fa';
import { DARK, ThemeProps, LIGHT } from './theme';
import CreateUserDialog from './CreateUserDialog';
import { faBookReader, faFileCirclePlus, faFilePen, faUserPlus } from '@fortawesome/free-solid-svg-icons';

import tr from '@i18n';
import KIPR_LOGO_WHITE from '../assets/KIPR-Logo-White-Text-Clear-Large.png';

import React from 'react';

import LocalizedString from '../util/LocalizedString';
import { DEFAULT_SETTINGS, Settings } from '../Settings';

import SettingsDialog from './SettingsDialog';


import OpenUsersDialog from './OpenUsersDialog';

import ProgrammingLanguage from 'ProgrammingLanguage';
import { Modal } from '../pages/Modal';

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
    //onNewFileName: (name: string) => void;
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
    height: '70%',
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



}));



const StartContainer = styled('div', (props: ThemeProps) => ({
    backgroundColor: '#ebdbdc',
    color: props.theme.color,
    width: '45%',
    height: '85%',
    marginTop: '5%',
    marginLeft: '10%',
    padding: '10px 5px 10px 5px',
    lineHeight: '28px',
    display: 'flex',
    alignContent: 'start',
    poisition: 'relative',
    flexDirection: 'column',
    zIndex: 4,


}));

interface ClickProps {
    onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
    disabled?: boolean;
}

const Item = styled('div', (props: ThemeProps & ClickProps) => ({
    display: 'flex',
    alignItems: 'start',
    flexDirection: 'row',
    fontSize: '25px',
    paddingRight: '20px',
    paddingLeft: '20px',
    marginBottom: '12px',
    height: '45px',
    userSelect: 'none',
    transition: 'background-color 0.2s, opacity 0.2s',
    cursor: 'grab'
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
    paddingRight: '12px',
    alignItems: 'center',
    height: '30px'
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


    private onCreateProject = () => {
        console.log("OnCreateProject;");
    };


    render() {
        const {
            className,
            style,
            locale,
        } = this.props;
        const theme = LIGHT;
        const {
            settings,
            modal,

        } = this.state;



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
                            <Item theme={theme}><ItemIcon style={{ paddingRight: '7%' }} icon={faFilePen}></ItemIcon>{LocalizedString.lookup(tr('Open File...'), locale)}</Item>
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


            </>

        );
    }
}