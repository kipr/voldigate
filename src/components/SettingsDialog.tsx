import * as React from 'react';
import ScrollArea from './ScrollArea';
import tr from '@i18n';
import LocalizedString from '../util/LocalizedString';
import ComboBox from './ComboBox';
import axios from 'axios';
import { styled } from 'styletron-react';
import { Settings } from '../Settings';
import { StyleProps } from '../style';
import { Dialog } from './Dialog';
import { Switch } from './Switch';
import { ThemeProps, Theme, DARK, LIGHT } from './theme';
import { State as ReduxState } from '../state';
import { I18nAction } from '../state/reducer';
import { connect } from 'react-redux';
import { BLANK_USER, User } from '../types/userTypes';
import { InterfaceMode } from '../types/interfaceModes';
import { Interface } from 'node:readline';
type SettingsSection = 'user-interface' | 'simulation' | 'editor';

export interface SettingsDialogPublicProps extends ThemeProps, StyleProps {
  settings: Settings;
  onClose: () => void;
  onSettingsChange: (settings: Partial<Settings>) => void;
  reloadUser: () => void;
  users?: User[];
}

interface SettingsDialogPrivateProps {
  locale: LocalizedString.Language;
  onLocaleChange: (locale: LocalizedString.Language) => void;
}

interface SettingsDialogState {
  selectedSection: SettingsSection;
  storedTheme: Theme;
  interfaceMode: InterfaceMode.SIMPLE | InterfaceMode.ADVANCED;

  userOptions: ComboBox.Option[];
  selectedUserName?: string;
  confirmMessage: React.ReactNode;
  successMessage: React.ReactNode;

  currentStateUser: User;
}
interface ClickProps {
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  disabled?: boolean;
}
type Props = SettingsDialogPublicProps & SettingsDialogPrivateProps;
type State = SettingsDialogState;

const Container = styled('div', (props: ThemeProps) => ({
  display: 'flex',
  flexDirection: 'row',
  backgroundColor: props.theme.backgroundColor,
  color: props.theme.color,
  minHeight: '350px',
}));

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

const SettingGridContainer = styled('div', {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gridTemplateRows: 'auto auto',
  justifyItems: 'center',
  gap: '5px',
  marginTop: '10px'
});

const SettingGridItemText = styled('div', {
  fontSize: '12pt',
  textDecoration: 'underline',
  paddingBottom: '3px'
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

const ConfirmChangeMessageContainer = styled('div', (props: ThemeProps) => ({
  display: 'flex',
  flexDirection: 'row',
  //backgroundColor: props.theme.confirmMessageBackground,
  color: 'white',
  height: '40px',
  alignItems: 'center',

}));

const StyledComboBox = styled(ComboBox, {
  flex: '1 1',
});

const Button = styled('button', {
  margin: '0 10px',
  padding: '10px 20px',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
});

const InterfaceChangeButton = styled(Button, (props: ThemeProps & ClickProps) => ({
  backgroundColor: props.theme.yesButtonColor.standard,
  border: `1px solid ${props.theme.yesButtonColor.border}`,
  ':hover':
    props.onClick && !props.disabled
      ? {
        backgroundColor: props.theme.yesButtonColor.hover,
      }
      : {},
  color: props.theme.yesButtonColor.textColor,
  textShadow: props.theme.yesButtonColor.textShadow,
  boxShadow: '2px 2px 4px rgba(0,0,0,0.9)',
  ':active': props.onClick && !props.disabled
    ? {
      boxShadow: '1px 1px 2px rgba(0,0,0,0.7)',
      transform: 'translateY(1px, 1px)',
    }
    : {},
}));

const InterfaceChangeMessageContainer = styled('div', (props: ThemeProps & { type: string }) => ({
  display: 'flex',
  flexDirection: 'column',
  flex: '1 0',
  backgroundColor: props.type === 'confirm' ? props.theme.confirmMessageBackground : props.theme.successMessageBackground,
  marginTop: '10px',
  padding: '4px',
  justifyContent: 'center',
  alignItems: 'center',

}));


const LOCALE_OPTIONS: ComboBox.Option[] = (() => {
  const ret: ComboBox.Option[] = [];
  for (const locale of [LocalizedString.EN_US]) {
    ret.push(ComboBox.option(LocalizedString.NATIVE_LOCALE_NAMES[locale], locale));
  }
  return ret;
})();

const INTERFACEMODE_OPTIONS: ComboBox.Option[] = (() => {

  const ret: ComboBox.Option[] = [];
  for (const mode of Object.values(InterfaceMode)) {
    console.log("Mode: ", mode);
    ret.push(ComboBox.option(mode, mode));
  }
  return ret;
})();

class SettingsDialog extends React.PureComponent<Props, State> {
  private newInterfaceModeRef: React.MutableRefObject<InterfaceMode | undefined> = { current: undefined };

  constructor(props: Props) {
    super(props);
    const initialUser = this.props.users.length > 0 ? this.props.users[0] : BLANK_USER;
    console.log("this.props.users: ", this.props.users);
    console.log("Initial user: ", initialUser);
    this.state = {
      selectedSection: 'user-interface',
      storedTheme: localStorage.getItem('ideEditorDarkMode') === 'true' ? DARK : LIGHT,
      interfaceMode: initialUser.interfaceMode,
      userOptions: [],
      selectedUserName: this.props.users.length > 0 ? this.props.users[0].userName : initialUser.userName,
      confirmMessage: '',
      currentStateUser: initialUser,
      successMessage: ''

    };
  }

  componentDidMount(): void {
    const storedTheme = localStorage.getItem('ideEditorDarkMode');
    if (storedTheme) {
      this.props.onSettingsChange({ ideEditorDarkMode: storedTheme === 'true' });
    }
    console.log("SettingsDialog state: ", this.state);

    //this.updateUserOptions();
    this.setState({
      userOptions: this.props.users.map(user => ({
        data: user.userName,
        text: user.userName, // or any other field you need for ComboBox
      }))
    }, () => {
      console.log("SettingsDialog userOptions: ", this.state.userOptions);
    });

  }

  componentDidUpdate = async (prevProps: Props, prevState: State) => {

    console.log("SettingsDialog prevProps: ", prevProps);
    console.log("SettingsDialog props: ", this.props);
    if (prevProps.settings.ideEditorDarkMode !== this.props.settings.ideEditorDarkMode) {
      if (this.props.settings.ideEditorDarkMode) {
        this.setState({ storedTheme: DARK });
      }
      else {
        this.setState({ storedTheme: LIGHT });
      }
    }

    if (prevProps.users !== this.props.users) {
      this.updateUserOptions();
    }

    if (this.state.userOptions !== prevState.userOptions && this.state.userOptions.length > 0) {
      if (!this.state.selectedUserName) {
        // Default to the first user if no user is selected
        this.setState({
          selectedUserName: this.state.userOptions[0].data as string
        });
      }
    }

    const currentUser = this.props.users.find(user => user.userName === this.state.selectedUserName);
    if (currentUser && currentUser.interfaceMode !== this.state.interfaceMode) {
      this.setState({
        interfaceMode: currentUser.interfaceMode
      });
    }


  };

  updateUserOptions = () => {
    const userOptions: ComboBox.Option[] = this.props.users.map(user => {
      const userName = LocalizedString.lookup(tr(`${user.userName}`), this.props.locale);
      const option = {
        data: user.userName,
        text: userName || `Invalid user ${user.userName}`, // Use a default if userName is falsy
      };

      // Log the option for debugging
      console.log("Creating option:", option);

      return option;
    }).filter(option => option.text); // Filter out any options with invalid text

    console.log("User options created:", userOptions); // Debug the final options array

    this.setState({ userOptions }); // Set the state with userOptions
  };


  private setSelectedSection = (selectedSection: SettingsSection) => {
    this.setState({ selectedSection });
  };

  USER_OPTIONS: ComboBox.Option[] = (() => {
    const ret: ComboBox.Option[] = [];
    for (const user of this.props.users) {
      const userName = LocalizedString.lookup(tr(`${user.userName}`), this.props.locale);
      if (userName) {
        ret.push({
          data: user, // Ensure this is correct
          text: userName // This should correspond to the 'text' property expected by the ComboBox
        });
      } else {
        console.error(`User ${user.userName} has an invalid localized name.`);
      }
    }
    return ret;
  })();

  private createBooleanSetting = (text: string, subtext: string, getValue: (settings: Settings) => boolean, getUpdatedSettings: (newValue: boolean) => Partial<Settings>) => {
    const { theme, settings: currentSettings, onSettingsChange } = this.props;

    return (
      <SettingContainer theme={theme}>
        <SettingInfoContainer>
          <SettingInfoText>{text}</SettingInfoText>
          <SettingInfoSubtext>{subtext}</SettingInfoSubtext>
        </SettingInfoContainer>
        <Switch theme={theme}
          value={getValue(currentSettings)}
          onValueChange={(value) => {
            const updatedSettings = getUpdatedSettings(value);
            if (updatedSettings.hasOwnProperty('ideEditorDarkMode')) {
              localStorage.setItem('ideEditorDarkMode', updatedSettings.ideEditorDarkMode ? 'true' : 'false');
            }
            onSettingsChange(getUpdatedSettings(value));

          }} />
      </SettingContainer>
    );
  };

  private onLocaleSelect_ = (index: number, option: ComboBox.Option) => {
    this.props.onLocaleChange(option.data as LocalizedString.Language);
  };

  private onUserSelect_ = (index: number, option: ComboBox.Option) => {

    const selectedUser = option.data as User;

    console.log("Selected user:", selectedUser);
    console.log("userOptins: ", this.state.userOptions);

    if (this.state.confirmMessage) {
      this.setState({
        confirmMessage: ''
      });
    }
    if (selectedUser) {
      this.setState({
        currentStateUser: selectedUser,
        interfaceMode: selectedUser.interfaceMode,
        selectedUserName: selectedUser.userName
      });
    }
  };

  private onModeSelect_ = (index: number, option: ComboBox.Option) => {
    console.log("Mode selected: ", option.data);
    console.log("currentStateUser: ", this.state.currentStateUser);
    this.newInterfaceModeRef.current = option.data as InterfaceMode.SIMPLE | InterfaceMode.ADVANCED;
    if (this.state.successMessage) {
      this.setState({
        successMessage: ''
      });
    }
    if (this.state.currentStateUser.interfaceMode !== option.data) {
      console.log("Interface mode changed");
      this.setState({
        confirmMessage: (
          <span style={{ marginRight: '5px' }}>
            Are you sure you want to change to: <strong>{option.data}</strong>?
          </span>
        ),
        interfaceMode: option.data as InterfaceMode.SIMPLE | InterfaceMode.ADVANCED
      });
    }

  };

  private onConfirmClick_ = async () => {
    console.log("Confirming interface mode change");
    console.log("Current newInterfaceModeRef: ", this.newInterfaceModeRef.current);
    const changeInterfaceResponse = await axios.post('/change-interface-mode', {
      userName: this.state.selectedUserName, newMode: this.newInterfaceModeRef.current
    });

    console.log("changeInterfaceResponse: ", changeInterfaceResponse);

    if (changeInterfaceResponse.request.status === 200) {
      console.log("Interface mode changed successfully");
      this.props.reloadUser();
      this.setState({
        confirmMessage: '',
        successMessage: 'Interface mode changed successfully',
        currentStateUser: {
          ...this.state.currentStateUser,
          interfaceMode: this.newInterfaceModeRef.current
        }
      })
    }
  };

  render() {
    const { props, state } = this;
    const { style, className, theme, onClose, locale } = props;
    const { selectedSection, storedTheme, userOptions, selectedUserName, successMessage, currentStateUser, interfaceMode, confirmMessage } = state;
    console.log("SettingsDialog render userOptions: ", userOptions);
    console.log("SettingsDialog render selectedUserName: ", selectedUserName);
    console.log("SettingsDialog render interfaceMode: ", interfaceMode);
    console.log("SettingsDialog render INTERFACEMODE_OPTIONS: ", INTERFACEMODE_OPTIONS);

    console.log("SettingsDialog render currentStateUser: ", currentStateUser);

    const userIndex = userOptions.findIndex(option => option.data === selectedUserName);

    return (
      <Dialog
        theme={storedTheme}
        name={LocalizedString.lookup(tr('Settings'), locale)}
        onClose={onClose}
      >
        <Container theme={storedTheme} style={style} className={className}>
          <SectionsColumn theme={storedTheme}>
            <SectionName
              theme={storedTheme}
              selected={selectedSection === 'user-interface'}
              onClick={() => this.setSelectedSection('user-interface')}
            >
              {LocalizedString.lookup(tr('User Interface'), locale)}
            </SectionName>

            <SectionName
              theme={storedTheme}
              selected={selectedSection === 'editor'}
              onClick={() => this.setSelectedSection('editor')}
            >
              {LocalizedString.lookup(tr('Editor'), locale)}
            </SectionName>
          </SectionsColumn>
          <SettingsColumn theme={storedTheme}>
            {selectedSection === 'user-interface' && (
              <>
                <SettingContainer theme={storedTheme}>
                  <SettingInfoContainer>
                    <SettingInfoText>{LocalizedString.lookup(tr('Locale'), locale)}</SettingInfoText>
                    <SettingInfoSubtext>{LocalizedString.lookup(tr('Switch languages'), locale)}</SettingInfoSubtext>
                  </SettingInfoContainer>
                  <StyledComboBox
                    options={LOCALE_OPTIONS}
                    index={LOCALE_OPTIONS.findIndex(opt => opt.data === locale)}
                    onSelect={this.onLocaleSelect_}
                    theme={storedTheme}
                  />
                </SettingContainer>
                {this.createBooleanSetting(
                  LocalizedString.lookup(tr('KISS IDE Theme'), locale),
                  LocalizedString.lookup(tr('Toggle IDE theme to dark mode'), locale),
                  (settings: Settings) => settings.ideEditorDarkMode,
                  (newValue: boolean) => ({ ideEditorDarkMode: newValue })
                )}
                {userOptions.length > 0 && (
                  <SettingContainer theme={storedTheme} style={{ flexDirection: 'column' }}>
                    <SettingInfoContainer>
                      <SettingInfoText>{LocalizedString.lookup(tr('User Interface Mode'), locale)}</SettingInfoText>
                      <SettingInfoSubtext>{LocalizedString.lookup(tr(`Change specific user's interface mode between Simple and Advanced`), locale)}</SettingInfoSubtext>
                    </SettingInfoContainer>
                    <SettingGridContainer>
                      <SettingGridItemText>{LocalizedString.lookup(tr('User'), locale)}</SettingGridItemText>
                      <SettingGridItemText>{LocalizedString.lookup(tr('Mode'), locale)}</SettingGridItemText>

                      <StyledComboBox
                        options={this.USER_OPTIONS}
                        index={userIndex}
                        onSelect={this.onUserSelect_}
                        theme={storedTheme}
                      />
                      <StyledComboBox
                        options={INTERFACEMODE_OPTIONS}
                        index={INTERFACEMODE_OPTIONS.findIndex(opt => opt.data === interfaceMode)}
                        onSelect={this.onModeSelect_}
                        theme={storedTheme}
                      />
                    </SettingGridContainer>
                    {confirmMessage && (
                      <InterfaceChangeMessageContainer theme={theme} type={'confirm'}>
                        Interface Mode Changed
                        <ConfirmChangeMessageContainer theme={storedTheme}>

                          {confirmMessage}
                          <InterfaceChangeButton
                            theme={theme}
                            onClick={this.onConfirmClick_}
                          >
                            Confirm
                          </InterfaceChangeButton>
                        </ConfirmChangeMessageContainer>

                      </InterfaceChangeMessageContainer>
                    )}
                    {successMessage && (
                      <InterfaceChangeMessageContainer theme={theme} type={'success'}>
                        {successMessage}
                      </InterfaceChangeMessageContainer>
                    )}
                  </SettingContainer>)}
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
  locale: state.i18n.locale
}), dispatch => ({
  onLocaleChange: (locale: LocalizedString.Language) => dispatch(I18nAction.setLocale({ locale })),
}))(SettingsDialog) as React.ComponentType<SettingsDialogPublicProps>;