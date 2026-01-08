#include <napi.h>
#include <iostream>
#include "button_p.hpp"

extern "C"
{
    int push_button();
}

Napi::Value js_push_button(const Napi::CallbackInfo &info)
{
    Napi::Env env = info.Env();

    std::cout << "Calling push_button()" << std::endl;

    int result = push_button();

    return Napi::Number::New(env, result);
}
Napi::Object InitAll(Napi::Env env, Napi::Object exports)
{
    exports.Set("push_button", Napi::Function::New(env, js_push_button));

    return exports;
}
NODE_API_MODULE(button_addon, InitAll)