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
include module/geometry/CMakeFiles/geometry_objects.dir/depend.make
# Include any dependencies generated by the compiler for this target.
include module/geometry/CMakeFiles/geometry_objects.dir/compiler_depend.make

# Include the progress variables for this target.
include module/geometry/CMakeFiles/geometry_objects.dir/progress.make

# Include the compile flags for this target's objects.
include module/geometry/CMakeFiles/geometry_objects.dir/flags.make

module/geometry/CMakeFiles/geometry_objects.dir/src/geometry_c.cpp.o: module/geometry/CMakeFiles/geometry_objects.dir/flags.make
module/geometry/CMakeFiles/geometry_objects.dir/src/geometry_c.cpp.o: libwallaby/module/geometry/src/geometry_c.cpp
module/geometry/CMakeFiles/geometry_objects.dir/src/geometry_c.cpp.o: module/geometry/CMakeFiles/geometry_objects.dir/compiler_depend.ts
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green --progress-dir=/home/erin/Desktop/qt6Upgrade/voldigate/dependencies/CMakeFiles --progress-num=$(CMAKE_PROGRESS_1) "Building CXX object module/geometry/CMakeFiles/geometry_objects.dir/src/geometry_c.cpp.o"
	cd /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/module/geometry && /usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -MD -MT module/geometry/CMakeFiles/geometry_objects.dir/src/geometry_c.cpp.o -MF CMakeFiles/geometry_objects.dir/src/geometry_c.cpp.o.d -o CMakeFiles/geometry_objects.dir/src/geometry_c.cpp.o -c /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/libwallaby/module/geometry/src/geometry_c.cpp

module/geometry/CMakeFiles/geometry_objects.dir/src/geometry_c.cpp.i: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Preprocessing CXX source to CMakeFiles/geometry_objects.dir/src/geometry_c.cpp.i"
	cd /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/module/geometry && /usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -E /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/libwallaby/module/geometry/src/geometry_c.cpp > CMakeFiles/geometry_objects.dir/src/geometry_c.cpp.i

module/geometry/CMakeFiles/geometry_objects.dir/src/geometry_c.cpp.s: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Compiling CXX source to assembly CMakeFiles/geometry_objects.dir/src/geometry_c.cpp.s"
	cd /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/module/geometry && /usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -S /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/libwallaby/module/geometry/src/geometry_c.cpp -o CMakeFiles/geometry_objects.dir/src/geometry_c.cpp.s

geometry_objects: module/geometry/CMakeFiles/geometry_objects.dir/src/geometry_c.cpp.o
geometry_objects: module/geometry/CMakeFiles/geometry_objects.dir/build.make
.PHONY : geometry_objects

# Rule to build all files generated by this target.
module/geometry/CMakeFiles/geometry_objects.dir/build: geometry_objects
.PHONY : module/geometry/CMakeFiles/geometry_objects.dir/build

module/geometry/CMakeFiles/geometry_objects.dir/clean:
	cd /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/module/geometry && $(CMAKE_COMMAND) -P CMakeFiles/geometry_objects.dir/cmake_clean.cmake
.PHONY : module/geometry/CMakeFiles/geometry_objects.dir/clean

module/geometry/CMakeFiles/geometry_objects.dir/depend:
	cd /home/erin/Desktop/qt6Upgrade/voldigate/dependencies && $(CMAKE_COMMAND) -E cmake_depends "Unix Makefiles" /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/libwallaby /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/libwallaby/module/geometry /home/erin/Desktop/qt6Upgrade/voldigate/dependencies /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/module/geometry /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/module/geometry/CMakeFiles/geometry_objects.dir/DependInfo.cmake --color=$(COLOR)
.PHONY : module/geometry/CMakeFiles/geometry_objects.dir/depend

