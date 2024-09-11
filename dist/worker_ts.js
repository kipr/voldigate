/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./RegisterState.ts":
/*!**************************!*\
  !*** ./RegisterState.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   "MotorControlMode": () => (/* binding */ MotorControlMode)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  WALLABY_SPI_VERSION: 4,

  /* READ Only Registers ----------------------- */
  REG_R_START: 0,
  // SHAREDARRAYBUFFER PADDING (1 BYTE)
  REG_R_VERSION_H: 1,
  REG_R_VERSION_L: 2,

  /* READ/Write Registers ----------------------- */
  REG_RW_DIG_IN_H: 3,
  REG_RW_DIG_IN_L: 4,
  REG_RW_DIG_OUT_H: 5,
  REG_RW_DIG_OUT_L: 6,
  REG_RW_DIG_PE_H: 7,
  REG_RW_DIG_PE_L: 8,
  REG_RW_DIG_OE_H: 9,
  REG_RW_DIG_OE_L: 10,
  REG_RW_ADC_0_H: 11,
  REG_RW_ADC_0_L: 12,
  REG_RW_ADC_1_H: 13,
  REG_RW_ADC_1_L: 14,
  REG_RW_ADC_2_H: 15,
  REG_RW_ADC_2_L: 16,
  REG_RW_ADC_3_H: 17,
  REG_RW_ADC_3_L: 18,
  REG_RW_ADC_4_H: 19,
  REG_RW_ADC_4_L: 20,
  REG_RW_ADC_5_H: 21,
  REG_RW_ADC_5_L: 22,
  REG_RW_ADC_PE: 23,
  // SHAREDARRAYBUFFER PADDING (1 BYTE)
  REG_RW_MAG_X_H: 24,
  REG_RW_MAG_X_L: 25,
  REG_RW_MAG_Y_H: 26,
  REG_RW_MAG_Y_L: 27,
  REG_RW_MAG_Z_H: 28,
  REG_RW_MAG_Z_L: 29,
  REG_RW_ACCEL_X_H: 30,
  REG_RW_ACCEL_X_L: 31,
  REG_RW_ACCEL_Y_H: 32,
  REG_RW_ACCEL_Y_L: 33,
  REG_RW_ACCEL_Z_H: 34,
  REG_RW_ACCEL_Z_L: 35,
  REG_RW_GYRO_X_H: 36,
  REG_RW_GYRO_X_L: 37,
  REG_RW_GYRO_Y_H: 38,
  REG_RW_GYRO_Y_L: 39,
  REG_RW_GYRO_Z_H: 40,
  REG_RW_GYRO_Z_L: 41,
  // Motor 0 position
  REG_RW_MOT_0_B3: 42,
  REG_RW_MOT_0_B2: 43,
  REG_RW_MOT_0_B1: 44,
  REG_RW_MOT_0_B0: 45,
  // Motor 1 position
  REG_RW_MOT_1_B3: 46,
  REG_Rw_MOT_1_B2: 47,
  REG_Rw_MOT_1_B1: 48,
  REG_RW_MOT_1_B0: 49,
  // Motor 2 position
  REG_RW_MOT_2_B3: 50,
  REG_RW_MOT_2_B2: 51,
  REG_RW_MOT_2_B1: 52,
  REG_RW_MOT_2_B0: 53,
  // Motor 3 position
  REG_RW_MOT_3_B3: 54,
  REG_RW_MOT_3_B2: 55,
  REG_RW_MOT_3_B1: 56,
  REG_RW_MOT_3_B0: 57,
  REG_RW_MOT_MODES: 58,
  REG_RW_MOT_DIRS: 59,
  REG_RW_MOT_DONE: 60,
  REG_RW_MOT_SRV_ALLSTOP: 61,
  // 16 bit signed speed goals
  REG_RW_MOT_0_SP_H: 62,
  REG_RW_MOT_0_SP_L: 63,
  REG_RW_MOT_1_SP_H: 64,
  REG_RW_MOT_1_SP_L: 65,
  REG_RW_MOT_2_SP_H: 66,
  REG_RW_MOT_2_SP_L: 67,
  REG_RW_MOT_3_SP_H: 68,
  REG_RW_MOT_3_SP_L: 69,
  // 16 bit unsigned pwms, from the user or PID controller
  REG_RW_MOT_0_PWM_H: 70,
  REG_RW_MOT_0_PWM_L: 71,
  REG_RW_MOT_1_PWM_H: 72,
  REG_RW_MOT_1_PWM_L: 73,
  REG_RW_MOT_2_PWM_H: 74,
  REG_RW_MOT_2_PWM_L: 75,
  REG_RW_MOT_3_PWM_H: 76,
  REG_RW_MOT_3_PWM_L: 77,
  // 16 bit unsigned servo goals
  // microsecond servo pulse, where 1500 is neutral
  // +/- about 10 per degree from neutral
  REG_RW_SERVO_0_H: 78,
  REG_RW_SERVO_0_L: 79,
  REG_RW_SERVO_1_H: 80,
  REG_RW_SERVO_1_L: 81,
  REG_RW_SERVO_2_H: 82,
  REG_RW_SERVO_2_L: 83,
  REG_RW_SERVO_3_H: 84,
  REG_RW_SERVO_3_L: 85,
  // 12 bit unsigned int adc result
  REG_RW_BATT_H: 86,
  REG_RW_BATT_L: 87,
  // msb is "extra show", then a non used bit
  // then 6 virtual button bits
  // E x 5 4 3 2 1 0
  REG_RW_BUTTONS: 88,
  REG_READABLE_COUNT: 89,
  // SHAREDARRAYBUFFER PADDING (1 BYTE)
  // WRITE ONLY Registers---------------------------------------------------------
  REG_W_PID_0_P_H: 89,
  REG_W_PID_0_P_L: 90,
  REG_W_PID_0_PD_H: 91,
  REG_W_PID_0_PD_L: 92,
  REG_W_PID_0_I_H: 93,
  REG_W_PID_0_I_L: 94,
  REG_W_PID_0_ID_H: 95,
  REG_W_PID_0_ID_L: 96,
  REG_W_PID_0_D_H: 97,
  REG_W_PID_0_D_L: 98,
  REG_W_PID_0_DD_H: 99,
  REG_W_PID_0_DD_L: 100,
  REG_W_PID_1_P_H: 101,
  REG_W_PID_1_P_L: 102,
  REG_W_PID_1_PD_H: 103,
  REG_W_PID_1_PD_L: 104,
  REG_W_PID_1_I_H: 105,
  REG_W_PID_1_I_L: 106,
  REG_W_PID_1_ID_H: 107,
  REG_W_PID_1_ID_L: 108,
  REG_W_PID_1_D_H: 119,
  REG_W_PID_1_D_L: 110,
  REG_W_PID_1_DD_H: 111,
  REG_W_PID_1_DD_L: 112,
  REG_W_PID_2_P_H: 113,
  REG_W_PID_2_P_L: 114,
  REG_W_PID_2_PD_H: 115,
  REG_W_PID_2_PD_L: 116,
  REG_W_PID_2_I_H: 117,
  REG_W_PID_2_I_L: 118,
  REG_W_PID_2_ID_H: 119,
  REG_W_PID_2_ID_L: 120,
  REG_W_PID_2_D_H: 121,
  REG_W_PID_2_D_L: 122,
  REG_W_PID_2_DD_H: 123,
  REG_W_PID_2_DD_L: 124,
  REG_W_PID_3_P_H: 125,
  REG_W_PID_3_P_L: 126,
  REG_W_PID_3_PD_H: 127,
  REG_W_PID_3_PD_L: 128,
  REG_W_PID_3_I_H: 129,
  REG_W_PID_3_I_L: 130,
  REG_W_PID_3_ID_H: 131,
  REG_W_PID_3_ID_L: 132,
  REG_W_PID_3_D_H: 133,
  REG_W_PID_3_D_L: 134,
  REG_W_PID_3_DD_H: 135,
  REG_W_PID_3_DD_L: 136,
  // Motor 0 position goal
  REG_W_MOT_0_GOAL_B3: 137,
  REG_W_MOT_0_GOAL_B2: 138,
  REG_W_MOT_0_GOAL_B1: 139,
  REG_W_MOT_0_GOAL_B0: 140,
  // Motor 1 position goal
  REG_W_MOT_1_GOAL_B3: 141,
  REG_w_MOT_1_GOAL_B2: 142,
  REG_w_MOT_1_GOAL_B1: 143,
  REG_W_MOT_1_GOAL_B0: 144,
  // Motor 2 position goal
  REG_W_MOT_2_GOAL_B3: 145,
  REG_W_MOT_2_GOAL_B2: 146,
  REG_W_MOT_2_GOAL_B1: 147,
  REG_W_MOT_2_GOAL_B0: 148,
  // Motor 3 position goal
  REG_W_MOT_3_GOAL_B3: 149,
  REG_W_MOT_3_GOAL_B2: 150,
  REG_W_MOT_3_GOAL_B1: 151,
  REG_W_MOT_3_GOAL_B0: 152,
  REG_ALL_COUNT: 153
});
const MotorControlMode = {
  Inactive: 0,
  Speed: 1,
  Position: 2,
  SpeedPosition: 3
};

/***/ }),

/***/ "./SharedRegisters.ts":
/*!****************************!*\
  !*** ./SharedRegisters.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ SharedRegisters)
/* harmony export */ });
/* harmony import */ var _RegisterState__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./RegisterState */ "./RegisterState.ts");

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

class SharedRegisters {
  constructor(registerSharedArrayBuffer) {
    this.getRegisterValue8b = (registerAddress, signed = false) => {
      const array = signed ? this.registerArrayView8b_ : this.registerArrayViewU8b_;
      return Atomics.load(array, SharedRegisters.getBufferIndexForRegisterAddress(registerAddress));
    };

    this.getRegisterValue16b = (registerAddress, signed = false) => {
      const array = signed ? this.registerArrayView16b_ : this.registerArrayViewU16b_;
      return Atomics.load(array, SharedRegisters.getBufferIndexForRegisterAddress(registerAddress) / 2);
    };

    this.getRegisterValue32b = (registerAddress, signed = false) => {
      const array = signed ? this.registerArrayView32b_ : this.registerArrayViewU32b_;
      return Atomics.load(array, SharedRegisters.getBufferIndexForRegisterAddress(registerAddress) / 4);
    }; // Add 3 bytes to account for padding. See RegisterState for which bytes are padded


    this.registerSharedArrayBuffer_ = registerSharedArrayBuffer !== null && registerSharedArrayBuffer !== void 0 ? registerSharedArrayBuffer : new SharedArrayBuffer(_RegisterState__WEBPACK_IMPORTED_MODULE_0__.default.REG_ALL_COUNT + 3);
    this.registerArrayViewU8b_ = new Uint8Array(this.registerSharedArrayBuffer_);
    this.registerArrayView8b_ = new Int8Array(this.registerSharedArrayBuffer_);
    this.registerArrayViewU16b_ = new Uint16Array(this.registerSharedArrayBuffer_);
    this.registerArrayView16b_ = new Int16Array(this.registerSharedArrayBuffer_);
    this.registerArrayViewU32b_ = new Uint32Array(this.registerSharedArrayBuffer_);
    this.registerArrayView32b_ = new Int32Array(this.registerSharedArrayBuffer_);
  }

  getSharedArrayBuffer() {
    return this.registerSharedArrayBuffer_;
  }

  clone() {
    const newRegisterSharedArrayBuffer = new SharedArrayBuffer(this.registerSharedArrayBuffer_.byteLength);
    new Uint8Array(newRegisterSharedArrayBuffer).set(this.registerArrayViewU8b_);
    return new SharedRegisters(newRegisterSharedArrayBuffer);
  }

  setRegister8b(registerAddress, value) {
    Atomics.store(this.registerArrayView8b_, SharedRegisters.getBufferIndexForRegisterAddress(registerAddress), value);
  }

  setRegister16b(registerAddress, value) {
    Atomics.store(this.registerArrayView16b_, SharedRegisters.getBufferIndexForRegisterAddress(registerAddress) / 2, value);
  }

  setRegister32b(registerAddress, value) {
    Atomics.store(this.registerArrayView32b_, SharedRegisters.getBufferIndexForRegisterAddress(registerAddress) / 4, value);
  }

  incrementRegister32b(registerAddress, value) {
    Atomics.add(this.registerArrayView32b_, SharedRegisters.getBufferIndexForRegisterAddress(registerAddress) / 4, value);
  }

}
/**
 * Get the index in the SharedArrayBuffer that corresponds to the given address.
 * Accounts for the padding bytes.
 * @param address The address of the register.
 * @returns The index in the SharedArrayBuffer that corresponds to the given address.
 */

SharedRegisters.getBufferIndexForRegisterAddress = address => {
  if (address <= _RegisterState__WEBPACK_IMPORTED_MODULE_0__.default.REG_R_START) return address;
  if (address <= _RegisterState__WEBPACK_IMPORTED_MODULE_0__.default.REG_RW_ADC_PE) return address + 1;
  if (address <= _RegisterState__WEBPACK_IMPORTED_MODULE_0__.default.REG_RW_BUTTONS) return address + 2;
  return address + 3;
};

/***/ }),

/***/ "./SharedRingBufferU32.ts":
/*!********************************!*\
  !*** ./SharedRingBufferU32.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
class SharedRingBufferU32 {
  constructor(sab) {
    if (sab.byteLength <= SharedRingBufferU32.HEADER_SIZE + 4) {
      throw new Error('SharedRingBufferU32: SharedArrayBuffer is too small');
    }

    if (sab.byteLength % 4 !== 0) {
      throw new Error('SharedRingBufferU32: SharedArrayBuffer byteLength is not a multiple of 4');
    }

    this.sab_ = sab;
    this.u32_ = new Uint32Array(sab);
  }

  get sharedArrayBuffer() {
    return this.sab_;
  }

  get maxLength() {
    return this.u32_.length - SharedRingBufferU32.HEADER_SIZE / 4;
  }

  static create(maxLength) {
    const sab = new SharedArrayBuffer(SharedRingBufferU32.HEADER_SIZE + maxLength * 4);
    const u32 = new Uint32Array(sab);
    u32[SharedRingBufferU32.BEGIN_INDEX] = 0;
    u32[SharedRingBufferU32.END_INDEX] = 0;
    return new SharedRingBufferU32(sab);
  }

  get begin_() {
    return Atomics.load(this.u32_, SharedRingBufferU32.BEGIN_INDEX);
  }

  set begin_(begin) {
    Atomics.store(this.u32_, SharedRingBufferU32.BEGIN_INDEX, begin % this.maxLength);
  }

  get end_() {
    return Atomics.load(this.u32_, SharedRingBufferU32.END_INDEX);
  }

  set end_(end) {
    Atomics.store(this.u32_, SharedRingBufferU32.END_INDEX, end % this.maxLength);
  }

  at_(index) {
    return this.u32_[SharedRingBufferU32.HEADER_SIZE / 4 + index];
  }

  setAt_(index, value) {
    this.u32_[SharedRingBufferU32.HEADER_SIZE / 4 + index] = value;
  }

  push(value) {
    const begin = this.begin_;
    const end = this.end_; // If the buffer is full, return false.

    if (begin === (end + 1) % this.maxLength) return false; // Write the value to the buffer.

    this.setAt_(end, value);
    ++this.end_;
    return true;
  }

  pop() {
    const begin = this.begin_;
    const end = this.end_; // If the buffer is empty, return undefined.

    if (begin === end) return undefined; // Read the value from the buffer.

    const value = this.at_(begin);
    ++this.begin_;
    return value;
  }

  popAll() {
    const begin = this.begin_;
    const end = this.end_; // If the buffer is empty, return empty array.

    if (begin === end) return []; // Read the values from the buffer. End might be less than begin if the buffer has wrapped.
    // 10 - 8 + 2 

    const length = end > begin ? end - begin : this.maxLength - begin + end;
    const values = new Array(length);

    if (end > begin) {
      for (let i = begin; i < end; ++i) values[i - begin] = this.at_(i);
    } else {
      for (let i = begin; i < this.maxLength; ++i) values[i - begin] = this.at_(i);

      for (let i = 0; i < end; ++i) values[this.maxLength - begin + i] = this.at_(i);
    }

    this.begin_ = end;
    return values;
  }

}

SharedRingBufferU32.HEADER_SIZE = 8;
SharedRingBufferU32.BEGIN_INDEX = 0;
SharedRingBufferU32.END_INDEX = 1;
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (SharedRingBufferU32);

/***/ }),

/***/ "./SharedRingBufferUtf32.ts":
/*!**********************************!*\
  !*** ./SharedRingBufferUtf32.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _SharedRingBufferU32__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./SharedRingBufferU32 */ "./SharedRingBufferU32.ts");


class SharedRingBufferUtf32 {
  constructor(ringBufferOrSharedArrayBuffer) {
    if (ringBufferOrSharedArrayBuffer instanceof _SharedRingBufferU32__WEBPACK_IMPORTED_MODULE_0__.default) {
      this.ringBufferU32_ = ringBufferOrSharedArrayBuffer;
    } else {
      this.ringBufferU32_ = new _SharedRingBufferU32__WEBPACK_IMPORTED_MODULE_0__.default(ringBufferOrSharedArrayBuffer);
    }
  }

  get sharedArrayBuffer() {
    return this.ringBufferU32_.sharedArrayBuffer;
  }

  static create(maxLength) {
    return new SharedRingBufferUtf32(_SharedRingBufferU32__WEBPACK_IMPORTED_MODULE_0__.default.create(maxLength));
  }

  get maxLength() {
    return this.ringBufferU32_.maxLength;
  }

  push(value) {
    return this.ringBufferU32_.push(value);
  } // Push a string to the buffer. The number of characters written is returned.


  pushString(value) {
    let i = 0;

    for (const codePoint of value) {
      if (!this.push(codePoint.codePointAt(0))) break;
      ++i;
    }

    return i;
  }

  pushStringBlocking(value) {
    let working = value;

    while (working.length > 0) {
      const written = this.pushString(working);
      if (written === 0) continue;
      working = working.slice(written);
    }
  }

  pop() {
    return this.ringBufferU32_.pop();
  }

  popAll() {
    return this.ringBufferU32_.popAll();
  } // Pop a string from the buffer. The read string is returned.


  popString() {
    return String.fromCodePoint(...this.popAll());
  }

}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (SharedRingBufferUtf32);

/***/ }),

/***/ "./python/index.ts":
/*!*************************!*\
  !*** ./python/index.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _registersDevice__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./registersDevice */ "./python/registersDevice.ts");
// This file interacts with many untyped things, unfortunately.
// The following ESLint rules are disabled:
var __awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-unsafe-assignment */

/* eslint-disable @typescript-eslint/no-unsafe-member-access */

/* eslint-disable @typescript-eslint/no-unsafe-call */



let python;

if (true) {
  // This is on a non-standard path specified in the webpack config.
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const PythonEmscripten = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module 'python.js'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
  /**
   * Initializes the Python interpreter.
   */


  python = params => __awaiter(void 0, void 0, void 0, function* () {
    const libkipr = yield fetch('/libkipr/python/kipr.wasm');
    const libkiprBuffer = yield libkipr.arrayBuffer();
    const kiprPy = yield fetch('/libkipr/python/binding/python/package/src/kipr/kipr.py');
    const kiprPyBuffer = yield kiprPy.text();
    yield PythonEmscripten.default(Object.assign({
      locateFile: (path, prefix) => {
        return `/cpython/${path}`;
      },
      preRun: [function (module) {
        const a = module.FS.makedev(64, 0);
        module.FS.registerDevice(a, (0,_registersDevice__WEBPACK_IMPORTED_MODULE_0__.default)({
          registers: params.registers
        }));
        module.FS.mkdev('/registers', a);
        module.FS.mkdir('/kipr');
        module.FS.writeFile('/kipr/_kipr.so', new Uint8Array(libkiprBuffer));
        module.FS.writeFile('/kipr/__init__.py', kiprPyBuffer);
        module.FS.writeFile('main.py', `
import sys
sys.path.append('/')
sys.path.append('/kipr')
del sys
${params.code}
  `);
      }],
      arguments: ['main.py']
    }, params));
  });
} else {}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (python);

/***/ }),

/***/ "./python/registersDevice.ts":
/*!***********************************!*\
  !*** ./python/registersDevice.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (params => {
  const {
    registers
  } = params;
  const outBuffer = [];
  return {
    write: (stream, buffer, offset, length, position) => {
      const uBuffer = new Uint8Array(buffer);

      for (let i = 0; i < length;) {
        const requestType = uBuffer[offset + i + 0];
        const address = uBuffer[offset + i + 1];
        const size = uBuffer[offset + i + 2];
        i += 3;

        switch (requestType) {
          // REQUEST_READ
          case 0:
            {
              switch (size) {
                case 1:
                  {
                    outBuffer.push(registers.getRegisterValue8b(address));
                    break;
                  }

                case 2:
                  {
                    const value = registers.getRegisterValue16b(address);
                    outBuffer.push((value & 0xFF00) >> 8);
                    outBuffer.push((value & 0x00FF) >> 0);
                    break;
                  }

                case 4:
                  {
                    const value = registers.getRegisterValue32b(address);
                    outBuffer.push((value & 0xFF000000) >> 24);
                    outBuffer.push((value & 0x00FF0000) >> 16);
                    outBuffer.push((value & 0x0000FF00) >> 8);
                    outBuffer.push((value & 0x000000FF) >> 0);
                    break;
                  }
              }

              break;
            }
          // REQUEST_WRITE

          case 1:
            {
              switch (size) {
                case 1:
                  {
                    registers.setRegister8b(address, uBuffer[offset + i]);
                    ++i;
                    break;
                  }

                case 2:
                  {
                    registers.setRegister16b(address, uBuffer[offset + i + 0] << 8 | uBuffer[offset + i + 1] << 0);
                    i += 2;
                    break;
                  }

                case 4:
                  {
                    registers.setRegister32b(address, uBuffer[offset + i + 0] << 24 | uBuffer[offset + i + 1] << 16 | uBuffer[offset + i + 2] << 8 | uBuffer[offset + i + 3] << 0);
                    i += 4;
                    break;
                  }
              }

              break;
            }

          default:
            {
              throw new Error(`Unknown request type: ${requestType}`);
            }
        }
      }

      return length;
    },
    read: (stream, buffer, offset, length, position) => {
      if (outBuffer.length < length) {
        throw new Error('Too much data requested');
      }

      for (let i = 0; i < length; i++) {
        buffer[offset + i] = outBuffer.shift();
      }

      return length;
    }
  };
});

/***/ }),

/***/ "./require.ts":
/*!********************!*\
  !*** ./require.ts ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((code, context, print, printErr) => {
  const mod = {
    context,
    print,
    printErr
  }; // Disable eslint rule - dynamic evaluation of user code is needed here
  // eslint-disable-next-line @typescript-eslint/no-implied-eval

  new Function("Module", `"use strict"; ${code}`)(mod);
  return mod;
});

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!*******************!*\
  !*** ./worker.ts ***!
  \*******************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _require__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./require */ "./require.ts");
/* harmony import */ var _SharedRegisters__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./SharedRegisters */ "./SharedRegisters.ts");
/* harmony import */ var _python__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./python */ "./python/index.ts");
/* harmony import */ var _SharedRingBufferUtf32__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./SharedRingBufferUtf32 */ "./SharedRingBufferUtf32.ts");
var __awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};




 // Proper typing of Worker is tricky due to conflicting DOM and WebWorker types
// See GitHub issue: https://github.com/microsoft/TypeScript/issues/20595

const ctx = self;
let sharedRegister_;
let sharedConsole_;

const print = stdout => {
  sharedConsole_.pushStringBlocking(`${stdout}\n`);
};

const printErr = stderror => {
  sharedConsole_.pushStringBlocking(`${stderror}\n`);
};

var ExitStatusError;

(function (ExitStatusError) {
  ExitStatusError.isExitStatusError = e => typeof e === 'object' && e['name'] === 'ExitStatus';
})(ExitStatusError || (ExitStatusError = {}));

const startC = message => {
  // message.code contains the user's code compiled to javascript
  let stoppedSent = false;

  const sendStopped = () => {
    if (stoppedSent) return;
    ctx.postMessage({
      type: 'stopped'
    });
    stoppedSent = true;
  }; // dynRequire is a function that takes a string of javascript code and returns a module (a function that is executed when called)


  const mod = (0,_require__WEBPACK_IMPORTED_MODULE_0__.default)(message.code, {
    setRegister8b: (address, value) => sharedRegister_.setRegister8b(address, value),
    setRegister16b: (address, value) => sharedRegister_.setRegister16b(address, value),
    setRegister32b: (address, value) => sharedRegister_.setRegister32b(address, value),
    readRegister8b: address => sharedRegister_.getRegisterValue8b(address),
    readRegister16b: address => sharedRegister_.getRegisterValue16b(address),
    readRegister32b: address => sharedRegister_.getRegisterValue32b(address),
    onStop: sendStopped
  }, print, printErr);

  mod.onRuntimeInitialized = () => {
    try {
      mod._main();
    } catch (e) {
      if (ExitStatusError.isExitStatusError(e)) {
        print(`Program exited with status code ${e.status}`);
      } else if (e instanceof Error) {
        printErr(e.message);
      } else {
        printErr(`Program exited with an unknown error`);
      }
    } finally {
      sendStopped();
    }
  };

  ctx.postMessage({
    type: 'start'
  });
};

const runEventLoop = () => new Promise((resolve, reject) => setTimeout(resolve, 5));

const startPython = message => __awaiter(void 0, void 0, void 0, function* () {
  ctx.postMessage({
    type: 'start'
  });
  yield runEventLoop();
  yield (0,_python__WEBPACK_IMPORTED_MODULE_1__.default)({
    code: message.code,
    print,
    printErr,
    registers: sharedRegister_
  });
});

const start = message => __awaiter(void 0, void 0, void 0, function* () {
  switch (message.language) {
    case 'c':
    case 'cpp':
      {
        startC(message);
        break;
      }

    case 'python':
      {
        try {
          yield startPython(message);
        } catch (e) {
          printErr(e);
        } finally {
          ctx.postMessage({
            type: 'stopped'
          });
        }

        break;
      }
  }
});

ctx.onmessage = e => {
  const message = e.data;

  switch (message.type) {
    case 'start':
      {
        void start(message);
        break;
      }

    case 'set-shared-registers':
      {
        sharedRegister_ = new _SharedRegisters__WEBPACK_IMPORTED_MODULE_2__.default(message.sharedArrayBuffer);
        break;
      }

    case 'set-shared-console':
      {
        sharedConsole_ = new _SharedRingBufferUtf32__WEBPACK_IMPORTED_MODULE_3__.default(message.sharedArrayBuffer);
        break;
      }
  }
}; // Notify main thread that worker is ready for messages


ctx.postMessage({
  type: 'worker-ready'
});
})();

/******/ })()
;
//# sourceMappingURL=worker_ts.js.map