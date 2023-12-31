# set(CMAKE_SYSROOT ${AARCH64_LINUX_GNU_SYSROOT})
set(ARCH armv7l)

set(CMAKE_SYSTEM_NAME Linux)
set(CMAKE_SYSTEM_PROCESSOR armv7l)

set(triple arm-linux-gnueabihf)

set_property(GLOBAL PROPERTY host arm-linux)
set_property(GLOBAL PROPERTY triple ${triple})
set_property(GLOBAL PROPERTY arch armv7l)
set_property(GLOBAL PROPERTY target_os linux)
set_property(GLOBAL PROPERTY cross_prefix ${triple}-)

set(CMAKE_C_COMPILER_TARGET ${triple})

set(CMAKE_C_COMPILER ${triple}-gcc)
set(CMAKE_C_COMPILER_TARGET ${triple})
set(CMAKE_CXX_COMPILER ${triple}-g++)
set(CMAKE_CXX_COMPILER_TARGET ${triple})
set(CMAKE_ASM_COMPILER ${triple}-as)
set(CMAKE_ASM_COMPILER_TARGET ${triple})
set(CMAKE_LINKER ${triple}-ld)
set(CMAKE_ADDR2LINE ${triple}-addr2line)
set(CMAKE_AR ${triple}-ar)
set(CMAKE_NM ${triple}-nm)
set(CMAKE_OBJCOPY ${triple}-objcopy)
set(CMAKE_OBJDUMP ${triple}-objdump)
set(CMAKE_RANLIB ${triple}-ranlib)
set(CMAKE_READELF ${triple}-readelf)
set(CMAKE_STRIP ${triple}-strip)