#!/usr/bin/python3

import os
import subprocess
import pathlib
import json
import multiprocessing

def is_tool(name):
  """Check whether `name` is on PATH and marked as executable."""
  from shutil import which
  return which(name) is not None


# Sanity checks
if not is_tool('cmake'):
  print('CMake is not installed. Please install CMake and try again.')
  exit(1)

if not is_tool('make'):
  print('Make is not installed. Please install Make and try again.')
  exit(1)

if not is_tool('swig'):
  print('SWIG is not installed. Please install SWIG and try again.')
  exit(1)

if not is_tool('doxygen'):
  print('Doxygen is not installed. Please install Doxygen and try again.')
  exit(1)

working_dir = pathlib.Path(__file__).parent.absolute()
path = os.environ['PATH']
env = {
  'PATH': path,

}

libkipr_dir = working_dir / 'libwallaby'

# libkipr (C)

print('Configuring libkipr (C)...')

libkipr_build_c_dir = working_dir / 'libkipr_voldigate/libkipr_build_c'
libkipr_install_c_dir = working_dir / 'libkipr_voldigate/libkipr_install_c'
os.makedirs(libkipr_build_c_dir, exist_ok=True)

subprocess.run(
  [
    'cmake',
    '-Dwith_camera=OFF',
    '-Dwith_tello=OFF',
    '-Dwith_python_binding=ON',
    '-Dwith_documentation=ON',
    '-Dwith_tests=OFF',
    '-DBUILD_SHARED_LIBS=OFF',  # Ensure static libraries are built
    f'-DCMAKE_INSTALL_PREFIX={libkipr_install_c_dir}',
    libkipr_dir  # Path to the source directory
  ],
  cwd = libkipr_build_c_dir,
  check = True
)

print('Building libkipr (C)...')
subprocess.run(
  [ 'make', f'-j{multiprocessing.cpu_count()}' ],
  cwd = libkipr_build_c_dir,
  check = True
)

print('Installing libkipr (C)...')
subprocess.run(
  [ 'make', 'install' ],
  cwd = libkipr_build_c_dir,
  check = True
)

static_lib_path = libkipr_install_c_dir/ 'lib' / 'libkipr.a'
if static_lib_path.exists():
    print(f'Successfully built static library: {static_lib_path}')
else:
    print('Static library not found. Please check the build configuration and output.')



# CPython

cpython_dir = working_dir / 'cpython'

print('Applying cpython patches...')
for patch_file in (working_dir / 'cpython_patches').glob('*.patch'):
    print('Applying patch:', patch_file)
    with open(patch_file) as patch:
        subprocess.run(
            ['patch', '-p0', '--forward'],
            stdin = patch,
            cwd = working_dir
        )

print('Finding latest host python...')

python = 'python3'
if is_tool('python3.12'):
    python = 'python3.12'
elif is_tool('python3.11'):
    python = 'python3.11'
elif is_tool('python3.10'):
    python = 'python3.10'
elif is_tool('python3.9'):
    python = 'python3.9'
elif is_tool('python3.8'):
    python = 'python3.8'
elif is_tool('python3.7'):
    python = 'python3.7'
else:
    print('Warning: Python 3.7+ could not be found. Using python3. This might not work.')

print(f'Configuring cpython with {python}...')
subprocess.run(
  ['./configure'],  # Adjusted for standard build script
  cwd = cpython_dir,
  env = os.environ,
  check = True
)


print(f'Building CPython...')
subprocess.run(
  ['make', f'-j{multiprocessing.cpu_count()}'],
  cwd=cpython_dir,
  check=True
)


# libkipr (Python)

print('Configuring libkipr (Python)...')
libkipr_build_python_dir = working_dir / 'libkipr_voldigate/libkipr_build_python'
os.makedirs(libkipr_build_python_dir, exist_ok=True)

# Find 

subprocess.run(
  [
    'cmake',
    '-Dwith_camera=OFF',
    '-Dwith_tello=OFF',
      '-Dwith_python_binding=ON',
    '-Dwith_documentation=OFF',
    '-Dwith_tests=OFF',
    '-Dwasm=OFF',
    libkipr_dir
  ],
  cwd = libkipr_build_python_dir,
  check = True,
  env = env
)

print('Building libkipr (Python)...')
subprocess.run(
  [ 'make', f'-j{multiprocessing.cpu_count()}' ],
  cwd = libkipr_build_python_dir,
  check = True
)

print('Building kipr-scratch...')
kipr_scratch_path = working_dir / 'kipr-scratch'
subprocess.run(
  [ python, kipr_scratch_path / 'build.py' ],
  cwd = kipr_scratch_path,
  check = True
)

print('Packaging kipr-scratch...')
subprocess.run(
  [ python, kipr_scratch_path / 'package.py' ],
  cwd = kipr_scratch_path,
  check = True
)

print('Generating scratch runtime...')
scratch_runtime_path = working_dir / 'scratch-rt'
# emcc -s WASM=0 -s INVOKE_RUN=0 -s ASYNCIFY -s EXIT_RUNTIME=1 -s "EXPORTED_FUNCTIONS=['_main', '_simMainWrapper']" -I${config.server.dependencies.libkipr_c}/include -Wl,--whole-archive -L${config.server.dependencies.libkipr_c}/lib -lkipr -o ${path}.js ${path}
subprocess.run([
    'gcc',
    '-o', f'{scratch_runtime_path}',
    f'{scratch_runtime_path}.c',
    f'-I{libkipr_install_c_dir}/include',
    f'-L{libkipr_install_c_dir}/lib',
    '-lkipr'
], env=env, check=True)


print('Outputting results...')
output = json.dumps({

  'libkipr_c': f'{libkipr_install_c_dir}',
  'libkipr_python': f'{libkipr_build_python_dir}',
  'scratch_rt': f'{scratch_runtime_path}.js',
  # 'cpython': f'{cpython_emscripten_build_dir}',
  #"libkipr_c_documentation": libkipr_c_documentation_json,
})

with open(working_dir / 'dependencies.json', 'w') as f:
  f.write(output)