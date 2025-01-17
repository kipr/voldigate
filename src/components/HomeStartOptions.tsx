
import { styled } from 'styletron-react';
import { StyleProps } from '../style';

import { Fa } from './Fa';
import { DARK, ThemeProps } from './theme';
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

export interface HomeStartOptionsPublicProps extends StyleProps, ThemeProps {
    onClearConsole: () => void;
    activeLanguage: ProgrammingLanguage;
    onEditorPageOpen: () => void;
    onChangeProjectName: (projectName: string) => void;
    onCreateProjectDialog: (name: string) => void;
    onOpenUserProject: (name: string, projectName: string, fileName: string, projectLanguage: string) => void;
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
    backgroundColor: 'green',
    color: props.theme.color,
    width: '50%',
    height: '100%',
    marginTop: '16%',
    marginLeft: '23%',
    lineHeight: '28px',
    display: 'flex',
    alignContent: 'flex-start',
    poisition: 'relative',
    flexDirection: 'column',
    zIndex: 1,


}));



const StartContainer = styled('div', (props: ThemeProps) => ({
    backgroundColor: 'blue',
    color: props.theme.color,
    width: '45%',
    height: '55%',
    marginTop: '5%',
    marginLeft: '15%',
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
    position: 'absolute',
    top: '4px',
    display: 'flex',
    flexWrap: 'wrap',
    marginLeft: '10%',
    flexDirection: 'row',
    justifyContent: 'start',
    backgroundColor: '#373737',
    width: '30%',
    height: '30%',
    zIndex: 0,
  }));

  const Logo = styled('img', (props: ThemeProps) => ({
    position: 'relative',
    top: '14%',
    alignItems: 'flex-end',
    width: '250px',
    height: '250px',
    marginLeft: '10%',
    marginRight: '10px',
    userSelect: 'none',
    transition: 'background-color 0.2s, opacity 0.2s'
  }));
  const IDEName = styled('div', (props: ThemeProps) => ({
    position: 'absolute',
    top: '40%',
    display: 'flex',
    flexWrap: 'wrap',
    marginLeft: '60%',
    flexDirection: 'row',
    justifyContent: 'start',
    fontFamily: "bebas-neue-pro-semiexpanded, sans-serif",
    fontStyle: 'normal',
    fontWeight: 600,
    fontSize: "500",
    width: '500px',
    height: '100%',
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
        const theme = DARK;
        const {
            settings,
            modal,
            
        } = this.state;


      
        return (


            <>
                <Container className={className} style={style} theme={theme}>
                    <LogoContainer theme={theme}>
                        <Logo src={KIPR_LOGO_WHITE as string} style={{ marginBottom: '10px' }} theme={theme} />
                        <IDEName style={{ fontSize: 50 }} theme={theme}>KISS IDE</IDEName>
                    </LogoContainer>
                    <StartContainer theme={theme}>
                        <Title theme={theme} style={{ fontSize: 35 }}>Start</Title>
                         <Item onClick={this.onModalClick_(Modal.CREATEUSER)} theme={theme}><ItemIcon icon={faUserPlus}></ItemIcon>{LocalizedString.lookup(tr('New User...'), locale)}</Item>
                        <Item theme={theme}><ItemIcon style={{ paddingRight: '7%' }} icon={faFilePen}></ItemIcon>{LocalizedString.lookup(tr('Open File...'), locale)}</Item>
                        <Item onClick={this.onModalClick_(Modal.OPENUSERS)} theme={theme}><ItemIcon style={{ paddingRight: '9%' }} icon={faBookReader}></ItemIcon>{LocalizedString.lookup(tr('Open User...'), locale)}</Item>


                    </StartContainer>

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
                        onCreateProjectDialog={this.props.onCreateProjectDialog}                         />
               
                )}
                {modal.type === Modal.Type.OpenUsers && (
                    <OpenUsersDialog
                        theme={theme}
                        onClose={this.onModalClose_}
                        settings={settings}
                        onSettingsChange={this.onSettingsChange_}
                        onOpenUserProject={this.props.onOpenUserProject}
                        projectLanguage={this.props.activeLanguage}                    />
                )}
               

            </>

        );
    }
}