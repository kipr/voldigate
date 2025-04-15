{
  "targets": [
    {
      "target_name": "motor_addon",     
      "sources": [
        "motor/src/motor_c.cpp",        
        "motor/src/motor_p.cpp"         
      ],
      "include_dirs": [
            "motor/include",                  
        "<(module_root_dir)/dependencies/libwallaby/include" 
      ],
      "libraries": [
        "-lwallaby"  
      ],
      "dependencies": [],
      "cflags": ["-std=c++11"],
      "defines": ["NAPI_ENABLE_CPP_EXCEPTIONS"]
    },
    {
      "target_name": "servo_addon",      
      "sources": [
        "servo/src/servo_c.cpp",  
        "servo/src/servo_p.cpp"          
      ],
      "include_dirs": [
        "servo/include",                 
        "<(module_root_dir)/dependencies/libwallaby/include" 
      ],
      "libraries": [
        "-lwallaby"  
      ],
       "dependencies": [],
      "cflags": ["-std=c++11"],
      "defines": ["NAPI_ENABLE_CPP_EXCEPTIONS"]
    }
  ]
}
