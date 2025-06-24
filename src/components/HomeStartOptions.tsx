import CreateUserDialog from './CreateUserDialog';
import tr from '@i18n';
import IDELogo from '../assets/IDE_Logo.webp';
import React from 'react';
import LocalizedString from '../util/LocalizedString';
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
    width: '100%',
    height: '80%',
    paddingTop: '2%',
    marginTop: '1%',
    lineHeight: '28px',
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    flexDirection: 'column',
    gap: '0.81em',
    zIndex: 1,
    fontSize: '1em',


}));


const HomeStartContainer = styled('div', (props: ThemeProps) => ({
    backgroundColor: props.theme.homeStartContainerBackground,
    border: `2px solid ${props.theme.borderColor}`,
    color: props.theme.color,
    width: '60%',
    maxWidth: '30em', 
    height: 'auto',
    minHeight: '40vh',
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    alignItems: 'center',
    flexDirection: 'column',
    zIndex: 1,
    padding: '20px',
    boxShadow: '0px 10px 13px -6px rgba(0, 0, 0, 0.2), 0px 20px 31px 3px rgba(0, 0, 0, 0.14), 0px 8px 38px 7px rgba(0, 0, 0, 0.12)',
}));



const StartContainer = styled('div', (props: ThemeProps) => ({
    backgroundColor: props.theme.startContainerBackground,
    color: props.theme.color,
    width: '100%', 
    maxWidth: '30em',
    height: '100%', 
    minHeight: '10vh', 
    maxHeight: '35vh', 
    padding: '1em',
    display: 'flex',
    alignContent: 'center',
    alignItems: 'flex-start',
    flexDirection: 'column',
    position: 'relative',
    zIndex: 4,
    boxShadow: '0px 3px 5px -1px rgba(0, 0, 0, 0.2), 0px 5px 8px 0px rgba(0, 0, 0, 0.14), 0px 1px 14px 0px rgba(0, 0, 0, 0.12)',
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
    fontSize: 'clamp(1.2rem, 3vw, 2rem)',
    padding: '0.3em 0.1em 0.3em 0.2em',
    marginBottom: '0.1em',
    height: '2.5em',
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
    width: '100%',
    marginBottom: '0.3em',
    marginTop: '0.3em',
    fontSize: 'clamp(1.2rem, 8vw, 3rem)',
    userSelect: 'none',
    transition: 'background-color 0.2s, opacity 0.2s'
}));

const ItemIcon = styled(Fa, {
    display: 'flex',
    justifyContent: 'center',
    paddingRight: '0.2em',
    alignItems: 'center',

    height: '1em'
});


const Logo = styled('img', (props: ThemeProps) => ({
    position: 'relative',
    backgroundColor: '#373737',
    width: '60%',
    height: '60%',
    maxWidth: '20em',
    maxHeight: '20em',
    userSelect: 'none',
    transition: 'background-color 0.2s, opacity 0.2s'
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
            <div style={{ height: '80%', maxHeight: '80%', }}>
                <Container className={className} style={style} theme={theme}>
                    <Logo src={IDELogo as string} loading={'eager'} decoding={'async'} theme={theme} />
                    <HomeStartContainer theme={theme}>
                        <StartContainer theme={theme}>
                            <Title theme={theme} >Start</Title>
                            <Item onClick={this.onModalClick_(Modal.CREATEUSER)} theme={theme}><ItemIcon icon={faUserPlus}></ItemIcon>{LocalizedString.lookup(tr('New User...'), locale)}</Item>
                            <Item onClick={this.onModalClick_(Modal.OPENFILE)} theme={theme}><ItemIcon icon={faFilePen}></ItemIcon>{LocalizedString.lookup(tr('Open File...'), locale)}</Item>
                            <Item onClick={this.onModalClick_(Modal.OPENUSERS)} theme={theme}><ItemIcon icon={faBookReader}></ItemIcon>{LocalizedString.lookup(tr('Open User...'), locale)}</Item>
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
            </div>
        );
    }
}