import { Project } from './projectTypes';
import { InterfaceMode } from './interfaceModes';
import Classroom from './classroomTypes';

export type User = {
  userName: string;
  interfaceMode: InterfaceMode;
  projects: Project[];
  classroomName?: string; 
};

export const BLANK_USER: User = {userName: '', interfaceMode: InterfaceMode.SIMPLE, projects: [], classroomName: ''};