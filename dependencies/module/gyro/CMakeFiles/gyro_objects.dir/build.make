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
include module/gyro/CMakeFiles/gyro_objects.dir/depend.make
# Include any dependencies generated by the compiler for this target.
include module/gyro/CMakeFiles/gyro_objects.dir/compiler_depend.make

# Include the progress variables for this target.
include module/gyro/CMakeFiles/gyro_objects.dir/progress.make

# Include the compile flags for this target's objects.
include module/gyro/CMakeFiles/gyro_objects.dir/flags.make

module/gyro/CMakeFiles/gyro_objects.dir/src/gyro.cpp.o: module/gyro/CMakeFiles/gyro_objects.dir/flags.make
module/gyro/CMakeFiles/gyro_objects.dir/src/gyro.cpp.o: libwallaby/module/gyro/src/gyro.cpp
module/gyro/CMakeFiles/gyro_objects.dir/src/gyro.cpp.o: module/gyro/CMakeFiles/gyro_objects.dir/compiler_depend.ts
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green --progress-dir=/home/erin/Desktop/qt6Upgrade/voldigate/dependencies/CMakeFiles --progress-num=$(CMAKE_PROGRESS_1) "Building CXX object module/gyro/CMakeFiles/gyro_objects.dir/src/gyro.cpp.o"
	cd /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/module/gyro && /usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -MD -MT module/gyro/CMakeFiles/gyro_objects.dir/src/gyro.cpp.o -MF CMakeFiles/gyro_objects.dir/src/gyro.cpp.o.d -o CMakeFiles/gyro_objects.dir/src/gyro.cpp.o -c /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/libwallaby/module/gyro/src/gyro.cpp

module/gyro/CMakeFiles/gyro_objects.dir/src/gyro.cpp.i: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Preprocessing CXX source to CMakeFiles/gyro_objects.dir/src/gyro.cpp.i"
	cd /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/module/gyro && /usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -E /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/libwallaby/module/gyro/src/gyro.cpp > CMakeFiles/gyro_objects.dir/src/gyro.cpp.i

module/gyro/CMakeFiles/gyro_objects.dir/src/gyro.cpp.s: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Compiling CXX source to assembly CMakeFiles/gyro_objects.dir/src/gyro.cpp.s"
	cd /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/module/gyro && /usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -S /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/libwallaby/module/gyro/src/gyro.cpp -o CMakeFiles/gyro_objects.dir/src/gyro.cpp.s

module/gyro/CMakeFiles/gyro_objects.dir/src/gyro_c.cpp.o: module/gyro/CMakeFiles/gyro_objects.dir/flags.make
module/gyro/CMakeFiles/gyro_objects.dir/src/gyro_c.cpp.o: libwallaby/module/gyro/src/gyro_c.cpp
module/gyro/CMakeFiles/gyro_objects.dir/src/gyro_c.cpp.o: module/gyro/CMakeFiles/gyro_objects.dir/compiler_depend.ts
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green --progress-dir=/home/erin/Desktop/qt6Upgrade/voldigate/dependencies/CMakeFiles --progress-num=$(CMAKE_PROGRESS_2) "Building CXX object module/gyro/CMakeFiles/gyro_objects.dir/src/gyro_c.cpp.o"
	cd /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/module/gyro && /usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -MD -MT module/gyro/CMakeFiles/gyro_objects.dir/src/gyro_c.cpp.o -MF CMakeFiles/gyro_objects.dir/src/gyro_c.cpp.o.d -o CMakeFiles/gyro_objects.dir/src/gyro_c.cpp.o -c /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/libwallaby/module/gyro/src/gyro_c.cpp

module/gyro/CMakeFiles/gyro_objects.dir/src/gyro_c.cpp.i: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Preprocessing CXX source to CMakeFiles/gyro_objects.dir/src/gyro_c.cpp.i"
	cd /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/module/gyro && /usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -E /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/libwallaby/module/gyro/src/gyro_c.cpp > CMakeFiles/gyro_objects.dir/src/gyro_c.cpp.i

module/gyro/CMakeFiles/gyro_objects.dir/src/gyro_c.cpp.s: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Compiling CXX source to assembly CMakeFiles/gyro_objects.dir/src/gyro_c.cpp.s"
	cd /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/module/gyro && /usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -S /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/libwallaby/module/gyro/src/gyro_c.cpp -o CMakeFiles/gyro_objects.dir/src/gyro_c.cpp.s

module/gyro/CMakeFiles/gyro_objects.dir/src/gyro_p.cpp.o: module/gyro/CMakeFiles/gyro_objects.dir/flags.make
module/gyro/CMakeFiles/gyro_objects.dir/src/gyro_p.cpp.o: libwallaby/module/gyro/src/gyro_p.cpp
module/gyro/CMakeFiles/gyro_objects.dir/src/gyro_p.cpp.o: module/gyro/CMakeFiles/gyro_objects.dir/compiler_depend.ts
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green --progress-dir=/home/erin/Desktop/qt6Upgrade/voldigate/dependencies/CMakeFiles --progress-num=$(CMAKE_PROGRESS_3) "Building CXX object module/gyro/CMakeFiles/gyro_objects.dir/src/gyro_p.cpp.o"
	cd /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/module/gyro && /usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -MD -MT module/gyro/CMakeFiles/gyro_objects.dir/src/gyro_p.cpp.o -MF CMakeFiles/gyro_objects.dir/src/gyro_p.cpp.o.d -o CMakeFiles/gyro_objects.dir/src/gyro_p.cpp.o -c /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/libwallaby/module/gyro/src/gyro_p.cpp

module/gyro/CMakeFiles/gyro_objects.dir/src/gyro_p.cpp.i: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Preprocessing CXX source to CMakeFiles/gyro_objects.dir/src/gyro_p.cpp.i"
	cd /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/module/gyro && /usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -E /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/libwallaby/module/gyro/src/gyro_p.cpp > CMakeFiles/gyro_objects.dir/src/gyro_p.cpp.i

module/gyro/CMakeFiles/gyro_objects.dir/src/gyro_p.cpp.s: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Compiling CXX source to assembly CMakeFiles/gyro_objects.dir/src/gyro_p.cpp.s"
	cd /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/module/gyro && /usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -S /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/libwallaby/module/gyro/src/gyro_p.cpp -o CMakeFiles/gyro_objects.dir/src/gyro_p.cpp.s

gyro_objects: module/gyro/CMakeFiles/gyro_objects.dir/src/gyro.cpp.o
gyro_objects: module/gyro/CMakeFiles/gyro_objects.dir/src/gyro_c.cpp.o
gyro_objects: module/gyro/CMakeFiles/gyro_objects.dir/src/gyro_p.cpp.o
gyro_objects: module/gyro/CMakeFiles/gyro_objects.dir/build.make
.PHONY : gyro_objects

# Rule to build all files generated by this target.
module/gyro/CMakeFiles/gyro_objects.dir/build: gyro_objects
.PHONY : module/gyro/CMakeFiles/gyro_objects.dir/build

module/gyro/CMakeFiles/gyro_objects.dir/clean:
	cd /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/module/gyro && $(CMAKE_COMMAND) -P CMakeFiles/gyro_objects.dir/cmake_clean.cmake
.PHONY : module/gyro/CMakeFiles/gyro_objects.dir/clean

module/gyro/CMakeFiles/gyro_objects.dir/depend:
	cd /home/erin/Desktop/qt6Upgrade/voldigate/dependencies && $(CMAKE_COMMAND) -E cmake_depends "Unix Makefiles" /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/libwallaby /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/libwallaby/module/gyro /home/erin/Desktop/qt6Upgrade/voldigate/dependencies /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/module/gyro /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/module/gyro/CMakeFiles/gyro_objects.dir/DependInfo.cmake --color=$(COLOR)
.PHONY : module/gyro/CMakeFiles/gyro_objects.dir/depend
