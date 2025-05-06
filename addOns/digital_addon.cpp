#include <napi.h>
#include <iostream>
#include "digital_c.hpp"

extern "C"
{
  int digital(int port);
}

Napi::Value js_digital(const Napi::CallbackInfo &info)
{
    Napi::Env env = info.Env();

    if (info.Length() < 1 || !info[0].IsNumber())
    {
        Napi::TypeError::New(env, "Expected one number argument").ThrowAsJavaScriptException();
        return env.Null();
    }

    int port = info[0].As<Napi::Number>().Int32Value();

    std::cout << "Calling digital(port=" << port << ")" << std::endl;

    int result = digital(port);

    return Napi::Number::New(env, result);
}

Napi::Object InitAll(Napi::Env env, Napi::Object exports)
{
    exports.Set("digital", Napi::Function::New(env, js_digital)); // Now using the JS-friendly wrapper

    return exports;
}
NODE_API_MODULE(digital_addon, InitAll)