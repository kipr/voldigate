#include <napi.h>
#include <iostream>
#include "analog_c.hpp"

extern "C" 
{
  int analog(int port);
}

Napi::Value js_analog(const Napi::CallbackInfo &info)
{
    Napi::Env env = info.Env();

    if (info.Length() < 1 || !info[0].IsNumber())
    {
        Napi::TypeError::New(env, "Expected one number argument").ThrowAsJavaScriptException();
        return env.Null();
    }

    int port = info[0].As<Napi::Number>().Int32Value();

    std::cout << "Calling analog(port=" << port << ")" << std::endl;

    int result = analog(port);

    return Napi::Number::New(env, result);
}

Napi::Object InitAll(Napi::Env env, Napi::Object exports)
{
    exports.Set("analog", Napi::Function::New(env, js_analog)); // Now using the JS-friendly wrapper
   
    return exports;
}

NODE_API_MODULE(analog_addon, InitAll)
