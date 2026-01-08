#include <napi.h>
#include <iostream>
#include "gyro_p.hpp"

extern "C"
{
    signed short gyro_x();
    signed short gyro_y();
    signed short gyro_z();
}

Napi::Value js_gyro_x(const Napi::CallbackInfo &info)
{
    Napi::Env env = info.Env();

    std::cout << "Calling gyro_x()" << std::endl;

    signed short result = gyro_x();

    return Napi::Number::New(env, result);
}
Napi::Value js_gyro_y(const Napi::CallbackInfo &info)
{
    Napi::Env env = info.Env();

    std::cout << "Calling gyro_y()" << std::endl;

    signed short result = gyro_y();

    return Napi::Number::New(env, result);
}
Napi::Value js_gyro_z(const Napi::CallbackInfo &info)
{
    Napi::Env env = info.Env();

    std::cout << "Calling gyro_z()" << std::endl;

    signed short result = gyro_z();

    return Napi::Number::New(env, result);
}
Napi::Object InitAll(Napi::Env env, Napi::Object exports)
{
    exports.Set("gyro_x", Napi::Function::New(env, js_gyro_x));
    exports.Set("gyro_y", Napi::Function::New(env, js_gyro_y));
    exports.Set("gyro_z", Napi::Function::New(env, js_gyro_z));

    return exports;
}
NODE_API_MODULE(gyro_addon, InitAll)