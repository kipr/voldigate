import Dashboard from '../pages/Dashboard';
import { ThemeProps } from './theme';
import { StyleProps } from '../style';
import { Settings } from '../Settings';
import tr from '@i18n';
import LocalizedString from '../util/LocalizedString';
import * as React from 'react';
import ComboBox from './ComboBox';
import { styled } from 'styletron-react';
import ScrollArea from './ScrollArea';
import { Dialog } from './Dialog';
import Dict from '../Dict';
import { State as ReduxState } from '../state';
import { I18nAction } from '../state/reducer';
import { connect } from 'react-redux';
import Form from './Form';
import User from './User';
import { push } from 'connected-react-router';

import Root from './Root';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
type SettingsSection = 'user-interface' | 'simulation' | 'editor';


export interface CreateUserDialogPublicProps extends ThemeProps, StyleProps {
    onClose: () => void;

    userName: string;

}

interface CreateUserDialogPrivateProps {
    locale: LocalizedString.Language;
    onLocaleChange: (locale: LocalizedString.Language) => void;
    onUserCreation: (userName: string) => void;
}

interface CreateUserDialogState {
    userName: string;
}


type Props = CreateUserDialogPublicProps & CreateUserDialogPrivateProps;
type State = CreateUserDialogState;

const Container = styled('div', (props: ThemeProps) => ({
    display: 'flex',
    flexDirection: 'row',
    color: props.theme.color,
    minHeight: '200px',
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

export class CreateUserDialog extends React.PureComponent<Props, State>{
    //state = {userName: ''};

    constructor(props: Props) {
        super(props);
        this.state = {
            userName: ''
        }
    }



    private onLocaleSelect_ = (index: number, option: ComboBox.Option) => {
        this.props.onLocaleChange(option.data as LocalizedString.Language);
    };
    onFinalize_ = (values: { [id: string]: string }) => {

        // this.setState({userName: values.userName}, () => {
        //     console.log(this.state.userName);
        // });

        let newUser = new User(this.props, values.userName, []);
        console.log(newUser);

        this.props.onUserCreation(newUser.name);


    };

    public myComponent(props: CreateUserDialogPublicProps) {
        return (props.userName)
    }


    render() {
        const { props, state } = this;
        const { style, className, theme, onClose, locale } = props;
        //const {userName} = this.state;
        const CREATEUSER_FORM_ITEMS: Form.Item[] = [
            //Form.email('email', 'Email'),
            //Form.password('password', 'Password', undefined, this.onForgotPasswordClick_, 'Forgot?', false),
            Form.username('userName', 'User Name')

        ];

        const FORMS = [CREATEUSER_FORM_ITEMS];
        return (
            <Dialog
                theme={theme}
                name={LocalizedString.lookup(tr('Create New User'), locale)}
                onClose={onClose}
            >
                <Container theme={theme} style={style} className={className}>
                    <StyledForm
                        theme={theme}
                        onFinalize={this.onFinalize_}
                        items={FORMS[0]}
                        finalizeText='Create'
                    />
                </Container>
            </Dialog>
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