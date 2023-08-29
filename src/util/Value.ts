import { TAU } from "../math";

export interface UnitlessValue {
  value: number;
}

export namespace UnitlessValue {
  export const create = (value: number): UnitlessValue => ({
    value
  });
}

export namespace Angle {
  export enum Type {
    Radians,
    Degrees
  }

  export interface Radians extends UnitlessValue {
    type: Type.Radians;
  }

  export interface Degrees extends UnitlessValue {
    type: Type.Degrees;
  }

  export const degrees = (value: number): Degrees => ({ type: Type.Degrees, value });
  export const radians = (value: number): Radians => ({ type: Type.Radians, value });

  export const ZERO_RADIANS = radians(0);

  export const toRadians = (angle: Angle): Radians => {
    switch (angle.type) {
      case Type.Radians: return angle;
      case Type.Degrees: return {
        type: Type.Radians,
        value: angle.value / 360 * TAU
      };
    }
  };

  export const toDegrees = (angle: Angle): Degrees => {
    switch (angle.type) {
      case Type.Degrees: return angle;
      case Type.Radians: return {
        type: Type.Degrees,
        value: angle.value / TAU * 360
      };
    }
  };

  export const toDegreesValue = (angle: Angle) => toDegrees(angle).value;
  export const toRadiansValue = (angle: Angle) => toRadians(angle).value;

  export const unitName = (angle: Angle) => {
    switch (angle.type) {
      case Type.Degrees: return 'degrees';
      case Type.Radians: return 'radians';
    }
  };

  export const toType = (angle: Angle, newType: Type): Angle => {
    switch (newType) {
      case Type.Degrees: return toDegrees(angle);
      case Type.Radians: return toRadians(angle);
    }
  };
}

export type Angle = Angle.Radians | Angle.Degrees;

export namespace Distance {
  export type Type = 'meters' | 'centimeters' | 'feet' | 'inches';

  export interface Meters extends UnitlessValue {
    type: 'meters';
  }
  export const meters = (value: number): Meters => ({ type: 'meters', value });

  export const ZERO_METERS = meters(0);

  export interface Centimeters extends UnitlessValue {
    type: 'centimeters';
  }
  export const centimeters = (value: number): Centimeters => ({ type: 'centimeters', value });

  export interface Feet extends UnitlessValue {
    type: 'feet';
  }
  export const feet = (value: number): Feet => ({ type: 'feet', value });

  export interface Inches extends UnitlessValue {
    type: 'inches';
  }
  export const inches = (value: number): Inches => ({ type: 'inches', value });

  export const unitName = (distance: Distance) => {
    switch (distance.type) {
      case 'meters': return 'meters';
      case 'centimeters': return 'centimeters';
      case 'feet': return 'feet';
      case 'inches': return 'inches';
    }
  };

  export const toMeters = (distance: Distance): Meters => {
    switch (distance.type) {
      case 'meters': return distance;
      case 'centimeters': return {
        type: 'meters',
        value: distance.value / 100
      };
      case 'feet': return {
        type: 'meters',
        value: distance.value / 3.28084
      };
      case 'inches': return {
        type: 'meters',
        value: distance.value / 39.3701
      };
    }
  };

  export const toCentimeters = (distance: Distance): Centimeters => {
    switch (distance.type) {
      case 'centimeters': return distance;
      case 'meters': return {
        type: 'centimeters',
        value: distance.value * 100
      };
      case 'feet': return {
        type: 'centimeters',
        value: distance.value * 30.48
      };
      case 'inches': return {
        type: 'centimeters',
        value: distance.value * 2.54
      };
    }
  };

  export const toFeet = (distance: Distance): Feet => {
    switch (distance.type) {
      case 'feet': return distance;
      case 'centimeters': return {
        type: 'feet',
        value: distance.value * 3.28084
      };
      case 'meters': return {
        type: 'feet',
        value: distance.value * 3.28084 / 100
      };
      case 'inches': return {
        type: 'feet',
        value: distance.value / 12
      };
    }
  };

  export const toInches = (distance: Distance): Inches => {
    switch (distance.type) {
      case 'inches': return distance;
      case 'centimeters': return {
        type: 'inches',
        value: distance.value * 39.3701
      };
      case 'meters': return {
        type: 'inches',
        value: distance.value * 39.3701 / 100
      };
      case 'feet': return {
        type: 'inches',
        value: distance.value * 12
      };
    }
  };

  export const toMetersValue = (distance: Distance): number => toMeters(distance).value;
  export const toCentimetersValue = (distance: Distance): number => toCentimeters(distance).value;
  export const toFeetValue = (distance: Distance): number => toFeet(distance).value;
  export const toInchesValue = (distance: Distance): number => toInches(distance).value;

  export const toType = (distance: Distance, newType: Type): Distance => {
    switch (newType) {
      case 'meters': return toMeters(distance);
      case 'centimeters': return toCentimeters(distance);
      case 'feet': return toFeet(distance);
      case 'inches': return toInches(distance);
    }
  };

  export const toValue = (distance: Distance, newType: Type): number => toType(distance, newType).value;

  export const subtract = (a: Distance, b: Distance, newType: Type): Distance => {
    const aMeters = toMeters(a);
    const bMeters = toMeters(b);
    const newMeters = aMeters.value - bMeters.value;
    return toType(meters(newMeters), newType);
  };

  export const add = (a: Distance, b: Distance, newType: Type): Distance => {
    const aMeters = toMeters(a);
    const bMeters = toMeters(b);
    const newMeters = aMeters.value + bMeters.value;
    return toType(meters(newMeters), newType);
  };

  export const abs = (a: Distance): Distance => ({
    type: a.type,
    value: Math.abs(a.value)
  });
}

export type Distance = (
  Distance.Meters |
  Distance.Centimeters |
  Distance.Feet |
  Distance.Inches
);

export namespace Mass {
  export enum Type {
    Grams,
    Kilograms,
    Pounds,
    Ounces,
  }

  export interface Grams extends UnitlessValue {
    type: Type.Grams;
  }

  export interface Kilograms extends UnitlessValue {
    type: Type.Kilograms;
  }

  export interface Pounds extends UnitlessValue {
    type: Type.Pounds;
  }

  export interface Ounces extends UnitlessValue {
    type: Type.Ounces;
  }

  export const grams = (value: number): Grams => ({ type: Type.Grams, value });
  export const kilograms = (value: number): Kilograms => ({ type: Type.Kilograms, value });
  export const pounds = (value: number): Pounds => ({ type: Type.Pounds, value });
  export const ounces = (value: number): Ounces => ({ type: Type.Ounces, value });

  export const unitName = (mass: Mass) => {
    switch (mass.type) {
      case Type.Grams: return 'grams';
      case Type.Kilograms: return 'kilograms';
      case Type.Pounds: return 'pounds';
      case Type.Ounces: return 'ounces';
    }
  };

  export const toGrams = (mass: Mass): Grams => {
    switch (mass.type) {
      case Type.Grams: return mass;
      case Type.Kilograms: return {
        type: Type.Grams,
        value: mass.value * 1000
      };
      case Type.Pounds: return {
        type: Type.Grams,
        value: mass.value * 453.592
      };
      case Type.Ounces: return {
        type: Type.Grams,
        value: mass.value * 28.3495
      };
    }
  };

  export const toKilograms = (mass: Mass): Kilograms => {
    switch (mass.type) {
      case Type.Kilograms: return mass;
      case Type.Grams: return {
        type: Type.Kilograms,
        value: mass.value / 1000
      };
      case Type.Pounds: return {
        type: Type.Kilograms,
        value: mass.value / 2.20462
      };
      case Type.Ounces: return {
        type: Type.Kilograms,
        value: mass.value / 35.2740
      };
    }
  };

  export const toPounds = (mass: Mass): Pounds => {
    switch (mass.type) {
      case Type.Pounds: return mass;
      case Type.Grams: return {
        type: Type.Pounds,
        value: mass.value / 453.592
      };
      case Type.Kilograms: return {
        type: Type.Pounds,
        value: mass.value * 2.20462
      };
      case Type.Ounces: return {
        type: Type.Pounds,
        value: mass.value / 16
      };
    }
  };

  export const toOunces = (mass: Mass): Ounces => {
    switch (mass.type) {
      case Type.Ounces: return mass;
      case Type.Grams: return {
        type: Type.Ounces,
        value: mass.value / 28.3495
      };
      case Type.Kilograms: return {
        type: Type.Ounces,
        value: mass.value * 35.2740
      };
      case Type.Pounds: return {
        type: Type.Ounces,
        value: mass.value * 16
      };
    }
  };

  export const toGramsValue = (mass: Mass): number => toGrams(mass).value;
  export const toKilogramsValue = (mass: Mass): number => toKilograms(mass).value;
  export const toPoundsValue = (mass: Mass): number => toPounds(mass).value;
  export const toOuncesValue = (mass: Mass): number => toOunces(mass).value;

  export const toType = (mass: Mass, newType: Type): Mass => {
    switch (newType) {
      case Type.Grams: return toGrams(mass);
      case Type.Kilograms: return toKilograms(mass);
      case Type.Pounds: return toPounds(mass);
      case Type.Ounces: return toOunces(mass);
    }
  };
}

export type Mass = (
  Mass.Grams |
  Mass.Kilograms |
  Mass.Pounds |
  Mass.Ounces
);

import AngleValue = Angle;
import DistanceValue = Distance;
import MassValue = Mass;


export namespace Value {
  export enum Type {
    Angle,
    Distance,
    Mass,
    Unitless
  }

  export interface Angle {
    type: Type.Angle;
    angle: AngleValue;
  }

  export const angle = (angle: AngleValue): Angle => ({ type: Type.Angle, angle });


  export interface Distance {
    type: Type.Distance;
    distance: DistanceValue;
  }

  export const distance = (distance: DistanceValue): Distance => ({ type: Type.Distance, distance });

  export interface Mass {
    type: Type.Mass;
    mass: MassValue;
  }

  export const mass = (mass: MassValue): Mass => ({ type: Type.Mass, mass });

  export interface Unitless {
    type: Type.Unitless;
    value: UnitlessValue;
  }

  export const unitless = (value: UnitlessValue): Unitless => ({ type: Type.Unitless, value });

  export const value = (value: Value) => {
    switch (value.type) {
      case Type.Angle: return value.angle.value;
      case Type.Distance: return value.distance.value;
      case Type.Mass: return value.mass.value;
      case Type.Unitless: return value.value.value;
    }
  };

  export const unitName = (value: Value) => {
    switch (value.type) {
      case Type.Angle: return AngleValue.unitName(value.angle);
      case Type.Distance: return DistanceValue.unitName(value.distance);
      case Type.Mass: return MassValue.unitName(value.mass);
      case Type.Unitless: return undefined;
    }
  };

  export const toAngle = (value: Value): AngleValue => (value as unknown as Angle).angle;
  export const toDistance = (value: Value): DistanceValue => (value as unknown as Distance).distance;
  export const toMass = (value: Value): MassValue => (value as unknown as Mass).mass;
  export const toUnitless = (value: Value): UnitlessValue => (value as unknown as Value.Unitless).value;

  export const subType = (value: Value): Angle.Type | Distance.Type | Mass.Type => {
    switch (value.type) {
      case Type.Angle: return value.angle.type;
      case Type.Distance: return value.distance.type;
      case Type.Mass: return value.mass.type;
      case Type.Unitless: return undefined;
    }
  };



  export const copyValue = (value: Value, num: number): Value => {
    switch (value.type) {
      case Type.Angle: return {
        ...value,
        angle: {
          ...value.angle,
          value: num
        }
      };
      case Type.Distance: return {
        ...value,
        distance: {
          ...value.distance,
          value: num
        }
      };
      case Type.Mass: return {
        ...value,
        mass: {
          ...value.mass,
          value: num
        }
      };
      case Type.Unitless: return {
        ...value,
        value: {
          ...value.value,
          value: num
        }
      };
    }
  };
}

export type Value = Value.Angle | Value.Distance | Value.Mass | Value.Unitless;