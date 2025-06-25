export interface Settings {
  simulationSensorNoise: boolean;
  simulationRealisticSensors: boolean;
  editorAutoComplete: boolean;
  ideEditorDarkMode: boolean;
  consoleLayout: "horizontal" | "vertical";
}

export const DEFAULT_SETTINGS: Settings = {
  simulationSensorNoise: false,
  simulationRealisticSensors: false,
  editorAutoComplete: false,
  ideEditorDarkMode: false,
  consoleLayout: "horizontal",
};