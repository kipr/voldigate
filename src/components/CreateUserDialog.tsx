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
import { Fa } from './Fa';
import { User } from 'ivygate/dist/src/types/user';
import ComboBox from './ComboBox';
import { InterfaceMode } from '../types/interfaceModes';
import { Settings } from 'Settings';
import Classroom from 'ivygate/dist/src/types/classroomTypes';


export interface CreateUserDialogPublicProps extends ThemeProps, StyleProps {
    showRepeatUserDialog: boolean;
    settings?: Settings | null;
    propClassroom?: Classroom | null;
    classrooms: Classroom[] | null;

    onClose: () => void;
    onCreateUserDialog: (userName: string, interfaceMode: InterfaceMode, classroom?: Classroom | null) => void;
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
    classroom?: Classroom | null;
}

type Props = CreateUserDialogPublicProps & CreateUserDialogPrivateProps;
type State = CreateUserDialogState;

const Container = styled('div', (props: ThemeProps) => ({
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: props.theme.backgroundColor,
    color: props.theme.color,
    minHeight: '15em',
    height: '9em'
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
// const INTERFACE_OPTIONS: ComboBox.Option[] = [{
//     text: 'Simple',
//     data: LocalizedString.lookup(tr('Simple'), locale)
// }, {
//     text: 'Advanced',
//     data: LocalizedString.lookup(tr('Advanced'), this.props.locale)

// }];
const getInterfaceOptions = (locale: LocalizedString.Language): ComboBox.Option[] => ([
    { text: LocalizedString.lookup(tr('Simple'), locale), data: LocalizedString.lookup(tr('Simple'), locale) },
    { text: LocalizedString.lookup(tr('Advanced'), locale), data: LocalizedString.lookup(tr('Advanced'), locale) },
]);


export class CreateUserDialog extends React.PureComponent<Props, State> {

    constructor(props: Props) {
        super(props);
        const initialClassroom = this.props.classrooms?.length > 0 ? this.props.classrooms[0] : Classroom.EMPTY_CLASSROOM;
        this.state = {
            userName: '',
            showRepeatUserDialog: false,
            errorMessage: '',
            interfaceMode: InterfaceMode.SIMPLE,
            classroom: this.props.propClassroom ? this.props.propClassroom : this.props.classrooms?.[0] || Classroom.NO_CLASSROOM
        }
    }

    componentDidMount() {
        console.log("CreateUserDialog componentDidMount props: ", this.props);
        console.log("CreateUserDialog componentDidMount state: ", this.state);
    }

    componentDidUpdate = (prevProps: Props, prevState: State) => {
        console.log("CreateUserDialog componentDidUpdate props: ", this.props);
        console.log("CreateUserDialog componentDidUpdate state: ", this.state);
    }
    private closeRepeatUserDialog_ = () => {

        this.setState({ showRepeatUserDialog: false });
    };
    private onInterfaceChange = (interfaceMode: InterfaceMode) => {
        this.setState({
            interfaceMode: interfaceMode
        });
    };
    private onSelectInterface_ = (interfaceIndex: number, option: ComboBox.Option) => {
        this.onInterfaceChange(option.data as InterfaceMode);
    };
    private onSelectClassroom_ = (classroomIndex: number, option: ComboBox.Option) => {
        console.log("Selected classroom: ", option);
        this.setState({
            classroom: {
                name: option.text as Classroom['name'],
                users: option.data as User[],
                type: 'classroom'
            }
        }, () => {
            console.log("Updated classroom state: ", this.state);
        })
    };
    onFinalize_ = async (values: { [id: string]: string }) => {
        const userName = values.userName;

        const specialCharRegex = /[^a-zA-Z0-9 _-]/; // Removed space from allowed chars


        // Check if user name exceeds 50 characters
        if (userName.length > 50) {
            this.setState({ errorMessage: 'User name cannot exceed 50 characters.' });
            return;
        }
        if (specialCharRegex.test(userName)) {
            this.setState({ errorMessage: 'User name contains special characters. Please use only letters, numbers, underscores, and hyphens.' });
            return;
        }
        if (userName.trim() === '') {
            this.setState({ errorMessage: 'User name cannot be empty!' });
            return;
        }

        this.setState({ errorMessage: '' }); // Clear error message if input is valid

        try {
            const response = await axios.get('/get-users', { params: { filePath: '/home/kipr/Documents/KISS' } });
            console.log("CreateUserDialog response: ", response.data);
            if (response.data.users.some(user => user.userName === userName)) {
                this.setState({ showRepeatUserDialog: true });
            } else {
                this.props.onClose();
                this.props.onCreateUserDialog(userName as User['userName'], this.state.interfaceMode, this.state.classroom ? this.state.classroom.name === 'No Classroom' ? { name: "", users: [], type: 'classroom' } : this.state.classroom : null);
            }
        } catch (error) {
            console.error('Error adding user to database:', error);
        }
    };
    CLASSROOM_OPTIONS: ComboBox.Option[] = (() => {
        const ret: ComboBox.Option[] = [];
        const classrooms = this.props.classrooms || [];
        for (const classroom of classrooms) {

            const classroomName = LocalizedString.lookup(tr(`${classroom.name}`), this.props.locale);


            if (classroomName) {
                ret.push({
                    data: classroom.users,
                    text: classroomName
                });
            } else {
                console.error(`Classroom ${classroom.name} has an invalid localized name.`);
            }
        }

        console.log("CreateUserDialog CLASSROOM_OPTIONS ret: ", ret);
        ret.push({
            data: [],
            text: LocalizedString.lookup(tr('No Classroom'), this.props.locale)
        })
        return ret;
    })();

    render() {
        const { props, state } = this;
        const { style, className, theme, onClose, locale, settings, classrooms, propClassroom } = props;
        const { errorMessage, interfaceMode, classroom } = state;
        console.log("CreateUserDialog render props: ", props);
        console.log("CreateUserDialog render state: ", state);

        const { showRepeatUserDialog } = state;
        const CREATEUSER_FORM_ITEMS: Form.Item[] = [
            Form.username('userName', LocalizedString.lookup(tr('User Name'), locale))
        ];
        const interfaceIndex = getInterfaceOptions(locale).findIndex(option => option.data === this.state.interfaceMode);
        console.log("CreateUserDialog render interfaceIndex: ", interfaceIndex);
        console.log("CreateUserDialog render classroom: ", classroom);
        const classroomIndex = this.CLASSROOM_OPTIONS.findIndex(option => option.text === classroom?.name);
        console.log("CreateUserDialog render classroomIndex: ", classroomIndex);

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
                                <ComboBoxLabel theme={theme}>{LocalizedString.lookup(tr('Interface Mode:'), locale)}</ComboBoxLabel>
                                <StyledComboBox
                                    theme={theme}
                                    onSelect={this.onSelectInterface_}
                                    options={getInterfaceOptions(locale)}
                                    index={interfaceIndex}
                                />
                            </ComboBoxContainer>
                            {settings && settings.classroomView && !propClassroom && classrooms && (
                                <ComboBoxContainer theme={theme} style={style} className={className}>
                                    <ComboBoxLabel theme={theme}>{LocalizedString.lookup(tr('Classroom:'), locale)}</ComboBoxLabel>
                                    <StyledComboBox
                                        theme={theme}
                                        onSelect={this.onSelectClassroom_}
                                        options={this.CLASSROOM_OPTIONS}
                                        index={classroomIndex}
                                    />
                                </ComboBoxContainer>
                            )}
                            <StyledForm
                                theme={theme}
                                onFinalize={this.onFinalize_}
                                items={CREATEUSER_FORM_ITEMS}
                                finalizeText={LocalizedString.lookup(tr('Create'), locale)}
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

}))(CreateUserDialog) as React.ComponentType<CreateUserDialogPublicProps>;


