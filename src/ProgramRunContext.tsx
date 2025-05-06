import * as React from 'react';

interface ProgramRunContextType {
  isRunning: boolean;
  setIsRunning: (running: boolean) => void;
}

const ProgramRunContext = React.createContext<ProgramRunContextType>({
  isRunning: false,
  setIsRunning: () => {},
});

export let programRunContextHelper: ProgramRunContextType = {
  isRunning: false,
  setIsRunning: () => {}
};

export const ProgramRunProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isRunning, setIsRunning] = React.useState(false);

  React.useEffect(() => {
    console.log("isRunning changed to:", isRunning);
  }, [isRunning]);

  programRunContextHelper = {
    isRunning,
    setIsRunning,
  };

  return (
    <ProgramRunContext.Provider value={{ isRunning, setIsRunning }}>
      {children}
    </ProgramRunContext.Provider>
  );
};

export const useProgramRun = () => React.useContext(ProgramRunContext);
