import * as React from 'react';
import tr from '@i18n';
import LocalizedString from '../util/LocalizedString';
import { ThemeProps } from '../components/theme';
import { StyleProps } from '../style';
import { connect } from 'react-redux';
import { styled } from 'styletron-react';
import { LayoutProps } from './Layout/Layout';
import { State as ReduxState } from '../state';
import { Motors, Servos, Sensors, MotorView, ServoType, DEFAULT_SENSORS, DEFAULT_MOTORS, } from '../types/motorServoSensorTypes';
import DynamicGauge from './DynamicGauge';
import ComboBox from './ComboBox';
import MiniComboBox from './MiniComboBox';
import ResizeableComboBox from './ResizeableComboBox';
export interface MotorServoSensorDisplayProps extends ThemeProps, StyleProps {

    storeMotorPositions: (motorPositions: { [key: string]: number }) => void;
    getMotorPositions: () => { [key: string]: number };
    storeServoPositions: (servoPositions: ServoType[]) => void;
    getServoPositions: () => ServoType[];
}
interface SectionProps {
    selected?: boolean;
}
interface MotorServoSensorDisplayReduxSideLayoutProps {

    locale: LocalizedString.Language;
}

interface MotorServoSensorDisplayPrivateProps {
    locale: LocalizedString.Language;
}

interface MotorServoSensorDisplayState {
    selectedSection: "Motor" | "Servo" | "Sensor";

    shownMotor: Motors;
    shownMotorValue: number;
    motorPositions: { [key: string]: number };
    shownMotorView: MotorView;
    motorMinValue: number;
    motorMaxValue: number;
    motorSubArcs: { limit: number, color: string, tooltip?: { text: string } }[];

    shownServo: Servos;
    shownServoValue: number;
    servoPositions: ServoType[];
    servoMinValue: number;
    servoMaxValue: number;
    servoSubArcs: { limit: number, color: string, tooltip?: { text: string } }[];

    sensorValues: {
        analogs: { [key: string]: number }
        digitals: { [key: string]: number }
        accelerometers: { [key: string]: number }
        gyroscopes: { [key: string]: number }
        magnetometers: { [key: string]: number }
        button: number
    };

}
interface ClickProps {
    onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
    disabled?: boolean;
}

type Props = MotorServoSensorDisplayProps & MotorServoSensorDisplayPrivateProps;
type State = MotorServoSensorDisplayState;

const MotorServoSensorContainer = styled('div', (props: ThemeProps) => ({

    left: '4%',
    height: '100%',
    width: '100%',
    margin: '5px',
    zIndex: 1,
    paddingBottom: '10px',
}));

const SectionsColumn = styled('div', (props: ThemeProps) => ({

    display: 'flex',
    flexDirection: 'column',
    border: `3px solid ${props.theme.borderColor}`,
    marginBottom: '6px',
}));

const SidePanel = styled('div', (props: ThemeProps) => ({
    display: 'flex',
    //backgroundColor: 'blue',
    flexWrap: 'wrap',
    //flex: '1 0 0',
    left: '3.5%',
    top: '6%',
    zIndex: 1,
    //overflow: 'scroll',
    width: 'auto',
    height: '100%'
}));

const StyledComboBox = styled(ComboBox, {
    flex: '1 0',
    padding: '3px',

});

const StyledResizeableComboBox = styled(ResizeableComboBox, {
    flex: '1 0',
    padding: '3px',

});


const StyledMiniComboBox = styled(MiniComboBox, {
    flex: '1 0',
    padding: '3px',
    width: '80%',
});
const SettingContainer = styled('div', (props: ThemeProps) => ({
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
    padding: `${props.theme.itemPadding * 1}px`,
}));

const SensorTypeContainer = styled('div', (props: ThemeProps) => ({
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gridTemplateRows: 'auto',
    gap: '5px',
    alignContent: 'center',
    justifyContent: 'center',
    //borderBottom: `1px solid ${props.theme.borderColor}`,

}));
const ContainerSeparator = styled('div', (props: ThemeProps) => ({
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
    borderBottom: `1px solid ${props.theme.borderColor}`,

}));

const SensorContainer = styled('div', (props: ThemeProps) => ({
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
    //  padding: '3px',
}));


const ViewContainer = styled('div', (props: ThemeProps) => ({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: `2px`,
    width: '40%',
}));


const SectionTitleContainer = styled('div', (props: ThemeProps) => ({
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'space-between',
    padding: `${props.theme.itemPadding * 1}px`,
    width: '100%',
}));

const ControlContainer = styled('div', {
    display: 'flex',
    flexDirection: 'row',
    //flex: '1 0',
    alignItems: 'center',
    justifyContent: 'space-between',
});
const SectionInfoText = styled('span', {
    paddingRight: '5px',
    fontSize: '14px',
});
const SectionText = styled('span', {
    paddingRight: '5px',
});

const SettingInfoSubtext = styled(SectionInfoText, {
    fontSize: '10pt',
});
const Button = styled('button', {
    margin: '0 10px',
    padding: '5px 10px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
});


const SectionName = styled('span', (props: ThemeProps & SectionProps & { selected: boolean }) => ({
    ':hover': {
        cursor: 'pointer',
        backgroundColor: props.theme.hoverOptionBackground
    },
    width: '100%',

    backgroundColor: props.selected ? props.theme.selectedUserBackground : props.theme.unselectedBackground,
    boxShadow: props.theme.themeName === 'DARK' ? '0px 10px 13px -6px rgba(0, 0, 0, 0.2), 0px 20px 31px 3px rgba(0, 0, 0, 0.14), 0px 8px 38px 7px rgba(0, 0, 0, 0.12)' : undefined,
    transition: 'background-color 0.2s, opacity 0.2s',
    padding: `5px`,
    fontWeight: props.selected ? 400 : undefined,
    userSelect: 'none',
}));


const StopButton = styled(Button, (props: ThemeProps & ClickProps) => ({
    backgroundColor: props.theme.noButtonColor.standard,
    border: `1px solid ${props.theme.noButtonColor.border}`,
    ':hover':
        props.onClick && !props.disabled
            ? {
                backgroundColor: props.theme.noButtonColor.hover,
            }
            : {},
    color: props.theme.noButtonColor.textColor,
    textShadow: props.theme.noButtonColor.textShadow,
    boxShadow: '2px 2px 4px rgba(0,0,0,0.9)',
    ':active': props.onClick && !props.disabled
        ? {
            boxShadow: '1px 1px 2px rgba(0,0,0,0.7)',
            transform: 'translateY(1px, 1px)',
        }
        : {},
}));

const EnableButton = styled(Button, (props: ThemeProps & ClickProps & { $enabled?: boolean }) => ({
    backgroundColor: props.$enabled ? props.theme.noButtonColor.standard : props.theme.yesButtonColor.standard,
    border: `1px solid ${props.theme.noButtonColor.border}`,
    ':hover':
        props.onClick && !props.disabled
            ? {
                backgroundColor: props.$enabled ? props.theme.noButtonColor.hover : props.theme.yesButtonColor.hover,
            }
            : {},
    color: props.$enabled ? props.theme.noButtonColor.textColor : props.theme.yesButtonColor.textColor,
    textShadow: props.$enabled ? props.theme.noButtonColor.textShadow : props.theme.yesButtonColor.textShadow,
    boxShadow: '2px 2px 4px rgba(0,0,0,0.9)',
    ':active': props.onClick && !props.disabled
        ? {
            boxShadow: '1px 1px 2px rgba(0,0,0,0.7)',
            transform: 'translateY(1px, 1px)',
        }
        : {},
}));
const MOTOR_OPTIONS: ComboBox.Option[] = (() => {

    const ret: ComboBox.Option[] = [];
    for (const motor of Object.values(Motors)) {
        console.log("Motor: ", motor);
        ret.push(ComboBox.option(motor, motor));
    }
    return ret;
})();
const SERVO_OPTIONS: ComboBox.Option[] = (() => {

    const ret: ComboBox.Option[] = [];
    for (const servo of Object.values(Servos)) {
        console.log("servo: ", servo);
        ret.push(ComboBox.option(servo, servo));
    }
    return ret;
})();
const VIEW_OPTIONS: ComboBox.Option[] = (() => {

    const ret: ComboBox.Option[] = [];
    for (const view of Object.values(MotorView)) {
        console.log("view: ", view);
        ret.push(ComboBox.option(view, view));
    }
    return ret;
})();
export class MotorServoSensorDisplay extends React.PureComponent<Props & MotorServoSensorDisplayReduxSideLayoutProps, State> {

    constructor(props: Props & MotorServoSensorDisplayReduxSideLayoutProps) {
        super(props);

        this.state = {
            selectedSection: "Motor",
            shownMotor: Motors.MOTOR0,
            shownMotorValue: 0,
            motorPositions: DEFAULT_MOTORS,
            shownMotorView: MotorView.VELOCITY,
            motorMinValue: -1500,
            motorMaxValue: 1500,
            motorSubArcs: [
                {
                    limit: 0,
                    color: '#FF4E4E',
                    tooltip: {
                        text: 'Reverse'
                    }
                },
                {
                    limit: 1500,
                    color: '#2BDE3F',
                    tooltip: {
                        text: 'Forward'
                    }
                }
            ],
            shownServo: Servos.SERVO0,
            shownServoValue: 0,
            servoPositions: [
                {
                    name: Servos.SERVO0,
                    value: 1024,
                    enable: false,
                },
                {
                    name: Servos.SERVO1,
                    value: 1024,
                    enable: false,
                },
                {
                    name: Servos.SERVO2,
                    value: 1024,
                    enable: false,
                },
                {
                    name: Servos.SERVO3,
                    value: 1024,
                    enable: false,
                }
            ],
            servoMinValue: 0,
            servoMaxValue: 2047,
            servoSubArcs: [
                {
                    limit: 2047,
                    color: '#2BDE3F',
                }
            ],
            sensorValues: DEFAULT_SENSORS,
        };


    }

    private newMotorRef: React.RefObject<Motors | undefined> = React.createRef();

    async componentDidMount(): Promise<void> {
        console.log("MOTOSERVOSENSORDISPLAY MOUNTED");
        // console.log("MotorServoSensorDisplay state: ", this.state);
        console.log("MotorServoSensorDisplay props: ", this.props);
        console.log("MotorServoSensorDisplay state: ", this.state);

        this.newMotorRef.current = Motors.MOTOR0;

        console.log("MotorServoSensorDisplay compDidMount this.props.getMotorPositions(): ", this.props.getMotorPositions());
        if (this.props.getMotorPositions() !== undefined) {
            this.setState({
                motorPositions: this.props.getMotorPositions(),
            }, () => {
                console.log("MotorServoSensorDisplay compDidMount NEW this.state.motorPositions: ", this.state.motorPositions);
            });
        }

        console.log("MotorServoSensorDisplay compDidMount this.props.getServoPositions(): ", this.props.getServoPositions());
        if (this.props.getServoPositions() !== undefined) {
            this.setState({
                servoPositions: this.props.getServoPositions(),
            }, () => {
                console.log("MotorServoSensorDisplay compDidMount NEW this.state.servoPositions: ", this.state.servoPositions);
            });

        }
    }

    componentWillUnmount(): void {
        console.log("MotorServoSensorDisplay UNMOUNTED");
    }

    async componentDidUpdate(prevProps: Props, prevState: State): Promise<void> {
        console.log("MotorServoSensorDisplay compDidUpdate prevProps: ", prevProps);
        console.log("MotorServoSensorDisplay compDidUpdate props: ", this.props);
        console.log("MotorServoSensorDisplay compDidUpdate prevState: ", prevState);
        console.log("MotorServoSensorDisplay compDidUpdate state: ", this.state);

        if(prevState.shownServoValue !== this.state.shownServoValue){
            console.log("MotorServoSensorDisplay compDidUpdate state shownServoValue CHANGED from: ", prevState.shownServoValue);
            console.log("MotorServoSensorDisplay compDidUpdate state shownServoValue CHANGED to: ", this.state.shownServoValue);

            this.setState({
                shownServoValue: this.state.shownServoValue,
            })
        }
        if (prevState.motorPositions !== this.state.motorPositions) {
            console.log("MotorServoSensorDisplay compDidUpdate state motorPositions CHANGED from: ", prevState.motorPositions);
            console.log("MotorServoSensorDisplay compDidUpdate state motorPositions CHANGED to: ", this.state.motorPositions);

            this.setState({
                shownMotorValue: this.state.motorPositions[this.state.shownMotor],
            })
        }
        if (prevState.shownMotor !== this.state.shownMotor) {
            console.log("MotorServoSensorDisplay compDidUpdate state shownMotor: ", this.state.shownMotor);
            console.log("MotorServoSensorDisplay compDidUpdate state shownMotorValue: ", this.state.shownMotorValue);
            console.log("MotorServoSensorDisplay compDidUpdate state motorPositions: ", this.state.motorPositions);

        }

        if (prevState.shownMotorValue !== this.state.shownMotorValue) {
            console.log("MotorServoSensorDisplay compDidUpdate state shownMotorValue: ", this.state.shownMotorValue);
        }

    }

    private onMotorSelect_ = (index: number, option: ComboBox.Option) => {
        console.log("Motor selected: ", option.data);

        this.newMotorRef.current = option.data as Motors;
        console.log("onMotorSelect_ newMotorRef: ", this.newMotorRef.current);
        console.log("onMotorSelect_ this.state.motorPositions[option.data]: ", this.state.motorPositions[option.data as Motors]);

        if (this.state.shownMotor !== option.data) {
            console.log("if this.state.shownMotor");
            this.setState({
                shownMotor: option.data as Motors,
                shownMotorValue: this.state.motorPositions[option.data as Motors],
            });

        }
    };

    private onServoSelect_ = (index: number, option: ComboBox.Option) => {

        console.log("Servo selected: ", option.data);

        this.setState((prevState) => {
            const selectedServo = option.data as Servos;

            // Find the corresponding servo object in the array
            const servoObj = prevState.servoPositions.find(servo => servo.name === selectedServo);

            return {
                shownServo: selectedServo,
                shownServoValue: servoObj ? servoObj.value : 1024, // Default to 0 if not found
            };
        });
    };

    private onMotorViewSelect_ = (index: number, option: ComboBox.Option) => {
        console.log("Motor view selected: ", option.data);

        if (this.state.shownMotorView !== option.data) {
            let newMotorLimits = { motorMinValue: 0, motorMaxValue: 0 };
            let newMotorSubArcs = [];
            if (option.data === MotorView.VELOCITY) {
                newMotorLimits = { motorMinValue: -1500, motorMaxValue: 1500 };
                newMotorSubArcs = [{
                    limit: 0,
                    color: '#FF4E4E',
                    tooltip: {
                        text: 'Reverse'
                    }
                },
                {
                    limit: 1500,
                    color: '#2BDE3F',
                    tooltip: {
                        text: 'Forward'
                    }
                }];
            }
            else if (option.data === MotorView.POWER) {
                newMotorLimits = { motorMinValue: -100, motorMaxValue: 100 };
                newMotorSubArcs = [{
                    limit: 0,
                    color: '#FF4E4E',
                    tooltip: {
                        text: 'Reverse'
                    }
                },
                {
                    limit: 100,
                    color: '#2BDE3F',
                    tooltip: {
                        text: 'Forward'
                    }
                }];
            }
            this.setState({
                motorMinValue: newMotorLimits.motorMinValue,
                motorMaxValue: newMotorLimits.motorMaxValue,
                motorSubArcs: newMotorSubArcs,
                shownMotorView: option.data as MotorView,
            });
        }
    };
    private onMotorChange_ = (value: number) => {
        console.log("Motor value: ", value, "for Motor: ", this.newMotorRef.current);
        if (this.newMotorRef.current) {
            this.setState({
                motorPositions: {
                    ...this.state.motorPositions,
                    [this.newMotorRef.current]: value,
                },
                shownMotorValue: value,
            }, () => {
                this.props.storeMotorPositions(this.state.motorPositions);
            });
        }
    };

    private onServoChange_ = (value: number) => {
        console.log("Servo value: ", value, "for Servo: ", this.state.shownServo);

        this.setState((prevState) => {
            const updatedServoPositions = prevState.servoPositions.map((servo) =>
                servo.name === prevState.shownServo ? { ...servo, value } : servo
            );

            return {
                servoPositions: updatedServoPositions,
                shownServoValue: value,
            };
        }, () => {
            console.log("After set state servoPositions: ", this.state.servoPositions);
            this.props.storeServoPositions(this.state.servoPositions);
        });
    };

    private flipEnableServo_ = (servo: Servos) => {
        console.log("Flip enable for servo: ", servo);

        this.setState((prevState) => {
            const updatedServoPositions = prevState.servoPositions.map((servoObj) =>
                servoObj.name === servo ? { ...servoObj, enable: !servoObj.enable } : servoObj
            );

            return {
                servoPositions: updatedServoPositions,
            };
        }, () => {
            console.log("After set state servoPositions: ", this.state.servoPositions);
            this.props.storeServoPositions(this.state.servoPositions);
        });
    };

    private stopAllMotors_ = () => {
        console.log("Stop all motors");
        this.setState({
            motorPositions: {
                [Motors.MOTOR0]: 0,
                [Motors.MOTOR1]: 0,
                [Motors.MOTOR2]: 0,
                [Motors.MOTOR3]: 0,
            },
            shownMotorValue: 0,
        }, () => {
            this.props.storeMotorPositions(this.state.motorPositions);
        });
    };

    private stopCurrentMotor_ = () => {
        console.log("Stop current motor");
        if (this.newMotorRef.current) {
            this.setState({
                motorPositions: {
                    ...this.state.motorPositions,
                    [this.newMotorRef.current]: 0,
                },
                shownMotorValue: 0,
            }, () => {
                this.props.storeMotorPositions(this.state.motorPositions);
            });
        }
    }

    private disableAllServos_ = () => {
        console.log("Disable all servos");
        this.setState((prevState) => {
            const updatedServoPositions = prevState.servoPositions.map((servo) =>
                ({ ...servo, enable: false })
            );

            return {
                servoPositions: updatedServoPositions,
            };
        }, () => {
            console.log("After set state servoPositions: ", this.state.servoPositions);
            this.props.storeServoPositions(this.state.servoPositions);
        });

    };

    private onSectionSelect_ = (section: "Motor" | "Servo" | "Sensor") => {
        console.log("Section selected: ", section);
        if(section === "Servo"){
            console.log("Setting shownServoValue to: ", this.state.servoPositions[0].value);
            this.setState({
                shownServoValue: this.state.servoPositions[0].value,
            })
        }
        this.setState({
            selectedSection: section,
        }, () => {
            console.log("Section selected: ", this.state.selectedSection);
        })
    };

    render() {
        const { props } = this;
        const {
            theme,
            locale,

        } = props;

        const {
            selectedSection,
            shownMotor,
            shownMotorValue,
            shownMotorView,
            motorMinValue,
            motorMaxValue,
            motorSubArcs,
            shownServo,
            shownServoValue,
            servoMinValue,
            servoMaxValue,
            servoSubArcs

        } = this.state;

        console.log("MotorServoSensorDisplay render state shownMotorValue: ", shownMotorValue);
        const motorSection = () => {
            const { theme } = this.props;
            return (
                <SectionsColumn theme={theme}>

                    <SectionTitleContainer theme={theme}>
                        <SectionText>{LocalizedString.lookup(tr('Motors'), locale)}</SectionText>
                        <ViewContainer theme={theme}>
                            <SectionInfoText style={{ fontSize: '10px' }}>{LocalizedString.lookup(tr('View:'), locale)}</SectionInfoText>
                            <StyledMiniComboBox
                                options={VIEW_OPTIONS}
                                index={VIEW_OPTIONS.findIndex(opt => opt.data === shownMotorView)}
                                onSelect={this.onMotorViewSelect_}
                                theme={theme}
                                style={{ padding: '1px' }}
                                minimal={true}

                            />
                        </ViewContainer>
                    </SectionTitleContainer>

                    <SettingContainer theme={theme}>
                        <ControlContainer >
                            <SectionInfoText>{LocalizedString.lookup(tr('Motor Port:'), locale)}</SectionInfoText>
                            <StyledResizeableComboBox
                                options={MOTOR_OPTIONS}
                                index={MOTOR_OPTIONS.findIndex(opt => opt.data === shownMotor)}
                                onSelect={this.onMotorSelect_}
                                theme={theme}
                                mainWidth={100}
                                mainHeight={20}
                                mainFontSize={14}

                            />
                        </ControlContainer>

                    </SettingContainer>


                    <SettingContainer theme={theme}>
                        <DynamicGauge
                            minValue={motorMinValue}
                            maxValue={motorMaxValue}
                            initialValue={0}
                            theme={theme}
                            onDialChange={this.onMotorChange_}
                            changeValue={this.state.shownMotorValue}
                            subArcs={motorSubArcs}
                        />
                    </SettingContainer>
                    <SettingContainer theme={theme} style={{ padding: '1px', paddingBottom: '5px' }}>
                        <StopButton onClick={() => this.stopAllMotors_()} theme={theme}>
                            {LocalizedString.lookup(tr('Stop All Motors'), locale)}
                        </StopButton>
                        <StopButton onClick={() => this.stopCurrentMotor_()} theme={theme}>
                            {LocalizedString.lookup(tr('Stop Current Motor'), locale)}
                        </StopButton>

                    </SettingContainer>
                </SectionsColumn>
            );
        };
        const servoSection = () => {
            console.log("Servo section this.state.shownServoValue: ", this.state.shownServoValue);
            const { theme } = this.props;
            return (
                <SectionsColumn theme={theme}>

                    <SectionTitleContainer theme={theme}>
                        <SectionText>{LocalizedString.lookup(tr('Servos'), locale)}</SectionText>
                    </SectionTitleContainer>

                    <SettingContainer theme={theme}>
                        <ControlContainer >
                            <SectionInfoText>{LocalizedString.lookup(tr('Servo Port:'), locale)}</SectionInfoText>
                            <StyledResizeableComboBox
                                options={SERVO_OPTIONS}
                                index={SERVO_OPTIONS.findIndex(opt => opt.data === shownServo)}
                                onSelect={this.onServoSelect_}
                                theme={theme}
                                mainWidth={100}
                                mainHeight={20}
                                mainFontSize={14}

                            />
                        </ControlContainer>

                    </SettingContainer>


                    <SettingContainer theme={theme}>
                        <DynamicGauge
                            minValue={servoMinValue}
                            maxValue={servoMaxValue}
                            initialValue={1024}
                            theme={theme}
                            onDialChange={this.onServoChange_}
                            changeValue={this.state.shownServoValue}
                            subArcs={servoSubArcs}
                        />
                    </SettingContainer>
                    <SettingContainer theme={theme} style={{ padding: '1px', paddingBottom: '5px' }}>
                        <EnableButton onClick={() => this.flipEnableServo_(shownServo)} theme={theme} $enabled={this.state.servoPositions.find(servo => servo.name === shownServo)?.enable}>
                            {this.state.servoPositions.find(servo => servo.name === shownServo)?.enable
                                ? LocalizedString.lookup(tr('Disable Servo'), locale)
                                : LocalizedString.lookup(tr('Enable Servo'), locale)}
                        </EnableButton>

                        <StopButton onClick={() => this.disableAllServos_()} theme={theme}>
                            {LocalizedString.lookup(tr('Disable All Servos'), locale)}
                        </StopButton>

                    </SettingContainer>
                </SectionsColumn>
            );
        };
        const sensorSection = () => {
            const { theme } = this.props;
            return (
                <SectionsColumn theme={theme} style={{ paddingBottom: '10px' }}>

                    <SectionTitleContainer theme={theme}>
                        <SectionText>{LocalizedString.lookup(tr('Analog Sensors'), locale)}</SectionText>
                    </SectionTitleContainer>
                    <SensorTypeContainer theme={theme}>
                        {Object.entries(this.state.sensorValues)
                            .filter(([sensorCategory]) => sensorCategory.toUpperCase().includes("ANALOG")) // Filter only "DIGITAL" entries
                            .map(([sensorCategory, categoryValue], index) => (
                                typeof categoryValue === 'object' && !Array.isArray(categoryValue) ? (
                                    Object.entries(categoryValue).map(([sensor, value]) => (
                                        <SensorContainer key={`${sensorCategory}-${sensor}-${index}`} theme={theme}>
                                            <SectionText>{`${sensor}:`}</SectionText>
                                            <SectionInfoText>{value}</SectionInfoText>
                                        </SensorContainer>
                                    ))
                                ) : (
                                    <SensorContainer key={`${sensorCategory}-${index}`} theme={theme}>
                                        <SectionText>{`${sensorCategory}:`}</SectionText>
                                        <SectionInfoText>{categoryValue}</SectionInfoText>
                                    </SensorContainer>
                                )
                            ))}
                    </SensorTypeContainer>

                    <ContainerSeparator theme={theme} />


                    <SectionTitleContainer theme={theme}>
                        <SectionText>{LocalizedString.lookup(tr('Digital Sensors'), locale)}</SectionText>
                    </SectionTitleContainer>
                    <SensorTypeContainer theme={theme}>
                        {Object.entries(this.state.sensorValues)
                            .filter(([sensorCategory]) => sensorCategory.toUpperCase().includes("DIGITAL")) // Filter only "DIGITAL" entries
                            .map(([sensorCategory, categoryValue], index) => (
                                typeof categoryValue === 'object' && !Array.isArray(categoryValue) ? (
                                    Object.entries(categoryValue).map(([sensor, value]) => (
                                        <SensorContainer key={`${sensorCategory}-${sensor}-${index}`} theme={theme}>
                                            <SectionText>{`${sensor}:`}</SectionText>
                                            <SectionInfoText>{value}</SectionInfoText>
                                        </SensorContainer>
                                    ))
                                ) : (
                                    <SensorContainer key={`${sensorCategory}-${index}`} theme={theme}>
                                        <SectionText>{`${sensorCategory}:`}</SectionText>
                                        <SectionInfoText>{categoryValue}</SectionInfoText>
                                    </SensorContainer>
                                )
                            ))}
                    </SensorTypeContainer>

                    <SectionTitleContainer theme={theme}>
                        <SectionText>{LocalizedString.lookup(tr('Accelerometers'), locale)}</SectionText>
                    </SectionTitleContainer>
                    <SensorTypeContainer theme={theme}>
                        {Object.entries(this.state.sensorValues)
                            .filter(([sensorCategory]) => sensorCategory.toUpperCase().includes("ACCELEROMETER"))
                            .map(([sensorCategory, categoryValue], index) => (
                                typeof categoryValue === 'object' && !Array.isArray(categoryValue) ? (
                                    Object.entries(categoryValue).map(([sensor, value]) => (
                                        <SensorContainer key={`${sensorCategory}-${sensor}-${index}`} theme={theme}>
                                            <SectionText>{`${sensor}:`}</SectionText>
                                            <SectionInfoText>{value}</SectionInfoText>
                                        </SensorContainer>
                                    ))
                                ) : (
                                    <SensorContainer key={`${sensorCategory}-${index}`} theme={theme}>
                                        <SectionText>{`${sensorCategory}:`}</SectionText>
                                        <SectionInfoText>{categoryValue}</SectionInfoText>
                                    </SensorContainer>
                                )
                            ))}
                    </SensorTypeContainer>

                    <SectionTitleContainer theme={theme}>
                        <SectionText>{LocalizedString.lookup(tr('Gyroscope'), locale)}</SectionText>
                    </SectionTitleContainer>
                    <SensorTypeContainer theme={theme}>
                        {Object.entries(this.state.sensorValues)
                            .filter(([sensorCategory]) => sensorCategory.toUpperCase().includes("GYROSCOPE"))
                            .map(([sensorCategory, categoryValue], index) => (
                                typeof categoryValue === 'object' && !Array.isArray(categoryValue) ? (
                                    Object.entries(categoryValue).map(([sensor, value]) => (
                                        <SensorContainer key={`${sensorCategory}-${sensor}-${index}`} theme={theme}>
                                            <SectionText>{`${sensor}:`}</SectionText>
                                            <SectionInfoText>{value}</SectionInfoText>
                                        </SensorContainer>
                                    ))
                                ) : (
                                    <SensorContainer key={`${sensorCategory}-${index}`} theme={theme}>
                                        <SectionText>{`${sensorCategory}:`}</SectionText>
                                        <SectionInfoText>{categoryValue}</SectionInfoText>
                                    </SensorContainer>
                                )
                            ))}
                    </SensorTypeContainer>

                    <SectionTitleContainer theme={theme}>
                        <SectionText>{LocalizedString.lookup(tr('Magnetometer'), locale)}</SectionText>
                    </SectionTitleContainer>
                    <SensorTypeContainer theme={theme}>
                        {Object.entries(this.state.sensorValues)
                            .filter(([sensorCategory]) => sensorCategory.toUpperCase().includes("MAGNETOMETER"))
                            .map(([sensorCategory, categoryValue], index) => (
                                typeof categoryValue === 'object' && !Array.isArray(categoryValue) ? (
                                    Object.entries(categoryValue).map(([sensor, value]) => (
                                        <SensorContainer key={`${sensorCategory}-${sensor}-${index}`} theme={theme}>
                                            <SectionText>{`${sensor}:`}</SectionText>
                                            <SectionInfoText>{value}</SectionInfoText>
                                        </SensorContainer>
                                    ))
                                ) : (
                                    <SensorContainer key={`${sensorCategory}-${index}`} theme={theme}>
                                        <SectionText>{`${sensorCategory}:`}</SectionText>
                                        <SectionInfoText>{categoryValue}</SectionInfoText>
                                    </SensorContainer>
                                )
                            ))}
                    </SensorTypeContainer>

                    <SectionTitleContainer theme={theme}>
                        <SectionText>{LocalizedString.lookup(tr('Buttons'), locale)}</SectionText>
                    </SectionTitleContainer>
                    <SensorTypeContainer theme={theme}>
                        {Object.entries(this.state.sensorValues)
                            .filter(([sensorCategory]) => sensorCategory.includes("button"))
                            .map(([sensorCategory, categoryValue], index) => (
                                typeof categoryValue === 'object' && !Array.isArray(categoryValue) ? (
                                    Object.entries(categoryValue).map(([sensor, value]) => (
                                        <SensorContainer key={`${sensorCategory}-${sensor}-${index}`} theme={theme}>
                                            <SectionText>{`${sensor}:`}</SectionText>
                                            <SectionInfoText>{value}</SectionInfoText>
                                        </SensorContainer>
                                    ))
                                ) : (
                                    <SensorContainer key={`${sensorCategory}-${index}`} theme={theme}>
                                        <SectionText>{`${sensorCategory}:`}</SectionText>
                                        <SectionInfoText>{categoryValue}</SectionInfoText>
                                    </SensorContainer>
                                )
                            ))}
                    </SensorTypeContainer>

                </SectionsColumn>
            );
        };
        return (
            <SidePanel
                theme={theme}
                style={{
                    flex: 1,
                    overflowY: 'scroll',
                }}
            >
                <h2 style={{ marginLeft: '6px' }}>Motors, Servos and Sensors</h2>
                <MotorServoSensorContainer theme={theme} style={{ marginBottom: '10px' }}>
                    <SectionName theme={theme} selected={selectedSection === "Motor"} onClick={() => this.onSectionSelect_("Motor")}>
                        Motor
                    </SectionName>
                    <SectionName theme={theme} selected={selectedSection === "Servo"} onClick={() => this.onSectionSelect_("Servo")}>
                        Servo
                    </SectionName>
                    <SectionName theme={theme} selected={selectedSection === "Sensor"} onClick={() => this.onSectionSelect_("Sensor")}>
                        Sensor
                    </SectionName>
                    {selectedSection == "Motor" && motorSection()}
                    {selectedSection == "Servo" && servoSection()}
                    {selectedSection == "Sensor" && sensorSection()}
                </MotorServoSensorContainer>
            </SidePanel>
        );
    }
}

export const MotorServoSensorDisplaySideLayoutRedux = connect((state: ReduxState, { }: LayoutProps) => {


    return {

        locale: state.i18n.locale,
    };
}, dispatch => ({

}), null, { forwardRef: true })(MotorServoSensorDisplay) as React.ComponentType<MotorServoSensorDisplayProps>;