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
include module/graphics/CMakeFiles/graphics_objects.dir/depend.make
# Include any dependencies generated by the compiler for this target.
include module/graphics/CMakeFiles/graphics_objects.dir/compiler_depend.make

# Include the progress variables for this target.
include module/graphics/CMakeFiles/graphics_objects.dir/progress.make

# Include the compile flags for this target's objects.
include module/graphics/CMakeFiles/graphics_objects.dir/flags.make

module/graphics/CMakeFiles/graphics_objects.dir/src/graphics.cpp.o: module/graphics/CMakeFiles/graphics_objects.dir/flags.make
module/graphics/CMakeFiles/graphics_objects.dir/src/graphics.cpp.o: libwallaby/module/graphics/src/graphics.cpp
module/graphics/CMakeFiles/graphics_objects.dir/src/graphics.cpp.o: module/graphics/CMakeFiles/graphics_objects.dir/compiler_depend.ts
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green --progress-dir=/home/erin/Desktop/qt6Upgrade/voldigate/dependencies/CMakeFiles --progress-num=$(CMAKE_PROGRESS_1) "Building CXX object module/graphics/CMakeFiles/graphics_objects.dir/src/graphics.cpp.o"
	cd /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/module/graphics && /usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -MD -MT module/graphics/CMakeFiles/graphics_objects.dir/src/graphics.cpp.o -MF CMakeFiles/graphics_objects.dir/src/graphics.cpp.o.d -o CMakeFiles/graphics_objects.dir/src/graphics.cpp.o -c /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/libwallaby/module/graphics/src/graphics.cpp

module/graphics/CMakeFiles/graphics_objects.dir/src/graphics.cpp.i: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Preprocessing CXX source to CMakeFiles/graphics_objects.dir/src/graphics.cpp.i"
	cd /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/module/graphics && /usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -E /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/libwallaby/module/graphics/src/graphics.cpp > CMakeFiles/graphics_objects.dir/src/graphics.cpp.i

module/graphics/CMakeFiles/graphics_objects.dir/src/graphics.cpp.s: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Compiling CXX source to assembly CMakeFiles/graphics_objects.dir/src/graphics.cpp.s"
	cd /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/module/graphics && /usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -S /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/libwallaby/module/graphics/src/graphics.cpp -o CMakeFiles/graphics_objects.dir/src/graphics.cpp.s

module/graphics/CMakeFiles/graphics_objects.dir/src/graphics_characters.cpp.o: module/graphics/CMakeFiles/graphics_objects.dir/flags.make
module/graphics/CMakeFiles/graphics_objects.dir/src/graphics_characters.cpp.o: libwallaby/module/graphics/src/graphics_characters.cpp
module/graphics/CMakeFiles/graphics_objects.dir/src/graphics_characters.cpp.o: module/graphics/CMakeFiles/graphics_objects.dir/compiler_depend.ts
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green --progress-dir=/home/erin/Desktop/qt6Upgrade/voldigate/dependencies/CMakeFiles --progress-num=$(CMAKE_PROGRESS_2) "Building CXX object module/graphics/CMakeFiles/graphics_objects.dir/src/graphics_characters.cpp.o"
	cd /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/module/graphics && /usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -MD -MT module/graphics/CMakeFiles/graphics_objects.dir/src/graphics_characters.cpp.o -MF CMakeFiles/graphics_objects.dir/src/graphics_characters.cpp.o.d -o CMakeFiles/graphics_objects.dir/src/graphics_characters.cpp.o -c /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/libwallaby/module/graphics/src/graphics_characters.cpp

module/graphics/CMakeFiles/graphics_objects.dir/src/graphics_characters.cpp.i: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Preprocessing CXX source to CMakeFiles/graphics_objects.dir/src/graphics_characters.cpp.i"
	cd /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/module/graphics && /usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -E /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/libwallaby/module/graphics/src/graphics_characters.cpp > CMakeFiles/graphics_objects.dir/src/graphics_characters.cpp.i

module/graphics/CMakeFiles/graphics_objects.dir/src/graphics_characters.cpp.s: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Compiling CXX source to assembly CMakeFiles/graphics_objects.dir/src/graphics_characters.cpp.s"
	cd /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/module/graphics && /usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -S /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/libwallaby/module/graphics/src/graphics_characters.cpp -o CMakeFiles/graphics_objects.dir/src/graphics_characters.cpp.s

graphics_objects: module/graphics/CMakeFiles/graphics_objects.dir/src/graphics.cpp.o
graphics_objects: module/graphics/CMakeFiles/graphics_objects.dir/src/graphics_characters.cpp.o
graphics_objects: module/graphics/CMakeFiles/graphics_objects.dir/build.make
.PHONY : graphics_objects

# Rule to build all files generated by this target.
module/graphics/CMakeFiles/graphics_objects.dir/build: graphics_objects
.PHONY : module/graphics/CMakeFiles/graphics_objects.dir/build

module/graphics/CMakeFiles/graphics_objects.dir/clean:
	cd /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/module/graphics && $(CMAKE_COMMAND) -P CMakeFiles/graphics_objects.dir/cmake_clean.cmake
.PHONY : module/graphics/CMakeFiles/graphics_objects.dir/clean

module/graphics/CMakeFiles/graphics_objects.dir/depend:
	cd /home/erin/Desktop/qt6Upgrade/voldigate/dependencies && $(CMAKE_COMMAND) -E cmake_depends "Unix Makefiles" /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/libwallaby /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/libwallaby/module/graphics /home/erin/Desktop/qt6Upgrade/voldigate/dependencies /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/module/graphics /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/module/graphics/CMakeFiles/graphics_objects.dir/DependInfo.cmake --color=$(COLOR)
.PHONY : module/graphics/CMakeFiles/graphics_objects.dir/depend

