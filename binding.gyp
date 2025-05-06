{
  "targets": [
    {
      "target_name": "motor_addon",
      "sources": [
	      "dependencies/libwallaby/module/motor/src/motor_addon.cpp",
        "dependencies/libwallaby/module/motor/src/motor_c.cpp",
	      "dependencies/libwallaby/module/motor/src/motor_p.cpp"
      ],
      "include_dirs": [
	      "<!(node -p \"require('node-addon-api').include_dir\")",

	      "dependencies/libwallaby/module/motor/src",
        "dependencies/libwallaby/module/motor/protected",
	      "dependencies/libwallaby/module/core/protected"
      ],
      "dependencies": [
        "<!(node -p \"require('node-addon-api').gyp\")"
      ],
      "libraries": [
        "-L/usr/lib",
        "-lkipr"
      ],
      "cflags!": [
        "-fno-exceptions",
	      "-D__EXCEPTIONS",
	      "-frtti"
      ],
      "cflags_cc!" : ['-fno-exceptions'],
      "cxxflags": [
        "-fexceptions",
        "-std=c++17",
	      "-D__EXCEPTIONS",
	      "-frtti"
      ],
      "ldflags": [
	      "-fexceptions"
      ],       
      "defines": [ "NAPI_CPP_EXCEPTIONS" ]
    },
    {
      "target_name": "servo_addon",
      "sources": [
	      "dependencies/libwallaby/module/servo/src/servo_addon.cpp",
        "dependencies/libwallaby/module/servo/src/servo_c.cpp",
	      "dependencies/libwallaby/module/servo/src/servo_p.cpp"
      ],
      "include_dirs": [
	      "<!(node -p \"require('node-addon-api').include_dir\")",

	      "dependencies/libwallaby/module/servo/src",
        "dependencies/libwallaby/module/servo/protected",
	      "dependencies/libwallaby/module/core/protected"
      ],
      "dependencies": [
        "<!(node -p \"require('node-addon-api').gyp\")"
      ],
      "libraries": [
        "-L/usr/lib",
        "-lkipr"
      ],
      "cflags!": [
        "-fno-exceptions",
	      "-D__EXCEPTIONS",
	      "-frtti"
      ],
      "cflags_cc!" : ['-fno-exceptions'],
      "cxxflags": [
        "-fexceptions",
        "-std=c++17",
	      "-D__EXCEPTIONS",
	      "-frtti"
      ],
      "ldflags": [
	      "-fexceptions"
      ],       
      "defines": [ "NAPI_CPP_EXCEPTIONS" ]
    },
    {
      "target_name": "analog_addon",
      "sources": [
	      "dependencies/libwallaby/module/analog/src/analog_addon.cpp",
        "dependencies/libwallaby/module/analog/src/analog_c.cpp",
	      "dependencies/libwallaby/module/analog/src/analog_p.cpp"
      ],
      "include_dirs": [
	      "<!(node -p \"require('node-addon-api').include_dir\")",

	      "dependencies/libwallaby/module/analog/src",
        "dependencies/libwallaby/module/analog/protected",
	      "dependencies/libwallaby/module/core/protected"
      ],
      "dependencies": [
        "<!(node -p \"require('node-addon-api').gyp\")"
      ],
      "libraries": [
        "-L/usr/lib",
        "-lkipr"
      ],
      "cflags!": [
        "-fno-exceptions",
	      "-D__EXCEPTIONS",
	      "-frtti"
      ],
      "cflags_cc!" : ['-fno-exceptions'],
      "cxxflags": [
        "-fexceptions",
        "-std=c++17",
	      "-D__EXCEPTIONS",
	      "-frtti"
      ],
      "ldflags": [
	      "-fexceptions"
      ],       
      "defines": [ "NAPI_CPP_EXCEPTIONS" ]
    },
    {
      "target_name": "digital_addon",
      "sources": [
	      "dependencies/libwallaby/module/digital/src/digital_addon.cpp",
        "dependencies/libwallaby/module/digital/src/digital_c.cpp",
	      "dependencies/libwallaby/module/digital/src/digital_p.cpp"
      ],
      "include_dirs": [
	      "<!(node -p \"require('node-addon-api').include_dir\")",

	      "dependencies/libwallaby/module/digital/src",
        "dependencies/libwallaby/module/digital/protected",
	      "dependencies/libwallaby/module/core/protected"
      ],
      "dependencies": [
        "<!(node -p \"require('node-addon-api').gyp\")"
      ],
      "libraries": [
        "-L/usr/lib",
        "-lkipr"
      ],
      "cflags!": [
        "-fno-exceptions",
	      "-D__EXCEPTIONS",
	      "-frtti"
      ],
      "cflags_cc!" : ['-fno-exceptions'],
      "cxxflags": [
        "-fexceptions",
        "-std=c++17",
	      "-D__EXCEPTIONS",
	      "-frtti"
      ],
      "ldflags": [
	      "-fexceptions"
      ],       
      "defines": [ "NAPI_CPP_EXCEPTIONS" ]
    },
    {
      "target_name": "accel_addon",
      "sources": [
	      "dependencies/libwallaby/module/accel/src/accel_addon.cpp",
        "dependencies/libwallaby/module/accel/src/accel_c.cpp",
	      "dependencies/libwallaby/module/accel/src/accel_p.cpp"
      ],
      "include_dirs": [
	      "<!(node -p \"require('node-addon-api').include_dir\")",

	      "dependencies/libwallaby/module/accel/src",
        "dependencies/libwallaby/module/accel/protected",
	      "dependencies/libwallaby/module/core/protected"
      ],
      "dependencies": [
        "<!(node -p \"require('node-addon-api').gyp\")"
      ],
      "libraries": [
        "-L/usr/lib",
        "-lkipr"
      ],
      "cflags!": [
        "-fno-exceptions",
	      "-D__EXCEPTIONS",
	      "-frtti"
      ],
      "cflags_cc!" : ['-fno-exceptions'],
      "cxxflags": [
        "-fexceptions",
        "-std=c++17",
	      "-D__EXCEPTIONS",
	      "-frtti"
      ],
      "ldflags": [
	      "-fexceptions"
      ],       
      "defines": [ "NAPI_CPP_EXCEPTIONS" ]
    },
     {
      "target_name": "gyro_addon",
      "sources": [
	      "dependencies/libwallaby/module/gyro/src/gyro_addon.cpp",
        "dependencies/libwallaby/module/gyro/src/gyro_c.cpp",
	      "dependencies/libwallaby/module/gyro/src/gyro_p.cpp"
      ],
      "include_dirs": [
	      "<!(node -p \"require('node-addon-api').include_dir\")",

	      "dependencies/libwallaby/module/gyro/src",
        "dependencies/libwallaby/module/gyro/protected",
	      "dependencies/libwallaby/module/core/protected"
      ],
      "dependencies": [
        "<!(node -p \"require('node-addon-api').gyp\")"
      ],
      "libraries": [
        "-L/usr/lib",
        "-lkipr"
      ],
      "cflags!": [
        "-fno-exceptions",
	      "-D__EXCEPTIONS",
	      "-frtti"
      ],
      "cflags_cc!" : ['-fno-exceptions'],
      "cxxflags": [
        "-fexceptions",
        "-std=c++17",
	      "-D__EXCEPTIONS",
	      "-frtti"
      ],
      "ldflags": [
	      "-fexceptions"
      ],       
      "defines": [ "NAPI_CPP_EXCEPTIONS" ]
    },
    {
      "target_name": "magneto_addon",
      "sources": [
	      "dependencies/libwallaby/module/magneto/src/magneto_addon.cpp",
        "dependencies/libwallaby/module/magneto/src/magneto_c.cpp",
	      "dependencies/libwallaby/module/magneto/src/magneto_p.cpp"
      ],
      "include_dirs": [
	      "<!(node -p \"require('node-addon-api').include_dir\")",

	      "dependencies/libwallaby/module/magneto/src",
        "dependencies/libwallaby/module/magneto/protected",
	      "dependencies/libwallaby/module/core/protected"
      ],
      "dependencies": [
        "<!(node -p \"require('node-addon-api').gyp\")"
      ],
      "libraries": [
        "-L/usr/lib",
        "-lkipr"
      ],
      "cflags!": [
        "-fno-exceptions",
	      "-D__EXCEPTIONS",
	      "-frtti"
      ],
      "cflags_cc!" : ['-fno-exceptions'],
      "cxxflags": [
        "-fexceptions",
        "-std=c++17",
	      "-D__EXCEPTIONS",
	      "-frtti"
      ],
      "ldflags": [
	      "-fexceptions"
      ],       
      "defines": [ "NAPI_CPP_EXCEPTIONS" ]
    },
    {
      "target_name": "button_addon",
      "sources": [
	      "dependencies/libwallaby/module/button/src/button_addon.cpp",
        "dependencies/libwallaby/module/button/src/button_c.cpp",
	      "dependencies/libwallaby/module/button/src/button_p.cpp"
      ],
      "include_dirs": [
	      "<!(node -p \"require('node-addon-api').include_dir\")",

	      "dependencies/libwallaby/module/button/src",
        "dependencies/libwallaby/module/button/protected",
	      "dependencies/libwallaby/module/core/protected"
      ],
      "dependencies": [
        "<!(node -p \"require('node-addon-api').gyp\")"
      ],
      "libraries": [
        "-L/usr/lib",
        "-lkipr"
      ],
      "cflags!": [
        "-fno-exceptions",
	      "-D__EXCEPTIONS",
	      "-frtti"
      ],
      "cflags_cc!" : ['-fno-exceptions'],
      "cxxflags": [
        "-fexceptions",
        "-std=c++17",
	      "-D__EXCEPTIONS",
	      "-frtti"
      ],
      "ldflags": [
	      "-fexceptions"
      ],       
      "defines": [ "NAPI_CPP_EXCEPTIONS" ]
    } 
     
    
  ]
}
