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
include module/accel/CMakeFiles/accel_objects.dir/depend.make
# Include any dependencies generated by the compiler for this target.
include module/accel/CMakeFiles/accel_objects.dir/compiler_depend.make

# Include the progress variables for this target.
include module/accel/CMakeFiles/accel_objects.dir/progress.make

# Include the compile flags for this target's objects.
include module/accel/CMakeFiles/accel_objects.dir/flags.make

module/accel/CMakeFiles/accel_objects.dir/src/accel.cpp.o: module/accel/CMakeFiles/accel_objects.dir/flags.make
module/accel/CMakeFiles/accel_objects.dir/src/accel.cpp.o: libwallaby/module/accel/src/accel.cpp
module/accel/CMakeFiles/accel_objects.dir/src/accel.cpp.o: module/accel/CMakeFiles/accel_objects.dir/compiler_depend.ts
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green --progress-dir=/home/erin/Desktop/qt6Upgrade/voldigate/dependencies/CMakeFiles --progress-num=$(CMAKE_PROGRESS_1) "Building CXX object module/accel/CMakeFiles/accel_objects.dir/src/accel.cpp.o"
	cd /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/module/accel && /usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -MD -MT module/accel/CMakeFiles/accel_objects.dir/src/accel.cpp.o -MF CMakeFiles/accel_objects.dir/src/accel.cpp.o.d -o CMakeFiles/accel_objects.dir/src/accel.cpp.o -c /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/libwallaby/module/accel/src/accel.cpp

module/accel/CMakeFiles/accel_objects.dir/src/accel.cpp.i: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Preprocessing CXX source to CMakeFiles/accel_objects.dir/src/accel.cpp.i"
	cd /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/module/accel && /usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -E /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/libwallaby/module/accel/src/accel.cpp > CMakeFiles/accel_objects.dir/src/accel.cpp.i

module/accel/CMakeFiles/accel_objects.dir/src/accel.cpp.s: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Compiling CXX source to assembly CMakeFiles/accel_objects.dir/src/accel.cpp.s"
	cd /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/module/accel && /usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -S /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/libwallaby/module/accel/src/accel.cpp -o CMakeFiles/accel_objects.dir/src/accel.cpp.s

module/accel/CMakeFiles/accel_objects.dir/src/accel_c.cpp.o: module/accel/CMakeFiles/accel_objects.dir/flags.make
module/accel/CMakeFiles/accel_objects.dir/src/accel_c.cpp.o: libwallaby/module/accel/src/accel_c.cpp
module/accel/CMakeFiles/accel_objects.dir/src/accel_c.cpp.o: module/accel/CMakeFiles/accel_objects.dir/compiler_depend.ts
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green --progress-dir=/home/erin/Desktop/qt6Upgrade/voldigate/dependencies/CMakeFiles --progress-num=$(CMAKE_PROGRESS_2) "Building CXX object module/accel/CMakeFiles/accel_objects.dir/src/accel_c.cpp.o"
	cd /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/module/accel && /usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -MD -MT module/accel/CMakeFiles/accel_objects.dir/src/accel_c.cpp.o -MF CMakeFiles/accel_objects.dir/src/accel_c.cpp.o.d -o CMakeFiles/accel_objects.dir/src/accel_c.cpp.o -c /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/libwallaby/module/accel/src/accel_c.cpp

module/accel/CMakeFiles/accel_objects.dir/src/accel_c.cpp.i: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Preprocessing CXX source to CMakeFiles/accel_objects.dir/src/accel_c.cpp.i"
	cd /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/module/accel && /usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -E /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/libwallaby/module/accel/src/accel_c.cpp > CMakeFiles/accel_objects.dir/src/accel_c.cpp.i

module/accel/CMakeFiles/accel_objects.dir/src/accel_c.cpp.s: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Compiling CXX source to assembly CMakeFiles/accel_objects.dir/src/accel_c.cpp.s"
	cd /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/module/accel && /usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -S /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/libwallaby/module/accel/src/accel_c.cpp -o CMakeFiles/accel_objects.dir/src/accel_c.cpp.s

module/accel/CMakeFiles/accel_objects.dir/src/accel_p.cpp.o: module/accel/CMakeFiles/accel_objects.dir/flags.make
module/accel/CMakeFiles/accel_objects.dir/src/accel_p.cpp.o: libwallaby/module/accel/src/accel_p.cpp
module/accel/CMakeFiles/accel_objects.dir/src/accel_p.cpp.o: module/accel/CMakeFiles/accel_objects.dir/compiler_depend.ts
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green --progress-dir=/home/erin/Desktop/qt6Upgrade/voldigate/dependencies/CMakeFiles --progress-num=$(CMAKE_PROGRESS_3) "Building CXX object module/accel/CMakeFiles/accel_objects.dir/src/accel_p.cpp.o"
	cd /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/module/accel && /usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -MD -MT module/accel/CMakeFiles/accel_objects.dir/src/accel_p.cpp.o -MF CMakeFiles/accel_objects.dir/src/accel_p.cpp.o.d -o CMakeFiles/accel_objects.dir/src/accel_p.cpp.o -c /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/libwallaby/module/accel/src/accel_p.cpp

module/accel/CMakeFiles/accel_objects.dir/src/accel_p.cpp.i: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Preprocessing CXX source to CMakeFiles/accel_objects.dir/src/accel_p.cpp.i"
	cd /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/module/accel && /usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -E /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/libwallaby/module/accel/src/accel_p.cpp > CMakeFiles/accel_objects.dir/src/accel_p.cpp.i

module/accel/CMakeFiles/accel_objects.dir/src/accel_p.cpp.s: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Compiling CXX source to assembly CMakeFiles/accel_objects.dir/src/accel_p.cpp.s"
	cd /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/module/accel && /usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -S /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/libwallaby/module/accel/src/accel_p.cpp -o CMakeFiles/accel_objects.dir/src/accel_p.cpp.s

accel_objects: module/accel/CMakeFiles/accel_objects.dir/src/accel.cpp.o
accel_objects: module/accel/CMakeFiles/accel_objects.dir/src/accel_c.cpp.o
accel_objects: module/accel/CMakeFiles/accel_objects.dir/src/accel_p.cpp.o
accel_objects: module/accel/CMakeFiles/accel_objects.dir/build.make
.PHONY : accel_objects

# Rule to build all files generated by this target.
module/accel/CMakeFiles/accel_objects.dir/build: accel_objects
.PHONY : module/accel/CMakeFiles/accel_objects.dir/build

module/accel/CMakeFiles/accel_objects.dir/clean:
	cd /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/module/accel && $(CMAKE_COMMAND) -P CMakeFiles/accel_objects.dir/cmake_clean.cmake
.PHONY : module/accel/CMakeFiles/accel_objects.dir/clean

module/accel/CMakeFiles/accel_objects.dir/depend:
	cd /home/erin/Desktop/qt6Upgrade/voldigate/dependencies && $(CMAKE_COMMAND) -E cmake_depends "Unix Makefiles" /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/libwallaby /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/libwallaby/module/accel /home/erin/Desktop/qt6Upgrade/voldigate/dependencies /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/module/accel /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/module/accel/CMakeFiles/accel_objects.dir/DependInfo.cmake --color=$(COLOR)
.PHONY : module/accel/CMakeFiles/accel_objects.dir/depend

