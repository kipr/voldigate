import * as React from 'react';

import { styled } from 'styletron-react';
import { StyleProps } from '../style';
import { Spacer } from './common';
import { Fa } from './Fa';
import { DARK, ThemeProps } from './theme';
import CreateUserDialog from './CreateUserDialog';
import { faBookReader, faCirclePlus, faCog, faFileCirclePlus, faFilePen, faFolderTree, faSignOutAlt, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { Space } from '../Sim';
import tr from '@i18n';

import { connect } from 'react-redux';

import { State as ReduxState } from '../state';


import { signOutOfApp } from '../firebase/modules/auth';
import LocalizedString from '../util/LocalizedString';
import { DEFAULT_SETTINGS, Settings } from '../Settings';
import { DEFAULT_CREATEUSER, CreateUser } from '../CreateUser';
import SettingsDialog from './SettingsDialog';

namespace Modal {
    export enum Type {
        Settings,
        CreateUser,
        None
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
}

export type Modal = (
    Modal.Settings |
    Modal.CreateUser |
    Modal.None
);






export interface HomeStartOptionsPublicProps extends StyleProps, ThemeProps { }

interface HomeStartOptionsPrivateProps {
    locale: LocalizedString.Language;
}

interface HomeStartOptionsState {
    modal: Modal;

    settings: Settings;

    createUser: CreateUser;

}

type Props = HomeStartOptionsPublicProps & HomeStartOptionsPrivateProps;
type State = HomeStartOptionsState;

const Container = styled('div', (props: ThemeProps) => ({
    backgroundColor: 'green',
    color: props.theme.color,
    width: '50%',
    height: '100%',
    top: '10px',
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
    transition: 'background-color 0.2s, opacity 0.2s'
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



export class HomeStartOptions extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            modal: Modal.NONE,
            settings: DEFAULT_SETTINGS,
            createUser: DEFAULT_CREATEUSER,


        }
    }


    private onSettingsChange_ = (changedSettings: Partial<Settings>) => {
        const nextSettings: Settings = {
          ...this.state.settings,
          ...changedSettings
        };
    
        if ('simulationRealisticSensors' in changedSettings) {
          Space.getInstance().realisticSensors = changedSettings.simulationRealisticSensors;
        }
        
        if ('simulationSensorNoise' in changedSettings) {
          Space.getInstance().noisySensors = changedSettings.simulationSensorNoise;
        }
    
        this.setState({ settings: nextSettings });
      };
    private onModalClick_ = (modal: Modal) => () => this.setState({ modal });
    private onModalClose_ = () => this.setState({ modal: Modal.NONE });
    render() {
        const { className, style, locale } = this.props;
        const theme = DARK;
        const {
            settings,
            createUser,
            modal
        } = this.state;

        return (
            <>
                <Container className={className} style={style} theme={theme}>
                    <StartContainer theme={theme}>
                        <Title theme={theme} style={{ fontSize: 35 }}>Start</Title>
                        <Item theme={theme}><ItemIcon style={{ paddingRight: '8%' }} icon={faFileCirclePlus}></ItemIcon>{LocalizedString.lookup(tr('New File...'), locale)}</Item>
                        <Item onClick={this.onModalClick_(Modal.CREATEUSER)} theme={theme}><ItemIcon icon={faUserPlus}></ItemIcon>{LocalizedString.lookup(tr('New User...'), locale)}</Item>
                        <Item theme={theme}><ItemIcon style={{ paddingRight: '7%' }} icon={faFilePen}></ItemIcon>{LocalizedString.lookup(tr('Open File...'), locale)}</Item>
                        <Item theme={theme}><ItemIcon style={{ paddingRight: '9%' }} icon={faBookReader}></ItemIcon>{LocalizedString.lookup(tr('Open User...'), locale)}</Item>


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
                        settings={settings}
                        onClose={this.onModalClose_}
                    />
                )}
            </>


        );
    }
}

export default connect((state: ReduxState) => ({
    locale: state.i18n.locale
}))(HomeStartOptions) as React.ComponentType<HomeStartOptionsPublicProps>;