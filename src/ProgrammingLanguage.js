"use strict";
exports.__esModule = true;
var ProgrammingLanguage;
(function (ProgrammingLanguage) {
    ProgrammingLanguage.FILE_EXTENSION = {
        c: 'c',
        cpp: 'cpp',
        python: 'py',
        plaintext: 'txt'
    };
    ProgrammingLanguage.DEFAULT_CODE = {
        c: '#include <stdio.h>\n#include <kipr/wombat.h>\n\nint main()\n{\n  printf("Hello, World!\\n");\n  return 0;\n}\n',
        cpp: '#include <iostream>\n#include <kipr/wombat.hpp>\n\nint main()\n{\n  std::cout << "Hello, World!" << std::endl;\n  return 0;\n}\n',
        python: 'from kipr import *\n\nprint(\'Hello, World!\')',
        plaintext: '*Your User Data Here*'
    };
    ProgrammingLanguage.DEFAULT_HEADER_CODE = '#include <kipr/wombat.h>\n';
    ProgrammingLanguage.DEFAULT_USER_DATA_CODE = '*Your User Data Here*';
})(ProgrammingLanguage || (ProgrammingLanguage = {}));
exports["default"] = ProgrammingLanguage;
