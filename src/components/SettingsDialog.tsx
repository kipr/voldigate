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
  consoleLayout: 'horizontal' | 'vertical';
  classroomView: boolean;
  userOptions: ComboBox.Option[];
  selectedUser?: User;
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
    ret.push(ComboBox.option(mode, mode));
  }
  return ret;
})();

class SettingsDialog extends React.PureComponent<Props, State> {
  private newInterfaceModeRef: React.MutableRefObject<InterfaceMode | undefined> = { current: undefined };

  constructor(props: Props) {
    super(props);
    const initialUser = Object.keys(this.props.users).length > 0 ? Object.values(this.props.users)[0] : BLANK_USER;

    console.log("SettingsDialog constructor props:", props);
    this.state = {
      selectedSection: 'user-interface',
      storedTheme: localStorage.getItem('ideEditorDarkMode') === 'true' ? DARK : LIGHT,
      interfaceMode: initialUser.interfaceMode,
      userOptions: this.USER_OPTIONS,
      selectedUser: Object.values(this.props.users)[0],
      confirmMessage: '',
      currentStateUser: initialUser,
      successMessage: '',
      consoleLayout: localStorage.getItem('consoleLayout') as 'horizontal' | 'vertical' || 'horizontal',
      classroomView: localStorage.getItem('classroomView') === 'true',
    };
  }

  componentDidMount(): void {
    console.log("SettingsDialog mounted state:", this.state);

    const storedTheme = localStorage.getItem('ideEditorDarkMode');
    const consoleLayout = localStorage.getItem('consoleLayout');
    const classroomView = localStorage.getItem('classroomView');
    console.log("Console Layout from localStorage:", consoleLayout);
    if (consoleLayout) {
      this.props.onSettingsChange({ consoleLayout: consoleLayout as 'horizontal' | 'vertical' });
    }
    if (storedTheme) {
      this.props.onSettingsChange({ ideEditorDarkMode: storedTheme === 'true' });
    }
    if (classroomView) {
      this.props.onSettingsChange({ classroomView: classroomView === 'true' });
    }
    const usersArray = Object.values(this.props.users);
    console.log("SettingsDialog componentDidMount usersArray:", usersArray);
    console.log("SettingsDialog componentDidMount userOptions:", usersArray.map(user => ({
      data: user.userName,
      text: user.userName, // or any other field you need for ComboBox
    })));
    this.setState({

      userOptions: usersArray.map(user => ({
        data: user.userName,
        text: user.userName, // or any other field you need for ComboBox
      })),
      consoleLayout: consoleLayout as 'horizontal' | 'vertical',

    });

  }

  componentDidUpdate = async (prevProps: Props, prevState: State) => {

    console.log("SettingsDialog updated state:", this.state);
    console.log("SettingsDialog updated props:", this.props);

    if (prevProps.settings.ideEditorDarkMode !== this.props.settings.ideEditorDarkMode) {
      if (this.props.settings.ideEditorDarkMode) {
        this.setState({ storedTheme: DARK });
      }
      else {
        this.setState({ storedTheme: LIGHT });
      }
    }
    if (prevProps.settings.consoleLayout !== this.props.settings.consoleLayout) {
      this.setState({
        consoleLayout: this.props.settings.consoleLayout
      });
    }
    if (prevProps.settings.classroomView !== this.props.settings.classroomView) {
      this.setState({
        classroomView: this.props.settings.classroomView
      });
    }

    if (prevProps.users !== this.props.users) {
      this.updateUserOptions();
    }

    if (this.state.userOptions !== prevState.userOptions && this.state.userOptions.length > 0) {
      if (!this.state.selectedUser) {
        // Default to the first user if no user is selected
        this.setState({
          selectedUser: this.state.userOptions[0].data as User
        });
      }
    }

    const userIndex = this.state.userOptions.findIndex(option => option.data === this.state.selectedUser);
    const currentUser = this.props.users[userIndex] || null;

    if (currentUser && currentUser.interfaceMode !== this.state.interfaceMode) {
      this.setState({
        interfaceMode: currentUser.interfaceMode
      });
    }

  };

  updateUserOptions = () => {
    console.log("SettingsDialog updateUserOptions props.users:", this.props.users);
    const userOptions: ComboBox.Option[] = Object.values(this.props.users).map(user => {
      const userName = LocalizedString.lookup(tr(`${user.userName}`), this.props.locale);
      const option = {
        data: user.userName,
        text: userName || `Invalid user ${user.userName}`,
      };
      return option;
    }).filter(option => option.text);

    this.setState({ userOptions });
  };


  private setSelectedSection = (selectedSection: SettingsSection) => {
    this.setState({ selectedSection });
  };

  USER_OPTIONS: ComboBox.Option[] = (() => {
    const ret: ComboBox.Option[] = [];
    console.log("SettingsDialog USER_OPTIONS props.users:", this.props.users);
    const usersArray = Object.values(this.props.users);
    for (const user of usersArray) {
      const userName = LocalizedString.lookup(tr(`${user.userName}`), this.props.locale);
      if (userName) {
        ret.push({
          data: user,
          text: userName
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
            if (updatedSettings.hasOwnProperty('consoleLayout')) {
              localStorage.setItem('consoleLayout', updatedSettings.consoleLayout);
            }
            if (updatedSettings.hasOwnProperty('classroomView')) {
              localStorage.setItem('classroomView', updatedSettings.classroomView ? 'true' : 'false');
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

    if (this.state.confirmMessage) {
      this.setState({
        confirmMessage: ''
      });
    }
    if (selectedUser) {
      this.setState({
        currentStateUser: selectedUser,
        interfaceMode: selectedUser.interfaceMode,
        selectedUser: selectedUser
      });
    }
  };

  private onModeSelect_ = (index: number, option: ComboBox.Option) => {
    this.newInterfaceModeRef.current = option.data as InterfaceMode.SIMPLE | InterfaceMode.ADVANCED;
    if (this.state.successMessage) {
      this.setState({
        successMessage: ''
      });
    }
    if (this.state.currentStateUser.interfaceMode !== option.data) {
      this.setState({
        confirmMessage: (
          <span style={{ marginRight: '5px' }}>
            Are you sure you want to change to: <strong>{option.data as React.ReactNode}</strong>?
          </span>
        ),
        interfaceMode: option.data as InterfaceMode.SIMPLE | InterfaceMode.ADVANCED
      });
    }

  };

  private onConfirmClick_ = async () => {
    const changeInterfaceResponse = await axios.post('/change-interface-mode', {
      user: this.state.selectedUser, newMode: this.newInterfaceModeRef.current
    });

    if (changeInterfaceResponse.request.status === 200) {
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
    const { selectedSection, storedTheme, userOptions, selectedUser, successMessage, currentStateUser, interfaceMode, confirmMessage } = state;

    const userIndex = userOptions.findIndex(option => option.text === selectedUser.userName);
    console.log("SettingsDialog render userIndex:", userIndex);
    console.log("SettingsDialog render state:", state);

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
                {this.createBooleanSetting(
                  LocalizedString.lookup(tr('Classroom View'), locale),
                  LocalizedString.lookup(tr('Toggle to arrange users into classrooms'), locale),
                  (settings: Settings) => settings.classroomView,
                  (newValue: boolean) => ({ classroomView: newValue })
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
                {this.createBooleanSetting(
                  LocalizedString.lookup(tr('Console Layout'), locale),
                  LocalizedString.lookup(tr('Toggle for vertical console view'), locale),
                  (settings: Settings) => settings.consoleLayout === "vertical",
                  (isVertical: boolean) => ({
                    consoleLayout: isVertical ? 'vertical' : 'horizontal',
                  })
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