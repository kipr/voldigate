# Install script for directory: /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/libwallaby/module

# Set the install prefix
if(NOT DEFINED CMAKE_INSTALL_PREFIX)
  set(CMAKE_INSTALL_PREFIX "/home/erin/Desktop/qt6Upgrade/voldigate/dependencies/libkipr_install_c")
endif()
string(REGEX REPLACE "/$" "" CMAKE_INSTALL_PREFIX "${CMAKE_INSTALL_PREFIX}")

# Set the install configuration name.
if(NOT DEFINED CMAKE_INSTALL_CONFIG_NAME)
  if(BUILD_TYPE)
    string(REGEX REPLACE "^[^A-Za-z0-9_]+" ""
           CMAKE_INSTALL_CONFIG_NAME "${BUILD_TYPE}")
  else()
    set(CMAKE_INSTALL_CONFIG_NAME "")
  endif()
  message(STATUS "Install configuration: \"${CMAKE_INSTALL_CONFIG_NAME}\"")
endif()

# Set the component getting installed.
if(NOT CMAKE_INSTALL_COMPONENT)
  if(COMPONENT)
    message(STATUS "Install component: \"${COMPONENT}\"")
    set(CMAKE_INSTALL_COMPONENT "${COMPONENT}")
  else()
    set(CMAKE_INSTALL_COMPONENT)
  endif()
endif()

# Install shared libraries without execute permission?
if(NOT DEFINED CMAKE_INSTALL_SO_NO_EXE)
  set(CMAKE_INSTALL_SO_NO_EXE "1")
endif()

# Is this installation the result of a crosscompile?
if(NOT DEFINED CMAKE_CROSSCOMPILING)
  set(CMAKE_CROSSCOMPILING "FALSE")
endif()

# Set default install directory permissions.
if(NOT DEFINED CMAKE_OBJDUMP)
  set(CMAKE_OBJDUMP "/usr/bin/objdump")
endif()

if(NOT CMAKE_INSTALL_LOCAL_ONLY)
  # Include the install script for each subdirectory.
  include("/home/erin/Desktop/qt6Upgrade/voldigate/dependencies/module/accel/cmake_install.cmake")
  include("/home/erin/Desktop/qt6Upgrade/voldigate/dependencies/module/analog/cmake_install.cmake")
  include("/home/erin/Desktop/qt6Upgrade/voldigate/dependencies/module/audio/cmake_install.cmake")
  include("/home/erin/Desktop/qt6Upgrade/voldigate/dependencies/module/battery/cmake_install.cmake")
  include("/home/erin/Desktop/qt6Upgrade/voldigate/dependencies/module/botball/cmake_install.cmake")
  include("/home/erin/Desktop/qt6Upgrade/voldigate/dependencies/module/button/cmake_install.cmake")
  include("/home/erin/Desktop/qt6Upgrade/voldigate/dependencies/module/camera/cmake_install.cmake")
  include("/home/erin/Desktop/qt6Upgrade/voldigate/dependencies/module/color/cmake_install.cmake")
  include("/home/erin/Desktop/qt6Upgrade/voldigate/dependencies/module/compat/cmake_install.cmake")
  include("/home/erin/Desktop/qt6Upgrade/voldigate/dependencies/module/compass/cmake_install.cmake")
  include("/home/erin/Desktop/qt6Upgrade/voldigate/dependencies/module/config/cmake_install.cmake")
  include("/home/erin/Desktop/qt6Upgrade/voldigate/dependencies/module/console/cmake_install.cmake")
  include("/home/erin/Desktop/qt6Upgrade/voldigate/dependencies/module/core/cmake_install.cmake")
  include("/home/erin/Desktop/qt6Upgrade/voldigate/dependencies/module/create/cmake_install.cmake")
  include("/home/erin/Desktop/qt6Upgrade/voldigate/dependencies/module/digital/cmake_install.cmake")
  include("/home/erin/Desktop/qt6Upgrade/voldigate/dependencies/module/export/cmake_install.cmake")
  include("/home/erin/Desktop/qt6Upgrade/voldigate/dependencies/module/geometry/cmake_install.cmake")
  include("/home/erin/Desktop/qt6Upgrade/voldigate/dependencies/module/graphics/cmake_install.cmake")
  include("/home/erin/Desktop/qt6Upgrade/voldigate/dependencies/module/gyro/cmake_install.cmake")
  include("/home/erin/Desktop/qt6Upgrade/voldigate/dependencies/module/log/cmake_install.cmake")
  include("/home/erin/Desktop/qt6Upgrade/voldigate/dependencies/module/magneto/cmake_install.cmake")
  include("/home/erin/Desktop/qt6Upgrade/voldigate/dependencies/module/motor/cmake_install.cmake")
  include("/home/erin/Desktop/qt6Upgrade/voldigate/dependencies/module/network/cmake_install.cmake")
  include("/home/erin/Desktop/qt6Upgrade/voldigate/dependencies/module/sensor/cmake_install.cmake")
  include("/home/erin/Desktop/qt6Upgrade/voldigate/dependencies/module/servo/cmake_install.cmake")
  include("/home/erin/Desktop/qt6Upgrade/voldigate/dependencies/module/tello/cmake_install.cmake")
  include("/home/erin/Desktop/qt6Upgrade/voldigate/dependencies/module/thread/cmake_install.cmake")
  include("/home/erin/Desktop/qt6Upgrade/voldigate/dependencies/module/time/cmake_install.cmake")
  include("/home/erin/Desktop/qt6Upgrade/voldigate/dependencies/module/wait_for/cmake_install.cmake")

endif()

