#include <napi.h>
#include <iostream>
#include "accel_c.hpp"

extern "C"
{
    signed short accel_x();
    signed short accel_y();
    signed short accel_z();
}

Napi::Value js_accel_x(const Napi::CallbackInfo &info)
{
    Napi::Env env = info.Env();

    std::cout << "Calling accel_x()" << std::endl;

    signed short result = accel_x();

    return Napi::Number::New(env, result);
}
Napi::Value js_accel_y(const Napi::CallbackInfo &info)
{
    Napi::Env env = info.Env();

    std::cout << "Calling accel_y()" << std::endl;

    signed short result = accel_y();

    return Napi::Number::New(env, result);
}
Napi::Value js_accel_z(const Napi::CallbackInfo &info)
{
    Napi::Env env = info.Env();

    std::cout << "Calling accel_z()" << std::endl;

    signed short result = accel_z();

    return Napi::Number::New(env, result);
}
Napi::Object InitAll(Napi::Env env, Napi::Object exports)
{
    exports.Set("accel_x", Napi::Function::New(env, js_accel_x));
    exports.Set("accel_y", Napi::Function::New(env, js_accel_y));
    exports.Set("accel_z", Napi::Function::New(env, js_accel_z));

    return exports;
}
NODE_API_MODULE(accel_addon, InitAll)