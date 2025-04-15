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
        "motor/protected", 
        "core/protected" 

      ],
      "libraries": [
        "-lkipr"  
      ],
      "library_dirs": [
        "/usr/local/lib"
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
        "servo/protected",
        "core/protected" 
      ],
      "libraries": [
        "-lkipr"  
      ],
       "library_dirs": [
        "/usr/local/lib"
      ],
       "dependencies": [],
      "cflags": ["-std=c++11"],
      "defines": ["NAPI_ENABLE_CPP_EXCEPTIONS"]
    }
  ]
}
