const path = require('path');

const KISS_ROOT = path.resolve('/home/kipr/Documents/KISS');
const USERS_JSON_PATH = safeJoin('users.json');
const CLASSROOMS_DIR = safeJoin('classrooms');
const CLASSROOMS_JSON_PATH = safeJoin('classrooms', 'classrooms.json');

const PROJECT_FOLDERS = new Set(['bin', 'include', 'src', 'data']);

function assertInsideKissRoot(candidatePath) {
  const resolvedPath = path.resolve(candidatePath);
  const relativePath = path.relative(KISS_ROOT, resolvedPath);

  if (
    relativePath === '' ||
    (!relativePath.startsWith('..') && !path.isAbsolute(relativePath))
  ) {
    return resolvedPath;
  }

  throw new Error(`Path escapes KISS root: ${candidatePath}`);
}

function validateName(name, label) {
  if (typeof name !== 'string' || name.trim() === '') {
    throw new Error(`Invalid ${label}`);
  }

  if (name.includes('/') || name.includes('\\') || name === '.' || name === '..') {
    throw new Error(`Invalid ${label}`);
  }

  return name;
}

function safeJoin(...segments) {
  return assertInsideKissRoot(path.join(KISS_ROOT, ...segments));
}

function userDirectory(userName) {
  return safeJoin(validateName(userName, 'user name'));
}

function userConfigPath(userName) {
  return safeJoin(validateName(userName, 'user name'), '.user.config.json');
}

function projectDirectory(userName, projectName) {
  return safeJoin(
    validateName(userName, 'user name'),
    validateName(projectName, 'project name'),
  );
}

function projectConfigPath(userName, projectName) {
  return safeJoin(
    validateName(userName, 'user name'),
    validateName(projectName, 'project name'),
    '.project.config.json',
  );
}

function projectSubdirectory(userName, projectName, folder) {
  if (!PROJECT_FOLDERS.has(folder)) {
    throw new Error(`Invalid project folder: ${folder}`);
  }

  return safeJoin(
    validateName(userName, 'user name'),
    validateName(projectName, 'project name'),
    folder,
  );
}

function projectFilePath(userName, projectName, folder, fileName) {
  if (!PROJECT_FOLDERS.has(folder)) {
    throw new Error(`Invalid project folder: ${folder}`);
  }

  return safeJoin(
    validateName(userName, 'user name'),
    validateName(projectName, 'project name'),
    folder,
    validateName(fileName, 'file name'),
  );
}

function projectBinaryPath(userName, projectName) {
  return projectFilePath(userName, projectName, 'bin', 'botball_user_program');
}

function classroomDirectory(classroomName) {
  return safeJoin('classrooms', validateName(classroomName, 'classroom name'));
}

function resolveClientPath(filePath) {
  if (typeof filePath !== 'string' || filePath.trim() === '') {
    throw new Error('Invalid file path');
  }

  return assertInsideKissRoot(filePath);
}

function parseProjectFilePath(filePath) {
  const resolvedPath = resolveClientPath(filePath);
  const relativePath = path.relative(KISS_ROOT, resolvedPath);
  const parts = relativePath.split(path.sep);
  const [user, project, fileType, fileName, ...rest] = parts;

  if (
    rest.length > 0 ||
    !user ||
    !project ||
    !['include', 'src', 'data'].includes(fileType) ||
    !fileName
  ) {
    throw new Error('Invalid project file path');
  }

  return { resolvedPath, user, project, fileType, fileName };
}

function folderForExtension(extension) {
  switch (extension) {
    case 'h':
      return 'include';
    case 'c':
    case 'cpp':
    case 'py':
    case 'graphical':
      return 'src';
    case 'txt':
      return 'data';
    default:
      throw new Error(`Invalid file type: ${extension}`);
  }
}

module.exports = {
  KISS_ROOT,
  USERS_JSON_PATH,
  CLASSROOMS_DIR,
  CLASSROOMS_JSON_PATH,
  assertInsideKissRoot,
  classroomDirectory,
  folderForExtension,
  parseProjectFilePath,
  projectBinaryPath,
  projectConfigPath,
  projectDirectory,
  projectFilePath,
  projectSubdirectory,
  resolveClientPath,
  safeJoin,
  userConfigPath,
  userDirectory,
  validateName,
};
