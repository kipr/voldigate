import ProgrammingLanguage from '../ProgrammingLanguage';

export type Project = {
  projectName: string;
  binFolderFiles: string[];
  includeFolderFiles: string[];
  srcFolderFiles: string[];
  dataFolderFiles: string[];
  projectLanguage: ProgrammingLanguage;
};