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

# Utility rule file for swig_kipr_xml.

# Include any custom commands dependencies for this target.
include binding/xml/CMakeFiles/swig_kipr_xml.dir/compiler_depend.make

# Include the progress variables for this target.
include binding/xml/CMakeFiles/swig_kipr_xml.dir/progress.make

binding/xml/CMakeFiles/swig_kipr_xml:
	cd /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/binding/xml && /usr/bin/swig4.0 -xml -o /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/binding/xml/kipr.xml -I/home/erin/Desktop/qt6Upgrade/voldigate/dependencies/include -I/home/erin/Desktop/qt6Upgrade/voldigate/dependencies/libwallaby/include -I/home/erin/Desktop/qt6Upgrade/voldigate/dependencies/libwallaby -outdir /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/binding/xml -I/home/erin/Desktop/qt6Upgrade/voldigate/dependencies/libwallaby/module/accel/public -I/home/erin/Desktop/qt6Upgrade/voldigate/dependencies/libwallaby/module/analog/public -I/home/erin/Desktop/qt6Upgrade/voldigate/dependencies/libwallaby/module/audio/public -I/home/erin/Desktop/qt6Upgrade/voldigate/dependencies/libwallaby/module/battery/public -I/home/erin/Desktop/qt6Upgrade/voldigate/dependencies/libwallaby/module/botball/public -I/home/erin/Desktop/qt6Upgrade/voldigate/dependencies/libwallaby/module/button/public -I/home/erin/Desktop/qt6Upgrade/voldigate/dependencies/libwallaby/module/color/public -I/home/erin/Desktop/qt6Upgrade/voldigate/dependencies/libwallaby/module/compat/public -I/home/erin/Desktop/qt6Upgrade/voldigate/dependencies/libwallaby/module/compass/public -I/home/erin/Desktop/qt6Upgrade/voldigate/dependencies/libwallaby/module/config/public -I/home/erin/Desktop/qt6Upgrade/voldigate/dependencies/libwallaby/module/console/public -I/home/erin/Desktop/qt6Upgrade/voldigate/dependencies/libwallaby/module/core/public -I/home/erin/Desktop/qt6Upgrade/voldigate/dependencies/libwallaby/module/create/public -I/home/erin/Desktop/qt6Upgrade/voldigate/dependencies/libwallaby/module/digital/public -I/home/erin/Desktop/qt6Upgrade/voldigate/dependencies/libwallaby/module/export/public -I/home/erin/Desktop/qt6Upgrade/voldigate/dependencies/libwallaby/module/geometry/public -I/home/erin/Desktop/qt6Upgrade/voldigate/dependencies/libwallaby/module/graphics/public -I/home/erin/Desktop/qt6Upgrade/voldigate/dependencies/libwallaby/module/gyro/public -I/home/erin/Desktop/qt6Upgrade/voldigate/dependencies/libwallaby/module/log/public -I/home/erin/Desktop/qt6Upgrade/voldigate/dependencies/libwallaby/module/magneto/public -I/home/erin/Desktop/qt6Upgrade/voldigate/dependencies/libwallaby/module/motor/public -I/home/erin/Desktop/qt6Upgrade/voldigate/dependencies/libwallaby/module/network/public -I/home/erin/Desktop/qt6Upgrade/voldigate/dependencies/libwallaby/module/sensor/public -I/home/erin/Desktop/qt6Upgrade/voldigate/dependencies/libwallaby/module/servo/public -I/home/erin/Desktop/qt6Upgrade/voldigate/dependencies/libwallaby/module/thread/public -I/home/erin/Desktop/qt6Upgrade/voldigate/dependencies/libwallaby/module/time/public -I/home/erin/Desktop/qt6Upgrade/voldigate/dependencies/libwallaby/module/wait_for/public /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/libwallaby/binding/kipr.i

swig_kipr_xml: binding/xml/CMakeFiles/swig_kipr_xml
swig_kipr_xml: binding/xml/CMakeFiles/swig_kipr_xml.dir/build.make
.PHONY : swig_kipr_xml

# Rule to build all files generated by this target.
binding/xml/CMakeFiles/swig_kipr_xml.dir/build: swig_kipr_xml
.PHONY : binding/xml/CMakeFiles/swig_kipr_xml.dir/build

binding/xml/CMakeFiles/swig_kipr_xml.dir/clean:
	cd /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/binding/xml && $(CMAKE_COMMAND) -P CMakeFiles/swig_kipr_xml.dir/cmake_clean.cmake
.PHONY : binding/xml/CMakeFiles/swig_kipr_xml.dir/clean

binding/xml/CMakeFiles/swig_kipr_xml.dir/depend:
	cd /home/erin/Desktop/qt6Upgrade/voldigate/dependencies && $(CMAKE_COMMAND) -E cmake_depends "Unix Makefiles" /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/libwallaby /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/libwallaby/binding/xml /home/erin/Desktop/qt6Upgrade/voldigate/dependencies /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/binding/xml /home/erin/Desktop/qt6Upgrade/voldigate/dependencies/binding/xml/CMakeFiles/swig_kipr_xml.dir/DependInfo.cmake --color=$(COLOR)
.PHONY : binding/xml/CMakeFiles/swig_kipr_xml.dir/depend

