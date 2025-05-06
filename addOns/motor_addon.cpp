#include <napi.h>
#include <iostream>
#include "motor_c.hpp"
#include "motor_p.hpp"

extern "C"
{
    int mav(int motor, int velocity);
    int mtp(int motor, int speed, int goal_pos);
    void off(int motor);
    void alloff();
    void motor(int motor, int percent);
    int get_motor_goal_velocity(unsigned int motor);
    int get_motor_position_counter(int motor);
}


Napi::Value js_get_motor_position_counter(const Napi::CallbackInfo &info)
{
    Napi::Env env = info.Env();

    if (info.Length() < 1 || !info[0].IsNumber())
    {
        Napi::TypeError::New(env, "Expected one number argument").ThrowAsJavaScriptException();
        return env.Null();
    }

    int motor = info[0].As<Napi::Number>().Int32Value();

    std::cout << "Calling get_motor_position_counter(motor=" << motor << ")" << std::endl;

    int result = get_motor_position_counter(motor);
    std::cout << "Result: " << result << std::endl;
    

    return Napi::Number::New(env, result);
}
Napi::Value js_reset_all_motors(const Napi::CallbackInfo &info)
{
    for (int i = 0; i < 4; ++i)
    {
        kipr::motor::set_motor_mode(i, 0);
       // kipr::motor::set_motor_bemf_vel(i, 0);
        motor(i, 0);
    }

    std::cout << "All motors reset." << std::endl;
    return info.Env().Undefined();
}

Napi::Value js_reset_motor(const Napi::CallbackInfo &info)
{
    Napi::Env env = info.Env();

    if (info.Length() < 1 || !info[0].IsNumber())
    {
        Napi::TypeError::New(env, "Expected one number argument").ThrowAsJavaScriptException();
        return env.Null();
    }

    int motor_ = info[0].As<Napi::Number>().Int32Value();
    std::cout << "Resetting motor: " << motor_ << std::endl;

    kipr::motor::set_motor_mode(motor_, 0); // open-loop mode
    //kipr::motor::set_motor_bemf_vel(motor, 0); // clears target velocity
    motor(motor_, 0);

    return Napi::Boolean::New(env, true);
}


Napi::Value js_get_motor_bemf_vel(const Napi::CallbackInfo &info)
{
    Napi::Env env = info.Env();

    if (info.Length() < 1 || !info[0].IsNumber())
    {
        Napi::TypeError::New(env, "Expected one number argument").ThrowAsJavaScriptException();
        return env.Null();
    }

    int motor = info[0].As<Napi::Number>().Int32Value();

    std::cout << "Calling get_motor_bemf_vel(motor=" << motor << ")" << std::endl;
    int result = kipr::motor::get_motor_bemf_vel(motor);

    std::cout << "Result: " << result << "in mode: " << kipr::motor::get_motor_mode(motor) << std::endl;
    return Napi::Number::New(env, result);
}

Napi::Value js_get_motor_goal_velocity(const Napi::CallbackInfo &info)
{
    Napi::Env env = info.Env();

    if (info.Length() < 1 || !info[0].IsNumber())
    {
        Napi::TypeError::New(env, "Expected one number argument").ThrowAsJavaScriptException();
        return env.Null();
    }

    int motor = info[0].As<Napi::Number>().Int32Value();

    std::cout << "Calling get_motor_goal_velocity(motor=" << motor << ")" << std::endl;

    int result = get_motor_goal_velocity(motor);

    return Napi::Number::New(env, result);
}

Napi::Value js_mav(const Napi::CallbackInfo &info)
{
    Napi::Env env = info.Env();

    if (info.Length() < 2 || !info[0].IsNumber() || !info[1].IsNumber())
    {
        Napi::TypeError::New(env, "Expected two number arguments").ThrowAsJavaScriptException();
        return env.Null();
    }

    int motor = info[0].As<Napi::Number>().Int32Value();
    int velocity = info[1].As<Napi::Number>().Int32Value();

    std::cout << "Calling mav(motor=" << motor << ", velocity=" << velocity << ")" << std::endl;

    int result = mav(motor, velocity);
    if (result != 0)
    {
        Napi::Error::New(env, "Failed to move motor").ThrowAsJavaScriptException();
        return env.Null();
    }

    return env.Undefined();
}

Napi::Value js_motor_power(const Napi::CallbackInfo &info)
{
    Napi::Env env = info.Env();

    if (info.Length() < 2 || !info[0].IsNumber() || !info[1].IsNumber())
    {
        Napi::TypeError::New(env, "Expected two number arguments").ThrowAsJavaScriptException();
        return env.Null();
    }

    int motor = info[0].As<Napi::Number>().Int32Value();
    int percent = info[1].As<Napi::Number>().Int32Value();

    std::cout << "Calling motor_power(motor=" << motor << ", percent=" << percent << ")" << std::endl;

    motor_power(motor, percent);

    return env.Undefined();
}

Napi::Value js_off(const Napi::CallbackInfo &info)
{
    Napi::Env env = info.Env();

    if (info.Length() < 1 || !info[0].IsNumber())
    {
        Napi::TypeError::New(env, "Expected one number argument").ThrowAsJavaScriptException();
        return env.Null();
    }

    int motor = info[0].As<Napi::Number>().Int32Value();

    std::cout << "Calling off(motor=" << motor << ")" << std::endl;

    off(motor);

    return env.Undefined();
}

Napi::Value js_allOff(const Napi::CallbackInfo &info)
{
    Napi::Env env = info.Env();

    std::cout << "Calling alloff()" << std::endl;

    alloff();

    return env.Undefined();
}

Napi::Object InitAll(Napi::Env env, Napi::Object exports)
{
    exports.Set("mav", Napi::Function::New(env, js_mav));                                         // Now using the JS-friendly wrapper
    exports.Set("motor_power", Napi::Function::New(env, js_motor_power));                         // Now using the JS-friendly wrapper
    exports.Set("off", Napi::Function::New(env, js_off));                                         // Now using the JS-friendly wrapper
    exports.Set("allOff", Napi::Function::New(env, js_allOff));                                   // Now using the JS-friendly wrapper
    exports.Set("get_motor_goal_velocity", Napi::Function::New(env, js_get_motor_goal_velocity)); // Now using the JS-friendly wrapper
    exports.Set("get_motor_bemf_vel", Napi::Function::New(env, js_get_motor_bemf_vel));           // Now using the JS-friendly wrapper
    exports.Set("reset_motor", Napi::Function::New(env, js_reset_motor));                         // Now using the JS-friendly wrapper
    exports.Set("reset_all_motors", Napi::Function::New(env, js_reset_all_motors));             // Now using the JS-friendly wrapper
    exports.Set("get_motor_position_counter", Napi::Function::New(env, js_get_motor_position_counter)); // Now using the JS-friendly wrapper
    return exports;
}

NODE_API_MODULE(motor_addon, InitAll)
