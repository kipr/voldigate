#ifndef _KIPR_COMPAT_COMPAT_HPP_
#define _KIPR_COMPAT_COMPAT_HPP_

#ifdef _MSC_VER
#define NOMINMAX
#define WIN32_LEAN_AND_MEAN
#include <windows.h>
#endif

namespace kipr
{
  namespace compat
  {
    int yield();
    int microsleep(unsigned long microseconds);
  }
}

#ifdef _MSC_VER

#define PRETTYFUNC __FUNCSIG__
#pragma section(".CRT$XCU", read)
#define INITIALIZER(f) \
   static void __cdecl f(void); \
   __declspec(allocate(".CRT$XCU")) void (__cdecl*f##_)(void) = f; \
   static void __cdecl f(void)
typedef SSIZE_T ssize_t;

#else

#define PRETTYFUNC __PRETTY_FUNCTION__
#define INITIALIZER(f) \
	static void f(void) __attribute__((constructor)); \
	static void f(void)

#endif

#endif