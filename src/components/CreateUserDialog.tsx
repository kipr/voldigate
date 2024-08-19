
import { ThemeProps } from './theme';
import { StyleProps } from '../style';

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

import { push } from 'connected-react-router';


import { DatabaseService } from './DatabaseService';
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
}



type Props = CreateUserDialogPublicProps & CreateUserDialogPrivateProps;
type State = CreateUserDialogState;

const Container = styled('div', (props: ThemeProps) => ({
    display: 'flex',
    flexDirection: 'row',
    color: props.theme.color,
    minHeight: '200px',
}));
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

const StyledComboBox = styled(ComboBox, {
    flex: '1 1',
});

const StyledForm = styled(Form, (props: ThemeProps) => ({
    paddingLeft: `${props.theme.itemPadding * 2}px`,
    paddingRight: `${props.theme.itemPadding * 2}px`,
}));


const OverlayContainer = styled('div', {
    position: 'relative',
});

const OverlayDialog = styled('div', {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000, // Ensure this is above the CreateUserDialog
});

export class CreateUserDialog extends React.PureComponent<Props, State> {
    //state = {userName: ''};

    constructor(props: Props) {
        super(props);
        this.state = {
            modal: Modal.NONE,
            userName: '',
            showRepeatUserDialog: false
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

        console.log('Inside onFinalizeClick_ in CreateUserDialog.tsx with values:', values);

        try {
            const result = DatabaseService.addUsertoDatabase(values.userName);

            if (await result == -1) {
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
        const { modal } = state;

        const { showRepeatUserDialog } = state;
        const CREATEUSER_FORM_ITEMS: Form.Item[] = [
            //Form.email('email', 'Email'),
            //Form.password('password', 'Password', undefined, this.onForgotPasswordClick_, 'Forgot?', false),
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
                            <StyledForm
                                theme={theme}
                                onFinalize={this.onFinalize_}
                                items={CREATEUSER_FORM_ITEMS}
                                finalizeText="Create"
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


