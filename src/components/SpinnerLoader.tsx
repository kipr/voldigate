import React from 'react';
import { PuffLoader } from "react-spinners";
import { CSSProperties } from "react";
import { styled } from 'styletron-react';

const override: React.CSSProperties = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
};

const SpinnerContainer = styled('div', {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  width: "100vw",
  backgroundColor: "rgba(255, 255, 255, 0.8)",
});



function SpinnerLoader() {
  return (
    <SpinnerContainer className="sweet-loading">
      <PuffLoader
        color="#ee1c27"
        loading={true}
        cssOverride={override}
        size={200}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </SpinnerContainer>
  );
}
//
export default SpinnerLoader;
