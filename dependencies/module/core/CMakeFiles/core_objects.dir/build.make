# CMAKE generated file: DO NOT EDIT!
# Generated by "Unix Makefiles" Generator, CMake Version 3.22

# Delete rule output on recipe failure.
.DELETE_ON_ERROR:

#=============================================================================
# Special targets provided by cmake.

# Disable implicit rules so canonical targets will work.
.SUFFIXES:

# Disable VCS-based implicit rules.
% : %,v

# Disable VCS-based implicit rules.
% : RCS/%

# Disable VCS-based implicit rules.
% : RCS/%,v

# Disable VCS-based implicit rules.
% : SCCS/s.%

# Disable VCS-based implicit rules.
% : s.%

.SUFFIXES: .hpux_make_needs_suffix_list

# Command-line flag to silence nested $(MAKE).
$(VERBOSE)MAKESILENT = -s

#Suppress display of executed commands.
$(VERBOSE).SILENT:

# A target that is always out of date.
cmake_force:
.PHONY : cmake_force

#=============================================================================
# Set environment variables for the build.

# The shell in which to execute make rules.
SHELL = /bin/sh

# The CMake executable.
CMAKE_COMMAND = /usr/bin/cmake

# The command to remove a file.
RM = /usr/bin/cmake -E rm -f

# Escaping for special characters.
EQUALS = =

# The top-level source directory on which CMake was run.
CMAKE_SOURCE_DIR = /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/libwallaby

# The top-level build directory on which CMake was run.
CMAKE_BINARY_DIR = /home/erin/Desktop/qt6Upgrade/voldigate/dependencies

# Include any dependencies generated for this target.
include module/core/CMakeFiles/core_objects.dir/depend.make
# Include any dependencies generated by the compiler for this target.
include module/core/CMakeFiles/core_objects.dir/compiler_depend.make

# Include the progress variables for this target.
include module/core/CMakeFiles/core_objects.dir/progress.make

# Include the compile flags for this target's objects.
include module/core/CMakeFiles/core_objects.dir/flags.make

module/core/CMakeFiles/core_objects.dir/src/cleanup.cpp.o: module/core/CMakeFiles/core_objects.dir/flags.make
module/core/CMakeFiles/core_objects.dir/src/cleanup.cpp.o: libwallaby/module/core/src/cleanup.cpp
module/core/CMakeFiles/core_objects.dir/src/cleanup.cpp.o: module/core/CMakeFiles/core_objects.dir/compiler_depend.ts
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green --progress-dir=/home/erin/Desktop/qt6Upgrade/voldigate/dependencies/CMakeFiles --progress-num=$(CMAKE_PROGRESS_1) "Building CXX object module/core/CMakeFiles/core_objects.dir/src/cleanup.cpp.o"
	cd /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/module/core && /usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -MD -MT module/core/CMakeFiles/core_objects.dir/src/cleanup.cpp.o -MF CMakeFiles/core_objects.dir/src/cleanup.cpp.o.d -o CMakeFiles/core_objects.dir/src/cleanup.cpp.o -c /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/libwallaby/module/core/src/cleanup.cpp

module/core/CMakeFiles/core_objects.dir/src/cleanup.cpp.i: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Preprocessing CXX source to CMakeFiles/core_objects.dir/src/cleanup.cpp.i"
	cd /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/module/core && /usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -E /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/libwallaby/module/core/src/cleanup.cpp > CMakeFiles/core_objects.dir/src/cleanup.cpp.i

module/core/CMakeFiles/core_objects.dir/src/cleanup.cpp.s: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Compiling CXX source to assembly CMakeFiles/core_objects.dir/src/cleanup.cpp.s"
	cd /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/module/core && /usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -S /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/libwallaby/module/core/src/cleanup.cpp -o CMakeFiles/core_objects.dir/src/cleanup.cpp.s

module/core/CMakeFiles/core_objects.dir/src/command.cpp.o: module/core/CMakeFiles/core_objects.dir/flags.make
module/core/CMakeFiles/core_objects.dir/src/command.cpp.o: libwallaby/module/core/src/command.cpp
module/core/CMakeFiles/core_objects.dir/src/command.cpp.o: module/core/CMakeFiles/core_objects.dir/compiler_depend.ts
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green --progress-dir=/home/erin/Desktop/qt6Upgrade/voldigate/dependencies/CMakeFiles --progress-num=$(CMAKE_PROGRESS_2) "Building CXX object module/core/CMakeFiles/core_objects.dir/src/command.cpp.o"
	cd /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/module/core && /usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -MD -MT module/core/CMakeFiles/core_objects.dir/src/command.cpp.o -MF CMakeFiles/core_objects.dir/src/command.cpp.o.d -o CMakeFiles/core_objects.dir/src/command.cpp.o -c /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/libwallaby/module/core/src/command.cpp

module/core/CMakeFiles/core_objects.dir/src/command.cpp.i: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Preprocessing CXX source to CMakeFiles/core_objects.dir/src/command.cpp.i"
	cd /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/module/core && /usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -E /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/libwallaby/module/core/src/command.cpp > CMakeFiles/core_objects.dir/src/command.cpp.i

module/core/CMakeFiles/core_objects.dir/src/command.cpp.s: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Compiling CXX source to assembly CMakeFiles/core_objects.dir/src/command.cpp.s"
	cd /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/module/core && /usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -S /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/libwallaby/module/core/src/command.cpp -o CMakeFiles/core_objects.dir/src/command.cpp.s

module/core/CMakeFiles/core_objects.dir/src/core.cpp.o: module/core/CMakeFiles/core_objects.dir/flags.make
module/core/CMakeFiles/core_objects.dir/src/core.cpp.o: libwallaby/module/core/src/core.cpp
module/core/CMakeFiles/core_objects.dir/src/core.cpp.o: module/core/CMakeFiles/core_objects.dir/compiler_depend.ts
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green --progress-dir=/home/erin/Desktop/qt6Upgrade/voldigate/dependencies/CMakeFiles --progress-num=$(CMAKE_PROGRESS_3) "Building CXX object module/core/CMakeFiles/core_objects.dir/src/core.cpp.o"
	cd /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/module/core && /usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -MD -MT module/core/CMakeFiles/core_objects.dir/src/core.cpp.o -MF CMakeFiles/core_objects.dir/src/core.cpp.o.d -o CMakeFiles/core_objects.dir/src/core.cpp.o -c /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/libwallaby/module/core/src/core.cpp

module/core/CMakeFiles/core_objects.dir/src/core.cpp.i: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Preprocessing CXX source to CMakeFiles/core_objects.dir/src/core.cpp.i"
	cd /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/module/core && /usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -E /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/libwallaby/module/core/src/core.cpp > CMakeFiles/core_objects.dir/src/core.cpp.i

module/core/CMakeFiles/core_objects.dir/src/core.cpp.s: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Compiling CXX source to assembly CMakeFiles/core_objects.dir/src/core.cpp.s"
	cd /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/module/core && /usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -S /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/libwallaby/module/core/src/core.cpp -o CMakeFiles/core_objects.dir/src/core.cpp.s

module/core/CMakeFiles/core_objects.dir/src/device.cpp.o: module/core/CMakeFiles/core_objects.dir/flags.make
module/core/CMakeFiles/core_objects.dir/src/device.cpp.o: libwallaby/module/core/src/device.cpp
module/core/CMakeFiles/core_objects.dir/src/device.cpp.o: module/core/CMakeFiles/core_objects.dir/compiler_depend.ts
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green --progress-dir=/home/erin/Desktop/qt6Upgrade/voldigate/dependencies/CMakeFiles --progress-num=$(CMAKE_PROGRESS_4) "Building CXX object module/core/CMakeFiles/core_objects.dir/src/device.cpp.o"
	cd /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/module/core && /usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -MD -MT module/core/CMakeFiles/core_objects.dir/src/device.cpp.o -MF CMakeFiles/core_objects.dir/src/device.cpp.o.d -o CMakeFiles/core_objects.dir/src/device.cpp.o -c /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/libwallaby/module/core/src/device.cpp

module/core/CMakeFiles/core_objects.dir/src/device.cpp.i: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Preprocessing CXX source to CMakeFiles/core_objects.dir/src/device.cpp.i"
	cd /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/module/core && /usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -E /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/libwallaby/module/core/src/device.cpp > CMakeFiles/core_objects.dir/src/device.cpp.i

module/core/CMakeFiles/core_objects.dir/src/device.cpp.s: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Compiling CXX source to assembly CMakeFiles/core_objects.dir/src/device.cpp.s"
	cd /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/module/core && /usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -S /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/libwallaby/module/core/src/device.cpp -o CMakeFiles/core_objects.dir/src/device.cpp.s

module/core/CMakeFiles/core_objects.dir/src/platform.cpp.o: module/core/CMakeFiles/core_objects.dir/flags.make
module/core/CMakeFiles/core_objects.dir/src/platform.cpp.o: libwallaby/module/core/src/platform.cpp
module/core/CMakeFiles/core_objects.dir/src/platform.cpp.o: module/core/CMakeFiles/core_objects.dir/compiler_depend.ts
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green --progress-dir=/home/erin/Desktop/qt6Upgrade/voldigate/dependencies/CMakeFiles --progress-num=$(CMAKE_PROGRESS_5) "Building CXX object module/core/CMakeFiles/core_objects.dir/src/platform.cpp.o"
	cd /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/module/core && /usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -MD -MT module/core/CMakeFiles/core_objects.dir/src/platform.cpp.o -MF CMakeFiles/core_objects.dir/src/platform.cpp.o.d -o CMakeFiles/core_objects.dir/src/platform.cpp.o -c /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/libwallaby/module/core/src/platform.cpp

module/core/CMakeFiles/core_objects.dir/src/platform.cpp.i: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Preprocessing CXX source to CMakeFiles/core_objects.dir/src/platform.cpp.i"
	cd /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/module/core && /usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -E /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/libwallaby/module/core/src/platform.cpp > CMakeFiles/core_objects.dir/src/platform.cpp.i

module/core/CMakeFiles/core_objects.dir/src/platform.cpp.s: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Compiling CXX source to assembly CMakeFiles/core_objects.dir/src/platform.cpp.s"
	cd /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/module/core && /usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -S /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/libwallaby/module/core/src/platform.cpp -o CMakeFiles/core_objects.dir/src/platform.cpp.s

module/core/CMakeFiles/core_objects.dir/src/device/wombat/wombat_device.cpp.o: module/core/CMakeFiles/core_objects.dir/flags.make
module/core/CMakeFiles/core_objects.dir/src/device/wombat/wombat_device.cpp.o: libwallaby/module/core/src/device/wombat/wombat_device.cpp
module/core/CMakeFiles/core_objects.dir/src/device/wombat/wombat_device.cpp.o: module/core/CMakeFiles/core_objects.dir/compiler_depend.ts
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green --progress-dir=/home/erin/Desktop/qt6Upgrade/voldigate/dependencies/CMakeFiles --progress-num=$(CMAKE_PROGRESS_6) "Building CXX object module/core/CMakeFiles/core_objects.dir/src/device/wombat/wombat_device.cpp.o"
	cd /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/module/core && /usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -MD -MT module/core/CMakeFiles/core_objects.dir/src/device/wombat/wombat_device.cpp.o -MF CMakeFiles/core_objects.dir/src/device/wombat/wombat_device.cpp.o.d -o CMakeFiles/core_objects.dir/src/device/wombat/wombat_device.cpp.o -c /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/libwallaby/module/core/src/device/wombat/wombat_device.cpp

module/core/CMakeFiles/core_objects.dir/src/device/wombat/wombat_device.cpp.i: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Preprocessing CXX source to CMakeFiles/core_objects.dir/src/device/wombat/wombat_device.cpp.i"
	cd /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/module/core && /usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -E /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/libwallaby/module/core/src/device/wombat/wombat_device.cpp > CMakeFiles/core_objects.dir/src/device/wombat/wombat_device.cpp.i

module/core/CMakeFiles/core_objects.dir/src/device/wombat/wombat_device.cpp.s: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Compiling CXX source to assembly CMakeFiles/core_objects.dir/src/device/wombat/wombat_device.cpp.s"
	cd /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/module/core && /usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -S /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/libwallaby/module/core/src/device/wombat/wombat_device.cpp -o CMakeFiles/core_objects.dir/src/device/wombat/wombat_device.cpp.s

core_objects: module/core/CMakeFiles/core_objects.dir/src/cleanup.cpp.o
core_objects: module/core/CMakeFiles/core_objects.dir/src/command.cpp.o
core_objects: module/core/CMakeFiles/core_objects.dir/src/core.cpp.o
core_objects: module/core/CMakeFiles/core_objects.dir/src/device.cpp.o
core_objects: module/core/CMakeFiles/core_objects.dir/src/platform.cpp.o
core_objects: module/core/CMakeFiles/core_objects.dir/src/device/wombat/wombat_device.cpp.o
core_objects: module/core/CMakeFiles/core_objects.dir/build.make
.PHONY : core_objects

# Rule to build all files generated by this target.
module/core/CMakeFiles/core_objects.dir/build: core_objects
.PHONY : module/core/CMakeFiles/core_objects.dir/build

module/core/CMakeFiles/core_objects.dir/clean:
	cd /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/module/core && $(CMAKE_COMMAND) -P CMakeFiles/core_objects.dir/cmake_clean.cmake
.PHONY : module/core/CMakeFiles/core_objects.dir/clean

module/core/CMakeFiles/core_objects.dir/depend:
	cd /home/erin/Desktop/qt6Upgrade/voldigate/dependencies && $(CMAKE_COMMAND) -E cmake_depends "Unix Makefiles" /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/libwallaby /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/libwallaby/module/core /home/erin/Desktop/qt6Upgrade/voldigate/dependencies /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/module/core /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/module/core/CMakeFiles/core_objects.dir/DependInfo.cmake --color=$(COLOR)
.PHONY : module/core/CMakeFiles/core_objects.dir/depend
