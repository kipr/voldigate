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


working_dir = pathlib.Path(__file__).parent.absolute()
path = os.environ['PATH']
env = {
  'PATH': path,

}
libkipr_dir = working_dir / 'libwallaby'


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