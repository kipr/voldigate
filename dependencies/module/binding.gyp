{
  "targets": [
    {
      "target_name": "motor_addon",     
      "sources": [
        "motor/src/motor_c.cpp",        
        "motor/src/motor_p.cpp"         
      ],
      "include_dirs": [
        "<!(node -e \"require('nan')\")", 
        "motor/include",                  
        "<(module_root_dir)/dependencies/libwallaby/include" 
      ],
      "libraries": [
        "-lwallaby"  
      ],
      "dependencies": [
        "<!(node -e \"require('nan')\")"
      ]
    },
    {
      "target_name": "servo_addon",      
      "sources": [
        "servo/src/servo_c.cpp",  
        "servo/src/servo_p.cpp"          
      ],
      "include_dirs": [
        "<!(node -e \"require('nan')\")",
        "servo/include",                 
        "<(module_root_dir)/dependencies/libwallaby/include" 
      ],
      "libraries": [
        "-lwallaby"  
      ],
      "dependencies": [
        "<!(node -e \"require('nan')\")" 
      ]
    }
  ]
}
