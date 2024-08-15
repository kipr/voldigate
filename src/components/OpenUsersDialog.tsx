import * as React from 'react';
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
import { DatabaseService } from './DatabaseService';
import ComboBox from './ComboBox';
import { Switch } from './Switch';
import { Settings } from '../Settings';
type SettingsSection = 'user-interface' | 'simulation' | 'editor' | string;


export interface OpenUsersDialogPublicProps extends ThemeProps, StyleProps {
  onClose: () => void;
  settings: Settings;
  onSettingsChange: (settings: Partial<Settings>) => void;
}

interface OpenUsersDialogPrivateProps {
  locale: LocalizedString.Language;
  onLocaleChange: (locale: LocalizedString.Language) => void;
}

interface OpenUsersDialogState {
  selectedSection: SettingsSection;
  users: string[];
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

const LogoContainer = styled('div', {
  flex: '1 1'
});

const Container = styled('div', (props: ThemeProps) => ({
  display: 'flex',
  flexDirection: 'row',
  color: props.theme.color,
  minHeight: '300px',
}));

const Bold = styled('span', {
  fontWeight: 400
});

const Link = styled('a', (props: ThemeProps) => ({
  color: props.theme.color,
}));

const LogoRow = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  marginBottom: '10px',
  alignItems: 'center',
});

const CopyrightContainer = styled('div', {
  flex: '1 1'
});
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
const SettingInfoText = styled('span', {
  userSelect: 'none',
});
const SettingInfoSubtext = styled(SettingInfoText, {
  fontSize: '10pt',
});
interface SectionProps {
  selected?: boolean;
}
const LOCALE_OPTIONS: ComboBox.Option[] = (() => {
  const ret: ComboBox.Option[] = [];
  for (const locale of [LocalizedString.EN_US]) {
    ret.push(ComboBox.option(LocalizedString.NATIVE_LOCALE_NAMES[locale], locale));
  }
  return ret;
})();

const CenteredContainer = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center', // Ensures that text within the Bold component is centered
  width: '100%', // Ensures the container takes up the full width of its parent
  height: '100%', // Ensures the container takes up the full height of its parent (if required)
});
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
const StyledComboBox = styled(ComboBox, {
  flex: '1 1',
});

class OpenUsersDialog extends React.PureComponent<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      selectedSection: 'user-interface',
      users: [],
    };
  }
  private setSelectedSection = (selectedSection: SettingsSection) => {
    this.setState({ selectedSection });
  };
  private onLocaleSelect_ = (index: number, option: ComboBox.Option) => {
    this.props.onLocaleChange(option.data as LocalizedString.Language);
  };
  private createBooleanSetting = (text: string, subtext: string, getValue: (settings: Settings) => boolean, getUpdatedSettings: (newValue: boolean) => Partial<Settings>) => {
    const { theme, settings: currentSettings, onSettingsChange } = this.props;

    return (
      <SettingContainer theme={theme}>
        <SettingInfoContainer>
          <SettingInfoText>{text}</SettingInfoText>
          <SettingInfoSubtext>{subtext}</SettingInfoSubtext>
        </SettingInfoContainer>
        <Switch theme={theme} value={getValue(currentSettings)} onValueChange={(value) => {
          onSettingsChange(getUpdatedSettings(value));
        }} />
      </SettingContainer>
    );
  };
  // private createUserSection = async () => {
  //   const { theme, settings: currentSettings, locale } = this.props;
  //   const{selectedSection} = this.state;
  //   const retrievedUserList = DatabaseService.getAllUsers();


  //   for(const user of await retrievedUserList){
  //     return (
  //       <SectionName
  //         theme={theme}
  //         selected={selectedSection === user}
  //         onClick={() => this.setSelectedSection(user)}
  //       >
  //         {LocalizedString.lookup(tr(user), locale)}
  //       </SectionName>
  //     );
  //   }

  // };

  private createUserSection = async () => {
    const { theme, locale } = this.props;
    const { selectedSection } = this.state;

    // Retrieve the list of users
    const retrievedUserList = await DatabaseService.getAllUsers();

    // Map the user list to an array of JSX elements
    return retrievedUserList.map((user) => (
      <SectionName
        key={user} // Add a unique key for each item in the list
        theme={theme}
        selected={selectedSection === user}
        onClick={() => this.setSelectedSection(user)}
      >
        {LocalizedString.lookup(tr(user), locale)}
      </SectionName>
    ));
  };

  componentDidMount() {
    this.loadUsers();
  }

  private async loadUsers() {
    const users = await DatabaseService.getAllUsers();
    this.setState({ users }); // Store users in state
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
            {selectedSection === 'user-interface' && (
              <>
                <SettingContainer theme={theme}>
                  <SettingInfoContainer>
                    <SettingInfoText>{LocalizedString.lookup(tr('Locale'), locale)}</SettingInfoText>
                    <SettingInfoSubtext>{LocalizedString.lookup(tr('Switch languages'), locale)}</SettingInfoSubtext>
                  </SettingInfoContainer>
                  <StyledComboBox
                    options={LOCALE_OPTIONS}
                    index={LOCALE_OPTIONS.findIndex(opt => opt.data === locale)}
                    onSelect={this.onLocaleSelect_}
                    theme={theme}
                  />
                </SettingContainer>
              </>
            )}
            {selectedSection === 'simulation' && (
              <>
                {this.createBooleanSetting(
                  LocalizedString.lookup(tr('Sensor noise'), locale),
                  LocalizedString.lookup(tr('Controls whether sensor outputs are affected by random noise'), locale),
                  (settings: Settings) => settings.simulationSensorNoise,
                  (newValue: boolean) => ({ simulationSensorNoise: newValue })
                )}
                {this.createBooleanSetting(
                  LocalizedString.lookup(tr('Realistic sensors'), locale),
                  LocalizedString.lookup(tr('Controls whether sensors behave like real-world sensors instead of like ideal sensors. For example, real-world ET sensors are nonlinear'), locale),
                  (settings: Settings) => settings.simulationRealisticSensors,
                  (newValue: boolean) => ({ simulationRealisticSensors: newValue })
                )}
              </>
            )}
            {selectedSection === 'editor' && (
              <>
                {this.createBooleanSetting(
                  LocalizedString.lookup(tr('Autocomplete'), locale),
                  LocalizedString.lookup(tr('Controls autocompletion of code, brackets, and quotes'), locale),
                  (settings: Settings) => settings.editorAutoComplete,
                  (newValue: boolean) => ({ editorAutoComplete: newValue })
                )}
              </>
            )}
          </SettingsColumn>
        </Container>
      </Dialog>
    );
  }
}

export default connect((state: ReduxState) => ({
  locale: state.i18n.locale,
}))(OpenUsersDialog) as React.ComponentType<OpenUsersDialogPublicProps>;