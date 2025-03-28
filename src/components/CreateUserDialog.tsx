import * as React from 'react';
import axios from 'axios';
import tr from '@i18n';
import LocalizedString from '../util/LocalizedString';
import Form from './Form';
import RepeatUserDialog from './RepeatUserDialog';
import { ThemeProps } from './theme';
import { StyleProps } from '../style';
import { styled } from 'styletron-react';
import { Dialog } from './Dialog';
import { State as ReduxState } from '../state';
import { I18nAction } from '../state/reducer';
import { connect } from 'react-redux';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { push } from 'connected-react-router';
import { Fa } from './Fa';
import { User } from '../types/userTypes';
import ComboBox from './ComboBox';
import { InterfaceMode } from '../types/interfaceModes';

export interface CreateUserDialogPublicProps extends ThemeProps, StyleProps {
    showRepeatUserDialog: boolean;
    userName: string;
    onClose: () => void;
    onCreateProjectDialog: (userName: string, interfaceMode: InterfaceMode) => void;
}

interface CreateUserDialogPrivateProps {
    locale: LocalizedString.Language;
    onLocaleChange: (locale: LocalizedString.Language) => void;
    onUserCreation: (userName: string) => void;
}

interface CreateUserDialogState {
    userName: string;
    errorMessage: string;
    showRepeatUserDialog: boolean;
    interfaceMode: InterfaceMode;
}

type Props = CreateUserDialogPublicProps & CreateUserDialogPrivateProps;
type State = CreateUserDialogState;

const Container = styled('div', (props: ThemeProps) => ({
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: props.theme.backgroundColor,
    color: props.theme.color,
    minHeight: '200px',
}));

const StyledForm = styled(Form, (props: ThemeProps) => ({
    paddingLeft: `${props.theme.itemPadding * 2}px`,
    paddingRight: `${props.theme.itemPadding * 2}px`,
}));

const ComboBoxContainer = styled('div', (props: ThemeProps) => ({
    display: 'flex',
    flexDirection: 'row',
    color: props.theme.color,
    spacing: '10px',
    minHeight: '30px',
    marginLeft: '8px',
    marginRight: '8px',
    marginBottom: '4px',
    marginTop: '4px',
}));
const ErrorMessageContainer = styled('div', (props: ThemeProps) => ({
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: 'red',
    color: 'white',
    height: '40px',
    alignItems: 'center',
    marginTop: '10px',
}));
const StyledComboBox = styled(ComboBox, {
    flex: '1 0',
});

const ItemIcon = styled(Fa, {
    paddingLeft: '10px',
    paddingRight: '10px',
    alignItems: 'center',
    height: '30px'
});
const ComboBoxLabel = styled('label', (theme: ThemeProps) => ({
    display: 'block',
    color: theme.theme.color,
    fontSize: '1.1em',
    fontWeight: 'normal',
    marginTop: `${theme.theme.itemPadding * 2}px`,
    marginBottom: `${theme.theme.itemPadding}px`,
    marginRight: `${theme.theme.itemPadding}px`,
    userSelect: 'none'
}));
const INTERFACE_OPTIONS: ComboBox.Option[] = [{
    text: 'Simple',
    data: 'Simple'
}, {
    text: 'Advanced',
    data: 'Advanced'

}];
export class CreateUserDialog extends React.PureComponent<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            userName: '',
            showRepeatUserDialog: false,
            errorMessage: '',
            interfaceMode: InterfaceMode.SIMPLE
        }
    }

    private closeRepeatUserDialog_ = () => {

        this.setState({ showRepeatUserDialog: false });
    };
    private onInterfaceChange = (interfaceMode: InterfaceMode) => {
        this.setState({
            interfaceMode: interfaceMode
        }, () => {
            console.log("Interface Mode: ", this.state.interfaceMode);
        });
    };
    private onSelectInterface_ = (interfaceIndex: number, option: ComboBox.Option) => {
        this.onInterfaceChange(option.data as InterfaceMode);
    };
    onFinalize_ = async (values: { [id: string]: string }) => {

        const userName = values.userName;

        const specialCharRegex = /[^a-zA-Z0-9 _-]/;
        const isOnlySpaces = !userName.trim(); // Check if the name is empty or only spaces

        // Check if user name exceeds 50 characters
        if (userName.length > 50) {
            this.setState({ errorMessage: 'User name cannot exceed 50 characters.' });
            return;
        }
        if (specialCharRegex.test(userName)) {
            this.setState({ errorMessage: 'User name contains special characters. Please use only letters, numbers, spaces, underscores, and hyphens.' });
            return;
        }
        if (isOnlySpaces) {
            this.setState({ errorMessage: "User name cannot be empty or just spaces!" });
            return;
        }
        this.setState({ errorMessage: "" }); // Clear error message if input is valid

        try {

            const response = await axios.get('/get-users', { params: { filePath: "/home/kipr/Documents/KISS" } });

            if (response.data.directories.includes(values.userName)) {
                this.setState({ showRepeatUserDialog: true });
            }
            else {
                this.props.onClose();
                this.props.onCreateProjectDialog(values.userName as User['userName'], this.state.interfaceMode);
            }
        }
        catch (error) {
            console.error('Error adding user to database:', error);
        }
    };

    public myComponent(props: CreateUserDialogPublicProps) {
        return (props.userName)
    }

    render() {
        const { props, state } = this;
        const { style, className, theme, onClose, locale } = props;
        const { errorMessage } = state;

        const { showRepeatUserDialog } = state;
        const CREATEUSER_FORM_ITEMS: Form.Item[] = [
            Form.username('userName', 'User Name')
        ];
        const interfaceIndex = INTERFACE_OPTIONS.findIndex(option => option.data === this.state.interfaceMode);

        return (
            <div>
                {!showRepeatUserDialog && (
                    <Dialog
                        theme={theme}
                        name={LocalizedString.lookup(tr('Create New User'), locale)}
                        onClose={onClose}
                    >
                        <Container theme={theme} style={style} className={className}>
                            {/* Show error message if it exists */}
                            {errorMessage && (
                                <ErrorMessageContainer theme={theme}>
                                    <ItemIcon icon={faExclamationTriangle} />
                                    <div style={{ fontWeight: 450 }}>
                                        {state.errorMessage}
                                    </div>

                                </ErrorMessageContainer>
                            )}
                            <ComboBoxContainer theme={theme} style={style} className={className}>
                                <ComboBoxLabel theme={theme}>Interface Mode:</ComboBoxLabel>
                                <StyledComboBox
                                    theme={theme}
                                    onSelect={this.onSelectInterface_}
                                    options={INTERFACE_OPTIONS}
                                    index={interfaceIndex}
                                />
                            </ComboBoxContainer>
                            <StyledForm
                                theme={theme}
                                onFinalize={this.onFinalize_}
                                items={CREATEUSER_FORM_ITEMS}
                                finalizeText="Create"
                                finalizeDisabled={false}
                            />
                        </Container>

                    </Dialog>)}
                {showRepeatUserDialog && (
                    <RepeatUserDialog
                        onClose={this.closeRepeatUserDialog_}
                        theme={theme}
                    />
                )}
            </div>

        );
    }
}

export default connect((state: ReduxState) => ({
    locale: state.i18n.locale
}), dispatch => ({
    onLocaleChange: (locale: LocalizedString.Language) => dispatch(I18nAction.setLocale({ locale })),
    onUserCreation: (userName: string) => {
        dispatch(push(`/scene/${userName}`));
    }
}))(CreateUserDialog) as React.ComponentType<CreateUserDialogPublicProps>;


