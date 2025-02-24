declare module 'simulator/AbstractRobot/Motor' {
  interface Motor {
      mode: Motor.Mode;
      direction: Motor.Direction;
      position: number;
      pwm: number;
      done: boolean;
      positionGoal: number;
      speedGoal: number;
      kP: number;
      kI: number;
      kD: number;
  }
  namespace Motor {
      enum Direction {
          Idle = 0,
          Forward = 1,
          Backward = 2,
          Brake = 3
      }
      namespace Direction {
          const fromBits: (bits: number) => Direction;
          const toBits: (direction: Direction) => number;
      }
      enum Mode {
          Pwm = 0,
          Speed = 1,
          Position = 2,
          SpeedPosition = 3
      }
      namespace Mode {
          const fromBits: (bits: number) => Mode;
          const toBits: (mode: Mode) => number;
      }
      const NIL: Motor;
  }
  export default Motor;

}
declare module 'simulator/AbstractRobot/Servo' {
  interface Servo {
      enabled: boolean;
      position: number;
  }
  namespace Servo {
  }
  export default Servo;

}
declare module 'simulator/AbstractRobot/WriteCommand' {
  import Motor from 'simulator/AbstractRobot/Motor';
  namespace WriteCommand {
      enum Type {
          DigitalIn = "digital-in",
          Analog = "analog",
          MotorPosition = "motor-position",
          AddMotorPosition = "add-motor-position",
          MotorPwm = "motor-pwm",
          MotorDone = "motor-done",
          MotorDirection = "motor-direction"
      }
      interface DigitalIn {
          type: Type.DigitalIn;
          port: number;
          value: boolean;
      }
      const digitalIn: (params: Omit<DigitalIn, "type">) => DigitalIn;
      interface Analog {
          type: Type.Analog;
          port: number;
          value: number;
      }
      const analog: (params: Omit<Analog, "type">) => Analog;
      interface MotorPosition {
          type: Type.MotorPosition;
          port: number;
          position: number;
      }
      const motorPosition: (params: Omit<MotorPosition, "type">) => MotorPosition;
      interface AddMotorPosition {
          type: Type.AddMotorPosition;
          port: number;
          positionDelta: number;
      }
      const addMotorPosition: (params: Omit<AddMotorPosition, "type">) => AddMotorPosition;
      interface MotorPwm {
          type: Type.MotorPwm;
          port: number;
          pwm: number;
      }
      const motorPwm: (params: Omit<MotorPwm, "type">) => MotorPwm;
      interface MotorDone {
          type: Type.MotorDone;
          port: number;
          done: boolean;
      }
      const motorDone: (params: Omit<MotorDone, "type">) => MotorDone;
      interface MotorDirection {
          type: Type.MotorDirection;
          port: number;
          direction: Motor.Direction;
      }
  }
  type WriteCommand = (WriteCommand.DigitalIn | WriteCommand.Analog | WriteCommand.MotorPosition | WriteCommand.AddMotorPosition | WriteCommand.MotorPwm | WriteCommand.MotorDone | WriteCommand.MotorDirection);
  export default WriteCommand;

}
declare module 'simulator/AbstractRobot/index' {
  import Patch from 'simulator/util/Patch';
  import Motor from 'simulator/AbstractRobot/Motor';
  import Servo from 'simulator/AbstractRobot/Servo';
  import WriteCommand from 'simulator/AbstractRobot/WriteCommand';
  type AbstractRobot = AbstractRobot.Readable & AbstractRobot.Writable;
  namespace AbstractRobot {
      interface Readable {
          getMotor(port: number): Motor;
          getServo(port: number): Servo;
          getAnalogValue(port: number): number;
          getDigitalValue(port: number): boolean;
      }
      interface Writable {
          apply(writeCommands: WriteCommand[]): any;
          sync(stateless: AbstractRobot.Stateless): any;
      }
      class Stateless implements Readable {
          motors: Stateless.Motors;
          servos: Stateless.Servos;
          analogValues: Stateless.AnalogValues;
          digitalValues: Stateless.DigitalValues;
          constructor(motors: Stateless.Motors, servos: Stateless.Servos, analogValues: Stateless.AnalogValues, digitalValues: Stateless.DigitalValues);
          getMotor(port: number): Motor;
          getServo(port: number): Servo;
          getAnalogValue(port: number): number;
          getDigitalValue(port: number): boolean;
      }
      namespace Stateless {
          type Motors = [Motor, Motor, Motor, Motor];
          type Servos = [Servo, Servo, Servo, Servo];
          type AnalogValues = [number, number, number, number, number, number];
          type DigitalValues = [boolean, boolean, boolean, boolean, boolean, boolean];
          const NIL: Stateless;
          const diff: (a: Stateless, b: Stateless) => Patch<Stateless>;
      }
      const toStateless: (robot: AbstractRobot) => Stateless;
  }
  export default AbstractRobot;

}
declare module 'simulator/App' {
  import * as React from 'react';
  export interface AppPublicProps {
  }
  const _default: React.ComponentType<AppPublicProps>;
  export default _default;

}
declare module 'simulator/CreateUser' {
  export interface CreateUser {
      userName: string;
  }
  export const DEFAULT_CREATEUSER: CreateUser;

}
declare module 'simulator/CustomShapeMetadata' {
  interface CustomShapeMetadata {
      __marker__: 'CustomShapeMetadata';
  }

}
declare module 'simulator/Dict' {
  type Dict<T> = {
      [key: string]: T;
  };
  namespace Dict {
      const filter: <T>(dict: Dict<T>, f: (value: T, key: string) => boolean) => Dict<T>;
      const map: <T, D>(dict: Dict<T>, f: (value: T, key: string) => D) => Dict<D>;
      const forEach: <T>(dict: Dict<T>, f: (value: T, key: string) => void) => void;
      const extract: <T>(dict: Dict<T>, fields: IterableIterator<string>) => [Dict<T>, Dict<T>];
      const toList: <T>(dict: Dict<T>) => [string, T][];
      const values: <T>(dict: Dict<T>) => T[];
      const keySet: <T>(dict: Dict<T>) => Set<string>;
      const generate: <T>(list: string[], f: (id: string) => T) => Dict<T>;
      const every: <T>(dict: Dict<T>, f: (value: T, key: string) => boolean) => boolean;
      const some: <T>(dict: Dict<T>, f: (value: T, key: string) => boolean) => boolean;
      const unique: <T>(dict: Dict<T>) => T;
  }
  export default Dict;

}
declare module 'simulator/Feedback' {
  export enum Sentiment {
      None = 0,
      Sad = 1,
      Okay = 2,
      Happy = 3
  }
  export interface Feedback {
      feedback: string;
      sentiment: Sentiment;
      email: string;
      includeAnonData: boolean;
      message: string;
      error: boolean;
  }
  export const DEFAULT_FEEDBACK: Feedback;

}
declare module 'simulator/Git' {
  export function setupLocalRepo(): Promise<void>;
  export function initializeRepository(): Promise<void>;

}
declare module 'simulator/ProgrammingLanguage' {
  type ProgrammingLanguage = 'c' | 'cpp' | 'python' | 'plaintext';
  namespace ProgrammingLanguage {
      const FILE_EXTENSION: {
          [key in ProgrammingLanguage]: string;
      };
      const DEFAULT_CODE: {
          [key in ProgrammingLanguage]: string;
      };
      const DEFAULT_HEADER_CODE = "#include <kipr/wombat.h>\n";
      const DEFAULT_USER_DATA_CODE = "*Your User Data Here*";
  }
  export default ProgrammingLanguage;

}
declare module 'simulator/RegisterState' {
  const _default: {
      WALLABY_SPI_VERSION: number;
      REG_R_START: number;
      REG_R_VERSION_H: number;
      REG_R_VERSION_L: number;
      REG_RW_DIG_IN_H: number;
      REG_RW_DIG_IN_L: number;
      REG_RW_DIG_OUT_H: number;
      REG_RW_DIG_OUT_L: number;
      REG_RW_DIG_PE_H: number;
      REG_RW_DIG_PE_L: number;
      REG_RW_DIG_OE_H: number;
      REG_RW_DIG_OE_L: number;
      REG_RW_ADC_0_H: number;
      REG_RW_ADC_0_L: number;
      REG_RW_ADC_1_H: number;
      REG_RW_ADC_1_L: number;
      REG_RW_ADC_2_H: number;
      REG_RW_ADC_2_L: number;
      REG_RW_ADC_3_H: number;
      REG_RW_ADC_3_L: number;
      REG_RW_ADC_4_H: number;
      REG_RW_ADC_4_L: number;
      REG_RW_ADC_5_H: number;
      REG_RW_ADC_5_L: number;
      REG_RW_ADC_PE: number;
      REG_RW_MAG_X_H: number;
      REG_RW_MAG_X_L: number;
      REG_RW_MAG_Y_H: number;
      REG_RW_MAG_Y_L: number;
      REG_RW_MAG_Z_H: number;
      REG_RW_MAG_Z_L: number;
      REG_RW_ACCEL_X_H: number;
      REG_RW_ACCEL_X_L: number;
      REG_RW_ACCEL_Y_H: number;
      REG_RW_ACCEL_Y_L: number;
      REG_RW_ACCEL_Z_H: number;
      REG_RW_ACCEL_Z_L: number;
      REG_RW_GYRO_X_H: number;
      REG_RW_GYRO_X_L: number;
      REG_RW_GYRO_Y_H: number;
      REG_RW_GYRO_Y_L: number;
      REG_RW_GYRO_Z_H: number;
      REG_RW_GYRO_Z_L: number;
      REG_RW_MOT_0_B3: number;
      REG_RW_MOT_0_B2: number;
      REG_RW_MOT_0_B1: number;
      REG_RW_MOT_0_B0: number;
      REG_RW_MOT_1_B3: number;
      REG_Rw_MOT_1_B2: number;
      REG_Rw_MOT_1_B1: number;
      REG_RW_MOT_1_B0: number;
      REG_RW_MOT_2_B3: number;
      REG_RW_MOT_2_B2: number;
      REG_RW_MOT_2_B1: number;
      REG_RW_MOT_2_B0: number;
      REG_RW_MOT_3_B3: number;
      REG_RW_MOT_3_B2: number;
      REG_RW_MOT_3_B1: number;
      REG_RW_MOT_3_B0: number;
      REG_RW_MOT_MODES: number;
      REG_RW_MOT_DIRS: number;
      REG_RW_MOT_DONE: number;
      REG_RW_MOT_SRV_ALLSTOP: number;
      REG_RW_MOT_0_SP_H: number;
      REG_RW_MOT_0_SP_L: number;
      REG_RW_MOT_1_SP_H: number;
      REG_RW_MOT_1_SP_L: number;
      REG_RW_MOT_2_SP_H: number;
      REG_RW_MOT_2_SP_L: number;
      REG_RW_MOT_3_SP_H: number;
      REG_RW_MOT_3_SP_L: number;
      REG_RW_MOT_0_PWM_H: number;
      REG_RW_MOT_0_PWM_L: number;
      REG_RW_MOT_1_PWM_H: number;
      REG_RW_MOT_1_PWM_L: number;
      REG_RW_MOT_2_PWM_H: number;
      REG_RW_MOT_2_PWM_L: number;
      REG_RW_MOT_3_PWM_H: number;
      REG_RW_MOT_3_PWM_L: number;
      REG_RW_SERVO_0_H: number;
      REG_RW_SERVO_0_L: number;
      REG_RW_SERVO_1_H: number;
      REG_RW_SERVO_1_L: number;
      REG_RW_SERVO_2_H: number;
      REG_RW_SERVO_2_L: number;
      REG_RW_SERVO_3_H: number;
      REG_RW_SERVO_3_L: number;
      REG_RW_BATT_H: number;
      REG_RW_BATT_L: number;
      REG_RW_BUTTONS: number;
      REG_READABLE_COUNT: number;
      REG_W_PID_0_P_H: number;
      REG_W_PID_0_P_L: number;
      REG_W_PID_0_PD_H: number;
      REG_W_PID_0_PD_L: number;
      REG_W_PID_0_I_H: number;
      REG_W_PID_0_I_L: number;
      REG_W_PID_0_ID_H: number;
      REG_W_PID_0_ID_L: number;
      REG_W_PID_0_D_H: number;
      REG_W_PID_0_D_L: number;
      REG_W_PID_0_DD_H: number;
      REG_W_PID_0_DD_L: number;
      REG_W_PID_1_P_H: number;
      REG_W_PID_1_P_L: number;
      REG_W_PID_1_PD_H: number;
      REG_W_PID_1_PD_L: number;
      REG_W_PID_1_I_H: number;
      REG_W_PID_1_I_L: number;
      REG_W_PID_1_ID_H: number;
      REG_W_PID_1_ID_L: number;
      REG_W_PID_1_D_H: number;
      REG_W_PID_1_D_L: number;
      REG_W_PID_1_DD_H: number;
      REG_W_PID_1_DD_L: number;
      REG_W_PID_2_P_H: number;
      REG_W_PID_2_P_L: number;
      REG_W_PID_2_PD_H: number;
      REG_W_PID_2_PD_L: number;
      REG_W_PID_2_I_H: number;
      REG_W_PID_2_I_L: number;
      REG_W_PID_2_ID_H: number;
      REG_W_PID_2_ID_L: number;
      REG_W_PID_2_D_H: number;
      REG_W_PID_2_D_L: number;
      REG_W_PID_2_DD_H: number;
      REG_W_PID_2_DD_L: number;
      REG_W_PID_3_P_H: number;
      REG_W_PID_3_P_L: number;
      REG_W_PID_3_PD_H: number;
      REG_W_PID_3_PD_L: number;
      REG_W_PID_3_I_H: number;
      REG_W_PID_3_I_L: number;
      REG_W_PID_3_ID_H: number;
      REG_W_PID_3_ID_L: number;
      REG_W_PID_3_D_H: number;
      REG_W_PID_3_D_L: number;
      REG_W_PID_3_DD_H: number;
      REG_W_PID_3_DD_L: number;
      REG_W_MOT_0_GOAL_B3: number;
      REG_W_MOT_0_GOAL_B2: number;
      REG_W_MOT_0_GOAL_B1: number;
      REG_W_MOT_0_GOAL_B0: number;
      REG_W_MOT_1_GOAL_B3: number;
      REG_w_MOT_1_GOAL_B2: number;
      REG_w_MOT_1_GOAL_B1: number;
      REG_W_MOT_1_GOAL_B0: number;
      REG_W_MOT_2_GOAL_B3: number;
      REG_W_MOT_2_GOAL_B2: number;
      REG_W_MOT_2_GOAL_B1: number;
      REG_W_MOT_2_GOAL_B0: number;
      REG_W_MOT_3_GOAL_B3: number;
      REG_W_MOT_3_GOAL_B2: number;
      REG_W_MOT_3_GOAL_B1: number;
      REG_W_MOT_3_GOAL_B0: number;
      REG_ALL_COUNT: number;
  };
  export default _default;
  export const MotorControlMode: {
      readonly Inactive: 0;
      readonly Speed: 1;
      readonly Position: 2;
      readonly SpeedPosition: 3;
  };

}
declare module 'simulator/Settings' {
  export interface Settings {
      simulationSensorNoise: boolean;
      simulationRealisticSensors: boolean;
      editorAutoComplete: boolean;
  }
  export const DEFAULT_SETTINGS: Settings;

}
declare module 'simulator/SharedRegisters' {
  /**
   * Represents the register data that is shared between the main thread and the worker thread.
   * The data is stored in a SharedArrayBuffer and accessed using typed arrays and the appropriate
   * atomic operations from Atomics.
   *
   * The SharedArrayBuffer indexes and register address are not the same because the multi-byte
   * array views must be aligned properly. For example, 4 byte values must start at address 0, 4, 8, etc.
   * So there are some padding bytes throughout the register space to ensure alignment.
   *
   * Additionally, the typed arrays use the platform's endianness (typically little-endian) while
   * the multi-byte registers are stored in big-endian order. As a result, the indexes are also different
   * within a multi-byte value, so the individual bytes in multi-byte values shouldn't be accessed separately.
   */
  export default class SharedRegisters {
      private readonly registerSharedArrayBuffer_;
      private readonly registerArrayViewU8b_;
      private readonly registerArrayView8b_;
      private readonly registerArrayViewU16b_;
      private readonly registerArrayView16b_;
      private readonly registerArrayViewU32b_;
      private readonly registerArrayView32b_;
      constructor(registerSharedArrayBuffer?: SharedArrayBuffer);
      getSharedArrayBuffer(): SharedArrayBuffer;
      clone(): SharedRegisters;
      setRegister8b(registerAddress: number, value: number): void;
      setRegister16b(registerAddress: number, value: number): void;
      setRegister32b(registerAddress: number, value: number): void;
      incrementRegister32b(registerAddress: number, value: number): void;
      getRegisterValue8b: (registerAddress: number, signed?: boolean) => number;
      getRegisterValue16b: (registerAddress: number, signed?: boolean) => number;
      getRegisterValue32b: (registerAddress: number, signed?: boolean) => number;
      /**
       * Get the index in the SharedArrayBuffer that corresponds to the given address.
       * Accounts for the padding bytes.
       * @param address The address of the register.
       * @returns The index in the SharedArrayBuffer that corresponds to the given address.
       */
      private static getBufferIndexForRegisterAddress;
  }

}
declare module 'simulator/SharedRegistersRobot' {
  import AbstractRobot from 'simulator/AbstractRobot/index';
  import Motor from 'simulator/AbstractRobot/Motor';
  import Servo from 'simulator/AbstractRobot/Servo';
  import WriteCommand from 'simulator/AbstractRobot/WriteCommand';
  import SharedRegisters from 'simulator/SharedRegisters';
  class SharedRegistersRobot implements AbstractRobot {
      private sharedResisters_;
      private static readonly POSITION_GOAL_SCALING;
      constructor(sharedRegisters: SharedRegisters);
      private readonly getMotorDone_;
      private readonly getMotorPid_;
      getMotor(port: number): Motor;
      getDigitalValue(port: number): boolean;
      getAnalogValue(port: number): number;
      private servoRegisterToPosition_;
      private positionToServoRegister_;
      getServo(port: number): Servo;
      private readonly apply_;
      apply(writeCommands: WriteCommand[]): void;
      sync(stateless: AbstractRobot.Stateless): void;
  }
  export default SharedRegistersRobot;

}
declare module 'simulator/SharedRingBuffer' {
  interface SharedRingBuffer {
      get sharedArrayBuffer(): SharedArrayBuffer;
      push(value: number): boolean;
      pop(): number;
      popAll(): number[];
  }
  export default SharedRingBuffer;

}
declare module 'simulator/SharedRingBufferU32' {
  import SharedRingBuffer from 'simulator/SharedRingBuffer';
  class SharedRingBufferU32 implements SharedRingBuffer {
      private static readonly HEADER_SIZE;
      private static readonly BEGIN_INDEX;
      private static readonly END_INDEX;
      private sab_;
      get sharedArrayBuffer(): SharedArrayBuffer;
      private u32_;
      constructor(sab: SharedArrayBuffer);
      get maxLength(): number;
      static create(maxLength: number): SharedRingBufferU32;
      private get begin_();
      private set begin_(value);
      private get end_();
      private set end_(value);
      private at_;
      private setAt_;
      push(value: number): boolean;
      pop(): number;
      popAll(): number[];
  }
  export default SharedRingBufferU32;

}
declare module 'simulator/SharedRingBufferUtf32' {
  import SharedRingBuffer from 'simulator/SharedRingBuffer';
  import SharedRingBufferU32 from 'simulator/SharedRingBufferU32';
  class SharedRingBufferUtf32 implements SharedRingBuffer {
      private ringBufferU32_;
      constructor(ringBufferOrSharedArrayBuffer: SharedRingBufferU32 | SharedArrayBuffer);
      get sharedArrayBuffer(): SharedArrayBuffer;
      static create(maxLength: number): SharedRingBufferUtf32;
      get maxLength(): number;
      push(value: number): boolean;
      pushString(value: string): number;
      pushStringBlocking(value: string): void;
      pop(): number;
      popAll(): number[];
      popString(): string;
  }
  export default SharedRingBufferUtf32;

}
declare module 'simulator/WorkerInstance' {
  import Protocol from 'simulator/WorkerProtocol';
  import SharedRingBufferUtf32 from 'simulator/SharedRingBufferUtf32';
  import AbstractRobot from 'simulator/AbstractRobot/index';
  import WriteCommand from 'simulator/AbstractRobot/WriteCommand';
  class WorkerInstance implements AbstractRobot {
      onStopped: () => void;
      private sharedRegisters_;
      private sharedConsole_;
      private sharedRegistersRobot_;
      getMotor(port: number): import("simulator/AbstractRobot/Motor").default;
      getServo(port: number): import("simulator/AbstractRobot/Servo").default;
      getAnalogValue(port: number): number;
      getDigitalValue(port: number): boolean;
      apply(writeCommands: WriteCommand[]): void;
      sync(stateless: AbstractRobot.Stateless): void;
      get sharedConsole(): SharedRingBufferUtf32;
      private onStopped_;
      private onMessage;
      start(req: Omit<Protocol.Worker.StartRequest, 'type'>): void;
      stop(): void;
      constructor();
      private startWorker;
      private worker_;
  }
  const _default: WorkerInstance;
  export default _default;

}
declare module 'simulator/WorkerProtocol' {
  import ProgrammingLanguage from 'simulator/ProgrammingLanguage';
  export namespace Protocol {
      namespace Worker {
          interface StartRequest {
              type: 'start';
              language: ProgrammingLanguage;
              code: string;
          }
          type Request = (StartRequest | SetSharedRegistersRequest | SetSharedConsoleRequest | ProgramOutputRequest | ProgramErrorRequest | WorkerReadyRequest | StoppedRequest);
          interface StartResponse {
              type: 'start';
          }
          interface SetSharedRegistersRequest {
              type: 'set-shared-registers';
              sharedArrayBuffer: SharedArrayBuffer;
          }
          interface SetSharedConsoleRequest {
              type: 'set-shared-console';
              sharedArrayBuffer: SharedArrayBuffer;
          }
          interface ProgramEndedRequest {
              type: 'program-ended';
          }
          interface ProgramEndedResponse {
              type: 'program-ended';
          }
          type Response = StartResponse | ProgramEndedResponse;
          interface ProgramOutputRequest {
              type: 'program-output';
              stdoutput: string;
          }
          interface ProgramErrorRequest {
              type: 'program-error';
              stdoutput: string;
              stderror: string;
          }
          interface WorkerReadyRequest {
              type: 'worker-ready';
          }
          interface StoppedRequest {
              type: 'stopped';
          }
      }
  }
  export default Protocol;

}
declare module 'simulator/compile' {
  import ProgrammingLanguage from "simulator/ProgrammingLanguage";
  const _default: (code: string, language: ProgrammingLanguage) => Promise<CompileResult>;
  export default _default;
  export interface CompileResult {
      result?: string;
      stdout: string;
      stderr: string;
  }

}
declare module 'simulator/components/AboutDialog' {
  import * as React from 'react';
  import { StyleProps } from 'simulator/style';
  import { ThemeProps } from 'simulator/components/theme';
  export interface AboutDialogPublicProps extends ThemeProps, StyleProps {
      onClose: () => void;
  }
  const _default: React.ComponentType<AboutDialogPublicProps>;
  export default _default;

}
declare module 'simulator/components/ActionTooltip' {
  import * as React from 'react';
  import { StyledText } from 'simulator/util/index';
  import { ThemeProps } from 'simulator/components/theme';
  import Tooltip from 'simulator/components/Tooltip';
  export interface ActionTooltipProps extends ThemeProps {
      target: Tooltip.Target;
      items: StyledText[];
      onClose: () => void;
  }
  export type Props = ActionTooltipProps;
  export class ActionTooltip extends React.Component<Props> {
      render(): JSX.Element;
  }

}
declare module 'simulator/components/Animation' {
  export interface Animation {
      start: number;
      end: number;
  }

}
declare module 'simulator/components/BooleanPlot' {
  import * as React from 'react';
  import { StyleProps } from 'simulator/style';
  import { ThemeProps } from 'simulator/components/theme';
  export interface BooleanPlotProps extends ThemeProps, StyleProps {
      value: boolean;
      duration?: number;
      refreshRate?: number;
  }
  export namespace BooleanPlotProps {
      const DEFAULT_DURATION = 5;
      const DEFAULT_REFRESH_RATE = 10;
      const duration: (props: BooleanPlotProps) => number;
      const refreshRate: (props: BooleanPlotProps) => number;
  }
  interface Range<T> {
      start: number;
      end: number;
      value: T;
  }
  namespace Range {
      const instant: <T>(time: number, value: T) => Range<T>;
      const extend: <T>(ranges: Range<T>[], time: number, value: T) => Range<T>[];
  }
  interface BooleanPlotState {
      svgWidth: number;
      svgHeight: number;
      viewportWidth: number;
      viewportHeight: number;
      x: number;
      ranges: Range<boolean>[];
      ticks: number[];
  }
  type Props = BooleanPlotProps;
  type State = BooleanPlotState;
  class BooleanPlot extends React.PureComponent<Props, State> {
      constructor(props: Props);
      private onResize_;
      private observer_;
      private ref_;
      private bindRef_;
      componentDidMount(): void;
      componentWillUnmount(): void;
      private mounted_;
      private scheduleTick_;
      private firstTick_;
      private lastTick_;
      private tick_;
      private transformRange_;
      private slow_;
      render(): JSX.Element;
  }
  export default BooleanPlot;

}
declare module 'simulator/components/Button' {
  import { ThemeProps } from 'simulator/components/theme';
  import * as React from 'react';
  import { StyleProps } from 'simulator/style';
  export interface ButtonProps extends StyleProps, ThemeProps {
      children: React.ReactNode;
      onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
      disabled?: boolean;
  }
  interface ButtonState {
  }
  type Props = ButtonProps;
  type State = ButtonState;
  export class Button extends React.PureComponent<Props, State> {
      constructor(props: Props);
      render(): JSX.Element;
  }
  export default Button;

}
declare module 'simulator/components/Card' {
  import * as React from "react";
  import { StyleProps } from "simulator/style";
  import { ThemeProps } from "simulator/components/theme";
  export interface CardProps extends StyleProps, ThemeProps {
      title?: string;
      description?: string;
      link?: string;
      backgroundImage?: string;
      backgroundColor?: string;
      backgroundPosition?: string;
      backgroundSize?: string;
      hoverBackgroundSize?: string;
      selected?: boolean;
      onClick: (event: React.MouseEvent) => void;
  }
  interface CardState {
  }
  type Props = CardProps;
  type State = CardState;
  export class Card extends React.Component<Props, State> {
      constructor(props: Props);
      render(): JSX.Element;
  }
  export default Card;

}
declare module 'simulator/components/Charm' {
  import { ThemeProps } from 'simulator/components/theme';
  import * as React from 'react';
  import { StyleProps } from 'simulator/style';
  export interface CharmProps extends StyleProps, ThemeProps {
      children: React.ReactNode;
      onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  }
  interface CharmState {
  }
  type Props = CharmProps;
  type State = CharmState;
  class Charm extends React.PureComponent<Props, State> {
      constructor(props: Props);
      render(): JSX.Element;
  }
  export default Charm;

}
declare module 'simulator/components/ComboBox' {
  import * as React from "react";
  import { StyleProps } from "simulator/style";
  import { AnyText } from "simulator/util/index";
  import { ThemeProps } from "simulator/components/theme";
  class ComboBox extends React.PureComponent<ComboBox.Props, ComboBox.State> {
      constructor(props: ComboBox.Props);
      private onFocusChange_;
      set onFocusChange(f: (focus: boolean) => void);
      get onFocusChange(): (focus: boolean) => void;
      private onClick_;
      private onOptionClick_;
      private ref_;
      private bindRef_;
      private dropDownRef_;
      private bindDropDownRef_;
      private onComboBoxRootClick_;
      componentDidMount(): void;
      componentWillUnmount(): void;
      render(): JSX.Element;
  }
  namespace ComboBox {
      interface Option {
          text: AnyText;
          data?: unknown;
      }
      const option: (text: AnyText, data?: unknown) => Option;
      interface Props extends StyleProps, ThemeProps {
          options: Option[];
          minimal?: boolean;
          innerRef?: (ref: ComboBox) => void;
          widthTweak?: number;
          index: number;
          onSelect: (index: number, option: Option) => void;
      }
      interface State {
          focus: boolean;
      }
  }
  export default ComboBox;

}
declare module 'simulator/components/Console/ClearCharm' {
  import * as React from 'react';
  import { StyleProps } from 'simulator/style';
  import { ThemeProps } from 'simulator/components/theme';
  import LocalizedString from 'simulator/util/LocalizedString';
  export interface ClearCharmProps extends StyleProps, ThemeProps {
      onClick: (event: React.MouseEvent<HTMLDivElement>) => void;
      locale: LocalizedString.Language;
  }
  type Props = ClearCharmProps;
  class ClearCharm extends React.PureComponent<Props> {
      constructor(props: Props);
      render(): JSX.Element;
  }
  export default ClearCharm;

}
declare module 'simulator/components/Console/index' {
  import * as React from 'react';
  import { StyleProps } from 'simulator/style';
  import { StyledText } from 'simulator/util/index';
  import { Theme, ThemeProps } from 'simulator/components/theme';
  import { BarComponent } from 'simulator/components/Widget';
  import LocalizedString from 'simulator/util/LocalizedString';
  export const createConsoleBarComponents: (theme: Theme, onClearConsole: () => void, locale: LocalizedString.Language) => BarComponent<object>[];
  export interface ConsoleProps extends StyleProps, ThemeProps {
      text: StyledText;
  }
  interface ConsoleState {
  }
  type Props = ConsoleProps;
  type State = ConsoleState;
  export class Console extends React.PureComponent<Props, State> {
      constructor(props: Props);
      render(): JSX.Element;
  }
  export default Console;

}
declare module 'simulator/components/CreateProjectDialog' {
  import { ThemeProps } from 'simulator/components/theme';
  import { StyleProps } from 'simulator/style';
  import LocalizedString from 'simulator/util/LocalizedString';
  import * as React from 'react';
  import { Modal } from 'simulator/pages/Modal';
  import ProgrammingLanguage from 'simulator/ProgrammingLanguage';
  export interface CreateProjectDialogPublicProps extends ThemeProps, StyleProps {
      onClose: () => void;
      showRepeatUserDialog: boolean;
      userName: string;
      language: string;
      projectName: string;
      onChangeProjectName: (name: string) => void;
      onLanguageChange: (language: ProgrammingLanguage) => void;
      closeProjectDialog: (newProjName: string, newProjLanguage: ProgrammingLanguage) => void;
      onDocumentationSetLanguage: (language: 'c' | 'python') => void;
  }
  interface CreateProjectDialogPrivateProps {
      locale: LocalizedString.Language;
      onLocaleChange: (locale: LocalizedString.Language) => void;
      onUserCreation: (userName: string) => void;
  }
  interface CreateProjectDialogState {
      userName: string;
      modal: Modal;
      showRepeatUserDialog: boolean;
      language: string;
  }
  type Props = CreateProjectDialogPublicProps & CreateProjectDialogPrivateProps;
  type State = CreateProjectDialogState;
  export class CreateProjectDialog extends React.PureComponent<Props, State> {
      constructor(props: Props);
      componentDidMount(): void;
      private onSelect_;
      private onLanguageChange;
      onFinalize_: (values: {
          [id: string]: string;
      }) => Promise<void>;
      myComponent(props: CreateProjectDialogPublicProps): string;
      render(): JSX.Element;
  }
  const _default: React.ComponentType<CreateProjectDialogPublicProps>;
  export default _default;

}
declare module 'simulator/components/CreateUserDialog' {
  import { ThemeProps } from 'simulator/components/theme';
  import { StyleProps } from 'simulator/style';
  import LocalizedString from 'simulator/util/LocalizedString';
  import * as React from 'react';
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
  namespace Modal {
      enum Type {
          Settings = 0,
          CreateUser = 1,
          RepeatUser = 2,
          None = 3,
          OpenUser = 4
      }
      interface None {
          type: Type.None;
      }
      const NONE: None;
      interface Settings {
          type: Type.Settings;
      }
      const SETTINGS: Settings;
      interface CreateUser {
          type: Type.CreateUser;
      }
      const CREATEUSER: CreateUser;
      interface RepeatUser {
          type: Type.RepeatUser;
      }
      const REPEATUSER: RepeatUser;
  }
  export type Modal = (Modal.Settings | Modal.CreateUser | Modal.None | Modal.RepeatUser);
  export class CreateUserDialog extends React.PureComponent<Props, State> {
      constructor(props: Props);
      private onModalClick_;
      private onModalClose_;
      private closeRepeatUserDialog_;
      private onLocaleSelect_;
      onFinalize_: (values: {
          [id: string]: string;
      }) => Promise<void>;
      myComponent(props: CreateUserDialogPublicProps): string;
      render(): JSX.Element;
  }
  const _default: React.ComponentType<CreateUserDialogPublicProps>;
  export default _default;

}
declare module 'simulator/components/Database' {
  export const db: any;
  export const userDB: any;

}
declare module 'simulator/components/DatabaseService' {
  import ProgrammingLanguage from 'simulator/ProgrammingLanguage';
  interface DatabaseType {
      _id: string;
      title: string;
  }
  export interface ProjectType {
      project_id: string;
      language: string;
      include: IncludeType;
      description: string;
      src: SrcType;
      userData: UserDataType;
  }
  export interface IncludeType {
      includeFiles: IncludeData[];
  }
  export interface IncludeData {
      fileName: string;
      content: string;
  }
  export interface SrcType {
      srcFiles: SrcData[];
  }
  export interface SrcData {
      fileName: string;
      content: string;
  }
  export interface UserDataType {
      userDataFiles: UserData[];
  }
  export interface UserData {
      fileName: string;
      content: string;
  }
  export class DatabaseService {
      private name;
      private dataBase;
      constructor(name: string);
      addDatabase: (dataBase: DatabaseType) => Promise<void>;
      static getDatabase: (name: string) => Promise<void>;
      static getUserInfo: (name: string) => Promise<any>;
      static checkForUserDatabase: () => Promise<boolean>;
      static createUserDatabase: () => Promise<void>;
      static addUsertoDatabase: (name: string) => Promise<number>;
      static getProjectInfo: (userName: string, projectId: string) => Promise<any>;
      static getContentFromSrcFile: (userName: string, projectId: string, fileName: string) => Promise<any>;
      static getContentfromIncludeFile: (userName: string, projectId: string, fileName: string) => Promise<any>;
      static getContentFromUserDataFile: (userName: string, projectId: string, fileName: string) => Promise<any>;
      static addIncludeContent: (userName: string, projectId: string, fileName: string, content: string) => Promise<1 | -1>;
      static updateIncludeContent: (userName: string, projectId: string, fileName: string, newContent: string) => Promise<void>;
      static addSrcContent: (userName: string, projectId: string, fileName: string, content: string) => Promise<1 | -1>;
      static updateSrcContent: (userName: string, projectId: string, fileName: string, newContent: string) => Promise<void>;
      static updateUserDataContent: (userName: string, projectId: string, fileName: string, newContent: string) => Promise<void>;
      static addUserDataContent: (userName: string, projectId: string, fileName: string, content: string) => Promise<1 | -1>;
      static addProjectToUser: (userName: string, projectName: string, language: ProgrammingLanguage) => Promise<1 | -1>;
      static getAllProjectsFromUser: (userName: string) => Promise<any>;
      static getSrcFileNameFromProject: (userName: string, projectId: string) => Promise<any>;
      static getAllUsers: () => Promise<any[]>;
  }
  export default DatabaseService;

}
declare module 'simulator/components/DeleteDialog' {
  import * as React from 'react';
  import { StyleProps } from 'simulator/style';
  import { ThemeProps } from 'simulator/components/theme';
  import LocalizedString from 'simulator/util/LocalizedString';
  export interface DeleteDialogPublicProps extends ThemeProps, StyleProps {
      name: LocalizedString;
      onClose: () => void;
      onAccept: () => void;
  }
  const _default: React.ComponentType<DeleteDialogPublicProps>;
  export default _default;

}
declare module 'simulator/components/Dialog' {
  import * as React from 'react';
  import { StyleProps } from 'simulator/style';
  import { ThemeProps } from 'simulator/components/theme';
  export interface DialogProps extends ThemeProps, StyleProps {
      name: string;
      children: React.ReactNode;
      onClose: () => void;
  }
  export const Dialog: import("styletron-react").StyletronComponent<Pick<DialogProps, keyof DialogProps>>;

}
declare module 'simulator/components/DialogBar' {
  import * as React from "react";
  import { ThemeProps } from "simulator/components/theme";
  export interface DialogBarProps extends ThemeProps {
      onAccept: () => void;
  }
  type Props = DialogBarProps;
  class DialogBar extends React.PureComponent<Props> {
      render(): JSX.Element;
  }
  export default DialogBar;

}
declare module 'simulator/components/DropdownList' {
  import * as React from 'react';
  import { StyleProps } from 'simulator/style';
  import { ThemeProps } from 'simulator/components/theme';
  export interface DropdownListProps extends ThemeProps, StyleProps {
      value: string;
      options: OptionDefinition[];
      onValueChange: (value: string) => void;
  }
  export interface OptionDefinition {
      displayName: string;
      value: string;
  }
  export class DropdownList extends React.PureComponent<DropdownListProps> {
      private onValueChange_;
      render(): JSX.Element;
  }

}
declare module 'simulator/components/Editor/Editor' {
  import * as React from 'react';
  import { StyleProps } from 'simulator/style';
  import { Theme, ThemeProps } from 'simulator/components/theme';
  import { BarComponent } from 'simulator/components/Widget';
  import { Ivygate, Message } from 'ivygate';
  import ProgrammingLanguage from 'simulator/ProgrammingLanguage';
  import Dict from 'simulator/Dict';
  import LocalizedString from 'simulator/util/LocalizedString';
  export enum EditorActionState {
      None = 0,
      Compiling = 1,
      Running = 2
  }
  export interface EditorPublicProps extends StyleProps, ThemeProps {
      language: ProgrammingLanguage;
      code: string;
      onCodeChange: (code: string) => void;
      onSaveCode: () => void;
      messages?: Message[];
      autocomplete: boolean;
      isleftbaropen: boolean;
      onDocumentationGoToFuzzy?: (query: string, language: 'c' | 'python' | 'plaintext') => void;
  }
  interface EditorState {
      isleftbaropen: boolean;
  }
  type Props = EditorPublicProps;
  type State = EditorState;
  export namespace EditorBarTarget {
      enum Type {
          Robot = 0,
          Script = 1
      }
      interface Robot {
          type: Type.Robot;
          messages: Message[];
          language: ProgrammingLanguage;
          isleftbaropen_: boolean;
          projectName: string;
          fileName: string;
          userName: string;
          onLanguageChange: (language: ProgrammingLanguage) => void;
          onIndentCode: () => void;
          onSaveCode: () => void;
          onRunClick: () => void;
          onCompileClick: () => void;
          onDownloadCode: () => void;
          onErrorClick: (event: React.MouseEvent<HTMLDivElement>) => void;
      }
  }
  export type EditorBarTarget = EditorBarTarget.Robot;
  export const createNavigationNamesBar: (theme: Theme, onClearConsole: () => void, locale: LocalizedString.Language) => BarComponent<object>[];
  export const createEditorBarComponents: ({ theme, target, locale, }: {
      theme: Theme;
      target: EditorBarTarget;
      locale: LocalizedString.Language;
  }) => BarComponent<object>[];
  export const IVYGATE_LANGUAGE_MAPPING: Dict<string>;
  class Editor extends React.PureComponent<Props, State> {
      constructor(props: Props);
      componentDidMount(): void;
      componentDidUpdate(prevProps: Props): Promise<void>;
      private openDocumentation_;
      private openDocumentationAction_?;
      private setupCodeEditor_;
      private disposeCodeEditor_;
      private ivygate_;
      private bindIvygate_;
      get ivygate(): Ivygate;
      render(): JSX.Element;
  }
  export default Editor;

}
declare module 'simulator/components/Editor/ErrorCharm' {
  import * as React from 'react';
  import { StyleProps } from 'simulator/style';
  import { ThemeProps } from 'simulator/components/theme';
  import LocalizedString from 'simulator/util/LocalizedString';
  export interface ErrorCharmProps extends StyleProps, ThemeProps {
      count: number;
      onClick: (event: React.MouseEvent<HTMLDivElement>) => void;
      locale: LocalizedString.Language;
  }
  type Props = ErrorCharmProps;
  class ErrorCharm extends React.PureComponent<Props> {
      constructor(props: Props);
      render(): JSX.Element;
  }
  export default ErrorCharm;

}
declare module 'simulator/components/Editor/LanguageSelectCharm' {
  import * as React from 'react';
  import { StyleProps } from 'simulator/style';
  import { ThemeProps } from 'simulator/components/theme';
  import ProgrammingLanguage from 'simulator/ProgrammingLanguage';
  export interface LanguageSelectCharmProps extends StyleProps, ThemeProps {
      language: ProgrammingLanguage;
      onLanguageChange: (language: ProgrammingLanguage) => void;
  }
  type Props = LanguageSelectCharmProps;
  class LanguageSelectCharm extends React.PureComponent<Props> {
      constructor(props: Props);
      private onSelect_;
      render(): JSX.Element;
  }
  export default LanguageSelectCharm;

}
declare module 'simulator/components/Editor/PerfectCharm' {
  import * as React from 'react';
  import { StyleProps } from 'simulator/style';
  import { ThemeProps } from 'simulator/components/theme';
  export interface PerfectCharmProps extends StyleProps, ThemeProps {
  }
  type Props = PerfectCharmProps;
  class PerfectCharm extends React.PureComponent<Props> {
      constructor(props: Props);
      render(): JSX.Element;
  }
  export default PerfectCharm;

}
declare module 'simulator/components/Editor/WarningCharm' {
  import * as React from 'react';
  import { StyleProps } from 'simulator/style';
  import { ThemeProps } from 'simulator/components/theme';
  import LocalizedString from 'simulator/util/LocalizedString';
  export interface WarningCharmProps extends StyleProps, ThemeProps {
      count: number;
      onClick: (event: React.MouseEvent<HTMLDivElement>) => void;
      locale: LocalizedString.Language;
  }
  type Props = WarningCharmProps;
  class WarningCharm extends React.PureComponent<Props> {
      constructor(props: Props);
      render(): JSX.Element;
  }
  export default WarningCharm;

}
declare module 'simulator/components/Editor/index' {
  export * from 'simulator/components/Editor/Editor';
  export { default as Editor } from 'simulator/components/Editor/Editor';
  export * from 'simulator/components/Editor/ErrorCharm';
  export { default as ErrorCharm } from 'simulator/components/Editor/ErrorCharm';
  export * from 'simulator/components/Editor/WarningCharm';
  export { default as WarningCharm } from 'simulator/components/Editor/WarningCharm';
  export * from 'simulator/components/Editor/PerfectCharm';
  export { default as PerfectCharm } from 'simulator/components/Editor/PerfectCharm';

}
declare module 'simulator/components/EditorPage' {
  import * as React from 'react';
  import { LayoutProps } from 'simulator/components/Layout/Layout';
  import { Size } from 'simulator/components/Widget';
  import Dict from 'simulator/Dict';
  import { StyledText } from 'simulator/util/index';
  import LocalizedString from 'simulator/util/LocalizedString';
  import ProgrammingLanguage from 'simulator/ProgrammingLanguage';
  import { Modal } from 'simulator/pages/Modal';
  export interface EditorPageProps extends LayoutProps {
      language: ProgrammingLanguage;
      projectName: string;
      fileName: string;
      userName: string;
      code: Dict<string>;
      isleftbaropen: boolean;
      onCodeChange: (code: string) => void;
      onRunClick: () => void;
      onCompileClick: () => void;
      onSaveCode: () => void;
      onDocumentationSetLanguage: (language: 'c' | 'python') => void;
      onFileNameChange: (newFileName: string) => void;
      onClearConsole: () => void;
      editorConsole: StyledText;
  }
  interface ReduxEditorPageProps {
      locale: LocalizedString.Language;
  }
  interface EditorPageState {
      activePanel: number;
      sidePanelSize: Size.Type;
      language: ProgrammingLanguage;
      code: Dict<string>;
      workingScriptCode?: string;
      editorConsole: StyledText;
      modal: Modal;
      fileName: string;
      resetCodeAccept: boolean;
  }
  type Props = EditorPageProps;
  type State = EditorPageState;
  export class EditorPage extends React.PureComponent<Props & ReduxEditorPageProps, State> {
      private editorRef;
      constructor(props: Props & ReduxEditorPageProps);
      componentDidUpdate(prevProps: Props, prevState: State): Promise<void>;
      componentDidMount(): Promise<void>;
      private onErrorClick_;
      private onActiveLanguageChange_;
      private onIndentCode_;
      private onDownloadClick_;
      render(): JSX.Element;
  }
  const _default: React.ComponentType<EditorPageProps>;
  export default _default;

}
declare module 'simulator/components/ExceptionDialog' {
  import * as React from "react";
  import { ThemeProps } from "simulator/components/theme";
  export interface ExceptionDialogProps extends ThemeProps {
      error: Error;
      info?: React.ErrorInfo;
      onClose: () => void;
  }
  type Props = ExceptionDialogProps;
  class ExceptionDialog extends React.PureComponent<Props> {
      render(): JSX.Element;
  }
  export default ExceptionDialog;

}
declare module 'simulator/components/ExtraMenu' {
  import * as React from 'react';
  import { StyleProps } from 'simulator/style';
  import { ThemeProps } from 'simulator/components/theme';
  export interface ExtraMenuPublicProps extends StyleProps, ThemeProps {
      onDocumentationClick: (event: React.MouseEvent) => void;
      onAboutClick: (event: React.MouseEvent) => void;
  }
  const _default: React.ComponentType<ExtraMenuPublicProps>;
  export default _default;

}
declare module 'simulator/components/Fa' {
  import { IconProp } from '@fortawesome/fontawesome-svg-core';
  import * as React from 'react';
  import { StyleProps } from 'simulator/style';
  export interface FaProps extends StyleProps {
      icon: IconProp;
      onClick?: (event: React.MouseEvent<SVGSVGElement>) => void;
      onMouseEnter?: (event: React.MouseEvent<SVGSVGElement>) => void;
      onMouseLeave?: (event: React.MouseEvent<SVGSVGElement>) => void;
      disabled?: boolean;
  }
  type Props = FaProps;
  export class Fa extends React.PureComponent<Props> {
      render(): JSX.Element;
  }
  export {};

}
declare module 'simulator/components/FancyBackground' {
  import * as React from 'react';
  import { StyleProps } from 'simulator/style';
  import { ThemeProps } from 'simulator/components/theme';
  export interface FancyBackgroundProps extends StyleProps, ThemeProps {
  }
  interface FancyBackgroundState {
  }
  type Props = FancyBackgroundProps;
  type State = FancyBackgroundState;
  class FancyBackground extends React.PureComponent<Props, State> {
      constructor(props: Props);
      private containerRef_;
      private bindContainerRef_;
      private canvasRef_;
      private bindCanvasRef_;
      private values_;
      componentDidMount(): void;
      componentWillUnmount(): void;
      private ticking_;
      private lastTick_;
      private tick_;
      render(): JSX.Element;
  }
  export default FancyBackground;

}
declare module 'simulator/components/Feedback/FeedbackInputs' {
  /// <reference types="react" />
  import { ThemeProps } from "simulator/components/theme";
  const FeedbackTextArea: import("styletron-react").StyletronComponent<Pick<import("react").DetailedHTMLProps<import("react").TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>, keyof import("react").ClassAttributes<HTMLTextAreaElement> | keyof import("react").TextareaHTMLAttributes<HTMLTextAreaElement>> & ThemeProps>;
  const FeedbackText: import("styletron-react").StyletronComponent<Pick<import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>, keyof import("react").ClassAttributes<HTMLSpanElement> | keyof import("react").HTMLAttributes<HTMLSpanElement>>>;
  const FeedbackLabel: import("styletron-react").StyletronComponent<Pick<import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>, keyof import("react").ClassAttributes<HTMLSpanElement> | keyof import("react").HTMLAttributes<HTMLSpanElement>>>;
  const FeedbackEmailInput: import("styletron-react").StyletronComponent<Pick<import("react").DetailedHTMLProps<import("react").InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, keyof import("react").ClassAttributes<HTMLInputElement> | keyof import("react").InputHTMLAttributes<HTMLInputElement>> & ThemeProps>;
  export { FeedbackTextArea, FeedbackText, FeedbackLabel, FeedbackEmailInput };

}
declare module 'simulator/components/Feedback/FeedbackTextArea' {
  /// <reference types="react" />
  import { ThemeProps } from "simulator/components/theme";
  const _default: import("styletron-react").StyletronComponent<Pick<import("react").DetailedHTMLProps<import("react").TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>, keyof import("react").ClassAttributes<HTMLTextAreaElement> | keyof import("react").TextareaHTMLAttributes<HTMLTextAreaElement>> & ThemeProps>;
  export default _default;

}
declare module 'simulator/components/Feedback/SendFeedback' {
  import { RootState } from 'simulator/components/Root';
  export interface FeedbackResponse {
      message: string;
      networkError: boolean;
  }
  export const sendFeedback: (rootState: RootState) => Promise<FeedbackResponse>;

}
declare module 'simulator/components/Feedback/SentimentCharm' {
  import * as React from 'react';
  import { StyleProps } from 'simulator/style';
  import { ThemeProps } from 'simulator/components/theme';
  import { IconProp } from '@fortawesome/fontawesome-svg-core';
  export interface SentimentCharmProps extends StyleProps, ThemeProps {
      icon: IconProp;
      selected: boolean;
      onClick: (event: React.MouseEvent<HTMLDivElement>) => void;
  }
  type Props = SentimentCharmProps;
  class SentimentCharm extends React.PureComponent<Props> {
      constructor(props: Props);
      render(): JSX.Element;
  }
  export default SentimentCharm;

}
declare module 'simulator/components/Feedback/SuccessModal' {
  import * as React from 'react';
  import { StyleProps } from 'simulator/style';
  import { ThemeProps } from 'simulator/components/theme';
  export interface FeedbackSuccessDialogPublicProps extends ThemeProps, StyleProps {
      onClose: () => void;
  }
  const _default: React.ComponentType<FeedbackSuccessDialogPublicProps>;
  export default _default;

}
declare module 'simulator/components/Feedback/index' {
  import * as React from 'react';
  import { Feedback } from 'simulator/Feedback';
  import { StyleProps } from 'simulator/style';
  import { ThemeProps } from 'simulator/components/theme';
  export interface FeedbackDialogPublicProps extends ThemeProps, StyleProps {
      onClose: () => void;
      onSubmit: () => void;
      feedback: Feedback;
      onFeedbackChange: (settings: Partial<Feedback>) => void;
  }
  export const FeedbackContainer: import("styletron-react").StyletronComponent<Pick<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, keyof React.ClassAttributes<HTMLDivElement> | keyof React.HTMLAttributes<HTMLDivElement>> & ThemeProps>;
  export const CenterContainer: import("styletron-react").StyletronComponent<Pick<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, keyof React.ClassAttributes<HTMLDivElement> | keyof React.HTMLAttributes<HTMLDivElement>> & ThemeProps>;
  export const FeedbackRowContainer: import("styletron-react").StyletronComponent<Pick<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, keyof React.ClassAttributes<HTMLDivElement> | keyof React.HTMLAttributes<HTMLDivElement>> & ThemeProps>;
  export const FeedbackLink: import("styletron-react").StyletronComponent<Pick<React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>, keyof React.ClassAttributes<HTMLAnchorElement> | keyof React.AnchorHTMLAttributes<HTMLAnchorElement>> & object>;
  const _default: React.ComponentType<FeedbackDialogPublicProps>;
  export default _default;

}
declare module 'simulator/components/Field' {
  import * as React from 'react';
  import { StyleProps } from 'simulator/style';
  import { ThemeProps } from 'simulator/components/theme';
  export interface FieldProps extends ThemeProps, StyleProps {
      name: string;
      children: React.ReactNode;
      long?: boolean;
      multiline?: boolean;
  }
  type Props = FieldProps;
  export class Field extends React.PureComponent<Props> {
      constructor(props: Props);
      render(): JSX.Element;
  }
  export default Field;

}
declare module 'simulator/components/FileExplorer' {
  import * as React from 'react';
  import { ThemeProps } from 'simulator/components/theme';
  import { StyleProps } from 'simulator/style';
  import LocalizedString from 'simulator/util/LocalizedString';
  import ProgrammingLanguage from 'simulator/ProgrammingLanguage';
  type UsersSection = string;
  export interface FileExplorerProps extends ThemeProps, StyleProps {
      onProjectSelected?: (userName: string, projectName: string, fileName: string, activeLanguage: ProgrammingLanguage, fileType: string) => void;
      onFileSelected?: (userName: string, projectName: string, fileName: string, activeLanguage: ProgrammingLanguage, fileType: string) => void;
      onUserSelected?: (userName: string) => void;
      onAddNewProject?: (userName: string) => void;
      onAddNewFile?: (userName: string, activeLanguage: ProgrammingLanguage, fileType: string) => void;
      propsSelectedProjectName?: string;
      propFileName?: string;
      propProjectName?: string;
      propActiveLanguage?: ProgrammingLanguage;
      propUserName?: string;
      addProjectFlag?: boolean;
      addFileFlag?: boolean;
  }
  interface FileExplorerReduxSideLayoutProps {
      locale: LocalizedString.Language;
  }
  interface FileExplorerPrivateProps {
      locale: LocalizedString.Language;
  }
  interface FileExplorerState {
      includeFiles: [];
      srcFiles: [];
      userDataFiles: [];
      userName: string;
      users: string[];
      selectedSection: UsersSection;
      selectedProject: string;
      projects: [] | null;
      error: string | null;
      projectName: string;
      fileType: string;
      activeLanguage: ProgrammingLanguage;
      showProjectFiles: boolean;
      currentUserSelected: boolean;
  }
  type Props = FileExplorerProps & FileExplorerPrivateProps;
  type State = FileExplorerState;
  export class FileExplorer extends React.PureComponent<Props & FileExplorerReduxSideLayoutProps, State> {
      constructor(props: Props & FileExplorerReduxSideLayoutProps);
      componentDidMount(): Promise<void>;
      componentDidUpdate(prevProps: Props, prevState: State): Promise<void>;
      private handleProjectClick;
      private handleFileClick;
      private addNewProject;
      private addNewFile;
      private loadUsers;
      private loadProjects;
      private setSelectedSection;
      private getProjects;
      renderSrcFiles(): JSX.Element;
      renderIncludeFiles(): JSX.Element;
      renderUserDataFiles(): JSX.Element;
      renderProjects: (selectedSection: UsersSection | null) => JSX.Element;
      render(): JSX.Element;
  }
  export const FileExplorerSideLayoutRedux: React.ComponentType<FileExplorerProps>;
  export {};

}
declare module 'simulator/components/Form' {
  import { IconProp } from '@fortawesome/fontawesome-svg-core';
  import * as React from 'react';
  import { StyleProps } from 'simulator/style';
  import { Validators } from 'simulator/util/Validator';
  import { ThemeProps } from 'simulator/components/theme';
  class Form extends React.PureComponent<Form.Props, Form.State> {
      constructor(props: Form.Props);
      private onValueChange_;
      private onFinalizeClick_;
      private isFinalizeAllowed_;
      render(): JSX.Element;
  }
  namespace Form {
      interface Props extends StyleProps, ThemeProps {
          onFinalize: (values: {
              [id: string]: any;
          }) => void;
          finalizeText?: string;
          finalizeIcon?: IconProp;
          finalizeDisabled?: boolean;
          items: Item[];
          verifiers?: Item[];
      }
      interface State {
          values: {
              [id: string]: State.Value;
          };
      }
      namespace State {
          interface Value {
              text: string;
          }
      }
      interface Item<F = any> {
          id: string;
          text: string;
          valueHidden?: boolean;
          tooltip?: string;
          defaultValue?: string;
          assistText?: string;
          assist?: () => void;
          validator?: (value: string) => boolean;
          validType?: Validators.Types;
          finalizer?: (value: string) => F;
      }
      const IDENTITY_FINALIZER: (value: string) => string;
      const EMAIL_VALIDATOR: (value: string) => boolean;
      const PASSWORD_VALIDATOR: (value: string) => boolean;
      const NON_EMPTY_VALIDATOR: (value: string) => boolean;
      const email: (id: string, text: string, tooltip?: string, assist?: () => void, assistText?: string) => Item<string>;
      const password: (id: string, text: string, tooltip?: string, assist?: () => void, assistText?: string, shouldValidate?: boolean) => Item<string>;
      const verifier: (id: string, text: string, validType: Validators.Types, tooltip?: string) => Item<string>;
      const username: (id: string, text: string) => Item<string>;
      const fileName: (id: string, text: string) => Item<string>;
      const projectName: (id: string, text: string) => Item<string>;
  }
  export default Form;

}
declare module 'simulator/components/HTree' {
  import * as React from 'react';
  import Dict from 'simulator/Dict';
  import { StyleProps } from 'simulator/style';
  export interface HTreeNode<P = any> {
      component: React.ComponentType<P>;
      props: P;
  }
  export interface HTreeProps extends StyleProps {
      parent: HTreeNode;
      children: Dict<HTreeNode>;
      childrenOrdering: string[];
      onParentClick?: (event: React.MouseEvent) => void;
      onChildRemoveClick?: (id: string, event: React.MouseEvent) => void;
      onChildAddClick?: (id: string, event: React.MouseEvent) => void;
      onChildSettingsClick?: (id: string, event: React.MouseEvent) => void;
      decorationColor?: string;
  }
  type Props = HTreeProps;
  const HTree: React.FC<Props>;
  export default HTree;

}
declare module 'simulator/components/HomeNavigation' {
  import * as React from 'react';
  import { ThemeProps } from 'simulator/components/theme';
  import { StyleProps } from 'simulator/style';
  import { RouteComponentProps } from 'react-router';
  export interface HomeNavigationPublicProps extends RouteComponentProps, ThemeProps, StyleProps {
  }
  const _default: React.ComponentType<HomeNavigationPublicProps>;
  export default _default;

}
declare module 'simulator/components/HomeStartOptions' {
  import { StyleProps } from 'simulator/style';
  import { ThemeProps } from 'simulator/components/theme';
  import React from 'react';
  import LocalizedString from 'simulator/util/LocalizedString';
  import { Settings } from 'simulator/Settings';
  import ProgrammingLanguage from 'ProgrammingLanguage';
  import { Modal } from 'simulator/pages/Modal';
  export interface HomeStartOptionsPublicProps extends StyleProps, ThemeProps {
      onClearConsole: () => void;
      activeLanguage: ProgrammingLanguage;
      onEditorPageOpen: () => void;
      onChangeProjectName: (projectName: string) => void;
      onCreateProjectDialog: (name: string) => void;
      onOpenUserProject: (name: string, projectName: string, fileName: string, projectLanguage: string) => void;
  }
  interface HomeStartOptionsPrivateProps {
      locale: LocalizedString.Language;
  }
  interface HomeStartOptionsState {
      modal: Modal;
      language: ProgrammingLanguage;
      settings: Settings;
  }
  type Props = HomeStartOptionsPublicProps & HomeStartOptionsPrivateProps;
  type State = HomeStartOptionsState;
  export class HomeStartOptions extends React.Component<Props, State> {
      static username: string;
      constructor(props: Props);
      handleNewFileClick: () => void;
      private onSettingsChange_;
      private onModalClick_;
      private onModalClose_;
      private handleDatabaseClick_;
      private onCreateProject;
      render(): JSX.Element;
  }
  export {};

}
declare module 'simulator/components/IFrame' {
  import * as React from 'react';
  import { ThemeProps } from 'simulator/components/theme';
  import { StyleProps } from 'simulator/style';
  export interface IFrameProps extends StyleProps, ThemeProps {
      src: string;
  }
  interface IFrameState {
      loaded: boolean;
      width: number;
      height: number;
  }
  type Props = IFrameProps;
  type State = IFrameState;
  export class IFrame extends React.Component<Props, State> {
      private iframe;
      private container;
      private resizeListener;
      constructor(props: Props);
      componentDidMount(): void;
      componentWillUnmount(): void;
      render(): JSX.Element;
  }
  export default IFrame;

}
declare module 'simulator/components/Input' {
  /// <reference types="react" />
  import { ThemeProps } from "simulator/components/theme";
  const _default: import("styletron-react").StyletronComponent<Pick<import("react").DetailedHTMLProps<import("react").InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, keyof import("react").ClassAttributes<HTMLInputElement> | keyof import("react").InputHTMLAttributes<HTMLInputElement>> & ThemeProps>;
  export default _default;

}
declare module 'simulator/components/Layout/Layout' {
  /// <reference types="react" />
  import { Message } from "ivygate";
  import ProgrammingLanguage from 'simulator/ProgrammingLanguage';
  import { Settings } from "simulator/Settings";
  import { StyleProps } from "simulator/style";
  import { StyledText } from "simulator/util/index";
  import { Editor } from "simulator/components/Editor/index";
  import { ThemeProps } from "simulator/components/theme";
  export namespace LayoutEditorTarget {
      enum Type {
          Robot = "robot"
      }
      interface Robot {
          type: Type.Robot;
          language: ProgrammingLanguage;
          onLanguageChange: (language: ProgrammingLanguage) => void;
          code: string;
          onCodeChange: (code: string) => void;
      }
  }
  export type LayoutEditorTarget = LayoutEditorTarget.Robot;
  export interface LayoutProps extends StyleProps, ThemeProps {
      editorTarget: LayoutEditorTarget;
      editorConsole: StyledText;
      messages: Message[];
      settings: Settings;
      onClearConsole: () => void;
      onIndentCode: () => void;
      onDownloadCode: () => void;
      editorRef: React.MutableRefObject<Editor>;
      onDocumentationGoToFuzzy?: (query: string, language: 'c' | 'python') => void;
  }
  export enum Layout {
      Overlay = 0,
      Side = 1,
      Bottom = 2
  }

}
declare module 'simulator/components/Layout/LayoutPicker' {
  import * as React from 'react';
  import { StyleProps } from 'simulator/style';
  import { Layout } from 'simulator/components/Layout/Layout';
  import { ThemeProps } from 'simulator/components/theme';
  export interface LayoutPickerPublicProps extends StyleProps, ThemeProps {
      layout: Layout;
      onLayoutChange: (layout: Layout) => void;
      onShowAll: () => void;
      onHideAll: () => void;
  }
  const _default: React.ComponentType<LayoutPickerPublicProps>;
  export default _default;

}
declare module 'simulator/components/Layout/index' {
  export { Layout, LayoutProps } from 'simulator/components/Layout/Layout';
  export * from 'simulator/components/Layout/LayoutPicker';
  export { default as LayoutPicker } from 'simulator/components/Layout/LayoutPicker';

}
declare module 'simulator/components/LeftBar' {
  import * as React from 'react';
  import { StyleProps } from 'simulator/style';
  import { ThemeProps } from 'simulator/components/theme';
  import { Settings } from 'simulator/Settings';
  import { Modal } from 'simulator/pages/Modal';
  import LocalizedString from 'simulator/util/LocalizedString';
  import { Size } from 'simulator/components/Widget';
  export interface LeftBarPublicProps extends StyleProps, ThemeProps {
      onToggle: () => void;
  }
  interface LeftBarPrivateProps {
      locale: LocalizedString.Language;
  }
  interface LeftBarState {
      modal: Modal;
      settings: Settings;
      activePanel: number;
      sidePanelSize: Size.Type;
  }
  type Props = LeftBarPublicProps & LeftBarPrivateProps;
  type State = LeftBarState;
  export class LeftBar extends React.Component<Props, State> {
      constructor(props: Props);
      private onSettingsChange_;
      private onModalClick_;
      private onModalClose_;
      render(): JSX.Element;
  }
  const _default: React.ComponentType<LeftBarPublicProps>;
  export default _default;

}
declare module 'simulator/components/Loading' {
  import * as React from 'react';
  import { LoadingType } from 'react-loading';
  export interface LoadingPublicProps {
      message?: string;
      errorMessage?: string;
      color?: string;
      width?: number | string;
      height?: number;
      type?: LoadingType;
  }
  const _default: React.ComponentType<LoadingPublicProps>;
  export default _default;

}
declare module 'simulator/components/MainMenu' {
  import * as React from 'react';
  import { StyleProps } from 'simulator/style';
  import { ThemeProps } from 'simulator/components/theme';
  import LocalizedString from 'simulator/util/LocalizedString';
  export interface MenuPublicProps extends StyleProps, ThemeProps {
  }
  interface MenuPrivateProps {
      locale: LocalizedString.Language;
  }
  interface MenuState {
  }
  type Props = MenuPublicProps & MenuPrivateProps;
  type State = MenuState;
  export class MainMenu extends React.Component<Props, State> {
      constructor(props: Props);
      private onDocumentationClick_;
      private onModalClick_;
      private onDashboardClick_;
      render(): JSX.Element;
  }
  const _default: React.ComponentType<MenuPublicProps>;
  export default _default;

}
declare module 'simulator/components/Modal' {
  import * as React from 'react';
  export interface ModalProps {
      children: React.ReactNode;
  }
  type Props = ModalProps;
  export class Modal extends React.PureComponent<Props> {
      static get active(): boolean;
      constructor(props?: Props);
      componentDidMount(): void;
      componentWillUnmount(): void;
      static isVisible: () => boolean;
      render(): React.ReactPortal;
  }
  export {};

}
declare module 'simulator/components/MotorsSwappedDialog' {
  import { StyleProps } from "simulator/style";
  import { Theme } from "simulator/components/theme";
  export interface MotorsSwappedDialogProps extends StyleProps {
      theme: Theme;
      onClose: () => void;
  }
  const _default: ({ style, className, theme, onClose }: MotorsSwappedDialogProps) => JSX.Element;
  export default _default;

}
declare module 'simulator/components/NewFileDialog' {
  import { ThemeProps } from 'simulator/components/theme';
  import { StyleProps } from 'simulator/style';
  import LocalizedString from 'simulator/util/LocalizedString';
  import * as React from 'react';
  import ProgrammingLanguage from 'ProgrammingLanguage';
  import { Settings } from 'simulator/Settings';
  import { Modal } from 'simulator/pages/Modal';
  export interface NewFileDialogPublicProps extends ThemeProps, StyleProps {
      showRepeatUserDialog: boolean;
      fileName: string;
      language: ProgrammingLanguage;
      otherFileType?: string;
      onClose: () => void;
      onEditorPageOpen: () => void;
      onCloseNewFileDialog: (newFileName: string, fileType: string) => void;
  }
  export enum Type {
      Robot = "robot"
  }
  export interface Robot {
      type: Type.Robot;
      language: ProgrammingLanguage;
      onLanguageChange: (language: ProgrammingLanguage) => void;
      code: string;
      onCodeChange: (code: string) => void;
  }
  interface NewFileDialogPrivateProps {
      locale: LocalizedString.Language;
      onLocaleChange: (locale: LocalizedString.Language) => void;
      onUserCreation: (fileName: string) => void;
  }
  interface NewFileDialogState {
      fileName: string;
      modal: Modal;
      settings: Settings;
      showRepeatUserDialog: boolean;
      showEditorPage: boolean;
      language: ProgrammingLanguage;
  }
  type Props = NewFileDialogPublicProps & NewFileDialogPrivateProps;
  type State = NewFileDialogState;
  export class NewFileDialog extends React.PureComponent<Props, State> {
      private editorRef;
      constructor(props: Props);
      private onModalClick_;
      private onModalClose_;
      private closeRepeatUserDialog_;
      myComponent(props: NewFileDialogPublicProps): string;
      componentDidMount(): void;
      private onFinalize_;
      render(): JSX.Element;
  }
  const _default: React.ComponentType<NewFileDialogPublicProps>;
  export default _default;

}
declare module 'simulator/components/OpenUsersDialog' {
  import React from 'react';
  import { StyleProps } from 'simulator/style';
  import { ThemeProps } from 'simulator/components/theme';
  import { Settings } from 'simulator/Settings';
  import ProgrammingLanguage from 'simulator/ProgrammingLanguage';
  export interface OpenUsersDialogPublicProps extends ThemeProps, StyleProps {
      onClose: () => void;
      projectLanguage: ProgrammingLanguage;
      settings: Settings;
      onOpenUserProject: (name: string, projectName: string, fileName: string, projectLanguage: string) => void;
      onSettingsChange: (settings: Partial<Settings>) => void;
  }
  namespace Modal {
      enum Type {
          Settings = 0,
          CreateUser = 1,
          RepeatUser = 2,
          None = 3,
          OpenUsers = 4
      }
      interface None {
          type: Type.None;
      }
      const NONE: None;
      interface Settings {
          type: Type.Settings;
      }
      const SETTINGS: Settings;
      interface CreateUser {
          type: Type.CreateUser;
      }
      const CREATEUSER: CreateUser;
      interface RepeatUser {
          type: Type.RepeatUser;
      }
      const REPEATUSER: RepeatUser;
      interface OpenUsers {
          type: Type.OpenUsers;
      }
      const OPENUSERS: OpenUsers;
  }
  export type Modal = (Modal.Settings | Modal.CreateUser | Modal.None | Modal.RepeatUser);
  const _default: React.ComponentType<OpenUsersDialogPublicProps>;
  export default _default;

}
declare module 'simulator/components/RepeatUserDialog' {
  import * as React from 'react';
  import { StyleProps } from 'simulator/style';
  import { ThemeProps } from 'simulator/components/theme';
  export interface RepeatUserDialogPublicProps extends ThemeProps, StyleProps {
      onClose: () => void;
  }
  namespace Modal {
      enum Type {
          Settings = 0,
          CreateUser = 1,
          RepeatUser = 2,
          None = 3,
          OpenUser = 4
      }
      interface None {
          type: Type.None;
      }
      const NONE: None;
      interface Settings {
          type: Type.Settings;
      }
      const SETTINGS: Settings;
      interface CreateUser {
          type: Type.CreateUser;
      }
      const CREATEUSER: CreateUser;
      interface RepeatUser {
          type: Type.RepeatUser;
      }
      const REPEATUSER: RepeatUser;
  }
  export type Modal = (Modal.Settings | Modal.CreateUser | Modal.None | Modal.RepeatUser);
  const _default: React.ComponentType<RepeatUserDialogPublicProps>;
  export default _default;

}
declare module 'simulator/components/ResizeListener' {
  import { Vector2 } from "simulator/math";
  export type ResizeCallback = (size: Vector2, element: Element) => void;
  export interface ResizeListener {
      observe(element: Element): any;
      unobserve(element: Element): any;
      disconnect(): any;
  }
  const _default: (callback: ResizeCallback) => ResizeListener;
  export default _default;

}
declare module 'simulator/components/Root' {
  import * as React from 'react';
  import { Theme } from 'simulator/components/theme';
  import { Layout } from 'simulator/components/Layout/index';
  import { SimulatorState } from 'simulator/components/SimulatorState';
  import { StyledText } from 'simulator/util/index';
  import { Message } from 'ivygate';
  import { Settings } from 'simulator/Settings';
  import { Feedback } from 'simulator/Feedback';
  import Dict from 'simulator/Dict';
  import ProgrammingLanguage from 'simulator/ProgrammingLanguage';
  import { RouteComponentProps } from 'react-router';
  import { Modal } from 'simulator/pages/Modal';
  interface RootParams {
      sceneId?: string;
      challengeId?: string;
  }
  export interface RootPublicProps extends RouteComponentProps<RootParams> {
      propFileName: string;
      propProjectName: string;
      propActiveLanguage: ProgrammingLanguage;
      propUserName: string;
      addNewProject: boolean;
      addNewFile: boolean;
      clickFile: boolean;
      otherFileType?: string;
      isLeftBarOpen: boolean;
      changeProjectName: (projectName: string) => void;
      setAddNewProject: (addNewProject: boolean) => void;
      setAddNewFile: (addNewFile: boolean) => void;
      setClickFile: (clickFile: boolean) => void;
  }
  interface RootState {
      layout: Layout;
      activeLanguage: ProgrammingLanguage;
      code: Dict<string>;
      simulatorState: SimulatorState;
      modal: Modal;
      editorConsole: StyledText;
      messages: Message[];
      theme: Theme;
      settings: Settings;
      feedback: Feedback;
      windowInnerHeight: number;
      isHomeStartOptionsVisible: boolean;
      isNewFileDialogVisible: boolean;
      isEditorPageVisible: boolean;
      isCreateProjectDialogVisible: boolean;
      isCreateNewUserDialogVisible: boolean;
      isOpenUserProject: boolean;
      projectName: string;
      fileName: string;
      addNewProject: boolean;
      addNewFile: boolean;
      clickFileState: boolean;
      otherFileType?: string;
      userName: string;
  }
  const _default: React.ComponentType<RootPublicProps>;
  export default _default;
  export { RootState };

}
declare module 'simulator/components/SceneErrorDialog' {
  import * as React from 'react';
  import Async from 'simulator/state/State/Async';
  import { ThemeProps } from 'simulator/components/theme';
  interface SceneErrorDialogPublicProps extends ThemeProps {
      error: Async.Error;
      onClose: () => void;
  }
  const _default: React.ComponentType<SceneErrorDialogPublicProps>;
  export default _default;

}
declare module 'simulator/components/ScrollArea' {
  import * as React from 'react';
  import { Vector2 } from 'simulator/math';
  import { StyleProps } from 'simulator/style';
  import { ThemeProps } from 'simulator/components/theme';
  export interface ScrollAreaProps extends StyleProps, ThemeProps {
      children: React.ReactNode;
      autoscroll?: boolean;
  }
  export namespace Action {
      enum Type {
          None = 0,
          VerticalScroll = 1
      }
      interface None {
          type: Type.None;
          top: number;
      }
      const none: (top: number) => None;
      interface VerticalScroll {
          type: Type.VerticalScroll;
          top: number;
          startTop: number;
          startOffset: Vector2;
      }
      type VerticalScrollParams = Omit<VerticalScroll, 'type'>;
      const verticalScroll: (params: VerticalScrollParams) => VerticalScroll;
      const top: (action: Action) => number;
  }
  export type Action = Action.None | Action.VerticalScroll;
  interface ScrollAreaState {
      outerSize: Vector2;
      innerSize: Vector2;
      hover: boolean;
      action: Action;
  }
  type Props = ScrollAreaProps;
  type State = ScrollAreaState;
  class ScrollArea extends React.PureComponent<Props, State> {
      private listener_;
      constructor(props: Props);
      private onResize_;
      private updateTopOnResize;
      componentWillUnmount(): void;
      private onMouseEnter_;
      private onMouseLeave_;
      private onMouseMoveHandle_;
      private onMouseUpHandle_;
      private onVMouseDown_;
      private onMouseMove_;
      private onMouseUp_;
      private onWheel_;
      private onTouchStart_;
      private onTouchMove_;
      private onTouchEnd_;
      private onTouchCancel_;
      private startScrolling;
      private stopScrolling;
      /**
       * Applies a scroll amount to the current scroll action (if there is one).
       * @param newOffset - The new scroll offset, relative to the startOffset specified in startScrolling()
       * @param isUsingBar - Whether the scroll offset refers to the scrollbar or the actual scroll area
       * @param invert - Whether the scroll direction should be inverted (for example, when using touch)
       */
      private applyScrolling;
      private outerRef_;
      private bindOuterRef_;
      private innerRef_;
      private bindInnerRef_;
      private get vScrollHeight();
      private get maxTop();
      set top(top: number);
      render(): JSX.Element;
  }
  export default ScrollArea;

}
declare module 'simulator/components/Section' {
  import * as React from 'react';
  import { StyleProps } from 'simulator/style';
  import { ThemeProps } from 'simulator/components/theme';
  import { AnyText } from 'simulator/util/index';
  export interface SectionProps extends ThemeProps, StyleProps {
      name: AnyText;
      children: React.ReactNode;
      collapsed?: boolean;
      onCollapsedChange?: (collapsed: boolean) => void;
      noHeaderPadding?: boolean;
      noBodyPadding?: boolean;
      noBorder?: boolean;
  }
  type Props = SectionProps;
  class Section extends React.PureComponent<Props> {
      private onCollapseClick_;
      render(): JSX.Element;
  }
  export default Section;

}
declare module 'simulator/components/SensorPlot' {
  import * as React from 'react';
  import { StyleProps } from 'simulator/style';
  import { ThemeProps } from 'simulator/components/theme';
  export interface Vector2 {
      x: number;
      y: number;
  }
  export interface SensorPlotProps extends ThemeProps, StyleProps {
      value: number;
      duration?: number;
      refreshRate?: number;
  }
  export namespace SensorPlotProps {
      const DEFAULT_DURATION = 5;
      const DEFAULT_REFRESH_RATE = 10;
      const duration: (props: SensorPlotProps) => number;
      const refreshRate: (props: SensorPlotProps) => number;
  }
  interface SensorPlotState {
      svgWidth: number;
      svgHeight: number;
      viewportWidth: number;
      viewportHeight: number;
      x: number;
      y: number;
      points: Vector2[];
      ticks: number[];
      maxValue: number;
      minValue: number;
  }
  type Props = SensorPlotProps;
  type State = SensorPlotState;
  class SensorPlot extends React.PureComponent<Props, State> {
      constructor(props: Props);
      private onResize_;
      private observer_;
      private ref_;
      private bindRef_;
      componentDidMount(): void;
      componentWillUnmount(): void;
      private mounted_;
      private scheduleTick_;
      private firstTick_;
      private lastTick_;
      private tick_;
      private transformPoint_;
      private slow_;
      render(): JSX.Element;
  }
  export default SensorPlot;

}
declare module 'simulator/components/SettingsDialog' {
  import * as React from 'react';
  import { Settings } from 'simulator/Settings';
  import { StyleProps } from 'simulator/style';
  import { ThemeProps } from 'simulator/components/theme';
  export interface SettingsDialogPublicProps extends ThemeProps, StyleProps {
      onClose: () => void;
      settings: Settings;
      onSettingsChange: (settings: Partial<Settings>) => void;
  }
  const _default: React.ComponentType<SettingsDialogPublicProps>;
  export default _default;

}
declare module 'simulator/components/SimMenu' {
  import * as React from 'react';
  import { StyleProps } from 'simulator/style';
  import { Layout } from 'simulator/components/Layout/index';
  import { SimulatorState } from 'simulator/components/SimulatorState';
  import { ThemeProps } from 'simulator/components/theme';
  export interface MenuPublicProps extends StyleProps, ThemeProps {
      layout: Layout;
      onLayoutChange: (layout: Layout) => void;
      onSettingsSceneClick?: (event: React.MouseEvent) => void;
      onShowAll: () => void;
      onHideAll: () => void;
      onRunClick: () => void;
      onStopClick: () => void;
      onSettingsClick: () => void;
      onAboutClick: () => void;
      onDocumentationClick: () => void;
      onDashboardClick: () => void;
      onFeedbackClick: () => void;
      simulatorState: SimulatorState;
  }
  const _default: React.ComponentType<MenuPublicProps>;
  export default _default;

}
declare module 'simulator/components/SimulatorState' {
  export namespace SimulatorState {
      enum Type {
          Stopped = 0,
          Compiling = 1,
          Running = 2
      }
      interface Stopped {
          type: Type.Stopped;
      }
      const STOPPED: Stopped;
      interface Compiling {
          type: Type.Compiling;
      }
      const COMPILING: Compiling;
      interface Running {
          type: Type.Running;
      }
      const RUNNING: Running;
      const isStopped: (simulatorState: SimulatorState) => boolean;
      const isCompiling: (simulatorState: SimulatorState) => boolean;
      const isRunning: (simulatorState: SimulatorState) => boolean;
  }
  export type SimulatorState = (SimulatorState.Stopped | SimulatorState.Compiling | SimulatorState.Running);

}
declare module 'simulator/components/Slider/Resizer' {
  /// <reference types="react" />
  interface ResizeState {
      isVertical: boolean;
      resizing: boolean;
      refs?: [React.MutableRefObject<HTMLDivElement>, React.MutableRefObject<HTMLDivElement>];
      grows?: number[];
      minSizes: number[];
      scaledMinSizes?: number[];
      startGrows?: number[];
      startPos?: number;
  }
  export enum Actions {
      MouseDown = 0,
      MouseUp = 1,
      MouseMove = 2
  }
  interface ResizeAction {
      actionType: Actions;
      x?: number;
      y?: number;
  }
  export function resizeOnPointerMove(state: ResizeState, action: ResizeAction): ResizeState;
  export {};

}
declare module 'simulator/components/Slider/Slider' {
  import { ThemeProps } from 'simulator/components/theme';
  export interface SliderProps extends ThemeProps {
      isVertical: boolean;
      children: [JSX.Element, JSX.Element];
      minSizes: [number, number];
      sizes: [number, number];
      visible: [boolean, boolean];
  }
  export const Slider: (props: SliderProps) => JSX.Element;

}
declare module 'simulator/components/Slider/SliderBar' {
  import * as React from 'react';
  import { ThemeProps } from 'simulator/components/theme';
  import { CanBeVertical, CanBeSelected } from 'simulator/components/Slider/index';
  interface SliderBarProps extends CanBeVertical, CanBeSelected, ThemeProps {
      onMouseDownCallback: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
      onTouchStartCallback: (e: React.TouchEvent<HTMLDivElement>) => void;
  }
  export const SliderBar: React.MemoExoticComponent<(props: SliderBarProps) => JSX.Element>;
  export {};

}
declare module 'simulator/components/Slider/index' {
  export { Slider, SliderProps } from 'simulator/components/Slider/Slider';
  export interface CanBeVertical {
      $vertical?: boolean;
  }
  export interface CanBeSelected {
      selected: boolean;
  }

}
declare module 'simulator/components/Svg' {
  import * as React from 'react';
  import { Vector2 } from 'simulator/math';
  import { StyleProps } from 'simulator/style';
  export type DrawFunction = (size: Vector2) => React.ReactNode;
  export interface SvgProps extends StyleProps {
      draw: DrawFunction;
      onMouseDown?: (event: React.MouseEvent) => void;
      onMouseUp?: (event: React.MouseEvent) => void;
      onMouseEnter?: (event: React.MouseEvent) => void;
      onMouseLeave?: (event: React.MouseEvent) => void;
      onMouseMove?: (event: React.MouseEvent) => void;
  }
  interface SvgState {
      size: Vector2;
  }
  type Props = SvgProps;
  type State = SvgState;
  class Svg extends React.Component<Props, State> {
      private onResize_;
      private resizeListener_;
      private containerRef_;
      private bindContainerRef_;
      get boundingClientRect(): DOMRect;
      get size(): Vector2;
      constructor(props: Props);
      render(): JSX.Element;
  }
  export default Svg;

}
declare module 'simulator/components/Switch' {
  import * as React from 'react';
  import { StyleProps } from 'simulator/style';
  import { ThemeProps } from 'simulator/components/theme';
  export interface SwitchProps extends ThemeProps, StyleProps {
      value: boolean;
      onValueChange: (value: boolean) => void;
  }
  type Props = SwitchProps;
  export class Switch extends React.PureComponent<Props> {
      private onClick_;
      render(): JSX.Element;
  }
  export {};

}
declare module 'simulator/components/TabBar' {
  import { IconProp } from '@fortawesome/fontawesome-svg-core';
  import * as React from 'react';
  import { StyleProps } from 'simulator/style';
  import { ThemeProps } from 'simulator/components/theme';
  import { Settings } from 'simulator/Settings';
  export interface TabProps extends ThemeProps, StyleProps {
      description: TabBar.TabDescription;
      selected?: boolean;
      vertical?: boolean;
      onClick: (event: React.MouseEvent<HTMLDivElement>) => void;
  }
  export class Tab extends React.PureComponent<TabProps> {
      render(): JSX.Element;
  }
  export interface TabBarProps extends ThemeProps, StyleProps {
      tabs: TabBar.TabDescription[];
      index: number;
      modal: Modal;
      settings: Settings;
      isVertical?: boolean;
      onIndexChange: (index: number, event: React.MouseEvent<HTMLDivElement>) => void;
  }
  interface TabBarState {
      modal: Modal;
      settings: Settings;
  }
  type Props = TabBarProps;
  type State = TabBarState;
  namespace Modal {
      enum Type {
          Settings = 0,
          None = 1
      }
      interface None {
          type: Type.None;
      }
      const NONE: None;
      interface Settings {
          type: Type.Settings;
      }
      const SETTINGS: Settings;
  }
  export type Modal = (Modal.Settings | Modal.None);
  export class TabBar extends React.Component<Props, State> {
      private onClick_;
      onSettingsChange_: (settings: Partial<Settings>) => void;
      constructor(props: Props);
      private onModalClick_;
      private onModalClose_;
      render(): JSX.Element;
  }
  export namespace TabBar {
      interface TabDescription {
          name: string;
          icon?: IconProp;
      }
  }
  export {};

}
declare module 'simulator/components/Text' {
  import * as React from 'react';
  import { StyleProps } from 'simulator/style';
  import { AnyText } from 'simulator/util/index';
  export interface TextProps extends StyleProps {
      text: AnyText;
  }
  type Props = TextProps;
  /**
   * Text is a component that can render either a string of text or a `StyledText` object. It allows all text fields
   * in the simulator to have sophisticated layouts and styling applied easily.
   */
  export class Text extends React.PureComponent<Props> {
      private renderStyledText_;
      render(): JSX.Element;
  }
  export {};

}
declare module 'simulator/components/TextArea' {
  /// <reference types="react" />
  import { ThemeProps } from "simulator/components/theme";
  const _default: import("styletron-react").StyletronComponent<Pick<import("react").DetailedHTMLProps<import("react").TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>, keyof import("react").ClassAttributes<HTMLTextAreaElement> | keyof import("react").TextareaHTMLAttributes<HTMLTextAreaElement>> & ThemeProps>;
  export default _default;

}
declare module 'simulator/components/Tooltip' {
  import * as React from 'react';
  import { ThemeProps } from "simulator/components/theme";
  import { Vector2 } from 'simulator/math';
  import { StyleProps } from 'simulator/style';
  export interface TooltipProps extends ThemeProps, StyleProps {
      target: Tooltip.Target;
      contentHint: Tooltip.ContentHint;
      children: unknown;
  }
  interface TooltipState {
      position: Vector2;
  }
  type Props = TooltipProps;
  type State = TooltipState;
  class Tooltip extends React.PureComponent<Props, State> {
      constructor(props: Props);
      private ref_;
      private bindRef_;
      private onMouseMove_;
      private onMouseMoveHandle_;
      private animationFrameRequestId_;
      componentDidMount(): void;
      componentWillUnmount(): void;
      private scheduleTick_;
      private tick_;
      render(): React.ReactPortal;
      close(): void;
  }
  namespace Tooltip {
      namespace Target {
          enum Type {
              Element = 0,
              Position = 1
          }
          interface Element {
              type: Type.Element;
              element: HTMLElement;
          }
          namespace Element {
              const create: (element: HTMLElement) => Element;
              const position: (element: Element) => Vector2;
          }
          interface Position {
              type: Type.Position;
              position: Vector2;
          }
          namespace Position {
              const create: (position: Vector2) => Position;
              const position: (position: Position) => Vector2;
          }
          const position: (target: Target) => Vector2;
      }
      type Target = Target.Element | Target.Position;
      namespace ContentHint {
          enum Type {
              NonInteractive = 0,
              Interactive = 1
          }
          interface NonInteractive {
              type: Type.NonInteractive;
          }
          const NON_INTERACTIVE: NonInteractive;
          interface Interactive {
              type: Type.Interactive;
              onClose: () => void;
          }
          const interactive: (onClose: () => void) => {
              type: Type;
              onClose: () => void;
          };
      }
      type ContentHint = ContentHint.NonInteractive | ContentHint.Interactive;
  }
  export default Tooltip;

}
declare module 'simulator/components/User' {
  import { ThemeProps } from 'simulator/components/theme';
  import * as React from 'react';
  import { StyleProps } from 'simulator/style';
  export interface UserProps extends StyleProps, ThemeProps {
  }
  interface UserState {
  }
  type Props = UserProps;
  type State = UserState;
  export class User extends React.PureComponent<Props, State> {
      name: string;
      projects: string[];
      constructor(props: Props, name: string, projects: string[]);
      render(): JSX.Element;
  }
  export default User;

}
declare module 'simulator/components/Widget' {
  import * as React from 'react';
  import { StyleProps } from 'simulator/style';
  import { ThemeProps } from 'simulator/components/theme';
  export namespace Size {
      enum Type {
          Maximized = 0,
          Partial = 1,
          Miniature = 2,
          Minimized = 3
      }
      interface Maximized {
          type: Type.Maximized;
      }
      const MAXIMIZED: Maximized;
      enum Direction {
          None = 0,
          Left = 1,
          Right = 2,
          Up = 3,
          Down = 4
      }
      interface Partial {
          type: Type.Partial;
          direction: Direction;
      }
      const PARTIAL: Partial;
      const PARTIAL_UP: Partial;
      const PARTIAL_DOWN: Partial;
      const PARTIAL_LEFT: Partial;
      const PARTIAL_RIGHT: Partial;
      interface Miniature {
          type: Type.Miniature;
          direction: Direction;
      }
      const MINIATURE_UP: Miniature;
      const MINIATURE_DOWN: Miniature;
      const MINIATURE_LEFT: Miniature;
      const MINIATURE_RIGHT: Miniature;
      interface Minimized {
          type: Type.Minimized;
      }
      const MINIMIZED: Minimized;
  }
  export type Size = Size.Maximized | Size.Partial | Size.Miniature | Size.Minimized;
  export enum Mode {
      Inline = 0,
      Floating = 1,
      Sidebar = 2
  }
  export interface ModeProps {
      mode: Mode;
  }
  export interface BarComponent<P extends object> {
      component: React.ComponentType<P>;
      props: P;
  }
  export namespace BarComponent {
      const create: <P>(component: React.ComponentType<P>, props: P) => {
          component: React.ComponentType<P>;
          props: P;
      };
  }
  export interface WidgetProps extends StyleProps, ThemeProps, ModeProps {
      name: string;
      onSizeChange?: (index: number) => void;
      size?: number;
      sizes?: Size[];
      hideActiveSize?: boolean;
      children: React.ReactNode;
      barComponents?: BarComponent<object>[];
      onChromeMouseDown?: (event: React.MouseEvent<HTMLDivElement>) => void;
      onChromeMouseUp?: (event: React.MouseEvent<HTMLDivElement>) => void;
  }
  interface WidgetState {
  }
  type Props = WidgetProps;
  type State = WidgetState;
  class Widget extends React.PureComponent<Props, State> {
      constructor(props: Props);
      private onSizeChange_;
      render(): JSX.Element;
  }
  export default Widget;

}
declare module 'simulator/components/charm-util' {
  export const charmColor: (hue: number) => string;

}
declare module 'simulator/components/common' {
  /// <reference types="react" />
  export const Spacer: import("styletron-react").StyletronComponent<Pick<import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLDivElement>, HTMLDivElement>, keyof import("react").ClassAttributes<HTMLDivElement> | keyof import("react").HTMLAttributes<HTMLDivElement>>>;
  export const leftBarSpacerOpen: import("styletron-react").StyletronComponent<Pick<import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLDivElement>, HTMLDivElement>, keyof import("react").ClassAttributes<HTMLDivElement> | keyof import("react").HTMLAttributes<HTMLDivElement>>>;
  export const leftBarSpacerClosed: import("styletron-react").StyletronComponent<Pick<import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLDivElement>, HTMLDivElement>, keyof import("react").ClassAttributes<HTMLDivElement> | keyof import("react").HTMLAttributes<HTMLDivElement>>>;
  export const middleBarSpacer: import("styletron-react").StyletronComponent<Pick<import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLDivElement>, HTMLDivElement>, keyof import("react").ClassAttributes<HTMLDivElement> | keyof import("react").HTMLAttributes<HTMLDivElement>>>;
  export const rightBarSpacerOpen: import("styletron-react").StyletronComponent<Pick<import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLDivElement>, HTMLDivElement>, keyof import("react").ClassAttributes<HTMLDivElement> | keyof import("react").HTMLAttributes<HTMLDivElement>>>;
  export const rightBarSpacerClosed: import("styletron-react").StyletronComponent<Pick<import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLDivElement>, HTMLDivElement>, keyof import("react").ClassAttributes<HTMLDivElement> | keyof import("react").HTMLAttributes<HTMLDivElement>>>;

}
declare module 'simulator/components/documentation/DocumentationRoot' {
  import * as React from 'react';
  export interface ModalProps {
      children: React.ReactNode;
  }
  type Props = ModalProps;
  class DocumentationRoot extends React.PureComponent<Props> {
      static get active(): boolean;
      constructor(props?: Props);
      componentDidMount(): void;
      componentWillUnmount(): void;
      static isVisible: () => boolean;
      render(): React.ReactPortal;
  }
  export default DocumentationRoot;

}
declare module 'simulator/components/documentation/DocumentationWindow' {
  import * as React from 'react';
  import { ThemeProps } from 'simulator/components/theme';
  export interface DocumentationWindowPublicProps extends ThemeProps {
  }
  const _default: React.ComponentType<DocumentationWindowPublicProps>;
  export default _default;

}
declare module 'simulator/components/documentation/EnumerationBrief' {
  import * as React from 'react';
  import EnumerationDocumentation from 'simulator/state/State/Documentation/EnumerationDocumentation';
  import { StyleProps } from 'simulator/style';
  import { ThemeProps } from 'simulator/components/theme';
  export interface EnumerationBriefProps extends StyleProps, ThemeProps {
      language: 'c' | 'python';
      enumeration: EnumerationDocumentation;
      onClick?: (event: React.MouseEvent) => void;
  }
  type Props = EnumerationBriefProps;
  const EnumerationBrief: ({ language, theme, enumeration, onClick, style, className }: Props) => JSX.Element;
  export default EnumerationBrief;

}
declare module 'simulator/components/documentation/FileBrief' {
  import * as React from 'react';
  import FileDocumentation from 'simulator/state/State/Documentation/FileDocumentation';
  import { StyleProps } from 'simulator/style';
  import { ThemeProps } from 'simulator/components/theme';
  export interface FileBriefProps extends StyleProps, ThemeProps {
      language: 'c' | 'python';
      file: FileDocumentation;
      onClick?: (event: React.MouseEvent) => void;
  }
  type Props = FileBriefProps;
  const FileBrief: ({ language, theme, file, onClick, style, className }: Props) => JSX.Element;
  export default FileBrief;

}
declare module 'simulator/components/documentation/FileDocumentation' {
  import Documentation from 'simulator/state/State/Documentation/index';
  import DocumentationLocation from 'simulator/state/State/Documentation/DocumentationLocation';
  import FileDocumentationModel from 'simulator/state/State/Documentation/FileDocumentation';
  import { StyleProps } from 'simulator/style';
  import { ThemeProps } from 'simulator/components/theme';
  import LocalizedString from 'simulator/util/LocalizedString';
  export interface FileDocumentationProps extends StyleProps, ThemeProps {
      language: 'c' | 'python';
      file: FileDocumentationModel;
      documentation: Documentation;
      locale: LocalizedString.Language;
      onDocumentationPush: (location: DocumentationLocation) => void;
  }
  type Props = FileDocumentationProps;
  const FileDocumentation: ({ language, file, documentation, onDocumentationPush, style, className, theme, locale }: Props) => JSX.Element;
  export default FileDocumentation;

}
declare module 'simulator/components/documentation/FileName' {
  /// <reference types="react" />
  const FileName: import("styletron-react").StyletronComponent<Pick<import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>, keyof import("react").ClassAttributes<HTMLSpanElement> | keyof import("react").HTMLAttributes<HTMLSpanElement>> & {
      onClick?: (event: React.MouseEvent) => void;
  }>;
  export default FileName;

}
declare module 'simulator/components/documentation/FunctionBrief' {
  import * as React from 'react';
  import FunctionDocumentation from 'simulator/state/State/Documentation/FunctionDocumentation';
  import { StyleProps } from 'simulator/style';
  import { ThemeProps } from 'simulator/components/theme';
  export interface FunctionBriefProps extends StyleProps, ThemeProps {
      language: 'c' | 'python';
      func: FunctionDocumentation;
      onClick?: (event: React.MouseEvent) => void;
  }
  type Props = FunctionBriefProps;
  const FunctionBrief: ({ language, func, onClick, style, className, theme }: Props) => JSX.Element;
  export default FunctionBrief;

}
declare module 'simulator/components/documentation/FunctionDocumentation' {
  import DocumentationLocation from 'simulator/state/State/Documentation/DocumentationLocation';
  import FunctionDocumentationModel from 'simulator/state/State/Documentation/FunctionDocumentation';
  import { StyleProps } from 'simulator/style';
  import { ThemeProps } from 'simulator/components/theme';
  import LocalizedString from 'simulator/util/LocalizedString';
  export interface FunctionDocumentationProps extends StyleProps, ThemeProps {
      language: 'c' | 'python';
      func: FunctionDocumentationModel;
      locale: LocalizedString.Language;
      onDocumentationPush: (location: DocumentationLocation) => void;
  }
  type Props = FunctionDocumentationProps;
  const FunctionDocumentation: ({ language, func, style, className, theme, locale }: Props) => JSX.Element;
  export default FunctionDocumentation;

}
declare module 'simulator/components/documentation/FunctionPrototype' {
  import * as React from 'react';
  import FunctionDocumentation from 'simulator/state/State/Documentation/FunctionDocumentation';
  import { StyleProps } from 'simulator/style';
  export interface FunctionPrototypeProps extends StyleProps {
      language: 'c' | 'python';
      func: Pick<FunctionDocumentation, 'name' | 'parameters' | 'return_type'>;
      onClick?: (event: React.MouseEvent) => void;
  }
  type Props = FunctionPrototypeProps;
  const FunctionPrototype: ({ language, func, onClick, style, className }: Props) => JSX.Element;
  export default FunctionPrototype;

}
declare module 'simulator/components/documentation/ModuleBrief' {
  import * as React from 'react';
  import ModuleDocumentation from 'simulator/state/State/Documentation/ModuleDocumentation';
  import { StyleProps } from 'simulator/style';
  import { ThemeProps } from 'simulator/components/theme';
  export interface FileBriefProps extends StyleProps, ThemeProps {
      module: ModuleDocumentation;
      onClick?: (event: React.MouseEvent) => void;
  }
  type Props = FileBriefProps;
  const ModuleBrief: ({ theme, module, onClick, style, className }: Props) => JSX.Element;
  export default ModuleBrief;

}
declare module 'simulator/components/documentation/ModuleDocumentation' {
  import Documentation from 'simulator/state/State/Documentation/index';
  import DocumentationLocation from 'simulator/state/State/Documentation/DocumentationLocation';
  import ModuleDocumentationModel from 'simulator/state/State/Documentation/ModuleDocumentation';
  import { StyleProps } from 'simulator/style';
  import { ThemeProps } from 'simulator/components/theme';
  import LocalizedString from 'simulator/util/LocalizedString';
  export interface ModuleDocumentationProps extends StyleProps, ThemeProps {
      language: 'c' | 'python';
      module: ModuleDocumentationModel;
      documentation: Documentation;
      locale: LocalizedString.Language;
      onDocumentationPush: (location: DocumentationLocation) => void;
  }
  type Props = ModuleDocumentationProps;
  const ModuleDocumentation: ({ language, module, documentation, onDocumentationPush, style, className, theme, locale }: Props) => JSX.Element;
  export default ModuleDocumentation;

}
declare module 'simulator/components/documentation/ModuleName' {
  /// <reference types="react" />
  const ModuleName: import("styletron-react").StyletronComponent<Pick<import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>, keyof import("react").ClassAttributes<HTMLSpanElement> | keyof import("react").HTMLAttributes<HTMLSpanElement>> & {
      onClick?: (event: React.MouseEvent) => void;
  }>;
  export default ModuleName;

}
declare module 'simulator/components/documentation/RootDocumentation' {
  import * as React from 'react';
  import Documentation from 'simulator/state/State/Documentation/index';
  import DocumentationLocation from 'simulator/state/State/Documentation/DocumentationLocation';
  import { ThemeProps } from 'simulator/components/theme';
  import LocalizedString from 'simulator/util/LocalizedString';
  export interface RootDocumentationProps extends ThemeProps {
      language: 'c' | 'python';
      documentation: Documentation;
      locale: LocalizedString.Language;
      onDocumentationPush: (location: DocumentationLocation) => void;
  }
  interface RootDocumentationState {
      query: string;
  }
  type Props = RootDocumentationProps;
  type State = RootDocumentationState;
  class RootDocumentation extends React.PureComponent<Props, State> {
      constructor(props: Props);
      private onQueryChange_;
      private onFunctionClick_;
      private onStructureClick_;
      private onEnumerationClick_;
      private onFileClick_;
      private onModuleClick_;
      render(): JSX.Element;
  }
  export default RootDocumentation;

}
declare module 'simulator/components/documentation/Section' {
  import * as React from 'react';
  import LocalizedString from 'simulator/util/LocalizedString';
  export interface SectionProps {
      name: LocalizedString;
      children: React.ReactNode;
  }
  export const Section: (props: SectionProps) => JSX.Element;

}
declare module 'simulator/components/documentation/StructureBrief' {
  import * as React from 'react';
  import StructureDocumentation from 'simulator/state/State/Documentation/StructureDocumentation';
  import { StyleProps } from 'simulator/style';
  import { ThemeProps } from 'simulator/components/theme';
  export interface StructureBriefProps extends StyleProps, ThemeProps {
      language: 'c' | 'python';
      structure: StructureDocumentation;
      onClick?: (event: React.MouseEvent) => void;
  }
  type Props = StructureBriefProps;
  const StructureBrief: ({ language, theme, structure, onClick, style, className }: Props) => JSX.Element;
  export default StructureBrief;

}
declare module 'simulator/components/documentation/StructureDocumentation' {
  import DocumentationLocation from 'simulator/state/State/Documentation/DocumentationLocation';
  import StructureDocumentationModel from 'simulator/state/State/Documentation/StructureDocumentation';
  import { StyleProps } from 'simulator/style';
  import { ThemeProps } from 'simulator/components/theme';
  import LocalizedString from 'simulator/util/LocalizedString';
  export interface StructureDocumentationProps extends StyleProps, ThemeProps {
      language: 'c' | 'python';
      structure: StructureDocumentationModel;
      locale: LocalizedString.Language;
      onDocumentationPush: (location: DocumentationLocation) => void;
  }
  type Props = StructureDocumentationProps;
  const StructureDocumentation: ({ language, structure, onDocumentationPush, style, className, theme, locale }: Props) => JSX.Element;
  export default StructureDocumentation;

}
declare module 'simulator/components/documentation/common' {
  /// <reference types="react" />
  export const FunctionName: import("styletron-react").StyletronComponent<Pick<import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>, keyof import("react").ClassAttributes<HTMLSpanElement> | keyof import("react").HTMLAttributes<HTMLSpanElement>>>;
  export const Type: import("styletron-react").StyletronComponent<Pick<import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>, keyof import("react").ClassAttributes<HTMLSpanElement> | keyof import("react").HTMLAttributes<HTMLSpanElement>> & {
      $language: 'c' | 'python';
  }>;
  export const Keyword: import("styletron-react").StyletronComponent<Pick<import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>, keyof import("react").ClassAttributes<HTMLSpanElement> | keyof import("react").HTMLAttributes<HTMLSpanElement>>>;
  export const ParameterName: import("styletron-react").StyletronComponent<Pick<import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>, keyof import("react").ClassAttributes<HTMLSpanElement> | keyof import("react").HTMLAttributes<HTMLSpanElement>>>;
  export const Decoration: import("styletron-react").StyletronComponent<Pick<import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>, keyof import("react").ClassAttributes<HTMLSpanElement> | keyof import("react").HTMLAttributes<HTMLSpanElement>>>;

}
declare module 'simulator/components/documentation/util' {
  export const toPythonType: (type: string) => string;

}
declare module 'simulator/components/theme' {
  export interface ButtonColor {
      disabled: string;
      standard: string;
      hover: string;
  }
  export const GREEN: ButtonColor;
  export const RED: ButtonColor;
  export const BLUE: ButtonColor;
  export const BROWN: ButtonColor;
  export interface Theme {
      foreground: 'white' | 'black';
      backgroundColor: string;
      transparentBackgroundColor: (a: number) => string;
      color: string;
      borderColor: string;
      borderRadius: number;
      widget: {
          padding: number;
      };
      itemPadding: number;
      switch: {
          on: {
              primary: string;
              secondary: string;
          };
          off: {
              primary: string;
              secondary: string;
          };
      };
      lighten: (frac: number) => string;
      darken: (frac: number) => string;
  }
  export const COMMON: Theme;
  export const LIGHT: Theme;
  export const DARK: Theme;
  export interface ThemeProps {
      theme: Theme;
  }

}
declare module 'simulator/database_js/Database' {
  export const __esModule: true;
  export const db: any;
  export const userDB: any;

}
declare module 'simulator/deepNeq' {
  const _default: (_0: unknown, _1: unknown) => boolean;
  export default _default;

}
declare module 'simulator/geometry' {
  import { Vector2 } from "simulator/math";
  export interface Box2 {
      topLeft: Vector2;
      bottomRight: Vector2;
  }
  export namespace Box2 {
      const ZERO: Box2;
      const create: (topLeft: Vector2, bottomRight: Vector2) => Box2;
      const translate: (delta: Vector2, box2: Box2) => Box2;
      const width: (box2: Box2) => number;
      const height: (box2: Box2) => number;
  }

}
declare module 'simulator/i18n' {
  import Dict from 'simulator/Dict';
  import LocalizedString from 'simulator/util/LocalizedString';
  export type I18n = Dict<Dict<LocalizedString>>;
  const _default: (enUs: string, description?: string) => LocalizedString;
  export default _default;

}
declare module 'simulator/index' {
  export {};

}
declare module 'simulator/login/LoginPage' {
  import * as React from 'react';
  import { ThemeProps } from 'simulator/components/theme';
  import { StyleProps } from 'simulator/style';
  export interface LoginPagePublicProps extends ThemeProps, StyleProps {
      externalIndex?: number;
  }
  interface LoginPagePrivateProps {
  }
  interface LoginPageState {
      initialAuthLoaded: boolean;
      authenticating: boolean;
      index: number;
      forgotPassword: boolean;
      logInFailedMessage: string;
  }
  type Props = LoginPagePublicProps & LoginPagePrivateProps;
  type State = LoginPageState;
  class LoginPage extends React.Component<Props, State> {
      constructor(props: Props);
      componentDidMount(): void;
      private authListener;
      private onFinalize_;
      private getMessageForFailedLogin_;
      private onTabIndexChange_;
      private onForgotPasswordClick_;
      private onBackClick_;
      render(): JSX.Element;
  }
  export default LoginPage;

}
declare module 'simulator/login/index' {
  export {};

}
declare module 'simulator/math' {
  export interface Vector2 {
      x: number;
      y: number;
  }
  export const TAU: number;
  export namespace Vector2 {
      const ZERO: Vector2;
      const X: Vector2;
      const Y: Vector2;
      const NEGATIVE_X: Vector2;
      const NEGATIVE_Y: Vector2;
      const create: (x: number, y: number) => Vector2;
      const x: (vec: Vector2) => number;
      const y: (vec: Vector2) => number;
      const eq: (lhs: Vector2, rhs: Vector2) => boolean;
      const neq: (lhs: Vector2, rhs: Vector2) => boolean;
      const add: (l: Vector2, r: Vector2) => Vector2;
      const subtract: (l: Vector2, r: Vector2) => Vector2;
      const fromClient: <T extends {
          clientX: number;
          clientY: number;
      }>(obj: T) => Vector2;
      const fromTopLeft: <T extends {
          top: number;
          left: number;
      }>(obj: T) => Vector2;
      const fromWidthHeight: <T extends {
          width: number;
          height: number;
      }>(obj: T) => Vector2;
      const fromX: (x: number) => Vector2;
      const fromY: (y: number) => Vector2;
      const distance: (l: Vector2, r: Vector2) => number;
  }
  export interface Vector3 {
      x: number;
      y: number;
      z: number;
  }
  export namespace Vector3 {
      const ZERO: Vector3;
      const ONE: Vector3;
      const X: Vector3;
      const Y: Vector3;
      const Z: Vector3;
      const NEGATIVE_X: Vector3;
      const NEGATIVE_Y: Vector3;
      const NEGATIVE_Z: Vector3;
      const create: (x: number, y: number, z: number) => Vector3;
      const x: (vec: Vector3) => number;
      const y: (vec: Vector3) => number;
      const z: (vec: Vector3) => number;
      const eq: (lhs: Vector3, rhs: Vector3) => boolean;
      const neq: (lhs: Vector3, rhs: Vector3) => boolean;
      const add: (l: Vector3, r: Vector3) => Vector3;
      const subtract: (l: Vector3, r: Vector3) => Vector3;
      const multiply: (l: Vector3, r: Vector3) => Vector3;
      const cross: (l: Vector3, r: Vector3) => Vector3;
      const multiplyScalar: (vec: Vector3, scalar: number) => Vector3;
      const divideScalar: (vec: Vector3, scalar: number) => Vector3;
      const lengthSquared: (vec: Vector3) => number;
      const length: (vec: Vector3) => number;
      const distance: (lhs: Vector3, rhs: Vector3) => number;
      const dot: (lhs: Vector3, rhs: Vector3) => number;
      const normalize: (vec: Vector3) => Vector3;
      const applyQuaternion: (v: Vector3, q: Quaternion) => Vector3;
      const project: (lhs: Vector3, rhs: Vector3) => Vector3;
      const applyQuaternionTwist: (v: Vector3, q: Quaternion) => {
          swing: Vector3;
          twist: Quaternion;
      };
      const rotate: (v: Vector3, orientation: Quaternion) => Vector3;
      const angle: (lhs: Vector3, rhs: Vector3) => number;
      const clampVec: (min: Vector3, v: Vector3, max: Vector3) => Vector3;
  }
  export interface Euler {
      x: number;
      y: number;
      z: number;
      order?: Euler.Order;
  }
  export namespace Euler {
      type Order = 'xyz' | 'xzy' | 'yxz' | 'yzx' | 'zxy' | 'zyx';
      const IDENTITY: Euler;
      const create: (x: number, y: number, z: number, order?: Euler.Order) => Euler;
  }
  export interface AxisAngle {
      angle: number;
      axis: Vector3;
  }
  export namespace AxisAngle {
      const fromQuaternion: (q: Quaternion) => AxisAngle;
      const toQuaternion: (angleAxis: AxisAngle) => Quaternion;
      const multiply: (a: AxisAngle, b: AxisAngle) => AxisAngle;
      const create: (angle: number, axis: Vector3) => AxisAngle;
  }
  export interface Quaternion {
      x: number;
      y: number;
      z: number;
      w: number;
  }
  export namespace Quaternion {
      const IDENTITY: Quaternion;
      const create: (x: number, y: number, z: number, w: number) => Quaternion;
      const x: (quat: Quaternion) => number;
      const y: (quat: Quaternion) => number;
      const z: (quat: Quaternion) => number;
      const w: (quat: Quaternion) => number;
      const eq: (lhs: Quaternion, rhs: Quaternion) => boolean;
      const neq: (lhs: Quaternion, rhs: Quaternion) => boolean;
      const multiply: (lhs: Quaternion, rhs: Quaternion) => Quaternion;
      const length: (quat: Quaternion) => number;
      const normalize: (quat: Quaternion) => Quaternion;
      const dot: (lhs: Quaternion, rhs: Quaternion) => number;
      const angle: (lhs: Quaternion, rhs: Quaternion) => number;
      const signedAngle: (lhs: Quaternion, rhs: Quaternion, axis: Vector3) => number;
      const axis: (quat: Quaternion) => Vector3;
      const fromVector3: (vec: Vector3) => Quaternion;
      const inverse: (quat: Quaternion) => Quaternion;
      const shortestArc: (from: Vector3, to: Vector3) => Quaternion;
      const conjugate: (quat: Quaternion) => Quaternion;
  }
  export interface ReferenceFrame {
      position?: Vector3;
      orientation?: Quaternion;
      scale?: Vector3;
  }
  export namespace ReferenceFrame {
      const IDENTITY: ReferenceFrame;
      const create: (position: Vector3, orientation: Quaternion, scale?: Vector3) => ReferenceFrame;
      const position: (frame: ReferenceFrame) => Vector3;
      const orientation: (frame: ReferenceFrame) => Quaternion;
      const scale: (frame: ReferenceFrame) => Vector3;
      const fill: (frame: ReferenceFrame) => ReferenceFrame;
  }
  export const clamp: (min: number, value: number, max: number) => number;
  export interface Rectangle {
      topLeft: Vector2;
      bottomRight: Vector2;
  }
  export namespace Rectangle {
      const create: (topLeft: Vector2, bottomRight: Vector2) => Rectangle;
      const topLeft: (rect: Rectangle) => Vector2;
      const bottomRight: (rect: Rectangle) => Vector2;
      const top: (rect: Rectangle) => number;
      const left: (rect: Rectangle) => number;
      const bottom: (rect: Rectangle) => number;
      const right: (rect: Rectangle) => number;
      const width: (rect: Rectangle) => number;
      const height: (rect: Rectangle) => number;
      const topRight: (rect: Rectangle) => Vector2;
      const bottomLeft: (rect: Rectangle) => Vector2;
      const center: (rect: Rectangle) => Vector2;
      const contains: (rect: Rectangle, point: Vector2) => boolean;
      const fromBoundingRect: <T extends {
          top: number;
          left: number;
          bottom: number;
          right: number;
      }>(obj: T) => Rectangle;
      const grow: (rect: Rectangle, amount: number) => Rectangle;
      const shrink: (rect: Rectangle, amount: number) => Rectangle;
  }

}
declare module 'simulator/pages/Dashboard' {
  import * as React from 'react';
  import { ThemeProps } from 'simulator/components/theme';
  import { StyleProps } from 'simulator/style';
  import { RouteComponentProps } from 'react-router';
  export interface DashboardPublicProps extends RouteComponentProps, ThemeProps, StyleProps {
  }
  const _default: React.ComponentType<DashboardPublicProps>;
  export default _default;

}
declare module 'simulator/pages/Modal' {
  /// <reference types="react" />
  export namespace Modal {
      enum Type {
          Settings = 0,
          About = 1,
          Exception = 2,
          OpenScene = 3,
          Feedback = 4,
          FeedbackSuccess = 5,
          None = 6,
          NewScene = 7,
          CopyScene = 8,
          SettingsScene = 9,
          DeleteRecord = 10,
          ResetCode = 11,
          CreateFile = 12,
          CreateUser = 13,
          CreateProject = 14,
          OpenUsers = 15
      }
      interface Settings {
          type: Type.Settings;
      }
      const SETTINGS: Settings;
      interface About {
          type: Type.About;
      }
      const ABOUT: About;
      interface Feedback {
          type: Type.Feedback;
      }
      const FEEDBACK: Feedback;
      interface FeedbackSuccess {
          type: Type.FeedbackSuccess;
      }
      const FEEDBACKSUCCESS: FeedbackSuccess;
      interface Exception {
          type: Type.Exception;
          error: Error;
          info?: React.ErrorInfo;
      }
      const exception: (error: Error, info?: React.ErrorInfo) => Exception;
      interface None {
          type: Type.None;
      }
      const NONE: None;
      interface CreateProject {
          type: Type.CreateProject;
      }
      const CREATEPROJECT: CreateProject;
      interface CreateFile {
          type: Type.CreateFile;
      }
      const CREATEFILE: CreateFile;
      interface CreateUser {
          type: Type.CreateUser;
      }
      const CREATEUSER: CreateUser;
      interface OpenUsers {
          type: Type.OpenUsers;
      }
      const OPENUSERS: OpenUsers;
  }
  export type Modal = (Modal.Settings | Modal.About | Modal.Exception | Modal.Feedback | Modal.FeedbackSuccess | Modal.None | Modal.CreateProject | Modal.CreateFile | Modal.CreateUser | Modal.OpenUsers);

}
declare module 'simulator/pages/Tutorials' {
  import * as React from 'react';
  import { ThemeProps } from 'simulator/components/theme';
  import { StyleProps } from 'simulator/style';
  export interface TutorialsPublicProps extends StyleProps, ThemeProps {
  }
  const _default: React.ComponentType<TutorialsPublicProps>;
  export default _default;

}
declare module 'simulator/pages/interfaces/tutorial.interface' {
  import LocalizedString from 'util/LocalizedString';
  export default interface Tutorial {
      title?: LocalizedString;
      description?: LocalizedString;
      src?: string;
      backgroundImage?: string;
      backgroundColor?: string;
      backgroundPosition?: string;
      backgroundSize?: string;
      hoverBackgroundSize?: string;
      index?: number;
  }

}
declare module 'simulator/pages/tutorialList' {
  import Tutorial from 'simulator/pages/interfaces/tutorial.interface';
  export const tutorialList: Tutorial[];

}
declare module 'simulator/python/FsDevice' {
  interface FsDevice {
      open?: (stream: unknown) => void;
      write?: (stream: unknown, buffer: Int8Array, offset: number, length: number, position: number) => number;
      read?: (stream: unknown, buffer: Int8Array, offset: number, length: number, position: number) => number;
  }
  export default FsDevice;

}
declare module 'simulator/python/index' {
  import SharedRegisters from 'simulator/SharedRegisters';
  export interface PythonParams {
      code: string;
      printErr: (stderr: string) => void;
      print: (stdout: string) => void;
      registers: SharedRegisters;
  }
  let python: (params: PythonParams) => Promise<void>;
  export default python;

}
declare module 'simulator/python/registersDevice' {
  import FsDevice from 'simulator/python/FsDevice';
  import SharedRegisters from 'simulator/SharedRegisters';
  interface RegistersDeviceParams {
      registers: SharedRegisters;
  }
  const _default: (params: RegistersDeviceParams) => FsDevice;
  export default _default;

}
declare module 'simulator/require' {
  export interface EmscriptenModule {
      context: ModuleContext;
      print: (s: string) => void;
      printErr: (stderror: string) => void;
      onRuntimeInitialized?: () => void;
      _main?: () => void;
  }
  export interface ModuleContext {
      setRegister8b?: (address: number, value: number) => void;
      setRegister16b?: (address: number, value: number) => void;
      setRegister32b?: (address: number, value: number) => void;
      readRegister8b?: (address: number) => number;
      readRegister16b?: (address: number) => number;
      readRegister32b?: (address: number) => number;
      onStop?: () => void;
  }
  const _default: (code: string, context: ModuleContext, print: (s: string) => void, printErr: (stderror: string) => void) => EmscriptenModule;
  export default _default;

}
declare module 'simulator/state/State/Async' {
  import { WritableDraft } from 'immer/dist/internal';
  namespace Async {
      interface Error {
          message?: string;
          code: number;
      }
      enum Type {
          Unloaded = 0,
          Creating = 1,
          CreateFailed = 2,
          Loading = 3,
          LoadFailed = 4,
          Loaded = 5,
          Saveable = 6,
          Saving = 7,
          SaveFailed = 8,
          Deleting = 9,
          DeleteFailed = 10
      }
      const isFailed: <B, T>(async: Async<B, T>) => async is CreateFailed<T> | LoadFailed<B> | SaveFailed<B, T> | DeleteFailed<B, T>;
      interface Unloaded<B> {
          type: Type.Unloaded;
          brief?: B;
      }
      type UnloadedParams<B> = Omit<Unloaded<B>, 'type'>;
      const unloaded: <B>(params: UnloadedParams<B>) => Unloaded<B>;
      interface Creating<T> {
          type: Type.Creating;
          value: T;
      }
      type CreatingParams<T> = Omit<Creating<T>, 'type'>;
      const creating: <T>(params: CreatingParams<T>) => Creating<T>;
      interface CreateFailed<T> {
          type: Type.CreateFailed;
          value: T;
          error: Error;
      }
      type CreateFailedParams<T> = Omit<CreateFailed<T>, 'type'>;
      const createFailed: <T>(params: CreateFailedParams<T>) => CreateFailed<T>;
      interface Loading<B> {
          type: Type.Loading;
          brief?: B;
      }
      type LoadingParams<B> = Omit<Loading<B>, 'type'>;
      const loading: <B>(params: LoadingParams<B>) => Loading<B>;
      interface LoadFailed<B> {
          type: Type.LoadFailed;
          brief?: B;
          error: Error;
      }
      type LoadFailedParams<B> = Omit<LoadFailed<B>, 'type'>;
      const loadFailed: <B>(params: LoadFailedParams<B>) => LoadFailed<B>;
      interface Loaded<B, T> {
          type: Type.Loaded;
          brief?: B;
          value: T;
      }
      type LoadedParams<B, T> = Omit<Loaded<B, T>, 'type'>;
      const loaded: <B, T>(params: LoadedParams<B, T>) => Loaded<B, T>;
      interface Saveable<B, T> {
          type: Type.Saveable;
          brief?: B;
          original: T;
          value: T;
      }
      type SaveableParams<B, T> = Omit<Saveable<B, T>, 'type'>;
      const saveable: <B, T>(params: SaveableParams<B, T>) => Saveable<B, T>;
      interface Saving<B, T> {
          type: Type.Saving;
          brief?: B;
          original: T;
          value: T;
      }
      type SavingParams<B, T> = Omit<Saving<B, T>, 'type'>;
      const saving: <B, T>(params: SavingParams<B, T>) => Saving<B, T>;
      interface SaveFailed<B, T> {
          type: Type.SaveFailed;
          brief?: B;
          original: T;
          value: T;
          error: Error;
      }
      type SavingFailedParams<B, T> = Omit<SaveFailed<B, T>, 'type'>;
      const saveFailed: <B, T>(params: SavingFailedParams<B, T>) => SaveFailed<B, T>;
      interface Deleting<B, T> {
          type: Type.Deleting;
          brief?: B;
          value: T;
      }
      type DeletingParams<B, T> = Omit<Deleting<B, T>, 'type'>;
      const deleting: <B, T>(params: DeletingParams<B, T>) => Deleting<B, T>;
      interface DeleteFailed<B, T> {
          type: Type.DeleteFailed;
          brief?: B;
          value: T;
          error: Error;
      }
      type DeleteFailedParams<B, T> = Omit<DeleteFailed<B, T>, 'type'>;
      const deleteFailed: <B, T>(params: DeleteFailedParams<B, T>) => DeleteFailed<B, T>;
      const set: <B, T>(current: Async<B, T>, value: T) => Async<B, T>;
      const fail: <B, T>(current: Async<B, T>, error: Error) => Async<B, T>;
      const unfail: <B, T>(current: Async<B, T>) => Async<B, T>;
      const brief: <B, T>(current: Async<B, T>) => B;
      const previousValue: <B, T>(async: Async<B, T>) => T;
      const latestValue: <B, T>(async: Async<B, T>) => T;
      const isResident: <B, T>(async: Async<B, T>) => boolean;
      const reset: <B, T>(async: Async<B, T>) => Async<B, T>;
      const mutate: <B, T>(async: Async<B, T>, recipe: (draft: WritableDraft<T>) => void) => Async<B, T>;
  }
  type Async<B, T> = (Async.Unloaded<B> | Async.Creating<T> | Async.CreateFailed<T> | Async.Loading<B> | Async.LoadFailed<B> | Async.Loaded<B, T> | Async.Saveable<B, T> | Async.Saving<B, T> | Async.SaveFailed<B, T> | Async.Deleting<B, T> | Async.DeleteFailed<B, T>);
  export default Async;

}
declare module 'simulator/state/State/Documentation/DocumentationLocation' {
  namespace DocumentationLocation {
      enum Type {
          None = 0,
          File = 1,
          Function = 2,
          Module = 3,
          Structure = 4,
          Enumeration = 5
      }
      interface None {
          type: Type.None;
      }
      const NONE: None;
      interface File {
          type: Type.File;
          id: string;
      }
      const file: (params: Omit<File, "type">) => File;
      interface Function {
          type: Type.Function;
          id: string;
      }
      const func: (params: Omit<Function, "type">) => Function;
      interface Module {
          type: Type.Module;
          id: string;
      }
      const module: (params: Omit<Module, "type">) => Module;
      interface Structure {
          type: Type.Structure;
          id: string;
      }
      const structure: (params: Omit<Structure, "type">) => Structure;
      interface Enumeration {
          type: Type.Enumeration;
          id: string;
      }
      const enumeration: (params: Omit<Enumeration, "type">) => Enumeration;
  }
  type DocumentationLocation = (DocumentationLocation.None | DocumentationLocation.File | DocumentationLocation.Function | DocumentationLocation.Module | DocumentationLocation.Structure | DocumentationLocation.Enumeration);
  export default DocumentationLocation;

}
declare module 'simulator/state/State/Documentation/EnumerationDocumentation' {
  interface EnumerationDocumentation {
      id: string;
      name: string;
      values: EnumerationDocumentation.Value[];
      brief_description?: string;
      detailed_description?: string;
  }
  namespace EnumerationDocumentation {
      interface Value {
          name: string;
          brief_description?: string;
          detailed_description?: string;
      }
      const compare: (a: EnumerationDocumentation, b: EnumerationDocumentation) => number;
  }
  export default EnumerationDocumentation;

}
declare module 'simulator/state/State/Documentation/FileDocumentation' {
  interface FileDocumentation {
      id: string;
      name: string;
      functions: string[];
      structures: string[];
      enumerations: string[];
  }
  namespace FileDocumentation {
      const compare: (a: FileDocumentation, b: FileDocumentation) => number;
  }
  export default FileDocumentation;

}
declare module 'simulator/state/State/Documentation/FunctionDocumentation' {
  interface FunctionDocumentation {
      id: string;
      name: string;
      parameters: FunctionDocumentation.Parameter[];
      return_type: string;
      return_description?: string;
      brief_description?: string;
      detailed_description?: string;
  }
  namespace FunctionDocumentation {
      const compare: (a: FunctionDocumentation, b: FunctionDocumentation) => number;
      interface Parameter {
          name: string;
          type: string;
          description: string;
      }
  }
  export default FunctionDocumentation;

}
declare module 'simulator/state/State/Documentation/ModuleDocumentation' {
  interface ModuleDocumentation {
      id: string;
      name: string;
      functions: string[];
      structures: string[];
      enumerations: string[];
  }
  namespace ModuleDocumentation {
      const compare: (a: ModuleDocumentation, b: ModuleDocumentation) => number;
  }
  export default ModuleDocumentation;

}
declare module 'simulator/state/State/Documentation/StructureDocumentation' {
  interface StructureDocumentation {
      id: string;
      name: string;
      members: StructureDocumentation.Member[];
      brief_description?: string;
      detailed_description?: string;
  }
  namespace StructureDocumentation {
      interface Member {
          name: string;
          type: string;
          brief_description?: string;
          detailed_description?: string;
      }
      const compare: (a: StructureDocumentation, b: StructureDocumentation) => number;
  }
  export default StructureDocumentation;

}
declare module 'simulator/state/State/Documentation/TypeDocumentation' {
  interface TypeDocumentation {
      id: string;
      type: 'enumeration' | 'structure';
  }
  export default TypeDocumentation;

}
declare module 'simulator/state/State/Documentation/index' {
  import Dict from 'simulator/Dict';
  import EnumerationDocumentation from 'simulator/state/State/Documentation/EnumerationDocumentation';
  import DocumentationLocation from 'simulator/state/State/Documentation/DocumentationLocation';
  import FileDocumentation from 'simulator/state/State/Documentation/FileDocumentation';
  import FunctionDocumentation from 'simulator/state/State/Documentation/FunctionDocumentation';
  import ModuleDocumentation from 'simulator/state/State/Documentation/ModuleDocumentation';
  import StructureDocumentation from 'simulator/state/State/Documentation/StructureDocumentation';
  import TypeDocumentation from 'simulator/state/State/Documentation/TypeDocumentation';
  interface Documentation {
      files: Dict<FileDocumentation>;
      functions: Dict<FunctionDocumentation>;
      modules: Dict<ModuleDocumentation>;
      structures: Dict<StructureDocumentation>;
      enumerations: Dict<EnumerationDocumentation>;
      types: Dict<TypeDocumentation>;
  }
  namespace Documentation {
      const EMPTY: Documentation;
      interface SubsetParams {
          files?: string[];
          functions?: string[];
          modules?: string[];
          structures?: string[];
          enumerations?: string[];
          types?: string[];
      }
      const subset: (doc: Documentation, params: SubsetParams) => Documentation;
      const lookup: (doc: Documentation, query: string) => DocumentationLocation;
  }
  export default Documentation;

}
declare module 'simulator/state/State/Scene/Color' {
  export namespace Color {
      enum Type {
          Rgba = 0,
          Hsla = 1,
          Rgb = 2,
          Hsl = 3
      }
      interface Rgba {
          type: Type.Rgba;
          r: number;
          g: number;
          b: number;
          a: number;
      }
      namespace Rgba {
          const create: (r: number, g: number, b: number, a: number) => Rgba;
          const fromCss: (css: string) => Rgba;
          const toCss: (rgba: Rgba) => string;
          const toRgb: ({ r, g, b, a }: Rgba) => Rgb;
          const toHsla: (rgba: Rgba) => Hsla;
          const darken: (color: Rgba, percent: number) => Color;
          const lighten: (color: Rgba, percent: number) => Color;
      }
      interface Hsla {
          type: Type.Hsla;
          h: number;
          s: number;
          l: number;
          a: number;
      }
      namespace Hsla {
          const create: (h: number, s: number, l: number, a: number) => Hsla;
          const toCss: (hsla: Hsla) => string;
          const toHsl: ({ h, s, l, a }: Hsla) => Hsl;
          const toRgba: (hsla: Hsla) => Rgba;
          const toRgb: (hsla: Hsla) => Rgb;
      }
      interface Rgb {
          type: Type.Rgb;
          r: number;
          g: number;
          b: number;
      }
      namespace Rgb {
          const create: (r: number, g: number, b: number) => Rgb;
          const toRgba: (rgb: Rgb) => Rgba;
          const fromHex: (hex: string) => Rgb;
          const fromCss: (css: string) => Rgb;
          const toCss: (rgb: Rgb) => string;
          const toHsl: (rgb: Rgb) => Hsl;
          const darken: (color: Rgb, percent: number) => Rgb;
          const lighten: (color: Rgb, percent: number) => Color;
      }
      interface Hsl {
          type: Type.Hsl;
          h: number;
          s: number;
          l: number;
      }
      namespace Hsl {
          const create: (h: number, s: number, l: number) => Hsl;
          const fromCss: (css: string) => Hsl;
          const toCss: (hsl: Hsl) => string;
          const toRgb: (hsl: Hsl) => Rgb;
      }
      const rgb: (r: number, g: number, b: number) => Rgb;
      const hsl: (h: number, s: number, l: number) => Hsl;
      const rgba: (r: number, g: number, b: number, a: number) => Rgba;
      const hsla: (h: number, s: number, l: number, a: number) => Hsla;
      const toRgb: (color: Color) => Rgb;
      const toCss: (color: Color) => string;
      const WHITE: Rgb;
      const BLACK: Rgb;
  }
  export type Color = Color.Rgba | Color.Hsla | Color.Rgb | Color.Hsl;

}
declare module 'simulator/state/State/index' {
  import { Size } from 'simulator/components/Widget';
  import LocalizedString from 'simulator/util/LocalizedString';
  import Documentation from 'simulator/state/State/Documentation/index';
  import DocumentationLocation from 'simulator/state/State/Documentation/DocumentationLocation';
  export interface DocumentationState {
      documentation: Documentation;
      locationStack: DocumentationLocation[];
      size: Size;
      language: 'c' | 'python';
  }
  export namespace DocumentationState {
      const DEFAULT: DocumentationState;
  }
  export interface I18n {
      locale: LocalizedString.Language;
  }

}
declare module 'simulator/state/history' {
  const _default: import("history").History<unknown>;
  export default _default;

}
declare module 'simulator/state/index' {
  import { DocumentationState, I18n } from 'simulator/state/State/index';
  import { RouterState } from 'connected-react-router';
  const _default: import("redux").Store<import("redux").EmptyObject & State, import("redux").AnyAction>;
  export default _default;
  export interface State {
      documentation: DocumentationState;
      router: RouterState;
      i18n: I18n;
  }

}
declare module 'simulator/state/reducer/documentation' {
  import { DocumentationState } from 'simulator/state/State/index';
  import DocumentationLocation from 'simulator/state/State/Documentation/DocumentationLocation';
  import { Size } from 'simulator/components/Widget';
  export namespace DocumentationAction {
      interface Push {
          type: 'documentation/push';
          location: DocumentationLocation;
      }
      const pushLocation: (params: Omit<Push, "type">) => Push;
      interface Pop {
          type: 'documentation/pop';
      }
      const POP: Pop;
      interface PopAll {
          type: 'documentation/pop-all';
      }
      const POP_ALL: PopAll;
      interface Hide {
          type: 'documentation/hide';
      }
      const HIDE: Hide;
      interface Show {
          type: 'documentation/show';
      }
      const SHOW: Show;
      interface SetSize {
          type: 'documentation/set-size';
          size: Size;
      }
      const setSize: (params: Omit<SetSize, "type">) => SetSize;
      interface Toggle {
          type: 'documentation/toggle';
      }
      const TOGGLE: Toggle;
      interface PopSome {
          type: 'documentation/pop-some';
          count: number;
      }
      const popSome: (params: Omit<PopSome, "type">) => PopSome;
      interface SetLanguage {
          type: 'documentation/set-language';
          language: 'c' | 'python';
      }
      const setLanguage: (params: Omit<SetLanguage, "type">) => SetLanguage;
      interface GoTo {
          type: 'documentation/go-to';
          location: DocumentationLocation;
          language: 'c' | 'python';
      }
      const goTo: (params: Omit<GoTo, "type">) => GoTo;
      interface GoToFuzzy {
          type: 'documentation/go-to-fuzzy';
          query: string;
          language: 'c' | 'python';
      }
      const goToFuzzy: (params: Omit<GoToFuzzy, "type">) => GoToFuzzy;
  }
  export type DocumentationAction = (DocumentationAction.Push | DocumentationAction.Pop | DocumentationAction.PopAll | DocumentationAction.Hide | DocumentationAction.Show | DocumentationAction.SetSize | DocumentationAction.Toggle | DocumentationAction.PopSome | DocumentationAction.SetLanguage | DocumentationAction.GoTo | DocumentationAction.GoToFuzzy);
  export const reduceDocumentation: (state: DocumentationState, action: DocumentationAction) => DocumentationState;

}
declare module 'simulator/state/reducer/i18n' {
  import { I18n } from 'simulator/state/State/index';
  import LocalizedString from 'simulator/util/LocalizedString';
  export namespace I18nAction {
      interface SetLocale {
          type: 'i18n/set-locale';
          locale: LocalizedString.Language;
      }
      const setLocale: (params: Omit<SetLocale, "type">) => SetLocale;
  }
  export type I18nAction = I18nAction.SetLocale;
  export const reduceI18n: (state: I18n, action: I18nAction) => I18n;

}
declare module 'simulator/state/reducer/index' {
  export * from 'simulator/state/reducer/documentation';
  export * from 'simulator/state/reducer/i18n';

}
declare module 'simulator/state/reducer/util' {
  import { WritableDraft } from 'immer/dist/internal';
  import Dict from 'simulator/Dict';
  import Async from 'simulator/state/State/Async';
  export const mutate: <B, T>(values: Dict<Async<B, T>>, id: string, recipe: (draft: WritableDraft<T>) => void) => {
      [x: string]: Async<B, T>;
  };

}
declare module 'simulator/style' {
  import * as React from 'react';
  export interface StyleProps {
      className?: string;
      style?: React.CSSProperties;
  }

}
declare module 'simulator/util/GlobalEvents' {
  /**
   * GlobalEvents allows components to easily register callbacks for window-wide events, such
   * as mouse move or mouse up.
   *
   * This is useful when a drag action, for example, shouldn't end when the cursor leaves the
   * component (e.g. scroll bars).
   *
   * The component must remember to remove itself once the callback is no longer needed
   * or the component will unmount.
   */
  export class GlobalEvents {
      private types_;
      constructor();
      private handles_;
      private iter_;
      add<T>(type: keyof GlobalEvents.EventTypes, callback: GlobalEvents.EventCallback<T>): GlobalEvents.Handle;
      remove(id: number): void;
  }
  export namespace GlobalEvents {
      type EventCallback<T = unknown> = (event: T) => boolean;
      class EventType<T> {
          private callbacks_;
          private iter_;
          add(callback: EventCallback<T>): number;
          remove(id: number): void;
          trigger: (event: T) => boolean;
      }
      interface EventTypes {
          onMouseMove: EventType<MouseEvent>;
          onMouseUp: EventType<MouseEvent>;
      }
      type Handle = number;
  }
  export const GLOBAL_EVENTS: GlobalEvents;

}
declare module 'simulator/util/LocalizedString' {
  interface LocalizedString {
      [locale: string]: string;
  }
  namespace LocalizedString {
      const EN_US = "en-US";
      const EN_UK = "en-UK";
      const ZH_CN = "zh-CN";
      const ZH_TW = "zh-TW";
      const JA_JP = "ja-JP";
      const KO_KR = "ko-KR";
      const HI_IN = "hi-IN";
      const ES_ES = "es-ES";
      const ES_MX = "es-MX";
      const FR_FR = "fr-FR";
      const DE_DE = "de-DE";
      const IT_IT = "it-IT";
      const PT_BR = "pt-BR";
      const PT_PT = "pt-PT";
      const RU_RU = "ru-RU";
      const AR_SA = "ar-SA";
      const TR_TR = "tr-TR";
      const PL_PL = "pl-PL";
      const NL_NL = "nl-NL";
      const SV_SE = "sv-SE";
      const DA_DK = "da-DK";
      const NO_NO = "no-NO";
      const FI_FI = "fi-FI";
      const HU_HU = "hu-HU";
      const CS_CZ = "cs-CZ";
      const SK_SK = "sk-SK";
      const RO_RO = "ro-RO";
      const BG_BG = "bg-BG";
      const EL_GR = "el-GR";
      const HE_IL = "he-IL";
      const TH_TH = "th-TH";
      const VI_VN = "vi-VN";
      const ID_ID = "id-ID";
      const MS_MY = "ms-MY";
      const FA_IR = "fa-IR";
      const UR_PK = "ur-PK";
      type Language = (typeof EN_US | typeof EN_UK | typeof ZH_CN | typeof ZH_TW | typeof JA_JP | typeof KO_KR | typeof HI_IN | typeof ES_ES | typeof ES_MX | typeof FR_FR | typeof DE_DE | typeof IT_IT | typeof PT_BR | typeof PT_PT | typeof RU_RU | typeof AR_SA | typeof TR_TR | typeof PL_PL | typeof NL_NL | typeof SV_SE | typeof DA_DK | typeof NO_NO | typeof FI_FI | typeof HU_HU | typeof CS_CZ | typeof SK_SK | typeof RO_RO | typeof BG_BG | typeof EL_GR | typeof HE_IL | typeof TH_TH | typeof VI_VN | typeof ID_ID | typeof MS_MY | typeof FA_IR | typeof UR_PK);
      const FALLBACKS: {
          [locale in Language]: Language[];
      };
      const lookup: (localizedString: LocalizedString, locale: Language) => string;
      const SUPPORTED_LANGUAGES: string[];
      const NATIVE_LOCALE_NAMES: {
          [locale in Language]: string;
      };
  }
  export default LocalizedString;

}
declare module 'simulator/util/Patch' {
  import Dict from "simulator/Dict";
  namespace Patch {
      enum Type {
          /**
           * Unchanged
           */
          None = 0,
          /**
           * Added to a dictionary
           */
          Add = 1,
          /**
           * Removed from a dictionary
           */
          Remove = 2,
          /**
           * A change of a sum type's variant (e.g., cone -> mesh)
           */
          OuterChange = 3,
          /**
           * A change inside of an object (e.g., cone height)
           */
          InnerChange = 4
      }
      interface None<T> {
          type: Type.None;
          prev: T;
      }
      interface Add<T> {
          type: Type.Add;
          next: T;
      }
      interface Remove<T> {
          type: Type.Remove;
          prev: T;
      }
      interface OuterChange<T> {
          type: Type.OuterChange;
          prev: T;
          next: T;
      }
      type InnerPatch<T> = {
          [P in keyof T]: Patch<T[P]>;
      };
      interface InnerChange<T> {
          type: Type.InnerChange;
          prev: T;
          next: T;
          inner: InnerPatch<T>;
      }
      const none: <T>(prev: T) => None<T>;
      const add: <T>(next: T) => Add<T>;
      const remove: <T>(prev: T) => Remove<T>;
      const outerChange: <T>(prev: T, next: T) => OuterChange<T>;
      const innerChange: <T>(prev: T, next: T, inner: InnerPatch<T>) => InnerChange<T>;
      const diffPrimitive: <T>(prev: T, next: T) => Patch<T>;
      const diffArray: <T>(prev: T[], next: T[]) => OuterChange<T[]> | None<T[]>;
      const diff: <T>(prev: T, next: T) => Patch<T>;
      const diffDict: <T>(prev: Dict<T>, next: Dict<T>, differ: (prev: T, next: T) => Patch<T>) => Dict<Patch<T>>;
      const applyInner: <T>(patch: InnerChange<T>, value: T) => T;
      const apply: <T>(patch: Patch<T>, value: T) => T;
      const applyDict: <T>(patch: Dict<Patch<T>>, value: Dict<T>) => Dict<T>;
  }
  /**
   * The result of a structured diff operation over a supported type
   */
  type Patch<T> = Patch.None<T> | Patch.Add<T> | Patch.Remove<T> | Patch.OuterChange<T> | Patch.InnerChange<T>;
  export default Patch;

}
declare module 'simulator/util/Reference' {
  namespace Reference {
      enum Type {
          Local = "local",
          Remote = "remote"
      }
      interface Local<T> {
          type: Type.Local;
          value: T;
      }
      interface Remote {
          type: Type.Remote;
          id: string;
      }
  }
  type Reference<T> = (Reference.Local<T> | Reference.Remote);
  export default Reference;

}
declare module 'simulator/util/SetOps' {
  export namespace SetOps {
      const difference: <T>(a: Set<T>, b: Set<T>) => Set<T>;
      const union: <T>(a: Set<T>, b: Set<T>) => Set<T>;
      const filter: <T>(a: Set<T>, f: (x: T) => boolean) => Set<T>;
      const intersection: <T>(a: Set<T>, b: Set<T>) => Set<T>;
  }

}
declare module 'simulator/util/StyledText' {
  import * as React from 'react';
  export namespace StyledText {
      enum Type {
          Text = 0,
          Component = 1,
          Composition = 2,
          NewLine = 3
      }
      interface Text {
          type: Type.Text;
          text: string;
          style?: React.CSSProperties;
          props?: React.HTMLProps<HTMLSpanElement>;
      }
      type TextParams = Omit<Text, 'type'>;
      const text: (params: TextParams) => StyledText;
      interface NewLine {
          type: Type.NewLine;
      }
      type NewLineParams = Omit<NewLine, 'type'>;
      const newLine: (params?: NewLineParams) => NewLine;
      interface Component {
          type: Type.Component;
          component: React.ComponentType<object>;
          props?: object;
      }
      type ComponentParams = Omit<Component, 'type'>;
      const component: (params: ComponentParams) => Component;
      interface Composition {
          type: Type.Composition;
          items: StyledText[];
      }
      type CompositionParams = Omit<Composition, 'type'>;
      const compose: (params: CompositionParams) => Composition;
      const extend: (existing: StyledText, extension: StyledText, maxItems?: number) => StyledText;
      const toString: (text: StyledText) => string;
  }
  export type StyledText = StyledText.Text | StyledText.Component | StyledText.Composition | StyledText.NewLine;
  export type AnyText = StyledText | string;

}
declare module 'simulator/util/Validator' {
  export interface GeneralValidator {
      validate: (value: string, length?: number) => boolean;
  }
  export namespace Validators {
      enum Types {
          Lowercase = "lowercase",
          Uppercase = "uppercase",
          Alpha = "alpha",
          Numeric = "number",
          Special = "special",
          Length = "length",
          Email = "email"
      }
      interface Lowercase extends GeneralValidator {
          type: Validators.Lowercase;
      }
      namespace Lowercase { }
      interface Uppercase extends GeneralValidator {
          type: Validators.Uppercase;
      }
      namespace Uppercase { }
      interface Alpha extends GeneralValidator {
          type: Validators.Alpha;
      }
      namespace Alpha { }
      interface Numeric extends GeneralValidator {
          type: Validators.Numeric;
      }
      namespace Numeric { }
      interface Special extends GeneralValidator {
          type: Validators.Special;
      }
      namespace Special { }
      interface Length extends GeneralValidator {
          type: Validators.Length;
      }
      namespace Length { }
      interface Email extends GeneralValidator {
          type: Validators.Email;
      }
      namespace Email { }
      function validate(value: string, type: Types, length?: number): boolean;
      type Validator = Lowercase | Uppercase | Alpha | Numeric | Special | Email;
      function validateMultiple(value: string, validators: Validators.Types[]): boolean;
      function validatePassword(value: string): boolean;
  }

}
declare module 'simulator/util/construct' {
  const _default: <T extends {
      type: unknown;
  }>(type: T["type"]) => (params: Omit<T, "type">) => T;
  export default _default;

}
declare module 'simulator/util/empties' {
  export const EMPTY_OBJECT: {};
  export const EMPTY_ARRAY: any[];

}
declare module 'simulator/util/index' {
  export * from 'simulator/util/slow';
  export * from 'simulator/util/GlobalEvents';
  export * from 'simulator/util/empties';
  export * from 'simulator/util/StyledText';
  export * from 'simulator/util/SetOps';
  export * from 'simulator/util/types';

}
declare module 'simulator/util/parse-messages' {
  import { Message } from 'ivygate';
  import { StyledText } from 'simulator/util/StyledText';
  export const hasErrors: (messages: Message[]) => boolean;
  export const hasWarnings: (messages: Message[]) => boolean;
  const _default: (stderr: string) => Message[];
  export default _default;
  export const sort: (message: Message[]) => Message[];
  export const toStyledText: (message: Message, props?: React.HTMLProps<HTMLSpanElement>) => StyledText;

}
declare module 'simulator/util/slow' {
  export class Slow {
      private ticks_;
      private frequency_;
      constructor(frequency?: number);
      log(...message: unknown[]): void;
  }

}
declare module 'simulator/util/types' {
  export type DistributiveOmit<T, K extends keyof T> = T extends unknown ? Omit<T, K> : never;

}
declare module 'simulator/worker' {
  export {};

}
declare module 'simulator' {
  import main = require('simulator/index');
  export = main;
}