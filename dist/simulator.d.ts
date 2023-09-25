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
declare module 'simulator/ProgrammingLanguage' {
  type ProgrammingLanguage = 'c' | 'cpp' | 'python';
  namespace ProgrammingLanguage {
      const FILE_EXTENSION: {
          [key in ProgrammingLanguage]: string;
      };
      const DEFAULT_CODE: {
          [key in ProgrammingLanguage]: string;
      };
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
declare module 'simulator/RobotBinding' {
  import { Scene as BabylonScene } from '@babylonjs/core/scene';
  import { PhysicsViewer as BabylonPhysicsViewer } from '@babylonjs/core/Debug/physicsViewer';
  import { IPhysicsEnabledObject as BabylonIPhysicsEnabledObject } from '@babylonjs/core/Physics/physicsImpostor';
  import { Mesh as BabylonMesh } from '@babylonjs/core/Meshes/mesh';
  import { Ray as BabylonRay } from '@babylonjs/core/Culling/ray';
  import '@babylonjs/core/Physics/physicsEngineComponent';
  import SceneNode from 'simulator/state/State/Scene/Node';
  import Robot from 'simulator/state/State/Robot/index';
  import Node from 'simulator/state/State/Robot/Node';
  import { ReferenceFrame } from 'simulator/unit-math';
  import { Angle } from 'simulator/util/Value';
  import Dict from 'simulator/Dict';
  import WriteCommand from 'simulator/AbstractRobot/WriteCommand';
  import AbstractRobot from 'simulator/AbstractRobot/index';
  class RobotBinding {
      private bScene_;
      private robot_;
      get robot(): Robot;
      private childrenNodeIds_;
      private rootId_;
      private robotSceneId_;
      private links_;
      get links(): Dict<BabylonMesh>;
      private weights_;
      private fixed_;
      private motors_;
      private servos_;
      private motorPorts_;
      private servoPorts_;
      private digitalSensors_;
      private digitalPorts_;
      private analogSensors_;
      private analogPorts_;
      private colliders_;
      private physicsViewer_;
      constructor(bScene: BabylonScene, physicsViewer?: BabylonPhysicsViewer);
      private buildGeometry_;
      private createLink_;
      private createSensor_;
      private createTouchSensor_;
      private createEtSensor_;
      private createLightSensor_;
      private createReflectanceSensor_;
      private static connectedAxisAngle_;
      private createWeight_;
      private bParentChild_;
      private createHinge_;
      private hingeAngle_;
      private setMotorVelocity_;
      private lastTick_;
      private lastMotorAngles_;
      private outstandingDigitalGetValues_;
      private outstandingAnalogGetValues_;
      private latestDigitalValues_;
      private latestAnalogValues_;
      private lastPErrs_;
      private iErrs_;
      private brakeAt_;
      private positionDeltaFracs_;
      private lastServoEnabledAngle_;
      tick(readable: AbstractRobot.Readable): RobotBinding.TickOut;
      get linkOrigins(): Dict<ReferenceFrame>;
      set linkOrigins(linkOrigins: Dict<ReferenceFrame>);
      get origin(): ReferenceFrame;
      set origin(origin: ReferenceFrame);
      get visible(): boolean;
      set visible(visible: boolean);
      setRobot(sceneRobot: SceneNode.Robot, robot: Robot, robotSceneId: string): Promise<void>;
      dispose(): void;
      set realisticSensors(realisticSensors: boolean);
      set noisySensors(noisySensors: boolean);
  }
  namespace RobotBinding {
      interface TickOut {
          /**
           * The new origin of the robot
           */
          origin: ReferenceFrame;
          writeCommands: WriteCommand[];
      }
      namespace TickOut {
          const NIL: TickOut;
      }
      interface OutstandingPromise<T> {
          doneObj: {
              done: boolean;
          };
          valueObj: {
              value: T;
          };
      }
      namespace OutstandingPromise {
          const create: <T>(promise: Promise<T>) => OutstandingPromise<T>;
          const isDone: <T>(promise: OutstandingPromise<T>) => boolean;
          const value: <T>(promise: OutstandingPromise<T>) => T;
      }
      interface Sensor<T> {
          getValue(): Promise<T>;
          dispose(): void;
          realistic: boolean;
          noisy: boolean;
          visible: boolean;
      }
      interface SensorParameters<T> {
          id: string;
          definition: T;
          parent: BabylonMesh;
          scene: BabylonScene;
          links: Set<BabylonMesh>;
          colliders: Set<BabylonIPhysicsEnabledObject>;
      }
      abstract class SensorObject<T, O> implements Sensor<O> {
          private parameters_;
          get parameters(): SensorParameters<T>;
          private realistic_;
          get realistic(): boolean;
          set realistic(realistic: boolean);
          private visible_;
          get visible(): boolean;
          set visible(visible: boolean);
          private noisy_;
          get noisy(): boolean;
          set noisy(noisy: boolean);
          constructor(parameters: SensorParameters<T>);
          abstract getValue(): Promise<O>;
          abstract dispose(): void;
      }
      class TouchSensor extends SensorObject<Node.TouchSensor, boolean> {
          private intersector_;
          constructor(parameters: SensorParameters<Node.TouchSensor>);
          getValue(): Promise<boolean>;
          dispose(): void;
      }
      class EtSensor extends SensorObject<Node.EtSensor, number> {
          private trace_;
          private static readonly DEFAULT_MAX_DISTANCE;
          private static readonly DEFAULT_NOISE_RADIUS;
          private static readonly FORWARD;
          constructor(parameters: SensorParameters<Node.EtSensor>);
          getValue(): Promise<number>;
          dispose(): void;
      }
      /**
       * A light sensor that detects the amount of light at a given point in space.
       *
       * This assumes the sensor can receive light from all directions. A ray is cast
       * to every light in the scene. If it collides with a mesh, it is considered
       * blocked. Otherwise, the light is considered to be received.
       *
       * The sensor value is the sum of the light intensities of all lights that are
       * not blocked, normalized to a calibrated value from measurements on a Wombat.
       */
      class LightSensor extends SensorObject<Node.LightSensor, number> {
          private trace_;
          private rayTrace_;
          private static AMBIENT_LIGHT_VALUE;
          private static DEFAULT_NOISE_RADIUS;
          private static lightValue_;
          constructor(parameters: SensorParameters<Node.LightSensor>);
          intersects(ray: BabylonRay): boolean;
          getValue(): Promise<number>;
          dispose(): void;
      }
      class ReflectanceSensor extends SensorObject<Node.ReflectanceSensor, number> {
          private trace_;
          private lastHitTextureId_;
          private lastHitPixels_;
          private static readonly DEFAULT_MAX_DISTANCE;
          private static readonly DEFAULT_NOISE_RADIUS;
          private static readonly FORWARD;
          constructor(parameters: SensorParameters<Node.ReflectanceSensor>);
          getValue(): Promise<number>;
          dispose(): void;
      }
      const SERVO_LOGICAL_MIN_ANGLE: Angle.Degrees;
      const SERVO_LOGICAL_MAX_ANGLE: Angle.Degrees;
      const SERVO_LOGICAL_MIN_ANGLE_RADS: number;
      const SERVO_LOGICAL_MAX_ANGLE_RADS: number;
      const SERVO_LOGICAL_RANGE_RADS: number;
  }
  export default RobotBinding;

}
declare module 'simulator/RobotPosition' {
  import { Angle, Distance } from "simulator/util/index";
  export interface RobotPosition {
      x: Distance;
      y: Distance;
      z: Distance;
      theta: Angle;
  }

}
declare module 'simulator/Robotable' {
  import { ReferenceFrame } from "simulator/unit-math";
  interface Robotable {
      setOrigin(origin: ReferenceFrame): void;
  }
  export default Robotable;

}
declare module 'simulator/SceneBinding' {
  import { Scene as BabylonScene } from '@babylonjs/core/scene';
  import { TransformNode as BabylonTransformNode } from '@babylonjs/core/Meshes/transformNode';
  import { AbstractMesh as BabylonAbstractMesh } from '@babylonjs/core/Meshes/abstractMesh';
  import { Camera as BabylonCamera } from '@babylonjs/core/Cameras/camera';
  import '@babylonjs/core/Engines/Extensions/engine.views';
  import '@babylonjs/core/Lights/Shadows/shadowGeneratorSceneComponent';
  import Dict from "simulator/Dict";
  import Scene from "simulator/state/State/Scene/index";
  import { ReferenceFrame } from "simulator/unit-math";
  import RobotBinding from 'simulator/RobotBinding';
  import Robot from 'simulator/state/State/Robot/index';
  import AbstractRobot from 'simulator/AbstractRobot/index';
  import ScriptManager from 'simulator/ScriptManager/index';
  export type FrameLike = BabylonTransformNode | BabylonAbstractMesh;
  export interface SceneMeshMetadata {
      id: string;
      selected?: boolean;
  }
  class SceneBinding {
      private bScene_;
      get bScene(): BabylonScene;
      private root_;
      get root(): BabylonTransformNode;
      private scene_;
      get scene(): Scene;
      set scene(s: Scene);
      private nodes_;
      private shadowGenerators_;
      private physicsViewer_;
      private camera_;
      private engineView_;
      private ammo_;
      private robots_;
      private robotBindings_;
      private scriptManager_;
      get scriptManager(): ScriptManager;
      get camera(): BabylonCamera;
      private canvas_;
      get canvas(): HTMLCanvasElement;
      set canvas(canvas: HTMLCanvasElement);
      /**
       * `declineTicks` is used for a race between initial robot origin setting and tick origin updates.
       * When this is true, the tick() method will exit immediately and return undefined.
       */
      private declineTicks_;
      private materialIdIter_;
      constructor(bScene: BabylonScene, ammo: unknown);
      private robotLinkOrigins_;
      set robotLinkOrigins(robotLinkOrigins: Dict<Dict<ReferenceFrame>>);
      get currentRobotLinkOrigins(): Dict<Dict<ReferenceFrame>>;
      private static apply_;
      private buildGeometry_;
      private buildGeometryFaceUvs_;
      private findBNode_;
      private createMaterial_;
      private updateMaterialBasic_;
      private updateMaterialPbr_;
      private updateMaterial_;
      private createObject_;
      private createEmpty_;
      private createDirectionalLight_;
      private createSpotLight_;
      private createPointLight_;
      private createRobot_;
      private static createShadowGenerator_;
      private createNode_;
      private updateNodePosition_;
      private updateEmpty_;
      private findMaterial_;
      private updateObject_;
      private updateDirectionalLight_;
      private updateSpotLight_;
      private updatePointLight_;
      private updateRobot_;
      private updateFromTemplate_;
      private updateNode_;
      private destroyNode_;
      private gizmoManager_;
      private createArcRotateCamera_;
      private createNoneCamera_;
      private createCamera_;
      private updateArcRotateCamera_;
      private updateCamera_;
      private cachedCollideCallbacks_;
      private restorePhysicsImpostor;
      private removePhysicsImpostor;
      private collisionFilters_;
      private intersectionFilters_;
      private syncCollisionFilters_;
      private onCollisionFiltersChanged_;
      private onIntersectionFiltersChanged_;
      private onCollideEvent_;
      readonly setScene: (scene: Scene, robots: Dict<Robot>) => Promise<void>;
      private currentIntersections_;
      private nodeMeshes_;
      private nodeMinMaxes_;
      private nodeBoundingBoxes_;
      tick(abstractRobots: Dict<AbstractRobot.Readable>): Dict<RobotBinding.TickOut>;
      set realisticSensors(realisticSensors: boolean);
      set noisySensors(noisySensors: boolean);
  }
  export default SceneBinding;

}
declare module 'simulator/ScriptManager/ScriptSceneBinding' {
  import Dict from 'simulator/Dict';
  import Camera from 'simulator/state/State/Scene/Camera';
  import Geometry from 'simulator/state/State/Scene/Geometry';
  import Node from 'simulator/state/State/Scene/Node';
  import { Vector3 } from 'simulator/unit-math';
  export type Ids = string | string[] | Set<string>;
  export namespace Ids {
      const toSet: (ids: Ids) => Set<string>;
  }
  export interface ScriptSceneBinding {
      readonly nodes: Dict<Node>;
      addNode(node: Node, id?: string): string;
      removeNode(id: string): void;
      setNode(id: string, node: Node): any;
      readonly geometry: Dict<Geometry>;
      addGeometry(geometry: Geometry, id?: string): string;
      removeGeometry(id: string): void;
      gravity: Vector3;
      camera: Camera;
      selectedNodeId?: string;
      readonly programStatus: 'running' | 'stopped';
      addOnRenderListener(cb: () => void): string;
      addOnCollisionListener(nodeId: string, cb: (otherNodeId: string, point: Vector3) => void, filterIds: Ids): string;
      addOnIntersectionListener(nodeId: string, cb: (type: 'start' | 'end', otherNodeId: string) => void, filterIds: Ids): string;
      addOnClickListener(filterIds: Ids, cb: (nodeId: string) => void): string;
      removeListener(handle: string): void;
      onBind?: (nodeId: string) => void;
      onUnbind?: (nodeId: string) => void;
      onDispose?: () => void;
      postTestResult: (data: unknown) => void;
      setChallengeEventValue: (eventId: string, value: boolean) => void;
  }

}
declare module 'simulator/ScriptManager/index' {
  import Dict from 'simulator/Dict';
  import Scene from 'simulator/state/State/Scene/index';
  import Camera from 'simulator/state/State/Scene/Camera';
  import Geometry from 'simulator/state/State/Scene/Geometry';
  import Node from 'simulator/state/State/Scene/Node';
  import Script from 'simulator/state/State/Scene/Script';
  import { Vector3 } from 'simulator/unit-math';
  import { Ids, ScriptSceneBinding } from 'simulator/ScriptManager/ScriptSceneBinding';
  class ScriptManager {
      private scene_;
      get scene(): Scene;
      set scene(scene: Scene);
      onNodeAdd?: (id: string, node: Node) => void;
      onNodeRemove?: (id: string) => void;
      onNodeChange?: (id: string, node: Node) => void;
      onGeometryAdd?: (id: string, geometry: Geometry) => void;
      onGeometryRemove?: (id: string) => void;
      onGravityChange?: (gravity: Vector3) => void;
      onCameraChange?: (camera: Camera) => void;
      onSelectedNodeIdChange?: (id: string) => void;
      onChallengeSetEventValue?: (eventId: string, value: boolean) => void;
      private programStatus_;
      get programStatus(): 'running' | 'stopped';
      set programStatus(status: 'running' | 'stopped');
      private scriptExecutions_;
      set(id: string, script: Script): string;
      bind(scriptId: string, nodeId: string): void;
      unbind(scriptId: string, nodeId: string): void;
      remove(id: string): void;
      trigger(event: ScriptManager.Event): void;
      dispose(): void;
      private collisionRefCounts_;
      private intersectionRefCounts_;
      onCollisionFiltersChanged: (nodeId: string, filterIds: Set<string>) => void;
      onIntersectionFiltersChanged: (nodeId: string, filterIds: Set<string>) => void;
      private addRefCounts_;
      private removeRefCounts_;
      readonly addCollisionRefCounts_: (listener: ScriptManager.Listener.Collision) => void;
      readonly removeCollisionRefCounts_: (listener: ScriptManager.Listener.Collision) => void;
      readonly addIntersectionRefCounts_: (listener: ScriptManager.Listener.Intersection) => void;
      readonly removeIntersectionRefCounts_: (listener: ScriptManager.Listener.Intersection) => void;
      onPostTestResult: (data: unknown) => void;
  }
  namespace ScriptManager {
      namespace Event {
          enum Type {
              Render = 0,
              Collision = 1,
              IntersectionStart = 2,
              IntersectionEnd = 3,
              Click = 4
          }
          interface Render {
              type: Type.Render;
          }
          const RENDER: Render;
          interface Collision {
              type: Type.Collision;
              nodeId: string;
              otherNodeId: string;
              point: Vector3;
          }
          const collision: (params: Omit<Collision, "type">) => Collision;
          interface IntersectionStart {
              type: Type.IntersectionStart;
              nodeId: string;
              otherNodeId: string;
          }
          const intersectionStart: (params: Omit<IntersectionStart, "type">) => IntersectionStart;
          interface IntersectionEnd {
              type: Type.IntersectionEnd;
              nodeId: string;
              otherNodeId: string;
          }
          const intersectionEnd: (params: Omit<IntersectionEnd, "type">) => IntersectionEnd;
          interface Click {
              type: Type.Click;
              nodeId: string;
          }
          const click: (params: Omit<Click, "type">) => Click;
      }
      type Event = (Event.Render | Event.Collision | Event.IntersectionStart | Event.IntersectionEnd | Event.Click);
      namespace Listener {
          enum Type {
              Render = 0,
              Collision = 1,
              Intersection = 2,
              Click = 3
          }
          interface Render {
              type: Type.Render;
              cb: () => void;
          }
          const render: (params: Omit<Render, "type">) => Render;
          interface Collision {
              type: Type.Collision;
              nodeId: string;
              filterIds: Set<string>;
              cb: (otherNodeId: string, point: Vector3) => void;
          }
          const collision: (params: Omit<Collision, "type">) => Collision;
          interface Intersection {
              type: Type.Intersection;
              nodeId: string;
              filterIds: Set<string>;
              cb: (type: 'start' | 'end', otherNodeId: string) => void;
          }
          const intersection: (params: Omit<Intersection, "type">) => Intersection;
          interface Click {
              type: Type.Click;
              filterIds: Set<string>;
              cb: (nodeId: string) => void;
          }
          const click: (params: Omit<Click, "type">) => Click;
      }
      type Listener = (Listener.Render | Listener.Collision | Listener.Intersection | Listener.Click);
      type CachedListener = Omit<Listener.Collision | Listener.Intersection, 'cb' | 'nodeId'>;
      interface TaggedCachedListener extends CachedListener {
          handle: string;
      }
      interface ListenerRefCount {
          /**
           * Map of filtered node ids to reference counts.
           */
          filterIds: Dict<number>;
      }
      namespace TaggedCachedListener {
          const fromListener: (handle: string, listener: Listener.Collision | Listener.Intersection) => TaggedCachedListener;
      }
      class ScriptExecution implements ScriptSceneBinding {
          private script_;
          private manager_;
          private listeners_;
          private boundNodeIds_;
          private spawnFunc_;
          constructor(script: Script, manager: ScriptManager);
          get programStatus(): "stopped" | "running";
          trigger(event: Event): void;
          private triggerRender_;
          private triggerCollision_;
          private triggerIntersection_;
          private triggerClick_;
          bind(nodeId: string): void;
          unbind(nodeId: string): void;
          dispose(): void;
          get nodes(): Dict<Node>;
          addNode(node: Node, id?: string): string;
          removeNode(id: string): void;
          setNode(id: string, node: Node): void;
          get geometry(): Dict<Geometry>;
          addGeometry(geometry: Geometry, id?: string): string;
          removeGeometry(id: string): void;
          get gravity(): Vector3;
          set gravity(gravity: Vector3);
          get camera(): Camera;
          set camera(camera: Camera);
          get selectedNodeId(): string | null;
          set selectedNodeId(nodeId: string | null);
          addOnRenderListener(cb: () => void): string;
          addOnCollisionListener(nodeId: string, cb: (otherNodeId: string, point: Vector3) => void, filterIds?: Ids): string;
          addOnIntersectionListener(nodeId: string, cb: (type: 'start' | 'end', otherNodeId: string) => void, filterIds?: Ids): string;
          addOnClickListener(filterIds: Ids, cb: (nodeId: string) => void): string;
          removeListener(handle: string): void;
          onBind?: (nodeId: string) => void;
          onUnbind?: (nodeId: string) => void;
          onDispose?: () => void;
          postTestResult(data: unknown): void;
          setChallengeEventValue(eventId: string, value: boolean): void;
      }
  }
  export default ScriptManager;

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
declare module 'simulator/Sim' {
  import '@babylonjs/loaders/glTF';
  import '@babylonjs/core/Physics/physicsEngineComponent';
  import Dict from 'simulator/Dict';
  import { Vector2 } from 'simulator/math';
  import { ReferenceFrame as UnitReferenceFrame, Vector3 as UnitVector3 } from 'simulator/unit-math';
  import { ScenesAction } from 'simulator/state/reducer/index';
  import SceneBinding from 'simulator/SceneBinding';
  import Scene from 'simulator/state/State/Scene/index';
  import Node from 'simulator/state/State/Scene/Node';
  import Geometry from 'simulator/state/State/Scene/Geometry';
  import Camera from 'simulator/state/State/Scene/Camera';
  export let ACTIVE_SPACE: Space;
  export class Space {
      private static instance;
      private initializationPromise;
      private engine;
      private workingCanvas;
      private bScene_;
      private storeSubscription_;
      private sceneBinding_;
      onSelectNodeId?: (nodeId: string) => void;
      onSetNodeBatch?: (setNodeBatch: Omit<ScenesAction.SetNodeBatch, 'type' | 'sceneId'>) => void;
      onNodeAdd?: (nodeId: string, node: Node) => void;
      onNodeRemove?: (nodeId: string) => void;
      onNodeChange?: (nodeId: string, node: Node) => void;
      onGeometryAdd?: (geometryId: string, geometry: Geometry) => void;
      onGeometryRemove?: (geometryId: string) => void;
      onCameraChange?: (camera: Camera) => void;
      onGravityChange?: (gravity: UnitVector3) => void;
      onChallengeSetEventValue?: (eventId: string, value: boolean) => void;
      private debounceUpdate_;
      private sceneSetting_;
      private nextScene_;
      private scene_;
      get sceneBinding(): SceneBinding;
      private robotLinkOrigins_;
      get robotLinkOrigins(): Dict<Dict<UnitReferenceFrame>>;
      set robotLinkOrigins(robotLinkOrigins: Dict<Dict<UnitReferenceFrame>>);
      get scene(): Scene;
      set scene(scene: Scene);
      objectScreenPosition(id: string): Vector2;
      static getInstance(): Space;
      private constructor();
      ensureInitialized(): Promise<void>;
      switchContext(canvas: HTMLCanvasElement): void;
      private onPointerTap_;
      private createScene;
      private updateStore_;
      private getSignificantOriginChange;
      private startRenderLoop;
      handleResize(): void;
      set realisticSensors(realisticSensors: boolean);
      set noisySensors(noisySensors: boolean);
  }

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
declare module 'simulator/challenges/jbc6c' {
  import Challenge from 'simulator/state/State/Challenge/index';
  const _default: Challenge;
  export default _default;

}
declare module 'simulator/challenges/test' {
  import Challenge from 'simulator/state/State/Challenge/index';
  const _default: Challenge;
  export default _default;

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
declare module 'simulator/components/Challenge/EventSettings' {
  import * as React from "react";
  import { ThemeProps } from "simulator/components/theme";
  import Event from 'simulator/state/State/Challenge/Event';
  export interface EventSettingsProps extends ThemeProps {
      onEventChange: (event: Event) => void;
      event: Event;
  }
  const EventSettings: React.FC<EventSettingsProps>;
  export default EventSettings;

}
declare module 'simulator/components/Challenge/EventSettingsDialog' {
  import * as React from 'react';
  import Event from 'simulator/state/State/Challenge/Event';
  import { ThemeProps } from 'simulator/components/theme';
  export interface EventSettingsDialogProps extends ThemeProps {
      event: Event;
      onChange: (event: Event) => void;
      onClose: () => void;
  }
  const EventSettingsDialog: React.FC<EventSettingsDialogProps>;
  export default EventSettingsDialog;

}
declare module 'simulator/components/Challenge/EventViewer' {
  import * as React from 'react';
  import Event from 'simulator/state/State/Challenge/Event';
  import { StyleProps } from 'simulator/style';
  import LocalizedString from 'simulator/util/LocalizedString';
  interface EventViewerProps extends StyleProps {
      event: Event;
      eventState?: boolean;
      locale: LocalizedString.Language;
  }
  const EventViewer: React.FC<EventViewerProps>;
  export default EventViewer;

}
declare module 'simulator/components/Challenge/LoadingOverlay' {
  import * as React from 'react';
  import { AsyncChallenge } from 'simulator/state/State/Challenge/index';
  const _default: React.ComponentType<{
      challenge: AsyncChallenge;
      onStartClick: () => void;
      loading: boolean;
  }>;
  export default _default;

}
declare module 'simulator/components/Challenge/Operator' {
  import * as React from 'react';
  import LocalizedString from 'simulator/util/LocalizedString';
  import Expr from 'simulator/state/State/Challenge/Expr';
  import { StyleProps } from 'simulator/style';
  export interface OperatorProps extends StyleProps {
      type: Expr.Type.And | Expr.Type.Or | Expr.Type.Xor | Expr.Type.Once | Expr.Type.Not;
      locale: LocalizedString.Language;
  }
  type Props = OperatorProps;
  const Operator: React.FC<Props>;
  export default Operator;

}
declare module 'simulator/components/Challenge/PredicateEditor' {
  import * as React from 'react';
  import LocalizedString from 'simulator/util/LocalizedString';
  import Dict from 'simulator/Dict';
  import Event from 'simulator/state/State/Challenge/Event';
  import Predicate from 'simulator/state/State/Challenge/Predicate';
  import PredicateCompletion from 'simulator/state/State/ChallengeCompletion/PredicateCompletion';
  import { StyleProps } from 'simulator/style';
  export interface PredicateEditorProps extends StyleProps {
      predicate: Predicate;
      predicateCompletion?: PredicateCompletion;
      events: Dict<Event>;
      locale: LocalizedString.Language;
  }
  const PredicateEditor: React.FC<PredicateEditorProps>;
  export default PredicateEditor;

}
declare module 'simulator/components/Challenge/index' {
  import * as React from 'react';
  import { StyleProps } from 'simulator/style';
  import { ThemeProps } from 'simulator/components/theme';
  import { AsyncChallenge } from 'simulator/state/State/Challenge/index';
  import { AsyncChallengeCompletion } from 'simulator/state/State/ChallengeCompletion/index';
  export interface ChallengePublicProps extends StyleProps, ThemeProps {
      challenge: AsyncChallenge;
      challengeCompletion: AsyncChallengeCompletion;
  }
  const _default: React.ComponentType<ChallengePublicProps>;
  export default _default;

}
declare module 'simulator/components/ChallengeMenu' {
  import * as React from 'react';
  import { StyleProps } from 'simulator/style';
  import { Layout } from 'simulator/components/Layout/index';
  import { SimulatorState } from 'simulator/components/SimulatorState';
  import { ThemeProps } from 'simulator/components/theme';
  namespace SubMenu {
      enum Type {
          None = 0,
          LayoutPicker = 1,
          SceneMenu = 2,
          ExtraMenu = 3
      }
      interface None {
          type: Type.None;
      }
      const NONE: None;
      interface LayoutPicker {
          type: Type.LayoutPicker;
      }
      const LAYOUT_PICKER: LayoutPicker;
      interface SceneMenu {
          type: Type.SceneMenu;
      }
      const SCENE_MENU: SceneMenu;
      interface ExtraMenu {
          type: Type.ExtraMenu;
      }
      const EXTRA_MENU: ExtraMenu;
  }
  type SubMenu = SubMenu.None | SubMenu.LayoutPicker | SubMenu.SceneMenu | SubMenu.ExtraMenu;
  export interface MenuProps extends StyleProps, ThemeProps {
      layout: Layout;
      onLayoutChange: (layout: Layout) => void;
      onShowAll: () => void;
      onHideAll: () => void;
      onRunClick: () => void;
      onStopClick: () => void;
      onResetChallengeClick: () => void;
      onSettingsClick: () => void;
      onAboutClick: () => void;
      onDocumentationClick: () => void;
      onDashboardClick: () => void;
      onLogoutClick: () => void;
      simulatorState: SimulatorState;
  }
  interface MenuState {
      subMenu: SubMenu;
  }
  type Props = MenuProps;
  type State = MenuState;
  class ChallengeMenu extends React.PureComponent<Props, State> {
      constructor(props: Props);
      private onLayoutClick_;
      private onSceneClick_;
      private onExtraClick_;
      private onClickOutside_;
      render(): JSX.Element;
  }
  export default ChallengeMenu;

}
declare module 'simulator/components/ChallengeRoot' {
  import * as React from 'react';
  import { Theme } from 'simulator/components/theme';
  import { Layout } from 'simulator/components/Layout/index';
  import { SimulatorState } from 'simulator/components/SimulatorState';
  import { StyledText } from 'simulator/util/index';
  import { Message } from 'ivygate';
  import { Settings } from 'simulator/Settings';
  import { Feedback } from 'simulator/Feedback';
  import Scene from 'simulator/state/State/Scene/index';
  import { RouteComponentProps } from 'react-router';
  import Record from 'simulator/db/Record';
  namespace Modal {
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
          ResetCode = 11
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
      interface SelectScene {
          type: Type.OpenScene;
      }
      const SELECT_SCENE: SelectScene;
      interface None {
          type: Type.None;
      }
      const NONE: None;
      interface NewScene {
          type: Type.NewScene;
      }
      const NEW_SCENE: NewScene;
      interface CopyScene {
          type: Type.CopyScene;
          scene: Scene;
      }
      const copyScene: (params: Omit<CopyScene, "type">) => CopyScene;
      interface DeleteRecord {
          type: Type.DeleteRecord;
          record: Record;
      }
      const deleteRecord: (params: Omit<DeleteRecord, "type">) => DeleteRecord;
      interface SettingsScene {
          type: Type.SettingsScene;
      }
      const SETTINGS_SCENE: SettingsScene;
      interface ResetCode {
          type: Type.ResetCode;
      }
      const RESET_CODE: ResetCode;
  }
  export type Modal = (Modal.Settings | Modal.About | Modal.Exception | Modal.SelectScene | Modal.Feedback | Modal.FeedbackSuccess | Modal.None | Modal.NewScene | Modal.CopyScene | Modal.DeleteRecord | Modal.SettingsScene | Modal.ResetCode);
  interface RootParams {
      challengeId: string;
  }
  export interface RootPublicProps extends RouteComponentProps<RootParams> {
  }
  interface RootState {
      layout: Layout;
      simulatorState: SimulatorState;
      modal: Modal;
      console: StyledText;
      messages: Message[];
      theme: Theme;
      settings: Settings;
      feedback: Feedback;
      windowInnerHeight: number;
      challengeStarted?: boolean;
      nonce: number;
  }
  const _default: React.ComponentType<RootPublicProps>;
  export default _default;
  export { RootState };

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
declare module 'simulator/components/CreateUserDialog' {
  import { ThemeProps } from 'simulator/components/theme';
  import { StyleProps } from 'simulator/style';
  import LocalizedString from 'simulator/util/LocalizedString';
  import * as React from 'react';
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
  export class CreateUserDialog extends React.PureComponent<Props, State> {
      constructor(props: Props);
      private onLocaleSelect_;
      onFinalize_: (values: {
          [id: string]: string;
      }) => void;
      myComponent(props: CreateUserDialogPublicProps): string;
      render(): JSX.Element;
  }
  const _default: React.ComponentType<CreateUserDialogPublicProps>;
  export default _default;

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
  import Script from 'simulator/state/State/Scene/Script';
  import Dict from 'simulator/Dict';
  import LocalizedString from 'simulator/util/LocalizedString';
  export enum EditorActionState {
      None = 0,
      Compiling = 1,
      Running = 2
  }
  export interface EditorPublicProps extends StyleProps, ThemeProps {
      language: ProgrammingLanguage | Script.Language;
      code: string;
      onCodeChange: (code: string) => void;
      messages?: Message[];
      autocomplete: boolean;
      username: string;
      onDocumentationGoToFuzzy?: (query: string, language: 'c' | 'python') => void;
  }
  interface EditorState {
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
          onLanguageChange: (language: ProgrammingLanguage) => void;
          onIndentCode: () => void;
          onGetUser: () => void;
          onCreateUser: () => void;
          onDownloadCode: () => void;
          onResetCode: () => void;
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
      onLogoutClick: (event: React.MouseEvent) => void;
      onFeedbackClick?: (event: React.MouseEvent) => void;
      onDocumentationClick: (event: React.MouseEvent) => void;
      onSettingsClick: (event: React.MouseEvent) => void;
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
  import { LayoutProps } from 'simulator/components/Layout/Layout';
  import { Size } from 'simulator/components/Widget';
  import Node from 'simulator/state/State/Scene/Node';
  import Dict from 'simulator/Dict';
  import LocalizedString from 'simulator/util/LocalizedString';
  export interface FileExplorerProps extends LayoutProps {
  }
  interface FileExplorerReduxSideLayoutProps {
      robots: Dict<Node.Robot>;
      locale: LocalizedString.Language;
  }
  interface FileExplorerState {
      activePanel: number;
      sidePanelSize: Size.Type;
      workingScriptCode?: string;
      userName: string;
  }
  type Props = FileExplorerProps;
  type State = FileExplorerState;
  export class FileExplorer extends React.PureComponent<Props & FileExplorerReduxSideLayoutProps, State> {
      constructor(props: Props & FileExplorerReduxSideLayoutProps);
      private onSideBarSizeChange_;
      private onTabBarIndexChange_;
      private onTabBarExpand_;
      private onErrorClick_;
      private onRobotOriginChange_;
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
  import * as React from 'react';
  import { StyleProps } from 'simulator/style';
  import { ThemeProps } from 'simulator/components/theme';
  import LocalizedString from 'simulator/util/LocalizedString';
  import { Settings } from 'simulator/Settings';
  import { CreateUser } from 'simulator/CreateUser';
  namespace Modal {
      enum Type {
          Settings = 0,
          CreateUser = 1,
          None = 2
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
  }
  export type Modal = (Modal.Settings | Modal.CreateUser | Modal.None);
  export interface HomeStartOptionsPublicProps extends StyleProps, ThemeProps {
  }
  interface HomeStartOptionsPrivateProps {
      locale: LocalizedString.Language;
  }
  interface HomeStartOptionsState {
      modal: Modal;
      settings: Settings;
      createUser: CreateUser;
  }
  type Props = HomeStartOptionsPublicProps & HomeStartOptionsPrivateProps;
  type State = HomeStartOptionsState;
  export class HomeStartOptions extends React.Component<Props, State> {
      static username: string;
      constructor(props: Props);
      private onCreateUser_;
      private onSettingsChange_;
      private onModalClick_;
      private onModalClose_;
      render(): JSX.Element;
  }
  const _default: React.ComponentType<HomeStartOptionsPublicProps>;
  export default _default;

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
declare module 'simulator/components/Info/FloatSensorWidget' {
  import * as React from 'react';
  import { Vector2 } from 'simulator/math';
  import { SensorWidgetProps } from 'simulator/components/Info/SensorWidget';
  export interface FloatSensorWidgetProps extends SensorWidgetProps {
  }
  interface FloatSensorWidgetState {
      topLeft: Vector2;
  }
  type Props = FloatSensorWidgetProps;
  type State = FloatSensorWidgetState;
  class FloatSensorWidget extends React.PureComponent<Props, State> {
      constructor(props: Props);
      render(): React.ReactPortal;
  }
  export default FloatSensorWidget;

}
declare module 'simulator/components/Info/Info' {
  import * as React from 'react';
  import { StyleProps } from 'simulator/style';
  import { ThemeProps } from 'simulator/components/theme';
  import { ReferenceFrame } from 'simulator/unit-math';
  import Node from 'simulator/state/State/Scene/Node';
  export interface InfoPublicProps extends StyleProps, ThemeProps {
      node: Node.Robot;
      onOriginChange: (origin: ReferenceFrame) => void;
  }
  const _default: React.ComponentType<InfoPublicProps>;
  export default _default;

}
declare module 'simulator/components/Info/Location' {
  import * as React from 'react';
  import { StyleProps } from 'simulator/style';
  import { ThemeProps } from 'simulator/components/theme';
  import { ReferenceFrame } from 'simulator/unit-math';
  import LocalizedString from 'simulator/util/LocalizedString';
  export interface LocationProps extends ThemeProps, StyleProps {
      origin?: ReferenceFrame;
      onOriginChange: (origin: ReferenceFrame, modifyReferenceScene: boolean) => void;
      locale: LocalizedString.Language;
  }
  type Props = LocationProps;
  export default class Location extends React.PureComponent<Props> {
      private onXChange_;
      private onYChange_;
      private onZChange_;
      private onThetaChange_;
      render(): JSX.Element;
  }
  export {};

}
declare module 'simulator/components/Info/SensorWidget' {
  import * as React from 'react';
  import { ThemeProps } from 'simulator/components/theme';
  import { StyleProps } from 'simulator/style';
  export interface SensorWidgetProps extends ThemeProps, StyleProps {
      name: string;
      value: number | boolean;
      unit?: string;
      plotTitle?: string;
  }
  interface SensorWidgetState {
      showGuide: boolean;
      showActionTooltip: boolean;
      showPlot: boolean;
  }
  type Props = SensorWidgetProps;
  type State = SensorWidgetState;
  class SensorWidget extends React.PureComponent<Props, State> {
      constructor(props: Props);
      private onMouseEnter_;
      private onMouseLeave_;
      private onActionTooltipClose_;
      private ref_;
      private bindRef_;
      private onShowPlotClick_;
      private onHidePlotClick_;
      private onTogglePlotClick_;
      render(): JSX.Element;
  }
  export default SensorWidget;

}
declare module 'simulator/components/Info/index' {
  export { default as Info } from 'simulator/components/Info/Info';
  export * from 'simulator/components/Info/Info';

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
  import { AsyncChallenge } from 'simulator/state/State/Challenge/index';
  import { AsyncChallengeCompletion } from 'simulator/state/State/ChallengeCompletion/index';
  import { AsyncScene } from 'simulator/state/State/Scene/index';
  import Node from 'simulator/state/State/Scene/Node';
  import Geometry from 'simulator/state/State/Scene/Geometry';
  import Script from 'simulator/state/State/Scene/Script';
  import { Capabilities } from 'simulator/components/World/index';
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
      console: StyledText;
      messages: Message[];
      settings: Settings;
      onClearConsole: () => void;
      onIndentCode: () => void;
      onDownloadCode: () => void;
      onGetUser: () => void;
      onCreateUser: () => void;
      onResetCode: () => void;
      editorRef: React.MutableRefObject<Editor>;
      scene: AsyncScene;
      onNodeAdd: (nodeId: string, node: Node) => void;
      onNodeRemove: (nodeId: string) => void;
      onNodeChange: (nodeId: string, node: Node) => void;
      onObjectAdd: (nodeId: string, object: Node.Obj, geometry: Geometry) => void;
      onGeometryAdd: (geometryId: string, geometry: Geometry) => void;
      onGeometryRemove: (geometryId: string) => void;
      onGeometryChange: (geometryId: string, geometry: Geometry) => void;
      onScriptAdd: (scriptId: string, script: Script) => void;
      onScriptRemove: (scriptId: string) => void;
      challengeState?: ChallengeState;
      worldCapabilities?: Capabilities;
      onDocumentationGoToFuzzy?: (query: string, language: 'c' | 'python') => void;
  }
  export enum Layout {
      Overlay = 0,
      Side = 1,
      Bottom = 2
  }
  export interface ChallengeState {
      challenge: AsyncChallenge;
      challengeCompletion: AsyncChallengeCompletion;
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
declare module 'simulator/components/Layout/SideLayout' {
  import * as React from 'react';
  import { LayoutProps } from 'simulator/components/Layout/Layout';
  import { Size } from 'simulator/components/Widget';
  import Node from 'simulator/state/State/Scene/Node';
  import Dict from 'simulator/Dict';
  import LocalizedString from 'simulator/util/LocalizedString';
  export interface SideLayoutProps extends LayoutProps {
  }
  interface ReduxSideLayoutProps {
      robots: Dict<Node.Robot>;
      locale: LocalizedString.Language;
  }
  interface SideLayoutState {
      activePanel: number;
      sidePanelSize: Size.Type;
      workingScriptCode?: string;
  }
  type Props = SideLayoutProps;
  type State = SideLayoutState;
  export class SideLayout extends React.PureComponent<Props & ReduxSideLayoutProps, State> {
      constructor(props: Props & ReduxSideLayoutProps);
      private onSideBarSizeChange_;
      private onTabBarIndexChange_;
      private onTabBarExpand_;
      private onErrorClick_;
      private onRobotOriginChange_;
      render(): JSX.Element;
  }
  export const SideLayoutRedux: React.ComponentType<SideLayoutProps>;
  export {};

}
declare module 'simulator/components/Layout/index' {
  export { Layout, LayoutProps } from 'simulator/components/Layout/Layout';
  export * from 'simulator/components/Layout/LayoutPicker';
  export { default as LayoutPicker } from 'simulator/components/Layout/LayoutPicker';
  export * from 'simulator/components/Layout/OverlayLayout/index';
  export { OverlayLayout, OverlayLayoutRedux } from 'simulator/components/Layout/OverlayLayout/index';
  export * from 'simulator/components/Layout/SideLayout';
  export { SideLayout, SideLayoutRedux } from 'simulator/components/Layout/SideLayout';

}
declare module 'simulator/components/LeftBar' {
  import * as React from 'react';
  import { StyleProps } from 'simulator/style';
  import { ThemeProps } from 'simulator/components/theme';
  import { Settings } from 'simulator/Settings';
  import LocalizedString from 'simulator/util/LocalizedString';
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
  export interface LeftBarPublicProps extends StyleProps, ThemeProps {
  }
  interface LeftBarPrivateProps {
      locale: LocalizedString.Language;
  }
  interface LeftBarState {
      modal: Modal;
      settings: Settings;
  }
  type Props = LeftBarPublicProps & LeftBarPrivateProps;
  type State = LeftBarState;
  export class LeftBar extends React.Component<Props, State> {
      constructor(props: Props);
      private onLogoutClick_;
      private onFileExplorerClick_;
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
      private onLogoutClick_;
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
declare module 'simulator/components/NewSceneDialog' {
  import * as React from 'react';
  import { StyleProps } from 'simulator/style';
  import { ThemeProps } from 'simulator/components/theme';
  import Scene from 'simulator/state/State/Scene/index';
  export interface NewSceneDialogPublicProps extends ThemeProps, StyleProps {
      onClose: () => void;
      onAccept: (scene: Scene) => void;
  }
  const _default: React.ComponentType<NewSceneDialogPublicProps>;
  export default _default;

}
declare module 'simulator/components/OpenSceneDialog' {
  import * as React from "react";
  import { ThemeProps } from "simulator/components/theme";
  export interface OpenSceneDialogPublicProps extends ThemeProps {
      onClose: () => void;
  }
  const _default: React.ComponentType<OpenSceneDialogPublicProps>;
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
  import Scene from 'simulator/state/State/Scene/index';
  import { RouteComponentProps } from 'react-router';
  import Record from 'simulator/db/Record';
  namespace Modal {
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
          ResetCode = 11
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
      interface SelectScene {
          type: Type.OpenScene;
      }
      const SELECT_SCENE: SelectScene;
      interface None {
          type: Type.None;
      }
      const NONE: None;
      interface NewScene {
          type: Type.NewScene;
      }
      const NEW_SCENE: NewScene;
      interface CopyScene {
          type: Type.CopyScene;
          scene: Scene;
      }
      const copyScene: (params: Omit<CopyScene, "type">) => CopyScene;
      interface DeleteRecord {
          type: Type.DeleteRecord;
          record: Record;
      }
      const deleteRecord: (params: Omit<DeleteRecord, "type">) => DeleteRecord;
      interface SettingsScene {
          type: Type.SettingsScene;
      }
      const SETTINGS_SCENE: SettingsScene;
      interface ResetCode {
          type: Type.ResetCode;
      }
      const RESET_CODE: ResetCode;
  }
  export type Modal = (Modal.Settings | Modal.About | Modal.Exception | Modal.SelectScene | Modal.Feedback | Modal.FeedbackSuccess | Modal.None | Modal.NewScene | Modal.DeleteRecord | Modal.SettingsScene | Modal.ResetCode);
  interface RootParams {
      sceneId?: string;
      challengeId?: string;
  }
  export interface RootPublicProps extends RouteComponentProps<RootParams> {
  }
  interface RootState {
      layout: Layout;
      activeLanguage: ProgrammingLanguage;
      code: Dict<string>;
      simulatorState: SimulatorState;
      modal: Modal;
      console: StyledText;
      messages: Message[];
      theme: Theme;
      settings: Settings;
      feedback: Feedback;
      windowInnerHeight: number;
  }
  const _default: React.ComponentType<RootPublicProps>;
  export default _default;
  export { RootState };

}
declare module 'simulator/components/SaveAsSceneDialog' {
  import * as React from 'react';
  import { StyleProps } from 'simulator/style';
  import { ThemeProps } from 'simulator/components/theme';
  import Scene from 'simulator/state/State/Scene/index';
  export interface CopySceneDialogPublicProps extends ThemeProps, StyleProps {
      scene: Scene;
      onClose: () => void;
      onAccept: (scene: Scene) => void;
  }
  const _default: React.ComponentType<CopySceneDialogPublicProps>;
  export default _default;

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
declare module 'simulator/components/SceneSettings' {
  import * as React from 'react';
  import Scene from 'simulator/state/State/Scene/index';
  import { StyleProps } from 'simulator/style';
  import { ThemeProps } from 'simulator/components/theme';
  export interface SceneSettingsPublicProps extends StyleProps, ThemeProps {
      scene: Scene;
      onSceneChange: (scene: Scene) => void;
  }
  const _default: React.ComponentType<SceneSettingsPublicProps>;
  export default _default;

}
declare module 'simulator/components/SceneSettingsDialog' {
  import * as React from 'react';
  import { StyleProps } from 'simulator/style';
  import { ThemeProps } from 'simulator/components/theme';
  import Scene from 'simulator/state/State/Scene/index';
  export interface SceneSettingsDialogPublicProps extends ThemeProps, StyleProps {
      scene: Scene;
      onClose: () => void;
      onAccept: (scene: Scene) => void;
  }
  const _default: React.ComponentType<SceneSettingsDialogPublicProps>;
  export default _default;

}
declare module 'simulator/components/ScreenGuide/MeshScreenGuide' {
  import * as React from 'react';
  import { Vector2 } from 'simulator/math';
  import { StyleProps } from 'simulator/style';
  import { ThemeProps } from 'simulator/components/theme';
  export interface MeshScreenGuideProps extends StyleProps, ThemeProps {
      from: HTMLElement;
      fromOffset?: Vector2;
      to: string;
  }
  interface MeshScreenGuideState {
      toVec?: Vector2;
  }
  type Props = MeshScreenGuideProps;
  type State = MeshScreenGuideState;
  class MeshScreenGuide extends React.PureComponent<Props, State> {
      constructor(props: Props);
      componentDidMount(): void;
      componentWillUnmount(): void;
      private running_;
      private tick_;
      render(): JSX.Element;
  }
  export default MeshScreenGuide;

}
declare module 'simulator/components/ScreenGuide/ScreenGuide' {
  import * as React from 'react';
  import { Vector2 } from 'simulator/math';
  import { StyleProps } from 'simulator/style';
  import { ThemeProps } from 'simulator/components/theme';
  export interface ScreenGuideProps extends StyleProps, ThemeProps {
      from: HTMLElement;
      fromOffset?: Vector2;
      to: Vector2;
  }
  interface ScreenGuideState {
  }
  type Props = ScreenGuideProps;
  type State = ScreenGuideState;
  class ScreenGuide extends React.PureComponent<Props, State> {
      constructor(props: Props);
      render(): React.ReactPortal;
  }
  export default ScreenGuide;

}
declare module 'simulator/components/ScreenGuide/index' {
  export { default as ScreenGuide } from 'simulator/components/ScreenGuide/ScreenGuide';
  export * from 'simulator/components/ScreenGuide/ScreenGuide';
  export { default as MeshScreenGuide } from 'simulator/components/ScreenGuide/MeshScreenGuide';
  export * from 'simulator/components/ScreenGuide/MeshScreenGuide';

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
      onNewSceneClick?: (event: React.MouseEvent) => void;
      onSaveSceneClick?: (event: React.MouseEvent) => void;
      onSaveAsSceneClick?: (event: React.MouseEvent) => void;
      onOpenSceneClick?: (event: React.MouseEvent) => void;
      onSettingsSceneClick?: (event: React.MouseEvent) => void;
      onDeleteSceneClick?: (event: React.MouseEvent) => void;
      onStartChallengeClick: () => void;
      onShowAll: () => void;
      onHideAll: () => void;
      onRunClick: () => void;
      onStopClick: () => void;
      onResetWorldClick: () => void;
      onSettingsClick: () => void;
      onAboutClick: () => void;
      onDocumentationClick: () => void;
      onDashboardClick: () => void;
      onLogoutClick: () => void;
      onFeedbackClick: () => void;
      simulatorState: SimulatorState;
  }
  const _default: React.ComponentType<MenuPublicProps>;
  export default _default;

}
declare module 'simulator/components/SimulatorArea' {
  import * as React from 'react';
  import { Theme } from 'simulator/components/theme';
  import LocalizedString from 'simulator/util/LocalizedString';
  namespace ModalDialog {
      enum Type {
          None = 0,
          MotorsSwapped = 1
      }
      interface None {
          type: Type.None;
      }
      const NONE: None;
      interface MotorsSwapped {
          type: Type.MotorsSwapped;
      }
      namespace MotorsSwapped {
          const SHOW_UNTIL: Date;
          const markShown: (shown: boolean) => void;
          const hasShown: () => boolean;
          const shouldShow: () => boolean;
      }
      const MOTORS_SWAPPED: MotorsSwapped;
  }
  type ModalDialog = ModalDialog.None | ModalDialog.MotorsSwapped;
  export interface SimulatorAreaPublicProps {
      theme: Theme;
      isSensorNoiseEnabled: boolean;
      isRealisticSensorsEnabled: boolean;
  }
  interface SimulatorAreaPrivateProps {
      locale: LocalizedString.Language;
  }
  type Props = SimulatorAreaPublicProps & SimulatorAreaPrivateProps;
  interface SimulatorAreaState {
      loading: boolean;
      loadingMessage: string;
      modalDialog: ModalDialog;
  }
  export class SimulatorArea extends React.Component<Props, SimulatorAreaState> {
      private containerRef_;
      private canvasRef_;
      constructor(props: Props);
      componentDidMount(): void;
      private lastWidth_;
      private lastHeight_;
      private onSizeChange_;
      private resizeListener_;
      componentWillUnmount(): void;
      componentDidUpdate(prevProps: Props): void;
      private bindContainerRef_;
      private bindCanvasRef_;
      private onMotorsSwappedClose_;
      render(): JSX.Element;
  }
  const _default: React.ComponentType<SimulatorAreaPublicProps>;
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
declare module 'simulator/components/ValueEdit/index' {
  import * as React from 'react';
  import { StyleProps } from 'simulator/style';
  import { Value } from 'simulator/util/index';
  import { ThemeProps } from 'simulator/components/theme';
  import LocalizedString from 'simulator/util/LocalizedString';
  export interface ValueEditPublicProps extends ThemeProps, StyleProps {
      name: string;
      long?: boolean;
      value: Value;
      onValueChange: (value: Value) => void;
  }
  interface ValueEditPrivateProps {
      locale: LocalizedString.Language;
  }
  interface ValueEditState {
      input: string;
      hasFocus: boolean;
      valid: boolean;
      unitFocus: boolean;
  }
  type Props = ValueEditPublicProps & ValueEditPrivateProps;
  type State = ValueEditState;
  export class ValueEdit extends React.PureComponent<Props, State> {
      constructor(props: Props);
      static getDerivedStateFromProps(props: Props, state: State): {
          input: string;
      };
      private onInputChange_;
      private update_;
      private onFocus_;
      private onBlur_;
      private onKeyDown_;
      private onUnitSelect_;
      private onUnitFocusChange_;
      private unitRef_;
      private bindUnitRef_;
      render(): JSX.Element;
  }
  const _default: React.ComponentType<ValueEditPublicProps>;
  export default _default;

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
declare module 'simulator/components/World/AddNodeDialog' {
  import * as React from "react";
  import { ThemeProps } from "simulator/components/theme";
  import Node from "simulator/state/State/Scene/Node";
  import Scene from "simulator/state/State/Scene/index";
  import Geometry from "simulator/state/State/Scene/Geometry";
  export interface AddNodeAcceptance {
      node: Node;
      geometry?: Geometry;
  }
  export interface AddNodeDialogPublicProps extends ThemeProps {
      scene: Scene;
      onAccept: (acceptance: AddNodeAcceptance) => void;
      onClose: () => void;
  }
  const _default: React.ComponentType<AddNodeDialogPublicProps>;
  export default _default;

}
declare module 'simulator/components/World/AddScriptDialog' {
  import * as React from "react";
  import { ThemeProps } from "simulator/components/theme";
  import Script from "simulator/state/State/Scene/Script";
  export interface AddScriptAcceptance {
      script: Script;
  }
  export interface AddScriptDialogPublicProps extends ThemeProps {
      onAccept: (acceptance: AddScriptAcceptance) => void;
      onClose: () => void;
  }
  const _default: React.ComponentType<AddScriptDialogPublicProps>;
  export default _default;

}
declare module 'simulator/components/World/Item' {
  import * as React from 'react';
  import EditableList from 'simulator/components/EditableList/index';
  import { ThemeProps } from 'simulator/components/theme';
  export interface ItemProps extends EditableList.StandardItem.ComponentProps, ThemeProps {
      name: string;
      onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
      selected?: boolean;
  }
  type Props = ItemProps;
  class Item extends React.PureComponent<Props> {
      constructor(props: Props);
      render(): JSX.Element;
  }
  export default Item;

}
declare module 'simulator/components/World/NodeSettings' {
  import * as React from "react";
  import { ReferenceFrame } from "simulator/unit-math";
  import { ThemeProps } from "simulator/components/theme";
  import Geometry from 'simulator/state/State/Scene/Geometry';
  import Node from "simulator/state/State/Scene/Node";
  import Scene from "simulator/state/State/Scene/index";
  export interface NodeSettingsPublicProps extends ThemeProps {
      onNodeChange: (node: Node) => void;
      onNodeOriginChange: (origin: ReferenceFrame) => void;
      node: Node;
      id: string;
      onGeometryAdd: (id: string, geometry: Geometry) => void;
      onGeometryChange: (id: string, geometry: Geometry) => void;
      onGeometryRemove: (id: string) => void;
      scene: Scene;
  }
  const _default: React.ComponentType<NodeSettingsPublicProps>;
  export default _default;

}
declare module 'simulator/components/World/NodeSettingsDialog' {
  import * as React from "react";
  import { ReferenceFrame } from "simulator/unit-math";
  import { ThemeProps } from "simulator/components/theme";
  import Node from 'simulator/state/State/Scene/Node';
  import Scene from "simulator/state/State/Scene/index";
  import Geometry from "simulator/state/State/Scene/Geometry";
  export type NodeSettingsAcceptance = Node;
  export interface NodeSettingsDialogPublicProps extends ThemeProps {
      node: Node;
      id: string;
      scene: Scene;
      onChange: (node: Node) => void;
      onOriginChange: (origin: ReferenceFrame) => void;
      onGeometryAdd: (id: string, geometry: Geometry) => void;
      onGeometryChange: (id: string, geometry: Geometry) => void;
      onGeometryRemove: (id: string) => void;
      onClose: () => void;
  }
  const _default: React.ComponentType<NodeSettingsDialogPublicProps>;
  export default _default;

}
declare module 'simulator/components/World/SceneMenu' {
  import * as React from 'react';
  import { StyleProps } from 'simulator/style';
  import { ThemeProps } from 'simulator/components/theme';
  export interface SceneMenuPublicProps extends StyleProps, ThemeProps {
      onSaveScene?: (event: React.MouseEvent) => void;
      onNewScene?: (event: React.MouseEvent) => void;
      onSaveAsScene?: (event: React.MouseEvent) => void;
      onOpenScene?: (event: React.MouseEvent) => void;
      onSettingsScene?: (event: React.MouseEvent) => void;
      onDeleteScene?: (event: React.MouseEvent) => void;
  }
  const _default: React.ComponentType<SceneMenuPublicProps>;
  export default _default;

}
declare module 'simulator/components/World/ScriptSettings' {
  import * as React from "react";
  import { ThemeProps } from "simulator/components/theme";
  import Script from "simulator/state/State/Scene/Script";
  export interface ScriptSettingsPublicProps extends ThemeProps {
      onScriptChange: (script: Script) => void;
      script: Script;
      id: string;
  }
  const _default: React.ComponentType<ScriptSettingsPublicProps>;
  export default _default;

}
declare module 'simulator/components/World/ScriptSettingsDialog' {
  import * as React from "react";
  import { ThemeProps } from "simulator/components/theme";
  import Script from 'simulator/state/State/Scene/Script';
  export type ScriptSettingsAcceptance = Script;
  export interface ScriptSettingsDialogPublicProps extends ThemeProps {
      script: Script;
      id: string;
      onClose: () => void;
      onAccept: (acceptance: ScriptSettingsAcceptance) => void;
  }
  const _default: React.ComponentType<ScriptSettingsDialogPublicProps>;
  export default _default;

}
declare module 'simulator/components/World/index' {
  import * as React from 'react';
  import { StyleProps } from 'simulator/style';
  import { Theme, ThemeProps } from 'simulator/components/theme';
  import Node from 'simulator/state/State/Scene/Node';
  import Geometry from 'simulator/state/State/Scene/Geometry';
  import { BarComponent } from 'simulator/components/Widget';
  import { AsyncScene } from 'simulator/state/State/Scene/index';
  import LocalizedString from 'simulator/util/LocalizedString';
  import Script from 'simulator/state/State/Scene/Script';
  namespace SceneState {
      enum Type {
          Clean = 0,
          Saveable = 1,
          Copyable = 2
      }
      interface Clean {
          type: Type.Clean;
      }
      const CLEAN: Clean;
      interface Saveable {
          type: Type.Saveable;
      }
      const SAVEABLE: Saveable;
      interface Copyable {
          type: Type.Copyable;
      }
      const COPYABLE: Copyable;
  }
  export type SceneState = SceneState.Clean | SceneState.Saveable | SceneState.Copyable;
  export const createWorldBarComponents: ({ theme, saveable, onSelectScene, onSaveScene, onCopyScene, locale }: {
      theme: Theme;
      saveable: boolean;
      onSelectScene: () => void;
      onSaveScene: () => void;
      onCopyScene: () => void;
      locale: LocalizedString.Language;
  }) => BarComponent<object>[];
  export interface Capabilities {
      addNode?: boolean;
      addScript?: boolean;
      scriptSettings?: boolean;
      removeNode?: boolean;
      removeScript?: boolean;
      nodeSettings?: boolean;
      nodeVisibility?: boolean;
      nodeReset?: boolean;
  }
  export const DEFAULT_CAPABILITIES: Capabilities;
  export interface WorldPublicProps extends StyleProps, ThemeProps {
      scene: AsyncScene;
      onNodeAdd: (nodeId: string, node: Node) => void;
      onNodeRemove: (nodeId: string) => void;
      onNodeChange: (nodeId: string, node: Node) => void;
      onObjectAdd: (nodeId: string, object: Node.Obj, geometry: Geometry) => void;
      onGeometryAdd: (geometryId: string, geometry: Geometry) => void;
      onGeometryRemove: (geometryId: string) => void;
      onGeometryChange: (geometryId: string, geometry: Geometry) => void;
      onScriptAdd: (scriptId: string, script: Script) => void;
      onScriptRemove: (scriptId: string) => void;
      onScriptChange: (scriptId: string, script: Script) => void;
      capabilities?: Capabilities;
  }
  const _default: React.ComponentType<WorldPublicProps>;
  export default _default;

}
declare module 'simulator/components/charm-util' {
  export const charmColor: (hue: number) => string;

}
declare module 'simulator/components/common' {
  /// <reference types="react" />
  export const Spacer: import("styletron-react").StyletronComponent<Pick<import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLDivElement>, HTMLDivElement>, keyof import("react").ClassAttributes<HTMLDivElement> | keyof import("react").HTMLAttributes<HTMLDivElement>>>;
  export const leftBarSpacer: import("styletron-react").StyletronComponent<Pick<import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLDivElement>, HTMLDivElement>, keyof import("react").ClassAttributes<HTMLDivElement> | keyof import("react").HTMLAttributes<HTMLDivElement>>>;
  export const middleBarSpacer: import("styletron-react").StyletronComponent<Pick<import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLDivElement>, HTMLDivElement>, keyof import("react").ClassAttributes<HTMLDivElement> | keyof import("react").HTMLAttributes<HTMLDivElement>>>;
  export const rightBarSpacer: import("styletron-react").StyletronComponent<Pick<import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLDivElement>, HTMLDivElement>, keyof import("react").ClassAttributes<HTMLDivElement> | keyof import("react").HTMLAttributes<HTMLDivElement>>>;

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
declare module 'simulator/db/Author' {
  namespace Author {
      enum Type {
          User = "user",
          Organization = "organization"
      }
      interface User {
          type: Type.User;
          id: string;
      }
      const user: (id: string) => User;
      interface Organization {
          type: Type.Organization;
          id: string;
      }
      const organization: (id: string) => Organization;
  }
  type Author = Author.User | Author.Organization;
  export default Author;

}
declare module 'simulator/db/Builder' {
  import Dict from 'simulator/Dict';
  import { State } from 'simulator/state/index';
  import { AsyncChallenge } from 'simulator/state/State/Challenge/index';
  import { AsyncChallengeCompletion } from 'simulator/state/State/ChallengeCompletion/index';
  import { AsyncScene } from 'simulator/state/State/Scene/index';
  export class ChallengeBuilder {
      private id_;
      private builder_;
      private challenge_;
      constructor(id: string, builder: Builder);
      scene(): SceneBuilder;
      completion(): ChallengeCompletionBuilder;
  }
  export class ChallengeCompletionBuilder {
      constructor(id: string | undefined, builder: Builder);
  }
  export class SceneBuilder {
      constructor(id: string | undefined, builder: Builder);
  }
  class Builder {
      private state_;
      get state(): State;
      private scenes_;
      get scenes(): Dict<AsyncScene>;
      private scenesToLoad_;
      private challenges_;
      get challenges(): Dict<AsyncChallenge>;
      private challengesToLoad_;
      private challengeCompletions_;
      get challengeCompletions(): Dict<AsyncChallengeCompletion>;
      private challengeCompletionsToLoad_;
      constructor(state: State);
      challenge(id: string): ChallengeBuilder;
      scene(id: string): SceneBuilder;
      addScene_(id: string, scene: AsyncScene): void;
      addChallenge_(id: string, challenge: AsyncChallenge): void;
      addChallengeCompletion_(id: string, challengeCompletion: AsyncChallengeCompletion): void;
      loadScene_(id: string): void;
      loadChallenge_(id: string): void;
      loadChallengeCompletion_(id: string): void;
      dispatchLoads(): void;
  }
  export default Builder;

}
declare module 'simulator/db/Db' {
  import Dict from 'simulator/Dict';
  import Selector from 'simulator/db/Selector';
  import TokenManager from 'simulator/db/TokenManager';
  class Db {
      private uri_;
      private tokenManager_;
      private pendingRequests_;
      get tokenManager(): TokenManager;
      set tokenManager(tokenManager: TokenManager);
      private firePending_;
      constructor(uri: string, tokenManager?: TokenManager);
      private headers_;
      private static parseError_;
      private request_;
      private static outstandingPromise_;
      set<T>({ collection, id }: Selector, value: T): Promise<void>;
      delete({ collection, id }: Selector): Promise<void>;
      get<T>({ collection, id }: Selector): Promise<T>;
      list<T>(collection: string): Promise<Dict<T>>;
  }
  export default Db;

}
declare module 'simulator/db/Error' {
  interface Error {
      type: 'db-error';
      code: number;
      message?: string;
  }
  namespace Error {
      const CODE_NOT_AUTHORIZED = 401;
      const CODE_FORBIDDEN = 403;
      const CODE_NOT_FOUND = 404;
      const CODE_INTERNAL = 500;
      const CODE_SERVICE_UNAVAILABLE = 503;
      const is: (error: unknown) => error is Error;
  }
  export default Error;

}
declare module 'simulator/db/Record' {
  import { AsyncChallenge } from 'simulator/state/State/Challenge/index';
  import { AsyncChallengeCompletion } from 'simulator/state/State/ChallengeCompletion/index';
  import { AsyncScene } from 'simulator/state/State/Scene/index';
  import Selector from 'simulator/db/Selector';
  namespace Record {
      export enum Type {
          Scene = "scene",
          Challenge = "challenge",
          ChallengeCompletion = "challenge-completion"
      }
      interface Base<T> {
          id: string;
          value: T;
      }
      export interface Scene extends Base<AsyncScene> {
          type: Type.Scene;
      }
      export interface Challenge extends Base<AsyncChallenge> {
          type: Type.Challenge;
      }
      export interface ChallengeCompletion extends Base<AsyncChallengeCompletion> {
          type: Type.ChallengeCompletion;
      }
      export const selector: (record: Record) => Selector;
      export const latestName: (record: Record) => import("simulator/util/LocalizedString").default;
      export const latestDescription: (record: Record) => import("simulator/util/LocalizedString").default;
      export {};
  }
  type Record = (Record.Scene | Record.Challenge | Record.ChallengeCompletion);
  export default Record;

}
declare module 'simulator/db/Selector' {
  interface Selector {
      collection: string;
      id: string;
  }
  namespace Selector {
      const scene: (id: string) => Selector;
      const challenge: (id: string) => Selector;
      const challengeCompletion: (id: string) => Selector;
  }
  export default Selector;

}
declare module 'simulator/db/TokenManager' {
  interface TokenManager {
      token(): Promise<string>;
  }
  export default TokenManager;

}
declare module 'simulator/db/constants' {
  export const SCENE_COLLECTION = "scene";
  export const CHALLENGE_COLLECTION = "challenge";
  export const CHALLENGE_COMPLETION_COLLECTION = "challenge_completion";

}
declare module 'simulator/db/index' {
  import Db from 'simulator/db/Db';
  const _default: Db;
  export default _default;

}
declare module 'simulator/deepNeq' {
  const _default: (_0: unknown, _1: unknown) => boolean;
  export default _default;

}
declare module 'simulator/firebase/FirebaseTokenManager' {
  import { Auth } from 'firebase/auth';
  import TokenManager from 'simulator/db/TokenManager';
  class FirebaseTokenManager implements TokenManager {
      private auth_;
      constructor(auth: Auth);
      token(): Promise<string>;
  }
  export default FirebaseTokenManager;

}
declare module 'simulator/firebase/config' {
  const config: {
      firebase: {
          apiKey: string;
          authDomain: string;
          databaseURL: string;
          projectId: string;
          storageBucket: string;
          messagingSenderId: string;
          appId: string;
          measurementId: string;
      };
  };
  export default config;

}
declare module 'simulator/firebase/firebase' {
  import { GoogleAuthProvider } from 'firebase/auth';
  const firebase: import("@firebase/app").FirebaseApp;
  export const Providers: {
      google: GoogleAuthProvider;
  };
  export const auth: import("@firebase/auth").Auth;
  export default firebase;

}
declare module 'simulator/firebase/modules/auth/index' {
  import { AuthProvider, UserCredential } from 'firebase/auth';
  export const signInWithSocialMedia: (provider: AuthProvider) => Promise<UserCredential>;
  export const signInWithSocialMediaRedirect: (provider: AuthProvider) => Promise<UserCredential>;
  export const createUserWithEmail: (email: string, password: string) => Promise<UserCredential>;
  export const signInWithEmail: (email: string, password: string) => Promise<UserCredential>;
  export const signOutOfApp: () => Promise<void>;
  export const forgotPassword: (email: string) => void;

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
      loggedIn: boolean;
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
      private signInWithSocialMedia_;
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
  import { Vector3 as BabylonVector3, Quaternion as BabylonQuaternion } from '@babylonjs/core/Maths/math.vector';
  import { TransformNode as BabylonTransformNode } from '@babylonjs/core/Meshes/transformNode';
  import { AbstractMesh as BabylonAbstractMesh } from '@babylonjs/core/Meshes/abstractMesh';
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
      const toBabylon: (vec: Vector3) => BabylonVector3;
      const fromBabylon: (vec: BabylonVector3) => Vector3;
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
      const fromQuaternion: (q: Quaternion) => Euler;
      const toQuaternion: (euler: Euler) => Quaternion;
  }
  export interface AxisAngle {
      angle: number;
      axis: Vector3;
  }
  export namespace AxisAngle {
      const fromQuaternion: (q: Quaternion) => AxisAngle;
      const fromEuler: (euler: Euler) => AxisAngle;
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
      const toBabylon: (quat: Quaternion) => BabylonQuaternion;
      const fromBabylon: (quat: BabylonQuaternion) => Quaternion;
      const dot: (lhs: Quaternion, rhs: Quaternion) => number;
      const angle: (lhs: Quaternion, rhs: Quaternion) => number;
      const signedAngle: (lhs: Quaternion, rhs: Quaternion, axis: Vector3) => number;
      const slerp: (lhs: Quaternion, rhs: Quaternion, t: number) => Quaternion;
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
      interface ToBabylon {
          position: BabylonVector3;
          rotationQuaternion: BabylonQuaternion;
          scaling: BabylonVector3;
      }
      const toBabylon: (frame: ReferenceFrame) => ToBabylon;
      const syncBabylon: (frame: ReferenceFrame, bNode: BabylonTransformNode | BabylonAbstractMesh) => void;
      const compose: (parent: ReferenceFrame, child: ReferenceFrame) => ReferenceFrame;
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
declare module 'simulator/renderConstants' {
  import { Distance } from 'simulator/util/index';
  export const RENDER_SCALE: Distance.Type;
  export const RENDER_SCALE_METERS_MULTIPLIER: number;

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
declare module 'simulator/robots/common' {
  import { Mass } from 'simulator/util/index';
  export const WOMBAT_BATTERY_MASS: Mass;
  export const MOTOR_MASS: Mass;

}
declare module 'simulator/robots/demobot' {
  import Robot from "simulator/state/State/Robot/index";
  export const DEMOBOT: Robot;

}
declare module 'simulator/robots/index' {
  export * from 'simulator/robots/demobot';

}
declare module 'simulator/scenes/index' {
  export * from 'simulator/scenes/jbcSandboxA';
  export * from 'simulator/scenes/jbcSandboxB';
  export * from 'simulator/scenes/jbc1';
  export * from 'simulator/scenes/jbc2';
  export * from 'simulator/scenes/jbc2b';
  export * from 'simulator/scenes/jbc2c';
  export * from 'simulator/scenes/jbc2d';
  export * from 'simulator/scenes/jbc3';
  export * from 'simulator/scenes/jbc3b';
  export * from 'simulator/scenes/jbc3c';
  export * from 'simulator/scenes/jbc4';
  export * from 'simulator/scenes/jbc4b';
  export * from 'simulator/scenes/jbc5';
  export * from 'simulator/scenes/jbc5b';
  export * from 'simulator/scenes/jbc5c';
  export * from 'simulator/scenes/jbc6';
  export * from 'simulator/scenes/jbc6b';
  export * from 'simulator/scenes/jbc6c';
  export * from 'simulator/scenes/jbc7';
  export * from 'simulator/scenes/jbc7b';
  export * from 'simulator/scenes/jbc8';
  export * from 'simulator/scenes/jbc8b';
  export * from 'simulator/scenes/jbc9';
  export * from 'simulator/scenes/jbc9b';
  export * from 'simulator/scenes/jbc10';
  export * from 'simulator/scenes/jbc10b';
  export * from 'simulator/scenes/jbc12';
  export * from 'simulator/scenes/jbc13';
  export * from 'simulator/scenes/jbc15b';
  export * from 'simulator/scenes/jbc17';
  export * from 'simulator/scenes/jbc17b';
  export * from 'simulator/scenes/jbc19';
  export * from 'simulator/scenes/jbc20';
  export * from 'simulator/scenes/jbc21';
  export * from 'simulator/scenes/jbc22';
  export * from 'simulator/scenes/scriptPlayground';
  export * from 'simulator/scenes/lightSensorTest';

}
declare module 'simulator/scenes/jbc1' {
  import Scene from 'simulator/state/State/Scene/index';
  export const JBC_1: Scene;

}
declare module 'simulator/scenes/jbc10' {
  import Scene from "simulator/state/State/Scene/index";
  export const JBC_10: Scene;

}
declare module 'simulator/scenes/jbc10b' {
  import Scene from "simulator/state/State/Scene/index";
  export const JBC_10B: Scene;

}
declare module 'simulator/scenes/jbc12' {
  import Scene from "simulator/state/State/Scene/index";
  export const JBC_12: Scene;

}
declare module 'simulator/scenes/jbc13' {
  import Scene from "simulator/state/State/Scene/index";
  export const JBC_13: Scene;

}
declare module 'simulator/scenes/jbc15b' {
  import Scene from "simulator/state/State/Scene/index";
  export const JBC_15B: Scene;

}
declare module 'simulator/scenes/jbc17' {
  import Scene from "simulator/state/State/Scene/index";
  export const JBC_17: Scene;

}
declare module 'simulator/scenes/jbc17b' {
  import Scene from "simulator/state/State/Scene/index";
  export const JBC_17B: Scene;

}
declare module 'simulator/scenes/jbc19' {
  import Scene from "simulator/state/State/Scene/index";
  export const JBC_19: Scene;

}
declare module 'simulator/scenes/jbc2' {
  import Scene from "simulator/state/State/Scene/index";
  export const JBC_2: Scene;

}
declare module 'simulator/scenes/jbc20' {
  import Scene from "simulator/state/State/Scene/index";
  export const JBC_20: Scene;

}
declare module 'simulator/scenes/jbc21' {
  import Scene from "simulator/state/State/Scene/index";
  export const JBC_21: Scene;

}
declare module 'simulator/scenes/jbc22' {
  import Scene from "simulator/state/State/Scene/index";
  export const JBC_22: Scene;

}
declare module 'simulator/scenes/jbc2b' {
  import Scene from "simulator/state/State/Scene/index";
  export const JBC_2B: Scene;

}
declare module 'simulator/scenes/jbc2c' {
  import Scene from "simulator/state/State/Scene/index";
  export const JBC_2C: Scene;

}
declare module 'simulator/scenes/jbc2d' {
  import Scene from "simulator/state/State/Scene/index";
  export const JBC_2D: Scene;

}
declare module 'simulator/scenes/jbc3' {
  import Scene from "simulator/state/State/Scene/index";
  export const JBC_3: Scene;

}
declare module 'simulator/scenes/jbc3b' {
  import Scene from "simulator/state/State/Scene/index";
  export const JBC_3B: Scene;

}
declare module 'simulator/scenes/jbc3c' {
  import Scene from "simulator/state/State/Scene/index";
  export const JBC_3C: Scene;

}
declare module 'simulator/scenes/jbc4' {
  import Scene from "simulator/state/State/Scene/index";
  export const JBC_4: Scene;

}
declare module 'simulator/scenes/jbc4b' {
  import Scene from "simulator/state/State/Scene/index";
  export const JBC_4B: Scene;

}
declare module 'simulator/scenes/jbc5' {
  import Scene from "simulator/state/State/Scene/index";
  export const JBC_5: Scene;

}
declare module 'simulator/scenes/jbc5b' {
  import Scene from "simulator/state/State/Scene/index";
  export const JBC_5B: Scene;

}
declare module 'simulator/scenes/jbc5c' {
  import Scene from "simulator/state/State/Scene/index";
  export const JBC_5C: Scene;

}
declare module 'simulator/scenes/jbc6' {
  import Scene from "simulator/state/State/Scene/index";
  export const JBC_6: Scene;

}
declare module 'simulator/scenes/jbc6b' {
  import Scene from "simulator/state/State/Scene/index";
  export const JBC_6B: Scene;

}
declare module 'simulator/scenes/jbc6c' {
  import Scene from "simulator/state/State/Scene/index";
  export const JBC_6C: Scene;

}
declare module 'simulator/scenes/jbc7' {
  import Scene from "simulator/state/State/Scene/index";
  export const JBC_7: Scene;

}
declare module 'simulator/scenes/jbc7b' {
  import Scene from "simulator/state/State/Scene/index";
  export const JBC_7B: Scene;

}
declare module 'simulator/scenes/jbc8' {
  import Scene from "simulator/state/State/Scene/index";
  export const JBC_8: Scene;

}
declare module 'simulator/scenes/jbc8b' {
  import Scene from "simulator/state/State/Scene/index";
  export const JBC_8B: Scene;

}
declare module 'simulator/scenes/jbc9' {
  import Scene from "simulator/state/State/Scene/index";
  export const JBC_9: Scene;

}
declare module 'simulator/scenes/jbc9b' {
  import Scene from "simulator/state/State/Scene/index";
  export const JBC_9B: Scene;

}
declare module 'simulator/scenes/jbcBase' {
  import { Vector3 } from "simulator/unit-math";
  import Node from "simulator/state/State/Scene/Node";
  import Scene from "simulator/state/State/Scene/index";
  export function createBaseSceneSurfaceA(): Scene;
  export function createBaseSceneSurfaceB(): Scene;
  /**
   * Helper function to create a Node for a can
   * @param canNumber The 1-index can number
   * @param canPosition The position of the can. If not provided, the position is determined using canNumber
   * @param editable Whether the can is editable
   * @param visible Whether the can is visible
   * @returns A can Node that can be inserted into a Scene
   */
  export function createCanNode(canNumber: number, canPosition?: Vector3, editable?: boolean, visible?: boolean): Node;

}
declare module 'simulator/scenes/jbcSandboxA' {
  import Scene from "simulator/state/State/Scene/index";
  export const JBC_Sandbox_A: Scene;

}
declare module 'simulator/scenes/jbcSandboxB' {
  import Scene from "simulator/state/State/Scene/index";
  export const JBC_Sandbox_B: Scene;

}
declare module 'simulator/scenes/lightSensorTest' {
  import Scene from "simulator/state/State/Scene/index";
  export const lightSensorTest: Scene;

}
declare module 'simulator/scenes/scriptPlayground' {
  import Scene from "simulator/state/State/Scene/index";
  export const scriptPlayground: Scene;

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
declare module 'simulator/state/State/Challenge/Event' {
  import LocalizedString from 'simulator/util/LocalizedString';
  interface Event {
      name: LocalizedString;
      description: LocalizedString;
  }
  export default Event;

}
declare module 'simulator/state/State/Challenge/Expr' {
  import Dict from 'simulator/Dict';
  namespace Expr {
      interface EvaluationContext {
          exprs: Dict<Expr>;
          eventStates: Dict<boolean>;
          exprStates: Dict<boolean>;
      }
      enum Type {
          Event = "event",
          And = "and",
          Or = "or",
          Xor = "xor",
          Not = "not",
          Once = "once"
      }
      interface Event {
          type: Type.Event;
          eventId: string;
      }
      interface And {
          type: Type.And;
          argIds: string[];
      }
      namespace And {
          const evaluate: (and: And, context: EvaluationContext) => boolean;
      }
      interface Or {
          type: Type.Or;
          argIds: string[];
      }
      namespace Or {
          const evaluate: (or: Or, context: EvaluationContext) => boolean;
      }
      interface Xor {
          type: Type.Xor;
          argIds: string[];
      }
      namespace Xor {
          const evaluate: (xor: Xor, context: EvaluationContext) => boolean;
      }
      interface Not {
          type: Type.Not;
          argId: string;
      }
      namespace Not {
          const evaluate: (not: Not, context: EvaluationContext) => boolean;
      }
      interface Once {
          type: Type.Once;
          argId: string;
      }
      namespace Once {
          const evaluate: (once: Once, context: EvaluationContext) => boolean;
      }
      const evaluate: (exprId: string, context: EvaluationContext) => boolean;
  }
  type Expr = (Expr.Event | Expr.And | Expr.Or | Expr.Xor | Expr.Not | Expr.Once);
  export default Expr;

}
declare module 'simulator/state/State/Challenge/Predicate' {
  import Dict from 'simulator/Dict';
  import Expr from 'simulator/state/State/Challenge/Expr';
  interface Predicate {
      exprs: Dict<Expr>;
      rootId: string;
  }
  namespace Predicate {
      const evaluate: (predicate: Predicate, eventStates: Dict<boolean>, lastExprStates?: Dict<boolean>) => boolean;
      const evaluateAll: (predicate: Predicate, eventStates: Dict<boolean>, lastExprStates?: Dict<boolean>) => Dict<boolean>;
  }
  export default Predicate;

}
declare module 'simulator/state/State/Challenge/index' {
  import Author from 'simulator/db/Author';
  import Dict from 'simulator/Dict';
  import ProgrammingLanguage from 'simulator/ProgrammingLanguage';
  import LocalizedString from 'simulator/util/LocalizedString';
  import Async from 'simulator/state/State/Async';
  import Event from 'simulator/state/State/Challenge/Event';
  import Predicate from 'simulator/state/State/Challenge/Predicate';
  interface Challenge {
      name: LocalizedString;
      description: LocalizedString;
      author: Author;
      code: {
          [language in ProgrammingLanguage]: string;
      };
      defaultLanguage: ProgrammingLanguage;
      events: Dict<Event>;
      success?: Predicate;
      failure?: Predicate;
      sceneId: string;
  }
  export interface ChallengeBrief {
      name: LocalizedString;
      description: LocalizedString;
      author: Author;
  }
  export namespace ChallengeBrief {
      const fromChallenge: (challenge: Challenge) => ChallengeBrief;
  }
  export type AsyncChallenge = Async<ChallengeBrief, Challenge>;
  export namespace AsyncChallenge {
      const unloaded: (brief: ChallengeBrief) => AsyncChallenge;
      const loaded: (challenge: Challenge) => AsyncChallenge;
  }
  export default Challenge;

}
declare module 'simulator/state/State/ChallengeCompletion/PredicateCompletion' {
  import Dict from 'simulator/Dict';
  import Predicate from 'simulator/state/State/Challenge/Predicate';
  interface PredicateCompletion {
      exprStates: Dict<boolean>;
  }
  namespace PredicateCompletion {
      const EMPTY: PredicateCompletion;
      const update: (predicateCompletion: PredicateCompletion, predicate: Predicate, eventStates: Dict<boolean>) => PredicateCompletion;
  }
  export default PredicateCompletion;

}
declare module 'simulator/state/State/ChallengeCompletion/index' {
  import Dict from 'simulator/Dict';
  import Async from 'simulator/state/State/Async';
  import PredicateCompletion from 'simulator/state/State/ChallengeCompletion/PredicateCompletion';
  import ProgrammingLanguage from 'simulator/ProgrammingLanguage';
  import { ReferenceFrame } from 'simulator/unit-math';
  interface ChallengeCompletion {
      code: {
          [language in ProgrammingLanguage]: string;
      };
      currentLanguage: ProgrammingLanguage;
      serializedSceneDiff: string;
      robotLinkOrigins?: Dict<Dict<ReferenceFrame>>;
      eventStates: Dict<boolean>;
      success?: PredicateCompletion;
      failure?: PredicateCompletion;
  }
  namespace ChallengeCompletion {
      const EMPTY: ChallengeCompletion;
  }
  export interface ChallengeCompletionBrief {
  }
  export namespace ChallengeCompletionBrief {
  }
  export type AsyncChallengeCompletion = Async<ChallengeCompletionBrief, ChallengeCompletion>;
  export namespace AsyncChallenge {
      const unloaded: (brief: ChallengeCompletionBrief) => AsyncChallengeCompletion;
      const loaded: (challenge: ChallengeCompletion) => AsyncChallengeCompletion;
  }
  export default ChallengeCompletion;

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
declare module 'simulator/state/State/Robot/Geometry' {
  namespace Geometry {
      enum Type {
          LocalMesh = "local-mesh",
          RemoteMesh = "remote-mesh"
      }
      interface LocalMesh {
          type: Type.LocalMesh;
          /**
           * The format of the mesh data.
           */
          format: LocalMesh.Format;
          /**
           * Base 64 encoded mesh data.
           */
          data: string;
      }
      const localMesh: (params: Omit<LocalMesh, "type">) => LocalMesh;
      namespace LocalMesh {
          enum Format {
              Gltf = "gltf",
              Glb = "glb"
          }
      }
      interface RemoteMesh {
          type: Type.RemoteMesh;
          /**
           * The URI of the mesh data. Format is derived from the file extension or MIME type.
           */
          uri: string;
          include?: string[];
      }
      const remoteMesh: (params: Omit<RemoteMesh, "type">) => RemoteMesh;
  }
  type Geometry = (Geometry.LocalMesh | Geometry.RemoteMesh);
  export default Geometry;

}
declare module 'simulator/state/State/Robot/Node' {
  import { Vector3 } from 'simulator/math';
  import { Vector3 as UnitVector3, ReferenceFrame } from 'simulator/unit-math';
  import { Angle, Distance, Mass } from 'simulator/util/index';
  import LocalizedString from 'simulator/util/LocalizedString';
  import Patch from 'simulator/util/Patch';
  namespace Node {
      export enum Type {
          Frame = "frame",
          Link = "link",
          Weight = "weight",
          Motor = "motor",
          Servo = "servo",
          EtSensor = "et-sensor",
          TouchSensor = "touch-sensor",
          LightSensor = "light-sensor",
          ReflectanceSensor = "reflectance-sensor",
          IRobotCreate = "irobot-create"
      }
      interface Base {
          /**
           * A human readable name for the Node.
           */
          name?: LocalizedString;
          /**
           * A human readable description of the Node.
           */
          description?: LocalizedString;
      }
      namespace Base {
          const innerDiff: (a: Base, b: Base) => Patch.InnerPatch<Base>;
      }
      export interface FrameLike {
          /**
           * Parent
           */
          parentId: string;
          /**
           * The translation and orientation from the parentId,
           * or ReferenceFrame.IDENTITY if undefined.
           */
          origin?: ReferenceFrame;
      }
      /**
       * A Frame is a reference frame in the robot's kinematic tree.
       * It MUST be placed between two `Link`s.
       */
      export interface Frame extends FrameLike {
          type: Type.Frame;
      }
      export namespace Frame {
          const diff: (a: Frame, b: Frame) => Patch<Frame>;
      }
      export interface Link extends Base {
          type: Type.Link;
          parentId?: string;
          /**
           * The mass of the link. If undefined, zero.
           */
          mass?: Mass;
          /**
           * Coefficient of friction. If undefined, zero.
           */
          friction?: number;
          /**
           * Restitution (bounciness). If undefined, zero.
           */
          restitution?: number;
          /**
           * The moment of inertia of the Mesh, represented as a
           * column-wise 3x3 matrix of numbers. If undefined, zeros.
           */
          inertia?: number[];
          /**
           * The physics body used for determining collision.
           */
          collisionBody: Link.CollisionBody;
          /**
           * The geometry to display for this mesh. If undefined, no mesh
           * is displayed.
           */
          geometryId?: string;
      }
      export const link: (params: Omit<Link, "type">) => Link;
      export namespace Link {
          namespace CollisionBody {
              enum Type {
                  Embedded = "embedded",
                  Sphere = "sphere",
                  Cylinder = "cylinder",
                  Box = "box"
              }
              interface Embedded {
                  type: Type.Embedded;
              }
              const EMBEDDED: Embedded;
              interface Sphere {
                  type: Type.Sphere;
              }
              const SPHERE: Sphere;
              interface Cylinder {
                  type: Type.Cylinder;
              }
              const CYLINDER: Cylinder;
              interface Box {
                  type: Type.Box;
              }
              const BOX: Box;
          }
          type CollisionBody = (CollisionBody.Embedded | CollisionBody.Sphere | CollisionBody.Cylinder | CollisionBody.Box);
          const diff: (a: Link, b: Link) => Patch<Link>;
      }
      /**
       * A `Weight` can be attached to a `Link` to distribute mass arbitrarily.
       * It has no visual or physical representation.
       */
      export interface Weight {
          type: Type.Weight;
          /**
           * Parent. Must be a link.
           */
          parentId: string;
          /**
           * The translation and orientation from the parentId,
           * or ReferenceFrame.IDENTITY if undefined.
           */
          origin?: ReferenceFrame;
          /**
           * The mass of the weight.
           */
          mass: Mass;
      }
      export const weight: (params: Omit<Weight, "type">) => Weight;
      export namespace Weight {
          const diff: (a: Weight, b: Weight) => Patch<Weight>;
      }
      export interface HingeJoint {
          /**
           * The axis of the parent
           */
          parentAxis: Vector3;
          /**
           * The axis of the child. If undefined, same as `parentAxis`.
           */
          childAxis?: Vector3;
          /**
           * The pivot point of the parent. If undefined, zero.
           */
          parentPivot?: UnitVector3;
          /**
           * The pivot point of the child. If undefined, zero.
           */
          childPivot?: UnitVector3;
          /**
           * The starting twist of the child relative to the parent along the main axis.
           * If undefined, zero.
           */
          childTwist?: Angle;
      }
      /**
       * A `Motor` is a continuous hinge joint.
       * It MUST have a parent that is a `Link`.
       */
      export interface Motor extends Base, HingeJoint {
          type: Type.Motor;
          parentId: string;
          /**
           * The number of ticks in a full revolution of the motor.
           * If undefined, 2048 is assumed.
           */
          ticksPerRevolution?: number;
          /**
           * Max velocity in ticks per second.
           * If undefined, 1500 ticks/sec is assumed.
           */
          velocityMax?: number;
          /**
           * The motor port.
           */
          motorPort: number;
          /**
           * The connection to the wombat. 'normal' or 'inverted'. If undefined, 'normal' is assumed.
           */
          plug?: Motor.Plug;
      }
      export const motor: (params: Omit<Motor, "type">) => Motor;
      export namespace Motor {
          enum Plug {
              Normal = "normal",
              Inverted = "inverted"
          }
          const diff: (a: Motor, b: Motor) => Patch<Motor>;
      }
      /**
       * A `Servo` is a revolute hinge joint.
       * It MUST have a parent that is a `Link`.
       */
      export interface Servo extends Base, HingeJoint {
          type: Type.Servo;
          parentId: string;
          /**
           * Position limits. Defaults are used (described below) if undefined.
           * Note that these are logical limits, not physical limits. The physical limits
           * are always +/- 87.5 degrees.
           */
          position?: {
              /**
               * The minimum position of the servo. If undefined,
               * assumed to be -87.5 degrees from origin.
               */
              min?: Angle;
              /**
               * The maximum position of the servo. If undefined,
               * assumed to be 87.5 degrees from origin.
               */
              max?: Angle;
          };
          /**
           * The servo port.
           */
          servoPort: number;
      }
      export const servo: (params: Omit<Servo, "type">) => Servo;
      export namespace Servo {
          const diff: (a: Servo, b: Servo) => Patch<Servo>;
      }
      interface DigitalSensor extends FrameLike {
          /**
           * The digital port.
           */
          digitalPort: number;
      }
      namespace DigitalSensor {
          const innerDiff: (a: DigitalSensor, b: DigitalSensor) => Patch.InnerPatch<DigitalSensor>;
      }
      interface AnalogSensor extends FrameLike {
          /**
           * The analog port.
           */
          analogPort: number;
      }
      namespace AnalogSensor {
          const innerDiff: (a: AnalogSensor, b: AnalogSensor) => Patch.InnerPatch<AnalogSensor>;
      }
      /**
       * ET (distance) sensor.
       */
      export interface EtSensor extends Base, AnalogSensor {
          type: Type.EtSensor;
          maxDistance?: Distance;
          noiseRadius?: Distance;
      }
      export const etSensor: (params: Omit<EtSensor, "type">) => EtSensor;
      export namespace EtSensor {
          const diff: (a: EtSensor, b: EtSensor) => Patch<EtSensor>;
      }
      export interface TouchSensor extends Base, DigitalSensor {
          type: Type.TouchSensor;
          collisionBox: UnitVector3;
      }
      export const touchSensor: (params: Omit<TouchSensor, "type">) => TouchSensor;
      export namespace TouchSensor {
          const diff: (a: TouchSensor, b: TouchSensor) => Patch<TouchSensor>;
      }
      export interface LightSensor extends Base, AnalogSensor {
          type: Type.LightSensor;
      }
      export const lightSensor: (params: Omit<LightSensor, "type">) => LightSensor;
      export interface ReflectanceSensor extends Base, AnalogSensor {
          type: Type.ReflectanceSensor;
          maxDistance?: Distance;
          noiseRadius?: Distance;
      }
      export const reflectanceSensor: (params: Omit<ReflectanceSensor, "type">) => ReflectanceSensor;
      export namespace ReflectanceSensor {
          const diff: (a: ReflectanceSensor, b: ReflectanceSensor) => Patch<ReflectanceSensor>;
      }
      export interface IRobotCreate extends Base, FrameLike {
          type: Type.IRobotCreate;
      }
      export const iRobotCreate: (params: Omit<IRobotCreate, "type">) => IRobotCreate;
      export namespace IRobotCreate {
          const diff: (a: IRobotCreate, b: IRobotCreate) => Patch<IRobotCreate>;
      }
      export const diff: (a: Node, b: Node) => Patch<Node>;
      export const isConstraint: (node: Node) => boolean;
      export {};
  }
  type Node = (Node.Frame | Node.Link | Node.Weight | Node.Motor | Node.Servo | Node.EtSensor | Node.TouchSensor | Node.LightSensor | Node.ReflectanceSensor | Node.IRobotCreate);
  export default Node;

}
declare module 'simulator/state/State/Robot/index' {
  import Dict from 'simulator/Dict';
  import { ReferenceFrame } from 'simulator/unit-math';
  import LocalizedString from 'simulator/util/LocalizedString';
  import Patch from 'simulator/util/Patch';
  import Geometry from 'simulator/state/State/Robot/Geometry';
  import Node from 'simulator/state/State/Robot/Node';
  interface Robot {
      name: LocalizedString;
      authorId: string;
      description?: LocalizedString;
      nodes: Dict<Node>;
      geometry: Dict<Geometry>;
      origin?: ReferenceFrame;
  }
  interface PatchRobot {
      name: Patch<LocalizedString>;
      authorId: Patch<string>;
      description: Patch<LocalizedString>;
      nodes: Dict<Patch<Node>>;
      geometry: Dict<Patch<Geometry>>;
  }
  namespace Robot {
      const rootNodeIds: (robot: Robot) => string[];
      const childrenNodeIds: (robot: Robot) => Dict<string[]>;
      const breadthFirstNodeIds: (robot: Robot) => string[];
      const diff: (a: Robot, b: Robot) => PatchRobot;
  }
  export default Robot;

}
declare module 'simulator/state/State/Scene/Audio' {
  namespace Audio {
      interface Base {
          name: string;
      }
      export interface Pcm extends Base {
          type: 'pcm';
          channels: number;
          sampleRate: number;
          bitDepth: number;
          data: string;
      }
      export interface File extends Base {
          type: 'file';
          uri: string;
      }
      export {};
  }
  type Audio = Audio.Pcm | Audio.File;
  export default Audio;

}
declare module 'simulator/state/State/Scene/Camera' {
  import { Vector3 } from "simulator/unit-math";
  import { Distance } from "simulator/util/Value";
  import Patch from 'simulator/util/Patch';
  namespace Camera {
      export interface ArcRotate {
          type: 'arc-rotate';
          target: Vector3;
          position: Vector3;
          radius: Distance;
      }
      namespace ArcRotate {
          const diff: (prev: ArcRotate, next: ArcRotate) => Patch<ArcRotate>;
      }
      export type ArcRotateParams = Omit<ArcRotate, 'type'>;
      export const arcRotate: (params: ArcRotateParams) => ArcRotate;
      export type Type = 'arc-rotate' | 'none';
      export const diff: (prev: Camera, next: Camera) => Patch<Camera>;
      export interface None {
          type: "none";
      }
      export const NONE: None;
      export {};
  }
  type Camera = Camera.ArcRotate | Camera.None;
  export default Camera;

}
declare module 'simulator/state/State/Scene/Color' {
  import { Color3 as BabylonColor3 } from '@babylonjs/core/Maths/math.color';
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
      const toBabylon: (color: Color) => BabylonColor3;
      const WHITE: Rgb;
      const BLACK: Rgb;
  }
  export type Color = Color.Rgba | Color.Hsla | Color.Rgb | Color.Hsl;

}
declare module 'simulator/state/State/Scene/Document' {
  namespace Document {
      interface Base {
          name: string;
      }
      export interface Internal extends Base {
          type: 'internal';
          content: string;
      }
      export interface External extends Base {
          type: 'external';
          uri: string;
      }
      export {};
  }
  type Document = Document.Internal | Document.External;
  export default Document;

}
declare module 'simulator/state/State/Scene/Geometry' {
  import { Vector2, Vector3 } from 'simulator/unit-math';
  import { Vector3 as RawVector3, Vector2 as RawVector2 } from 'simulator/math';
  import { Distance } from 'simulator/util/Value';
  import Patch from 'simulator/util/Patch';
  namespace Geometry {
      interface Box {
          type: 'box';
          size: Vector3;
      }
      namespace Box {
          const DEFAULT: Box;
          const diff: (prev: Box, next: Box) => Patch<Box>;
      }
      interface Sphere {
          type: 'sphere';
          radius: Distance;
      }
      namespace Sphere {
          const DEFAULT: Sphere;
          const diff: (prev: Sphere, next: Sphere) => Patch<Sphere>;
      }
      interface Cylinder {
          type: 'cylinder';
          radius: Distance;
          height: Distance;
      }
      namespace Cylinder {
          const DEFAULT: Cylinder;
          const diff: (prev: Cylinder, next: Cylinder) => Patch<Cylinder>;
      }
      interface Cone {
          type: 'cone';
          radius: Distance;
          height: Distance;
      }
      namespace Cone {
          const DEFAULT: Cone;
          const diff: (prev: Cone, next: Cone) => Patch<Cone>;
      }
      interface Plane {
          type: 'plane';
          size: Vector2;
      }
      namespace Plane {
          const DEFAULT: Plane;
          const diff: (prev: Plane, next: Plane) => Patch<Plane>;
      }
      interface Mesh {
          type: 'mesh';
          distanceType?: Distance.Type;
          vertices: RawVector3[];
          uvs?: RawVector2[];
          indices?: number[];
      }
      namespace Mesh {
          const DEFAULT: Mesh;
          const diff: (prev: Mesh, next: Mesh) => Patch<Mesh>;
      }
      interface File {
          type: 'file';
          uri: string;
          include?: string[];
          exclude?: string[];
      }
      namespace File {
          const DEFAULT: File;
          const diff: (prev: File, next: File) => Patch<File>;
      }
      const isBox: (geometry: Geometry) => geometry is Box;
      const isSphere: (geometry: Geometry) => geometry is Sphere;
      const isCylinder: (geometry: Geometry) => geometry is Cylinder;
      const isCone: (geometry: Geometry) => geometry is Cone;
      const isPlane: (geometry: Geometry) => geometry is Plane;
      const isMesh: (geometry: Geometry) => geometry is Mesh;
      const isFile: (geometry: Geometry) => geometry is File;
      const diff: (prev: Geometry, next: Geometry) => Patch<Geometry>;
      type Type = 'box' | 'sphere' | 'cylinder' | 'cone' | 'plane' | 'mesh' | 'file';
      const defaultFor: (type: Type) => Geometry;
  }
  type Geometry = Geometry.Box | Geometry.Sphere | Geometry.Cylinder | Geometry.Cone | Geometry.Plane | Geometry.Mesh | Geometry.File;
  export default Geometry;

}
declare module 'simulator/state/State/Scene/Material' {
  import Patch from 'simulator/util/Patch';
  import { Color as ColorT } from 'simulator/state/State/Scene/Color';
  namespace Material {
      namespace Source1 {
          interface Color {
              type: 'color1';
              color: number;
          }
          namespace Color {
              const diff: (prev: Color, next: Color) => Patch<Color>;
          }
          interface Texture {
              type: 'texture';
              uri: string;
          }
          namespace Texture {
              const diff: (prev: Texture, next: Texture) => Patch<Texture>;
          }
          const diff: (prev: Source1, next: Source1) => Patch<Source1>;
      }
      namespace Source3 {
          interface Color {
              type: 'color3';
              color: ColorT;
          }
          namespace Color {
              const diff: (prev: Color, next: Color) => Patch<Color>;
          }
          interface Texture {
              type: 'texture';
              uri: string;
          }
          namespace Texture {
              const diff: (prev: Texture, next: Texture) => Patch<Texture>;
          }
          const diff: (prev: Source3, next: Source3) => Patch<Source3>;
      }
      type Source1 = Source1.Color | Source1.Texture;
      type Source3 = Source3.Color | Source3.Texture;
      interface Pbr {
          type: 'pbr';
          albedo?: Material.Source3;
          emissive?: Material.Source3;
          reflection?: Material.Source3;
          ambient?: Material.Source3;
          metalness?: Material.Source1;
      }
      namespace Pbr {
          const NIL: Pbr;
          const diff: (prev: Pbr, next: Pbr) => Patch<Pbr>;
      }
      interface Basic {
          type: 'basic';
          color?: Material.Source3;
      }
      namespace Basic {
          const NIL: Basic;
          const diff: (prev: Basic, next: Basic) => Patch<Basic>;
      }
      const diff: (prev: Material, next: Material) => Patch<Material>;
  }
  type Material = Material.Pbr | Material.Basic;
  export default Material;

}
declare module 'simulator/state/State/Scene/Node' {
  import AbstractRobot from 'simulator/AbstractRobot/index';
  import { Vector2, Vector3 } from 'simulator/math';
  import { ReferenceFrame } from 'simulator/unit-math';
  import { DistributiveOmit } from 'simulator/util/types';
  import { Angle, Mass } from 'simulator/util/Value';
  import LocalizedString from 'simulator/util/LocalizedString';
  import Patch from 'simulator/util/Patch';
  import Material from 'simulator/state/State/Scene/Material';
  namespace Node {
      export interface Physics {
          colliderId?: string;
          fixed?: boolean;
          type: Physics.Type;
          mass?: Mass;
          friction?: number;
          restitution?: number;
      }
      export namespace Physics {
          type Type = 'box' | 'sphere' | 'cylinder' | 'mesh' | 'none';
          const diff: (prev: Physics, next: Physics) => Patch<Physics>;
      }
      interface Base {
          name: LocalizedString;
          startingOrigin?: ReferenceFrame;
          origin?: ReferenceFrame;
          scriptIds?: string[];
          documentIds?: string[];
          editable?: boolean;
          visible?: boolean;
      }
      export namespace Base {
          const NIL: Base;
          const upcast: <T extends Base>(t: T) => Base;
          const partialDiff: (prev: Base, next: Base) => Patch.InnerPatch<Base>;
      }
      export interface Empty extends Base {
          type: 'empty';
          parentId?: string;
      }
      export namespace Empty {
          const NIL: Empty;
          const from: <T extends Base>(t: T) => Empty;
          const diff: (prev: Empty, next: Empty) => Patch<Empty>;
      }
      export interface Obj extends Base {
          type: 'object';
          parentId?: string;
          geometryId: string;
          physics?: Physics;
          material?: Material;
          faceUvs?: Vector2[];
      }
      export namespace Obj {
          const NIL: Obj;
          const from: <T extends Base>(t: T) => Obj;
          const diff: (prev: Obj, next: Obj) => Patch<Obj>;
      }
      export interface PointLight extends Base {
          type: 'point-light';
          parentId?: string;
          intensity: number;
          radius?: number;
          range?: number;
      }
      export namespace PointLight {
          const NIL: PointLight;
          const from: <T extends Base>(t: T) => PointLight;
          const diff: (prev: PointLight, next: PointLight) => Patch<PointLight>;
      }
      export interface SpotLight extends Base {
          type: 'spot-light';
          parentId?: string;
          direction: Vector3;
          angle: Angle;
          exponent: number;
          intensity: number;
      }
      export namespace SpotLight {
          const NIL: SpotLight;
          const from: <T extends Base>(t: T) => SpotLight;
          const diff: (prev: SpotLight, next: SpotLight) => Patch<SpotLight>;
      }
      export interface DirectionalLight extends Base {
          type: 'directional-light';
          parentId?: string;
          radius?: number;
          range?: number;
          direction: Vector3;
          intensity: number;
      }
      export namespace DirectionalLight {
          const NIL: DirectionalLight;
          const from: <T extends Base>(t: T) => DirectionalLight;
          const diff: (prev: DirectionalLight, next: DirectionalLight) => Patch<DirectionalLight>;
      }
      export interface FromTemplate extends Base {
          type: 'from-template';
          parentId?: string;
          templateId: string;
      }
      export namespace FromTemplate {
          const NIL: FromTemplate;
          const from: <T extends Base>(t: T) => FromTemplate;
          const diff: (prev: FromTemplate, next: FromTemplate) => Patch<FromTemplate>;
      }
      export interface Robot extends Base {
          type: 'robot';
          robotId: string;
          state: AbstractRobot.Stateless;
      }
      export namespace Robot {
          const NIL: Robot;
          const from: <T extends Base>(t: T) => Robot;
          const diff: (prev: Robot, next: Robot) => Patch<Robot>;
      }
      export const diff: (prev: Node, next: Node) => Patch<Node>;
      export type Type = 'empty' | 'object' | 'point-light' | 'spot-light' | 'directional-light' | 'from-template' | 'robot';
      export const transmute: (node: Node, type: Type) => Node;
      export type TemplatedNode<T extends Base> = DistributiveOmit<T, keyof Base>;
      export {};
  }
  type Node = (Node.Empty | Node.Obj | Node.PointLight | Node.SpotLight | Node.DirectionalLight | Node.FromTemplate | Node.Robot);
  export default Node;

}
declare module 'simulator/state/State/Scene/Script' {
  interface Script {
      name: string;
      language: Script.Language;
      code: string;
  }
  namespace Script {
      enum Language {
          EcmaScript = "ecmascript"
      }
      const ecmaScript: (name: string, code: string) => Script;
  }
  export default Script;

}
declare module 'simulator/state/State/Scene/Texture' {

}
declare module 'simulator/state/State/Scene/index' {
  import Dict from 'simulator/Dict';
  import Geometry from 'simulator/state/State/Scene/Geometry';
  import Node from 'simulator/state/State/Scene/Node';
  import Script from 'simulator/state/State/Scene/Script';
  import { Vector3 } from 'simulator/unit-math';
  import Camera from 'simulator/state/State/Scene/Camera';
  import Patch from 'simulator/util/Patch';
  import Async from 'simulator/state/State/Async';
  import LocalizedString from 'simulator/util/LocalizedString';
  import Author from 'simulator/db/Author';
  interface Scene {
      name: LocalizedString;
      author: Author;
      description: LocalizedString;
      selectedNodeId?: string;
      selectedScriptId?: string;
      hdriUri?: string;
      geometry: Dict<Geometry>;
      nodes: Dict<Node>;
      scripts?: Dict<Script>;
      camera: Camera;
      gravity: Vector3;
  }
  export type SceneBrief = Pick<Scene, 'name' | 'author' | 'description'>;
  export namespace SceneBrief {
      const fromScene: (scene: Scene) => SceneBrief;
  }
  export type AsyncScene = Async<SceneBrief, Scene>;
  export namespace AsyncScene {
      const unloaded: (brief: SceneBrief) => AsyncScene;
      const loaded: (scene: Scene) => AsyncScene;
  }
  export interface PatchScene {
      name: Patch<LocalizedString>;
      author: Patch<Author>;
      description: Patch<LocalizedString>;
      selectedNodeId: Patch<string>;
      selectedScriptId: Patch<string>;
      hdriUri?: Patch<string>;
      geometry: Dict<Patch<Geometry>>;
      nodes: Dict<Patch<Node>>;
      scripts?: Dict<Patch<Script>>;
      camera: Patch<Camera>;
      gravity: Patch<Vector3>;
  }
  namespace Scene {
      const robots: (scene: Scene) => Dict<Node.Robot>;
      const nodeOrdering: (scene: Scene) => string[];
      const setNode: (scene: Scene, nodeId: string, node: Node) => Scene;
      const addObject: (scene: Scene, nodeId: string, obj: Node.Obj, geometry: Geometry) => Scene;
      const removeNode: (scene: Scene, nodeId: string) => Scene;
      const setGravity: (scene: Scene, gravity: Vector3) => Scene;
      const setCamera: (scene: Scene, camera: Camera) => Scene;
      const setGeometry: (scene: Scene, geometryId: string, geometry: Geometry) => Scene;
      const removeGeometry: (scene: Scene, geometryId: string) => Scene;
      const setScript: (scene: Scene, scriptId: string, script: Script) => Scene;
      const removeScript: (scene: Scene, scriptId: string) => Scene;
      const diff: (a: Scene, b: Scene) => PatchScene;
      const apply: (scene: Scene, patch: PatchScene) => Scene;
      const EMPTY: Scene;
  }
  export default Scene;

}
declare module 'simulator/state/State/index' {
  import { Size } from 'simulator/components/Widget';
  import LocalizedString from 'simulator/util/LocalizedString';
  import Dict from 'simulator/Dict';
  import Async from "simulator/state/State/Async";
  import { AsyncChallenge } from 'simulator/state/State/Challenge/index';
  import { AsyncChallengeCompletion } from 'simulator/state/State/ChallengeCompletion/index';
  import Documentation from 'simulator/state/State/Documentation/index';
  import DocumentationLocation from 'simulator/state/State/Documentation/DocumentationLocation';
  import Robot from 'simulator/state/State/Robot/index';
  import { AsyncScene } from 'simulator/state/State/Scene/index';
  export type Scenes = Dict<AsyncScene>;
  export namespace Scenes {
      const EMPTY: Scenes;
  }
  export type Challenges = Dict<AsyncChallenge>;
  export namespace Challenges {
      const EMPTY: Challenges;
  }
  export type ChallengeCompletions = Dict<AsyncChallengeCompletion>;
  export namespace ChallengeCompletions {
      const EMPTY: ChallengeCompletions;
  }
  export interface Robots {
      robots: Dict<Async<Record<string, never>, Robot>>;
  }
  export namespace Robots {
      const EMPTY: Robots;
      const loaded: (robots: Robots) => Dict<Robot>;
  }
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
  import { DocumentationState, ChallengeCompletions, Challenges, I18n, Robots, Scenes } from 'simulator/state/State/index';
  import { RouterState } from 'connected-react-router';
  import Record from 'simulator/db/Record';
  import Selector from 'simulator/db/Selector';
  const _default: import("redux").Store<import("redux").EmptyObject & State, import("redux").AnyAction>;
  export default _default;
  export interface State {
      scenes: Scenes;
      challenges: Challenges;
      challengeCompletions: ChallengeCompletions;
      robots: Robots;
      documentation: DocumentationState;
      router: RouterState;
      i18n: I18n;
  }
  export namespace State {
      const lookup: (state: State, selector: Selector) => Record | undefined;
  }

}
declare module 'simulator/state/reducer/challengeCompletions' {
  import { ChallengeCompletions } from 'simulator/state/State/index';
  import ChallengeCompletion, { AsyncChallengeCompletion } from 'simulator/state/State/ChallengeCompletion/index';
  import PredicateCompletion from 'simulator/state/State/ChallengeCompletion/PredicateCompletion';
  import Scene from 'simulator/state/State/Scene/index';
  import Dict from 'simulator/Dict';
  import { OuterObjectPatch } from 'symmetry/dist';
  import ProgrammingLanguage from 'simulator/ProgrammingLanguage';
  import { ReferenceFrame } from 'simulator/unit-math';
  export namespace ChallengeCompletionsAction {
      interface LoadChallengeCompletion {
          type: 'challenge-completions/load-challenge-completion';
          challengeId: string;
      }
      const loadChallengeCompletion: (params: Omit<LoadChallengeCompletion, "type">) => LoadChallengeCompletion;
      interface CreateChallengeCompletion {
          type: 'challenge-completions/create-challenge-completion';
          challengeId: string;
          challengeCompletion: ChallengeCompletion;
      }
      const createChallengeCompletion: (params: Omit<CreateChallengeCompletion, "type">) => CreateChallengeCompletion;
      interface SaveChallengeCompletion {
          type: 'challenge-completions/save-challenge-completion';
          challengeId: string;
      }
      const saveChallengeCompletion: (params: Omit<SaveChallengeCompletion, "type">) => SaveChallengeCompletion;
      interface RemoveChallengeCompletion {
          type: 'challenge-completions/remove-challenge-completion';
          challengeId: string;
      }
      const removeChallenge: (params: Omit<RemoveChallengeCompletion, "type">) => RemoveChallengeCompletion;
      interface SetChallengeCompletionInternal {
          type: 'challenge-completions/set-challenge-completion-internal';
          challengeId: string;
          challengeCompletion: AsyncChallengeCompletion;
      }
      const setChallengeCompletionInternal: (params: Omit<SetChallengeCompletionInternal, "type">) => SetChallengeCompletionInternal;
      interface SetSuccessPredicateCompletion {
          type: 'challenge-completions/set-success-predicate-completion';
          challengeId: string;
          success?: PredicateCompletion;
      }
      const setSuccessPredicateCompletion: (params: Omit<SetSuccessPredicateCompletion, "type">) => SetSuccessPredicateCompletion;
      interface SetFailurePredicateCompletion {
          type: 'challenge-completions/set-failure-predicate-completion';
          challengeId: string;
          failure?: PredicateCompletion;
      }
      const setFailurePredicateCompletion: (params: Omit<SetFailurePredicateCompletion, "type">) => SetFailurePredicateCompletion;
      interface RemoveEventState {
          type: 'challenge-completions/remove-event-state';
          challengeId: string;
          eventId: string;
      }
      const removeEventState: (params: Omit<RemoveEventState, "type">) => RemoveEventState;
      interface SetEventState {
          type: 'challenge-completions/set-event-state';
          challengeId: string;
          eventId: string;
          eventState: boolean;
      }
      const setEventState: (params: Omit<SetEventState, "type">) => SetEventState;
      interface SetEventStates {
          type: 'challenge-completions/set-event-states';
          challengeId: string;
          eventStates: Dict<boolean>;
      }
      const setEventStates: (params: Omit<SetEventStates, "type">) => SetEventStates;
      interface SetEventStatesAndPredicateCompletions {
          type: 'challenge-completions/set-event-states-and-predicate-completions';
          challengeId: string;
          eventStates: Dict<boolean>;
          success?: PredicateCompletion;
          failure?: PredicateCompletion;
      }
      const setEventStatesAndPredicateCompletions: (params: Omit<SetEventStatesAndPredicateCompletions, "type">) => SetEventStatesAndPredicateCompletions;
      interface SetSceneDiff {
          type: 'challenge-completions/set-scene-diff';
          challengeId: string;
          sceneDiff: OuterObjectPatch<Scene>;
      }
      const setSceneDiff: (params: Omit<SetSceneDiff, "type">) => SetSceneDiff;
      interface ResetChallengeCompletion {
          type: 'challenge-completions/reset-challenge-completion';
          challengeId: string;
      }
      const resetChallengeCompletion: (params: Omit<ResetChallengeCompletion, "type">) => ResetChallengeCompletion;
      interface SetCode {
          type: 'challenge-completions/set-code';
          challengeId: string;
          language: ProgrammingLanguage;
          code: string;
      }
      const setCode: (params: Omit<SetCode, "type">) => SetCode;
      interface SetCurrentLanguage {
          type: 'challenge-completions/set-current-language';
          challengeId: string;
          language: ProgrammingLanguage;
      }
      const setCurrentLanguage: (params: Omit<SetCurrentLanguage, "type">) => SetCurrentLanguage;
      interface SetRobotLinkOrigins {
          type: 'challenge-completions/set-robot-link-origins';
          challengeId: string;
          robotLinkOrigins: Dict<Dict<ReferenceFrame>>;
      }
      const setRobotLinkOrigins: (params: Omit<SetRobotLinkOrigins, "type">) => SetRobotLinkOrigins;
  }
  export type ChallengeCompletionsAction = (ChallengeCompletionsAction.LoadChallengeCompletion | ChallengeCompletionsAction.CreateChallengeCompletion | ChallengeCompletionsAction.SaveChallengeCompletion | ChallengeCompletionsAction.RemoveChallengeCompletion | ChallengeCompletionsAction.SetChallengeCompletionInternal | ChallengeCompletionsAction.SetSuccessPredicateCompletion | ChallengeCompletionsAction.SetFailurePredicateCompletion | ChallengeCompletionsAction.RemoveEventState | ChallengeCompletionsAction.SetEventState | ChallengeCompletionsAction.SetEventStates | ChallengeCompletionsAction.SetEventStatesAndPredicateCompletions | ChallengeCompletionsAction.SetSceneDiff | ChallengeCompletionsAction.ResetChallengeCompletion | ChallengeCompletionsAction.SetCode | ChallengeCompletionsAction.SetCurrentLanguage | ChallengeCompletionsAction.SetRobotLinkOrigins);
  export const reduceChallengeCompletions: (state: ChallengeCompletions, action: ChallengeCompletionsAction) => ChallengeCompletions;

}
declare module 'simulator/state/reducer/challenges' {
  import { Challenges } from 'simulator/state/State/index';
  import Challenge, { AsyncChallenge } from 'simulator/state/State/Challenge/index';
  import Predicate from 'simulator/state/State/Challenge/Predicate';
  import Event from 'simulator/state/State/Challenge/Event';
  import LocalizedString from 'simulator/util/LocalizedString';
  export namespace ChallengesAction {
      interface LoadChallenge {
          type: 'challenges/load-challenge';
          challengeId: string;
      }
      const loadChallenge: (params: Omit<LoadChallenge, "type">) => LoadChallenge;
      interface CreateChallenge {
          type: 'challenges/create-challenge';
          challengeId: string;
          challenge: Challenge;
      }
      const createChallenge: (params: Omit<CreateChallenge, "type">) => CreateChallenge;
      interface SaveChallenge {
          type: 'challenges/save-challenge';
          challengeId: string;
      }
      const saveChallenge: (params: Omit<SaveChallenge, "type">) => SaveChallenge;
      interface RemoveChallenge {
          type: 'challenges/remove-challenge';
          challengeId: string;
      }
      const removeChallenge: (params: Omit<RemoveChallenge, "type">) => RemoveChallenge;
      interface SetChallengeInternal {
          type: 'challenges/set-challenge-internal';
          challengeId: string;
          challenge: AsyncChallenge;
      }
      const setChallengeInternal: (params: Omit<SetChallengeInternal, "type">) => SetChallengeInternal;
      interface SetSuccessPredicate {
          type: 'challenges/set-success-predicate';
          challengeId: string;
          success?: Predicate;
      }
      const setSuccessPredicate: (params: Omit<SetSuccessPredicate, "type">) => SetSuccessPredicate;
      interface SetFailurePredicate {
          type: 'challenges/set-failure-predicate';
          challengeId: string;
          failure?: Predicate;
      }
      const setFailurePredicate: (params: Omit<SetFailurePredicate, "type">) => SetFailurePredicate;
      interface RemoveEvent {
          type: 'challenges/remove-event';
          challengeId: string;
          eventId: string;
      }
      const removeEvent: (params: Omit<RemoveEvent, "type">) => RemoveEvent;
      interface SetEvent {
          type: 'challenges/set-event';
          challengeId: string;
          eventId: string;
          event: Event;
      }
      const setEvent: (params: Omit<SetEvent, "type">) => SetEvent;
      interface SetName {
          type: 'challenges/set-name';
          challengeId: string;
          name: LocalizedString;
      }
      const setName: (params: Omit<SetName, "type">) => SetName;
      interface SetDescription {
          type: 'challenges/set-description';
          challengeId: string;
          description: LocalizedString;
      }
      const setDescription: (params: Omit<SetDescription, "type">) => SetDescription;
  }
  export type ChallengesAction = (ChallengesAction.LoadChallenge | ChallengesAction.CreateChallenge | ChallengesAction.SaveChallenge | ChallengesAction.RemoveChallenge | ChallengesAction.SetChallengeInternal | ChallengesAction.SetSuccessPredicate | ChallengesAction.SetFailurePredicate | ChallengesAction.RemoveEvent | ChallengesAction.SetEvent | ChallengesAction.SetName | ChallengesAction.SetDescription);
  export const reduceChallenges: (state: Challenges, action: ChallengesAction) => Challenges;

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
  export * from 'simulator/state/reducer/scenes';
  export * from 'simulator/state/reducer/robots';
  export * from 'simulator/state/reducer/challenges';
  export * from 'simulator/state/reducer/challengeCompletions';
  export * from 'simulator/state/reducer/documentation';
  export * from 'simulator/state/reducer/i18n';

}
declare module 'simulator/state/reducer/robot' {

}
declare module 'simulator/state/reducer/robots' {
  import Robot from "simulator/state/State/Robot/index";
  import { Robots } from 'simulator/state/State/index';
  export namespace RobotsAction {
      interface AddRobot {
          type: 'add-robot';
          id: string;
          robot: Robot;
      }
      type AddRobotParams = Omit<AddRobot, 'type'>;
      const addRobot: (params: AddRobotParams) => AddRobot;
      interface RemoveRobot {
          type: 'remove-robot';
          id: string;
      }
      type RemoveRobotParams = Omit<RemoveRobot, 'type'>;
      const removeRobot: (params: RemoveRobotParams) => RemoveRobot;
      interface SetRobot {
          type: 'set-robot';
          id: string;
          robot: Robot;
      }
      type SetRobotParams = Omit<SetRobot, 'type'>;
      const setRobot: (params: SetRobotParams) => SetRobot;
      interface SetRobotBatch {
          type: 'set-robot-batch';
          robotIds: {
              id: string;
              robot: Robot;
          }[];
      }
      type SetRobotBatchParams = Omit<SetRobotBatch, 'type'>;
      const setRobotBatch: (params: SetRobotBatchParams) => SetRobotBatch;
      interface LoadRobot {
          type: 'load-robot';
          id: string;
      }
      type LoadRobotParams = Omit<LoadRobot, 'type'>;
      const loadRobot: (params: LoadRobotParams) => LoadRobot;
  }
  export type RobotsAction = (RobotsAction.AddRobot | RobotsAction.RemoveRobot | RobotsAction.SetRobot | RobotsAction.SetRobotBatch | RobotsAction.LoadRobot);
  export const reduceRobots: (state: Robots, action: RobotsAction) => Robots;

}
declare module 'simulator/state/reducer/scenes' {
  import Scene, { AsyncScene } from "simulator/state/State/Scene/index";
  import { Scenes } from "simulator/state/State/index";
  import Geometry from 'simulator/state/State/Scene/Geometry';
  import Node from 'simulator/state/State/Scene/Node';
  import Camera from 'simulator/state/State/Scene/Camera';
  import { ReferenceFrame, Vector3 } from 'simulator/unit-math';
  import Script from 'simulator/state/State/Scene/Script';
  export namespace ScenesAction {
      interface RemoveScene {
          type: 'scenes/remove-scene';
          sceneId: string;
      }
      const removeScene: (params: Omit<RemoveScene, "type">) => RemoveScene;
      interface SetScene {
          type: 'scenes/set-scene';
          sceneId: string;
          scene: Scene;
      }
      const setScene: (params: Omit<SetScene, "type">) => SetScene;
      interface SetScenePartial {
          type: 'scenes/set-scene-partial';
          sceneId: string;
          partialScene: Partial<Scene>;
      }
      const setScenePartial: (params: Omit<SetScenePartial, "type">) => SetScenePartial;
      interface SetSceneInternal {
          type: 'scenes/set-scene-internal';
          sceneId: string;
          scene: AsyncScene;
      }
      const setSceneInternal: (params: Omit<SetSceneInternal, "type">) => SetSceneInternal;
      interface SetScenesInternal {
          type: 'scenes/set-scenes-internal';
          scenes: {
              [sceneId: string]: AsyncScene;
          };
      }
      const setScenesInternal: (params: Omit<SetScenesInternal, "type">) => SetScenesInternal;
      interface SetSceneBatch {
          type: 'scenes/set-scene-batch';
          sceneIds: {
              id: string;
              scene: Scene;
          }[];
      }
      const setSceneBatch: (params: Omit<SetSceneBatch, "type">) => SetSceneBatch;
      interface LoadScene {
          type: 'scenes/load-scene';
          sceneId: string;
      }
      const loadScene: (params: Omit<LoadScene, "type">) => LoadScene;
      interface CreateScene {
          type: 'scenes/create-scene';
          sceneId: string;
          scene: Scene;
      }
      const createScene: (params: Omit<CreateScene, "type">) => CreateScene;
      interface SaveScene {
          type: 'scenes/save-scene';
          sceneId: string;
      }
      const saveScene: (params: Omit<SaveScene, "type">) => SaveScene;
      interface ListUserScenes {
          type: 'scenes/list-user-scenes';
      }
      const LIST_USER_SCENES: ListUserScenes;
      interface ResetScene {
          type: 'scenes/reset-scene';
          sceneId: string;
      }
      const resetScene: (params: Omit<ResetScene, "type">) => ResetScene;
      interface SoftResetScene {
          type: 'scenes/soft-reset-scene';
          sceneId: string;
      }
      const softResetScene: (params: Omit<SoftResetScene, "type">) => SoftResetScene;
      interface RemoveNode {
          type: 'scenes/remove-node';
          sceneId: string;
          nodeId: string;
      }
      const removeNode: (params: Omit<RemoveNode, "type">) => RemoveNode;
      interface SetNode {
          type: 'scenes/set-node';
          sceneId: string;
          nodeId: string;
          node: Node;
      }
      const setNode: (params: Omit<SetNode, "type">) => SetNode;
      interface SetNodeBatch {
          type: 'scenes/set-node-batch';
          sceneId: string;
          nodeIds: {
              id: string;
              node: Node;
          }[];
      }
      const setNodeBatch: (params: Omit<SetNodeBatch, "type">) => SetNodeBatch;
      interface AddGeometry {
          type: 'scenes/add-geometry';
          sceneId: string;
          geometryId: string;
          geometry: Geometry;
      }
      const addGeometry: (params: Omit<AddGeometry, "type">) => AddGeometry;
      interface RemoveGeometry {
          type: 'scenes/remove-geometry';
          sceneId: string;
          geometryId: string;
      }
      const removeGeometry: (params: Omit<RemoveGeometry, "type">) => RemoveGeometry;
      interface SetGeometry {
          type: 'scenes/set-geometry';
          sceneId: string;
          geometryId: string;
          geometry: Geometry;
      }
      const setGeometry: (params: Omit<SetGeometry, "type">) => SetGeometry;
      interface SetGeometryBatch {
          type: 'scenes/set-geometry-batch';
          sceneId: string;
          geometryIds: {
              id: string;
              geometry: Geometry;
          }[];
      }
      const setGeometryBatch: (params: Omit<SetGeometryBatch, "type">) => SetGeometryBatch;
      interface SelectNode {
          type: 'scenes/select-node';
          sceneId: string;
          nodeId?: string;
      }
      const selectNode: (params: Omit<SelectNode, "type">) => SelectNode;
      interface AddObject {
          type: 'scenes/add-object';
          sceneId: string;
          nodeId: string;
          object: Node.Obj;
          geometry: Geometry;
      }
      const addObject: (params: Omit<AddObject, "type">) => AddObject;
      interface SetCamera {
          type: 'scenes/set-camera';
          sceneId: string;
          camera: Camera;
      }
      const setCamera: (params: Omit<SetCamera, "type">) => SetCamera;
      interface SetGravity {
          type: 'scenes/set-gravity';
          sceneId: string;
          gravity: Vector3;
      }
      const setGravity: (params: Omit<SetGravity, "type">) => SetGravity;
      interface SetNodeOrigin {
          type: 'scenes/set-node-origin';
          sceneId: string;
          nodeId: string;
          origin: ReferenceFrame;
          updateStarting?: boolean;
      }
      const setNodeOrigin: (params: Omit<SetNodeOrigin, "type">) => SetNodeOrigin;
      interface UnfailScene {
          type: 'scenes/unfail-scene';
          sceneId: string;
      }
      const unfailScene: (params: Omit<UnfailScene, "type">) => UnfailScene;
      interface AddScript {
          type: 'scenes/add-script';
          sceneId: string;
          scriptId: string;
          script: Script;
      }
      const addScript: (params: Omit<AddScript, "type">) => AddScript;
      interface RemoveScript {
          type: 'scenes/remove-script';
          sceneId: string;
          scriptId: string;
      }
      const removeScript: (params: Omit<RemoveScript, "type">) => RemoveScript;
      interface SetScript {
          type: 'scenes/set-script';
          sceneId: string;
          scriptId: string;
          script: Script;
      }
      const setScript: (params: Omit<SetScript, "type">) => SetScript;
  }
  export type ScenesAction = (ScenesAction.RemoveScene | ScenesAction.SetScene | ScenesAction.SetScenePartial | ScenesAction.SetSceneInternal | ScenesAction.SetScenesInternal | ScenesAction.SetSceneBatch | ScenesAction.LoadScene | ScenesAction.ResetScene | ScenesAction.SoftResetScene | ScenesAction.RemoveNode | ScenesAction.SetNode | ScenesAction.SetNodeBatch | ScenesAction.AddGeometry | ScenesAction.RemoveGeometry | ScenesAction.SetGeometry | ScenesAction.SetGeometryBatch | ScenesAction.SelectNode | ScenesAction.AddObject | ScenesAction.SetCamera | ScenesAction.SetGravity | ScenesAction.SetNodeOrigin | ScenesAction.CreateScene | ScenesAction.SaveScene | ScenesAction.ListUserScenes | ScenesAction.UnfailScene | ScenesAction.AddScript | ScenesAction.RemoveScript | ScenesAction.SetScript);
  export const listUserScenes: () => Promise<void>;
  export const reduceScenes: (state: Scenes, action: ScenesAction) => Scenes;

}
declare module 'simulator/state/reducer/util' {
  import { WritableDraft } from 'immer/dist/internal';
  import Dict from 'simulator/Dict';
  import Async from 'simulator/state/State/Async';
  export const mutate: <B, T>(values: Dict<Async<B, T>>, id: string, recipe: (draft: WritableDraft<T>) => void) => {
      [x: string]: Async<B, T>;
  };
  export const errorToAsyncError: (error: unknown) => Async.Error;

}
declare module 'simulator/style' {
  import * as React from 'react';
  export interface StyleProps {
      className?: string;
      style?: React.CSSProperties;
  }

}
declare module 'simulator/unit-math' {
  import { Angle, Distance } from 'simulator/util/Value';
  import { Euler as RawEuler, Vector2 as RawVector2, Vector3 as RawVector3, AxisAngle as RawAxisAngle, ReferenceFrame as RawReferenceFrame, Quaternion } from 'simulator/math';
  import { TransformNode as BabylonTransformNode } from '@babylonjs/core/Meshes/transformNode';
  import { AbstractMesh as BabylonAbstractMesh } from '@babylonjs/core/Meshes/abstractMesh';
  export interface Vector2 {
      x: Distance;
      y: Distance;
  }
  export namespace Vector2 {
      const zero: (type?: Distance.Type) => Vector2;
      const create: (x: Distance, y: Distance, z: Distance) => Vector2;
      const toRaw: (v: Vector2, type: Distance.Type) => RawVector2;
      const fromRaw: (raw: RawVector2, type: Distance.Type) => {
          x: {
              type: Distance.Type;
              value: number;
          };
          y: {
              type: Distance.Type;
              value: number;
          };
      };
      const toTypeGranular: (v: Vector2, x: Distance.Type, y: Distance.Type) => Vector2;
  }
  export interface Vector3 {
      x: Distance;
      y: Distance;
      z: Distance;
  }
  export namespace Vector3 {
      const zero: (type?: Distance.Type) => Vector3;
      const ZERO_METERS: Vector3;
      const one: (type?: Distance.Type) => Vector3;
      const create: (x: Distance, y: Distance, z: Distance) => Vector3;
      const createX: (x: Distance) => Vector3;
      const createY: (y: Distance) => Vector3;
      const createZ: (z: Distance) => Vector3;
      const meters: (x: number, y: number, z: number) => Vector3;
      const centimeters: (x: number, y: number, z: number) => Vector3;
      const metersX: (x: number) => Vector3;
      const metersY: (y: number) => Vector3;
      const metersZ: (z: number) => Vector3;
      const toRaw: (v: Vector3, type: Distance.Type) => RawVector3;
      const toRawGranular: (v: Vector3, x: Distance.Type, y: Distance.Type, z: Distance.Type) => RawVector3;
      const toBabylon: (v: Vector3, type: Distance.Type) => import("@babylonjs/core").Vector3;
      const fromRaw: (raw: RawVector3, type: Distance.Type) => {
          x: {
              type: Distance.Type;
              value: number;
          };
          y: {
              type: Distance.Type;
              value: number;
          };
          z: {
              type: Distance.Type;
              value: number;
          };
      };
      const fromRawGranular: (raw: RawVector3, x: Distance.Type, y: Distance.Type, z: Distance.Type) => {
          x: {
              type: Distance.Type;
              value: number;
          };
          y: {
              type: Distance.Type;
              value: number;
          };
          z: {
              type: Distance.Type;
              value: number;
          };
      };
      const toTypeGranular: (v: Vector3, x: Distance.Type, y: Distance.Type, z: Distance.Type) => Vector3;
      const distance: (lhs: Vector3, rhs: Vector3, newType?: Distance.Type) => Distance;
      /**
       * Adds two vectors together
       *
       * @param lhs The left hand side of the addition. The units of this vector will be used for the result.
       * @param rhs The right hand side of the addition.
       */
      const add: (lhs: Vector3, rhs: Vector3) => Vector3;
      const subtract: (lhs: Vector3, rhs: Vector3) => Vector3;
      /**
       * Clamp a vector between a min and max value
       * @param min The minimum
       * @param v The value to clamp. The units of this vector will be used for the result.
       * @param max The maximum
       */
      const clamp: (min: Vector3, v: Vector3, max: Vector3) => Vector3;
      const length: (v: Vector3) => Distance;
  }
  export namespace Rotation {
      type Type = 'euler' | 'axis-angle';
      interface Euler {
          type: 'euler';
          x: Angle;
          y: Angle;
          z: Angle;
          order?: RawEuler.Order;
      }
      namespace Euler {
          const identity: (type?: Angle.Type) => Euler;
          const toRaw: (e: Euler) => RawEuler;
          const fromRaw: (raw: RawEuler) => Euler;
      }
      interface AxisAngle {
          type: 'axis-angle';
          angle: Angle;
          axis: Vector3;
      }
      namespace AxisAngle {
          const identity: (angleType?: Angle.Type, axisType?: Distance.Type) => AxisAngle;
          const toRaw: (a: AxisAngle) => RawAxisAngle;
          const fromRaw: (raw: RawAxisAngle) => AxisAngle;
      }
      const axisAngle: (axis: Vector3, angle: Angle) => AxisAngle;
      const euler: (x: Angle, y: Angle, z: Angle, order?: RawEuler.Order) => Euler;
      const eulerDegrees: (x: number, y: number, z: number, order?: RawEuler.Order) => Euler;
      const eulerRadians: (x: number, y: number, z: number, order?: RawEuler.Order) => Euler;
      const toRawQuaternion: (rotation: Rotation) => Quaternion;
      const toType: (rotation: Rotation, type: Type) => Rotation;
      const fromRawQuaternion: (q: Quaternion, type: Type) => Rotation;
      const angle: (lhs: Rotation, rhs: Rotation) => Angle;
      const slerp: (lhs: Rotation, rhs: Rotation, t: number, newType?: Type) => Rotation;
  }
  export type Rotation = Rotation.Euler | Rotation.AxisAngle;
  export interface ReferenceFrame {
      position?: Vector3;
      orientation?: Rotation;
      scale?: RawVector3;
  }
  export namespace ReferenceFrame {
      const IDENTITY: ReferenceFrame;
      const create: (position?: Vector3, orientation?: Rotation, scale?: RawVector3) => ReferenceFrame;
      const toRaw: (frame: ReferenceFrame, distanceType?: Distance.Type) => RawReferenceFrame;
      const toBabylon: (frame: ReferenceFrame, distanceType?: Distance.Type) => RawReferenceFrame.ToBabylon;
      const syncBabylon: (frame: ReferenceFrame, bNode: BabylonTransformNode | BabylonAbstractMesh, distanceType?: Distance.Type) => void;
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
declare module 'simulator/util/Value' {
  export interface UnitlessValue {
      value: number;
  }
  export namespace UnitlessValue {
      const create: (value: number) => UnitlessValue;
  }
  export namespace Angle {
      enum Type {
          Radians = 0,
          Degrees = 1
      }
      interface Radians extends UnitlessValue {
          type: Type.Radians;
      }
      interface Degrees extends UnitlessValue {
          type: Type.Degrees;
      }
      const degrees: (value: number) => Degrees;
      const radians: (value: number) => Radians;
      const ZERO_RADIANS: Radians;
      const toRadians: (angle: Angle) => Radians;
      const toDegrees: (angle: Angle) => Degrees;
      const toDegreesValue: (angle: Angle) => number;
      const toRadiansValue: (angle: Angle) => number;
      const unitName: (angle: Angle) => "degrees" | "radians";
      const toType: (angle: Angle, newType: Type) => Angle;
  }
  export type Angle = Angle.Radians | Angle.Degrees;
  export namespace Distance {
      type Type = 'meters' | 'centimeters' | 'feet' | 'inches';
      interface Meters extends UnitlessValue {
          type: 'meters';
      }
      const meters: (value: number) => Meters;
      const ZERO_METERS: Meters;
      interface Centimeters extends UnitlessValue {
          type: 'centimeters';
      }
      const centimeters: (value: number) => Centimeters;
      interface Feet extends UnitlessValue {
          type: 'feet';
      }
      const feet: (value: number) => Feet;
      interface Inches extends UnitlessValue {
          type: 'inches';
      }
      const inches: (value: number) => Inches;
      const unitName: (distance: Distance) => "meters" | "centimeters" | "feet" | "inches";
      const toMeters: (distance: Distance) => Meters;
      const toCentimeters: (distance: Distance) => Centimeters;
      const toFeet: (distance: Distance) => Feet;
      const toInches: (distance: Distance) => Inches;
      const toMetersValue: (distance: Distance) => number;
      const toCentimetersValue: (distance: Distance) => number;
      const toFeetValue: (distance: Distance) => number;
      const toInchesValue: (distance: Distance) => number;
      const toType: (distance: Distance, newType: Type) => Distance;
      const toValue: (distance: Distance, newType: Type) => number;
      const subtract: (a: Distance, b: Distance, newType: Type) => Distance;
      const add: (a: Distance, b: Distance, newType: Type) => Distance;
      const abs: (a: Distance) => Distance;
  }
  export type Distance = (Distance.Meters | Distance.Centimeters | Distance.Feet | Distance.Inches);
  export namespace Mass {
      enum Type {
          Grams = 0,
          Kilograms = 1,
          Pounds = 2,
          Ounces = 3
      }
      interface Grams extends UnitlessValue {
          type: Type.Grams;
      }
      interface Kilograms extends UnitlessValue {
          type: Type.Kilograms;
      }
      interface Pounds extends UnitlessValue {
          type: Type.Pounds;
      }
      interface Ounces extends UnitlessValue {
          type: Type.Ounces;
      }
      const grams: (value: number) => Grams;
      const kilograms: (value: number) => Kilograms;
      const pounds: (value: number) => Pounds;
      const ounces: (value: number) => Ounces;
      const unitName: (mass: Mass) => "grams" | "kilograms" | "pounds" | "ounces";
      const toGrams: (mass: Mass) => Grams;
      const toKilograms: (mass: Mass) => Kilograms;
      const toPounds: (mass: Mass) => Pounds;
      const toOunces: (mass: Mass) => Ounces;
      const toGramsValue: (mass: Mass) => number;
      const toKilogramsValue: (mass: Mass) => number;
      const toPoundsValue: (mass: Mass) => number;
      const toOuncesValue: (mass: Mass) => number;
      const toType: (mass: Mass, newType: Type) => Mass;
  }
  export type Mass = (Mass.Grams | Mass.Kilograms | Mass.Pounds | Mass.Ounces);
  import AngleValue = Angle;
  import DistanceValue = Distance;
  import MassValue = Mass;
  export namespace Value {
      enum Type {
          Angle = 0,
          Distance = 1,
          Mass = 2,
          Unitless = 3
      }
      interface Angle {
          type: Type.Angle;
          angle: AngleValue;
      }
      const angle: (angle: AngleValue) => Angle;
      interface Distance {
          type: Type.Distance;
          distance: DistanceValue;
      }
      const distance: (distance: DistanceValue) => Distance;
      interface Mass {
          type: Type.Mass;
          mass: MassValue;
      }
      const mass: (mass: MassValue) => Mass;
      interface Unitless {
          type: Type.Unitless;
          value: UnitlessValue;
      }
      const unitless: (value: UnitlessValue) => Unitless;
      const value: (value: Value) => number;
      const unitName: (value: Value) => "meters" | "centimeters" | "feet" | "inches" | "degrees" | "radians" | "grams" | "kilograms" | "pounds" | "ounces";
      const toAngle: (value: Value) => AngleValue;
      const toDistance: (value: Value) => DistanceValue;
      const toMass: (value: Value) => MassValue;
      const toUnitless: (value: Value) => UnitlessValue;
      const subType: (value: Value) => Angle.Type | Distance.Type | Mass.Type;
      const copyValue: (value: Value, num: number) => Value;
  }
  export type Value = Value.Angle | Value.Distance | Value.Mass | Value.Unitless;

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
  export * from 'simulator/util/Value';
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