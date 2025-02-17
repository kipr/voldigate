export interface Settings {
  simulationSensorNoise: boolean;
  simulationRealisticSensors: boolean;
  editorAutoComplete: boolean;
  ideEditorDarkMode: boolean;
}

export const DEFAULT_SETTINGS: Settings = {
  simulationSensorNoise: false,
  simulationRealisticSensors: false,
  editorAutoComplete: false,
  ideEditorDarkMode: false,
};