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
include module/motor/CMakeFiles/motor_objects.dir/depend.make
# Include any dependencies generated by the compiler for this target.
include module/motor/CMakeFiles/motor_objects.dir/compiler_depend.make

# Include the progress variables for this target.
include module/motor/CMakeFiles/motor_objects.dir/progress.make

# Include the compile flags for this target's objects.
include module/motor/CMakeFiles/motor_objects.dir/flags.make

module/motor/CMakeFiles/motor_objects.dir/src/command.cpp.o: module/motor/CMakeFiles/motor_objects.dir/flags.make
module/motor/CMakeFiles/motor_objects.dir/src/command.cpp.o: libwallaby/module/motor/src/command.cpp
module/motor/CMakeFiles/motor_objects.dir/src/command.cpp.o: module/motor/CMakeFiles/motor_objects.dir/compiler_depend.ts
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green --progress-dir=/home/erin/Desktop/qt6Upgrade/voldigate/dependencies/CMakeFiles --progress-num=$(CMAKE_PROGRESS_1) "Building CXX object module/motor/CMakeFiles/motor_objects.dir/src/command.cpp.o"
	cd /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/module/motor && /usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -MD -MT module/motor/CMakeFiles/motor_objects.dir/src/command.cpp.o -MF CMakeFiles/motor_objects.dir/src/command.cpp.o.d -o CMakeFiles/motor_objects.dir/src/command.cpp.o -c /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/libwallaby/module/motor/src/command.cpp

module/motor/CMakeFiles/motor_objects.dir/src/command.cpp.i: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Preprocessing CXX source to CMakeFiles/motor_objects.dir/src/command.cpp.i"
	cd /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/module/motor && /usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -E /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/libwallaby/module/motor/src/command.cpp > CMakeFiles/motor_objects.dir/src/command.cpp.i

module/motor/CMakeFiles/motor_objects.dir/src/command.cpp.s: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Compiling CXX source to assembly CMakeFiles/motor_objects.dir/src/command.cpp.s"
	cd /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/module/motor && /usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -S /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/libwallaby/module/motor/src/command.cpp -o CMakeFiles/motor_objects.dir/src/command.cpp.s

module/motor/CMakeFiles/motor_objects.dir/src/init.cpp.o: module/motor/CMakeFiles/motor_objects.dir/flags.make
module/motor/CMakeFiles/motor_objects.dir/src/init.cpp.o: libwallaby/module/motor/src/init.cpp
module/motor/CMakeFiles/motor_objects.dir/src/init.cpp.o: module/motor/CMakeFiles/motor_objects.dir/compiler_depend.ts
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green --progress-dir=/home/erin/Desktop/qt6Upgrade/voldigate/dependencies/CMakeFiles --progress-num=$(CMAKE_PROGRESS_2) "Building CXX object module/motor/CMakeFiles/motor_objects.dir/src/init.cpp.o"
	cd /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/module/motor && /usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -MD -MT module/motor/CMakeFiles/motor_objects.dir/src/init.cpp.o -MF CMakeFiles/motor_objects.dir/src/init.cpp.o.d -o CMakeFiles/motor_objects.dir/src/init.cpp.o -c /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/libwallaby/module/motor/src/init.cpp

module/motor/CMakeFiles/motor_objects.dir/src/init.cpp.i: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Preprocessing CXX source to CMakeFiles/motor_objects.dir/src/init.cpp.i"
	cd /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/module/motor && /usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -E /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/libwallaby/module/motor/src/init.cpp > CMakeFiles/motor_objects.dir/src/init.cpp.i

module/motor/CMakeFiles/motor_objects.dir/src/init.cpp.s: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Compiling CXX source to assembly CMakeFiles/motor_objects.dir/src/init.cpp.s"
	cd /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/module/motor && /usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -S /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/libwallaby/module/motor/src/init.cpp -o CMakeFiles/motor_objects.dir/src/init.cpp.s

module/motor/CMakeFiles/motor_objects.dir/src/motor.cpp.o: module/motor/CMakeFiles/motor_objects.dir/flags.make
module/motor/CMakeFiles/motor_objects.dir/src/motor.cpp.o: libwallaby/module/motor/src/motor.cpp
module/motor/CMakeFiles/motor_objects.dir/src/motor.cpp.o: module/motor/CMakeFiles/motor_objects.dir/compiler_depend.ts
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green --progress-dir=/home/erin/Desktop/qt6Upgrade/voldigate/dependencies/CMakeFiles --progress-num=$(CMAKE_PROGRESS_3) "Building CXX object module/motor/CMakeFiles/motor_objects.dir/src/motor.cpp.o"
	cd /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/module/motor && /usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -MD -MT module/motor/CMakeFiles/motor_objects.dir/src/motor.cpp.o -MF CMakeFiles/motor_objects.dir/src/motor.cpp.o.d -o CMakeFiles/motor_objects.dir/src/motor.cpp.o -c /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/libwallaby/module/motor/src/motor.cpp

module/motor/CMakeFiles/motor_objects.dir/src/motor.cpp.i: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Preprocessing CXX source to CMakeFiles/motor_objects.dir/src/motor.cpp.i"
	cd /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/module/motor && /usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -E /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/libwallaby/module/motor/src/motor.cpp > CMakeFiles/motor_objects.dir/src/motor.cpp.i

module/motor/CMakeFiles/motor_objects.dir/src/motor.cpp.s: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Compiling CXX source to assembly CMakeFiles/motor_objects.dir/src/motor.cpp.s"
	cd /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/module/motor && /usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -S /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/libwallaby/module/motor/src/motor.cpp -o CMakeFiles/motor_objects.dir/src/motor.cpp.s

module/motor/CMakeFiles/motor_objects.dir/src/motor_c.cpp.o: module/motor/CMakeFiles/motor_objects.dir/flags.make
module/motor/CMakeFiles/motor_objects.dir/src/motor_c.cpp.o: libwallaby/module/motor/src/motor_c.cpp
module/motor/CMakeFiles/motor_objects.dir/src/motor_c.cpp.o: module/motor/CMakeFiles/motor_objects.dir/compiler_depend.ts
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green --progress-dir=/home/erin/Desktop/qt6Upgrade/voldigate/dependencies/CMakeFiles --progress-num=$(CMAKE_PROGRESS_4) "Building CXX object module/motor/CMakeFiles/motor_objects.dir/src/motor_c.cpp.o"
	cd /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/module/motor && /usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -MD -MT module/motor/CMakeFiles/motor_objects.dir/src/motor_c.cpp.o -MF CMakeFiles/motor_objects.dir/src/motor_c.cpp.o.d -o CMakeFiles/motor_objects.dir/src/motor_c.cpp.o -c /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/libwallaby/module/motor/src/motor_c.cpp

module/motor/CMakeFiles/motor_objects.dir/src/motor_c.cpp.i: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Preprocessing CXX source to CMakeFiles/motor_objects.dir/src/motor_c.cpp.i"
	cd /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/module/motor && /usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -E /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/libwallaby/module/motor/src/motor_c.cpp > CMakeFiles/motor_objects.dir/src/motor_c.cpp.i

module/motor/CMakeFiles/motor_objects.dir/src/motor_c.cpp.s: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Compiling CXX source to assembly CMakeFiles/motor_objects.dir/src/motor_c.cpp.s"
	cd /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/module/motor && /usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -S /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/libwallaby/module/motor/src/motor_c.cpp -o CMakeFiles/motor_objects.dir/src/motor_c.cpp.s

module/motor/CMakeFiles/motor_objects.dir/src/motor_p.cpp.o: module/motor/CMakeFiles/motor_objects.dir/flags.make
module/motor/CMakeFiles/motor_objects.dir/src/motor_p.cpp.o: libwallaby/module/motor/src/motor_p.cpp
module/motor/CMakeFiles/motor_objects.dir/src/motor_p.cpp.o: module/motor/CMakeFiles/motor_objects.dir/compiler_depend.ts
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green --progress-dir=/home/erin/Desktop/qt6Upgrade/voldigate/dependencies/CMakeFiles --progress-num=$(CMAKE_PROGRESS_5) "Building CXX object module/motor/CMakeFiles/motor_objects.dir/src/motor_p.cpp.o"
	cd /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/module/motor && /usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -MD -MT module/motor/CMakeFiles/motor_objects.dir/src/motor_p.cpp.o -MF CMakeFiles/motor_objects.dir/src/motor_p.cpp.o.d -o CMakeFiles/motor_objects.dir/src/motor_p.cpp.o -c /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/libwallaby/module/motor/src/motor_p.cpp

module/motor/CMakeFiles/motor_objects.dir/src/motor_p.cpp.i: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Preprocessing CXX source to CMakeFiles/motor_objects.dir/src/motor_p.cpp.i"
	cd /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/module/motor && /usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -E /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/libwallaby/module/motor/src/motor_p.cpp > CMakeFiles/motor_objects.dir/src/motor_p.cpp.i

module/motor/CMakeFiles/motor_objects.dir/src/motor_p.cpp.s: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Compiling CXX source to assembly CMakeFiles/motor_objects.dir/src/motor_p.cpp.s"
	cd /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/module/motor && /usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -S /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/libwallaby/module/motor/src/motor_p.cpp -o CMakeFiles/motor_objects.dir/src/motor_p.cpp.s

motor_objects: module/motor/CMakeFiles/motor_objects.dir/src/command.cpp.o
motor_objects: module/motor/CMakeFiles/motor_objects.dir/src/init.cpp.o
motor_objects: module/motor/CMakeFiles/motor_objects.dir/src/motor.cpp.o
motor_objects: module/motor/CMakeFiles/motor_objects.dir/src/motor_c.cpp.o
motor_objects: module/motor/CMakeFiles/motor_objects.dir/src/motor_p.cpp.o
motor_objects: module/motor/CMakeFiles/motor_objects.dir/build.make
.PHONY : motor_objects

# Rule to build all files generated by this target.
module/motor/CMakeFiles/motor_objects.dir/build: motor_objects
.PHONY : module/motor/CMakeFiles/motor_objects.dir/build

module/motor/CMakeFiles/motor_objects.dir/clean:
	cd /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/module/motor && $(CMAKE_COMMAND) -P CMakeFiles/motor_objects.dir/cmake_clean.cmake
.PHONY : module/motor/CMakeFiles/motor_objects.dir/clean

module/motor/CMakeFiles/motor_objects.dir/depend:
	cd /home/erin/Desktop/qt6Upgrade/voldigate/dependencies && $(CMAKE_COMMAND) -E cmake_depends "Unix Makefiles" /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/libwallaby /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/libwallaby/module/motor /home/erin/Desktop/qt6Upgrade/voldigate/dependencies /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/module/motor /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/module/motor/CMakeFiles/motor_objects.dir/DependInfo.cmake --color=$(COLOR)
.PHONY : module/motor/CMakeFiles/motor_objects.dir/depend

