#include <node.h>
#include <v8.h>

namespace {

using v8::FunctionCallbackInfo;
using v8::Isolate;
using v8::Local;
using v8::Number;
using v8::Object;
using v8::Promise;
using v8::String;
using v8::Value;

static void ThrowError(Isolate* isolate, const char* err_msg) {
  Local<String> str = String::NewFromOneByte(
      isolate,
      reinterpret_cast<const uint8_t*>(err_msg)).ToLocalChecked();
  isolate->ThrowException(str);
}

static void GetPromiseField(const FunctionCallbackInfo<Value>& args) {
  auto isolate = args.GetIsolate();

  if (!args[0]->IsPromise())
    return ThrowError(isolate, "arg 0 is not an Promise");

  if (!args[1]->IsNumber())
    return ThrowError(isolate, "arg 1 is not a number");

  auto p = args[0].As<Promise>();
  if (p->InternalFieldCount() < 2)
    return ThrowError(isolate, "Promise has no internal fields");

  double fieldIdx = args[1].As<Number>()->Value();
  if (fieldIdx != 0 && fieldIdx != 1)
    return ThrowError(isolate, "Index has to be 0 or 1");

  auto l = p->GetInternalField(fieldIdx);
  args.GetReturnValue().Set(l);
}

inline void Initialize(v8::Local<v8::Object> binding) {
  NODE_SET_METHOD(binding, "getPromiseField", GetPromiseField);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, Initialize)

}  // anonymous namespace
