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
import { User } from '../types/userTypes';
import ComboBox from './ComboBox';
import { InterfaceMode } from '../types/interfaceModes';

export interface CreateClassroomDialogPublicProps extends ThemeProps, StyleProps {
    showRepeatUserDialog: boolean;
    userName: string;
    onClose: () => void;
    onCloseClassroomDialog: (classroomName: string) => void;
}

interface CreateClassroomDialogPrivateProps {
    locale: LocalizedString.Language;
    onLocaleChange: (locale: LocalizedString.Language) => void;
    onUserCreation: (userName: string) => void;
}

interface CreateClassroomDialogState {
    userName: string;
    errorMessage: string;
    showRepeatUserDialog: boolean;
    interfaceMode: InterfaceMode;
}

type Props = CreateClassroomDialogPublicProps & CreateClassroomDialogPrivateProps;
type State = CreateClassroomDialogState;

const Container = styled('div', (props: ThemeProps) => ({
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: props.theme.backgroundColor,
    color: props.theme.color,
    minHeight: '15em',
    height: '9em'
}));

const StyledForm = styled(Form, (props: ThemeProps) => ({
    paddingTop: `${props.theme.itemPadding * 4}px`,
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

const ItemIcon = styled(Fa, {
    paddingLeft: '10px',
    paddingRight: '10px',
    alignItems: 'center',
    height: '30px'
});

export class CreateClassroomDialog extends React.PureComponent<Props, State> {

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
        });
    };

onFinalize_ = async (values: { [id: string]: string }) => {
  const classroomName = values.classroomName;

  const specialCharRegex = /[^a-zA-Z0-9 _-]/; // Removed space from allowed chars

  // Check if classroom name exceeds 50 characters
  if (classroomName.length > 50) {
    this.setState({ errorMessage: 'Classroom name cannot exceed 50 characters.' });
    return;
  }
  if (specialCharRegex.test(classroomName)) {
    this.setState({ errorMessage: 'Classroom name contains special characters. Please use only letters, numbers, underscores, and hyphens.' });
    return;
  }
  if (classroomName.trim() === '') {
    this.setState({ errorMessage: 'Classroom name cannot be empty!' });
    return;
  }

  this.setState({ errorMessage: '' }); // Clear error message if input is valid

  try {
    const response = await axios.post('/create-classroom', {  classroomName: `${classroomName}` });
    console.log('Create classroom response:', response.data);
    if (response.status === 200) {
      this.props.onCloseClassroomDialog(classroomName);
    }
  } catch (error) {
     if(error.response.status === 400 && error.response.data.error === 'Classroom already exists') {
      this.setState({ errorMessage: 'Classroom already exists. Please choose a different name.' });
      return;

    }
  }
};


    public myComponent(props: CreateClassroomDialogPublicProps) {
        return (props.userName)
    }

    render() {
        const { props, state } = this;
        const { style, className, theme, onClose, locale } = props;
        const { errorMessage } = state;

        const { showRepeatUserDialog } = state;
        const CREATEUSER_FORM_ITEMS: Form.Item[] = [
            Form.username('classroomName', LocalizedString.lookup(tr('Classroom Name'), locale))
        ];
        
        return (
            <div>
                {!showRepeatUserDialog && (
                    <Dialog
                        theme={theme}
                        name={LocalizedString.lookup(tr('Create New Classroom'), locale)}
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
 
}))(CreateClassroomDialog) as React.ComponentType<CreateClassroomDialogPublicProps>;


