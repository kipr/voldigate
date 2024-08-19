
import { styled } from 'styletron-react';
import { StyleProps } from '../style';
import { Spacer } from './common';
import { Fa } from './Fa';
import { DARK, ThemeProps } from './theme';
import CreateUserDialog from './CreateUserDialog';
import { faBookReader, faCirclePlus, faCog, faFileCirclePlus, faFilePen, faFolderTree, faSignOutAlt, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { Space } from '../Sim';
import tr from '@i18n';
import KIPR_LOGO_WHITE from '../assets/KIPR-Logo-White-Text-Clear-Large.png';
import { connect } from 'react-redux';

import { State as ReduxState } from '../state';
import React, { useEffect, useState } from 'react';

import { signOutOfApp } from '../firebase/modules/auth';
import LocalizedString from '../util/LocalizedString';
import { DEFAULT_SETTINGS, Settings } from '../Settings';
import { DEFAULT_CREATEUSER, CreateUser } from '../CreateUser';
import SettingsDialog from './SettingsDialog';



import PouchDB from 'pouchdb';

import { DatabaseService } from './DatabaseService';
import OpenUsersDialog from './OpenUsersDialog';
import NewFileDialog from './NewFileDialog';
import ProgrammingLanguage from 'ProgrammingLanguage';
import { set } from 'immer/dist/internal';
import EditorPage from './EditorPage';
import CreateProjectDialog from './CreateProjectDialog';


namespace Modal {
    export enum Type {
        Settings,
        CreateUser,
        RepeatUser,
        None,
        OpenUsers,
        CreateNewFile
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


    export interface CreateNewFile {
        type: Type.CreateNewFile;
    }

    export const CREATENEWFILE: CreateNewFile = { type: Type.CreateNewFile };
}
export type Modal = (
    Modal.Settings |
    Modal.CreateUser |
    Modal.None |
    Modal.OpenUsers |
    Modal.CreateNewFile
);

export interface HomeStartOptionsPublicProps extends StyleProps, ThemeProps {
    onClearConsole: () => void;
    activeLanguage: ProgrammingLanguage;
    onEditorPageOpen: () => void;
    onChangeProjectName: (projectName: string) => void;
    onCreateProjectDialog: (name: string) => void;

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


async function fetchDocument() {
    const doc = { _id: 'erin_database' }; // replace with actual document ID
    try {
        const document = await DatabaseService.getDatabase(doc._id);
        console.log('Document:', document);
    } catch (error) {
        console.error('Failed to fetch document:', error);
    }
}
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

    private handleDatabaseClick_ = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        fetchDocument();
    };
    
    private onCreateProject = () => {
        console.log("OnCreateProject;");
    };


    render() {
        const {
            className,
            style,
            locale,
            onClearConsole } = this.props;
        const theme = DARK;
        const {
            settings,
            modal,
            language
        } = this.state;


        DatabaseService.checkForUserDatabase();

        return (


            <>
                <Container className={className} style={style} theme={theme}>
                    <LogoContainer theme={theme}>
                        <Logo src={KIPR_LOGO_WHITE as string} style={{ marginBottom: '10px' }} theme={theme} />
                        <IDEName style={{ fontSize: 50 }} theme={theme}>KISS IDE</IDEName>
                    </LogoContainer>
                    <StartContainer theme={theme}>
                        <Title theme={theme} style={{ fontSize: 35 }}>Start</Title>
                        <Item onClick={this.onModalClick_(Modal.CREATENEWFILE)} theme={theme}><ItemIcon style={{ paddingRight: '8%' }} icon={faFileCirclePlus}></ItemIcon>{LocalizedString.lookup(tr('New File...'), locale)}</Item>
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
                    />
                )}
                {modal.type === Modal.Type.CreateNewFile && (
                    <NewFileDialog
                        theme={theme}
                        onClose={this.onModalClose_}
                        fileName={''}
                        showRepeatUserDialog={false}
                        editorTarget={undefined}
                        messages={[]}
                        language={language}
                        onIndentCode={function (): void {
                            throw new Error('Function not implemented.');
                        }} onDownloadCode={function (): void {
                            throw new Error('Function not implemented.');
                        }} onResetCode={function (): void {
                            throw new Error('Function not implemented.');
                        }}
                        onClearConsole={onClearConsole}
                        editorConsole={undefined}
                        onEditorPageOpen={this.props.onEditorPageOpen}
                        onChangeProjectName={this.props.onChangeProjectName}
                    />
                )}


            </>

        );
    }
}