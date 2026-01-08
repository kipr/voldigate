#include <napi.h>
#include <iostream>
#include "servo_p.hpp"

extern "C"
{
    void enable_servo(int port);
    void disable_servo(int port);
    void enable_servos();
    void disable_servos();
    int get_servo_position(int port);
    void set_servo_position(int port, int position);
    int get_servo_enabled(int port);
}

Napi::Value js_get_servo_enabled(const Napi::CallbackInfo &info)
{
    Napi::Env env = info.Env();

    if (info.Length() < 1 || !info[0].IsNumber())
    {
        Napi::TypeError::New(env, "Expected one number argument").ThrowAsJavaScriptException();
        return env.Null();
    }

    int port = info[0].As<Napi::Number>().Int32Value();

    std::cout << "Calling get_servo_enabled(port=" << port << ")" << std::endl;

    int enabled = get_servo_enabled(port);

    std::cout << "Servo enabled: " << enabled << std::endl;

    return Napi::Boolean::New(env, enabled);
}
Napi::Value js_enable_servo(const Napi::CallbackInfo &info)
{
    Napi::Env env = info.Env();

    if (info.Length() < 1 || !info[0].IsNumber())
    {
        Napi::TypeError::New(env, "Expected one number argument").ThrowAsJavaScriptException();
        return env.Null();
    }

    int port = info[0].As<Napi::Number>().Int32Value();

    std::cout << "Calling enable_servo(port=" << port << ")" << std::endl;

    enable_servo(port);

    return env.Undefined();
}
Napi::Value js_disable_servo(const Napi::CallbackInfo &info)
{
    Napi::Env env = info.Env();

    if (info.Length() < 1 || !info[0].IsNumber())
    {
        Napi::TypeError::New(env, "Expected one number argument").ThrowAsJavaScriptException();
        return env.Null();
    }

    int port = info[0].As<Napi::Number>().Int32Value();

    std::cout << "Calling disable_servo(port=" << port << ")" << std::endl;

    disable_servo(port);

    return env.Undefined();
}
Napi::Value js_disable_servos(const Napi::CallbackInfo &info)
{
    Napi::Env env = info.Env();

    std::cout << "Calling disable_servos()" << std::endl;

    disable_servos();

    return env.Undefined();
}

Napi::Value js_set_servo_position(const Napi::CallbackInfo &info)
{
    Napi::Env env = info.Env();

    if (info.Length() < 2 || !info[0].IsNumber() || !info[1].IsNumber())
    {
        Napi::TypeError::New(env, "Expected two number arguments").ThrowAsJavaScriptException();
        return env.Null();
    }

    int port = info[0].As<Napi::Number>().Int32Value();
    int position = info[1].As<Napi::Number>().Int32Value();

    std::cout << "Calling set_servo_position(port=" << port << ", position=" << position << ")" << std::endl;

    set_servo_position(port, position);

    return env.Undefined();
}

Napi::Value js_get_servo_position(const Napi::CallbackInfo &info)
{
    Napi::Env env = info.Env();

    if (info.Length() < 1 || !info[0].IsNumber())
    {
        Napi::TypeError::New(env, "Expected one number argument").ThrowAsJavaScriptException();
        return env.Null();
    }

    int port = info[0].As<Napi::Number>().Int32Value();

    std::cout << "Calling get_servo_position(port=" << port << ")" << std::endl;

    int position = get_servo_position(port);

    std::cout << "Servo position: " << position << std::endl;

    return Napi::Number::New(env, position);
}
Napi::Object InitAll(Napi::Env env, Napi::Object exports)
{
    exports.Set("enable_servo", Napi::Function::New(env, js_enable_servo)); // Now using the JS-friendly wrapper
    exports.Set("disable_servo", Napi::Function::New(env, js_disable_servo)); // Now using the JS-friendly wrapper
    exports.Set("disable_servos", Napi::Function::New(env, js_disable_servos)); // Now using the JS-friendly wrapper
    exports.Set("set_servo_position", Napi::Function::New(env, js_set_servo_position)); // Now using the JS-friendly wrapper
    exports.Set("get_servo_position", Napi::Function::New(env, js_get_servo_position)); // Now using the JS-friendly wrapper
    exports.Set("get_servo_enabled", Napi::Function::New(env, js_get_servo_enabled)); // Now using the JS-friendly wrapper
    return exports;
}

NODE_API_MODULE(servo_addon, InitAll)
