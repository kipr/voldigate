
import { ThemeProps, LIGHTMODE_YES } from './theme';
import { StyleProps } from '../style';
import axios from 'axios';
import tr from '@i18n';
import LocalizedString from '../util/LocalizedString';
import * as React from 'react';
import ComboBox from './ComboBox';
import { styled } from 'styletron-react';
import ScrollArea from './ScrollArea';
import { Dialog } from './Dialog';
import { State as ReduxState } from '../state';
import { I18nAction } from '../state/reducer';
import { connect } from 'react-redux';
import Form from './Form';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { push } from 'connected-react-router';

import { Fa } from './Fa';
import RepeatUserDialog from './RepeatUserDialog';



export interface CreateUserDialogPublicProps extends ThemeProps, StyleProps {
    onClose: () => void;
    showRepeatUserDialog: boolean;
    userName: string;
    onCreateProjectDialog: (userName: string) => void;

}

interface CreateUserDialogPrivateProps {
    locale: LocalizedString.Language;
    onLocaleChange: (locale: LocalizedString.Language) => void;
    onUserCreation: (userName: string) => void;
}

interface CreateUserDialogState {
    userName: string;
    modal: Modal;
    showRepeatUserDialog: boolean;
    errorMessage: string;
}



type Props = CreateUserDialogPublicProps & CreateUserDialogPrivateProps;
type State = CreateUserDialogState;


namespace Modal {
    export enum Type {
        Settings,
        CreateUser,
        RepeatUser,
        None,
        OpenUser
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
}

export type Modal = (
    Modal.Settings |
    Modal.CreateUser |
    Modal.None |
    Modal.RepeatUser
);



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


const ErrorMessageContainer = styled('div', (props: ThemeProps) => ({
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: 'red',
    color: 'white',
    height: '40px',
    alignItems: 'center',
    marginTop: '10px',

}));

const ItemIcon = styled(Fa, {
    paddingLeft: '10px',
    paddingRight: '10px',
    alignItems: 'center',
    height: '30px'
});

export class CreateUserDialog extends React.PureComponent<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            modal: Modal.NONE,
            userName: '',
            showRepeatUserDialog: false,
            errorMessage: ''
        }
    }
    private onModalClick_ = (modal: Modal) => () => this.setState({ modal });
    private onModalClose_ = () => this.setState({ modal: Modal.NONE });
    private closeRepeatUserDialog_ = () => {
        // 
        // 
        //  this.setState({modal:Modal.NONE});
        this.setState({ showRepeatUserDialog: false });
    };
    private onLocaleSelect_ = (index: number, option: ComboBox.Option) => {
        this.props.onLocaleChange(option.data as LocalizedString.Language);
    };


    onFinalize_ = async (values: { [id: string]: string }) => {

        const userName = values.userName;


        const specialCharRegex = /[^a-zA-Z0-9 _-]/;
        const isOnlySpaces = !userName.trim(); // Check if the name is empty or only spaces


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
            console.log("Response: ", response);

            if (response.data.directories.includes(values.userName)) {
                this.setState({ showRepeatUserDialog: true });
            }
            else {
                this.props.onClose();
                this.props.onCreateProjectDialog(values.userName);
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

        const FORMS = [CREATEUSER_FORM_ITEMS];
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


