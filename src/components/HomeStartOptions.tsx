import CreateUserDialog from './CreateUserDialog';
import tr from '@i18n';
import KIPR_LOGO_WHITE from '../assets/KIPR-Logo-White-Text-Clear-Large.png';
import React from 'react';
import LocalizedString from '../util/LocalizedString';
import SettingsDialog from './SettingsDialog';
import OpenUsersDialog from './OpenUsersDialog';
import ProgrammingLanguage from 'ProgrammingLanguage';
import OpenFileDialog from './OpenFileDialog';
import { styled } from 'styletron-react';
import { StyleProps } from '../style';
import { Fa } from './Fa';
import { ThemeProps } from './theme';
import { faBookReader, faFilePen, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { DEFAULT_SETTINGS, Settings } from '../Settings';
import { Modal } from '../pages/Modal';
import { Project } from '../types/projectTypes';
import { User } from '../types/userTypes';
import { InterfaceMode } from 'types/interfaceModes';
export interface HomeStartOptionsPublicProps extends StyleProps, ThemeProps {
    activeLanguage: ProgrammingLanguage;
    onEditorPageOpen: () => void;
    onChangeProjectName: (projectName: string) => void;
    onCreateProjectDialog: (name: string, interfaceMode: InterfaceMode) => void;
    onOpenUserProject: (name: User, project: Project, fileName: string, projectLanguage: string) => void;
    onLoadUsers: () => Promise<User[]>;
    onLoadUserData: (openedUserDialog: boolean, createdUserDialog?: boolean, desiredUser?: User) => Promise<Project[]>;
    onOpenFile: (userName: User, project: Project, fileName: string, projectLanguage: string) => void;
    onClearConsole: () => void;
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
    position: 'relative',
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
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    zIndex: 1,
    boxShadow: '0px 10px 13px -6px rgba(0, 0, 0, 0.2), 0px 20px 31px 3px rgba(0, 0, 0, 0.14), 0px 8px 38px 7px rgba(0, 0, 0, 0.12)'
}));

const StartContainer = styled('div', (props: ThemeProps) => ({
    backgroundColor: props.theme.startContainerBackground,
    color: props.theme.color,
    width: '85%',
    height: '90%',
    padding: '10px 5px 10px 5px',
    lineHeight: '28px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    position: 'relative',
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
    justifyContent: 'center',
    flexDirection: 'row',
    paddingRight: '20px',
    width: '100%',
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
    }

    handleNewFileClick = () => {
        this.props.onEditorPageOpen();
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