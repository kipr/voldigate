interface ResizeState {
  isVertical: boolean,
  resizing: boolean,
  refs?: [React.MutableRefObject<HTMLDivElement>, React.MutableRefObject<HTMLDivElement>],
  grows?: number[],
  minSizes: number[],
  scaledMinSizes?: number[],
  startGrows?: number[],
  startPos?: number,
}

export enum Actions {
  MouseDown,
  MouseUp,
  MouseMove,
  SetSizes,
}
interface ResizeAction {
  actionType: Actions,
  x?: number,
  y?: number,
  sizes?: number[],
}
export function resizeOnPointerMove(state: ResizeState, action: ResizeAction): ResizeState {
  const { isVertical, refs, minSizes, scaledMinSizes, grows, startGrows, startPos, resizing } = state;
  const { actionType, x, y, sizes } = action;
  const pos = (isVertical) ? x : y;

  // stop the resize on mouseup
  // if it's a touch event, we won't have an actual position here, so quit before we do that
  if (actionType === Actions.MouseUp) {
    return { 
      ...state, 
      resizing: false
    };
  }

  // check that our refs are loaded
  if (refs[0].current === null || refs[1].current === null) return state;

  // get the current size of each panel
  const currSizes = refs.map((ref) => (isVertical ? ref.current.offsetWidth : ref.current.offsetHeight));
  const sumSize = currSizes[0] + currSizes[1];
  const sumGrow = grows[0] + grows[1];
  
  if (actionType === Actions.SetSizes && sizes) {
    return { ...state, grows: action.sizes };  // Set sizes based on passed `sizes` prop
  }

  // When we start our resize, store the size of each element and the mouse
  if (actionType === Actions.MouseDown) {
    // scale the min sizes
    const scaledMinSizes = minSizes.map(x => sumGrow * x / sumSize);
    return {
      ...state,
      startGrows: grows,
      startPos: pos,
      resizing: true,
      scaledMinSizes: scaledMinSizes,
    };
  }
  if (!resizing) return state;

  // resizing!
  
  // resize the panels, respecting their mininmum sizes

  const diff = pos - startPos;
  // scale the diff, since flex units != size units
  let currGrows = [sumGrow * (diff / sumSize),  sumGrow * (-diff / sumSize)];
  // add to grows
  currGrows = [startGrows[0] + currGrows[0], startGrows[1] + currGrows[1]];
  // respect minimum sizes
  if (currGrows[0] < scaledMinSizes[0]) {
    currGrows[1] += currGrows[0] - scaledMinSizes[0];
    currGrows[0] = scaledMinSizes[0];
  }
  if (currGrows[1] < scaledMinSizes[1]) {
    currGrows[0] += currGrows[1] - scaledMinSizes[1];
    currGrows[1] = scaledMinSizes[1];
  }    

  return {
    ...state,
    grows: currGrows,
  };
}
  