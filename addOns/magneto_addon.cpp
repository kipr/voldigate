#include <napi.h>
#include <iostream>
#include "magneto_p.hpp"

extern "C"
{
    signed short magneto_x();
    signed short magneto_y();
    signed short magneto_z();
}

Napi::Value js_magneto_x(const Napi::CallbackInfo &info)
{
    Napi::Env env = info.Env();

    std::cout << "Calling magneto_x()" << std::endl;

    signed short result = magneto_x();

    return Napi::Number::New(env, result);
}
Napi::Value js_magneto_y(const Napi::CallbackInfo &info)
{
    Napi::Env env = info.Env();

    std::cout << "Calling magneto_y()" << std::endl;

    signed short result = magneto_y();

    return Napi::Number::New(env, result);
}
Napi::Value js_magneto_z(const Napi::CallbackInfo &info)
{
    Napi::Env env = info.Env();

    std::cout << "Calling magneto_z()" << std::endl;

    signed short result = magneto_z();

    return Napi::Number::New(env, result);
}
Napi::Object InitAll(Napi::Env env, Napi::Object exports)
{
    exports.Set("magneto_x", Napi::Function::New(env, js_magneto_x));
    exports.Set("magneto_y", Napi::Function::New(env, js_magneto_y));
    exports.Set("magneto_z", Napi::Function::New(env, js_magneto_z));

    return exports;
}
NODE_API_MODULE(magneto_addon, InitAll)