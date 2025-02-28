import { Project } from './projectTypes';
import { InterfaceMode } from './interfaceModes';

export type User = {
  userName: string;
  interfaceMode: InterfaceMode;
  projects: Project[];
};

export const BLANK_USER: User = {userName: '', interfaceMode: InterfaceMode.SIMPLE, projects: []};