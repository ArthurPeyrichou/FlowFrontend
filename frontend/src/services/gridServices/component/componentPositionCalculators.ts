/*
 * In this file you will find all the function that calculate the component placement
 */

export function rectPlaceX (x: number, theCompWidth: number, svgGridSize: number, svgGridBorderWidth: number): number {
  if (x < (svgGridBorderWidth + (theCompWidth / 2))) {
    return 10
  } else if (x > (svgGridSize - svgGridBorderWidth - (theCompWidth / 2))) {
    return svgGridSize - svgGridBorderWidth - theCompWidth
  }
  return x - (theCompWidth / 2)
}

export function rectPlaceY (y: number, theCompHeight: number, svgGridSize: number, svgGridBorderWidth: number): number {
  if (y < (svgGridBorderWidth + (theCompHeight / 2))) {
    return svgGridBorderWidth
  } else if (y > (svgGridSize - svgGridBorderWidth - (theCompHeight / 2))) {
    return svgGridSize - svgGridBorderWidth - theCompHeight
  }
  return y - (theCompHeight / 2)
}

export function namePlaceX (x: number, theCompWidth: number, svgGridSize: number, svgGridBorderWidth: number): number {
  if (x < (svgGridBorderWidth + (theCompWidth / 2))) {
    return svgGridBorderWidth + 65
  } else if (x > (svgGridSize - svgGridBorderWidth - (theCompWidth / 2))) {
    return svgGridSize + 65 - svgGridBorderWidth - theCompWidth
  }
  return x - (theCompWidth / 2) + 65
}

export function namePlaceY (y: number, theCompHeight: number, svgGridSize: number, svgGridBorderWidth: number, transferShowIO: boolean): number {
  if (y < (svgGridBorderWidth + (theCompHeight / 2))) {
    return svgGridBorderWidth - (transferShowIO ? 8 : 2) + (theCompHeight / 2)
  } else if (y > (svgGridSize - svgGridBorderWidth - (theCompHeight / 2))) {
    return svgGridSize - (transferShowIO ? 8 : 2) - svgGridBorderWidth - (theCompHeight / 2)
  }
  return y - (transferShowIO ? 8 : 2)
}

export function titlePlaceX (x: number, theCompWidth: number, svgGridSize: number, svgGridBorderWidth: number): number {
  if (x < (svgGridBorderWidth + (theCompWidth / 2))) {
    return svgGridBorderWidth + 65
  } else if (x > (svgGridSize - svgGridBorderWidth - (theCompWidth / 2))) {
    return svgGridSize + 65 - svgGridBorderWidth - theCompWidth
  }
  return x - (theCompWidth / 2) + 65
}

export function titlePlaceY (y: number, theCompHeight: number, svgGridSize: number, svgGridBorderWidth: number, transferShowIO: boolean): number {
  if (y < (svgGridBorderWidth + (theCompHeight / 2))) {
    return svgGridBorderWidth + (transferShowIO ? 8 : 14) + (theCompHeight / 2)
  } else if (y > (svgGridSize - svgGridBorderWidth - (theCompHeight / 2))) {
    return svgGridSize + (transferShowIO ? 8 : 14) - svgGridBorderWidth - (theCompHeight / 2)
  }
  return y + (transferShowIO ? 8 : 14)
}

// io for input/output
export function ioPlaceX (x: number, theCompWidth: number, svgGridSize: number, svgGridBorderWidth: number): number {
  if (x < (svgGridBorderWidth + (theCompWidth / 2))) {
    return svgGridBorderWidth + 65
  } else if (x > (svgGridSize - svgGridBorderWidth - (theCompWidth / 2))) {
    return svgGridSize + 65 - svgGridBorderWidth - theCompWidth
  }
  return x - (theCompWidth / 2) + 65
}

export function ioPlaceY (y: number, theCompHeight: number, svgGridSize: number, svgGridBorderWidth: number): number {
  if (y < (svgGridBorderWidth + (theCompHeight / 2))) {
    return svgGridBorderWidth + 25 + (theCompHeight / 2)
  } else if (y > (svgGridSize - svgGridBorderWidth - (theCompHeight / 2))) {
    return svgGridSize + 25 - svgGridBorderWidth - (theCompHeight / 2)
  }
  return y + 25
}

export function iconPlaceX (x: number, theCompWidth: number, svgGridSize: number, svgGridBorderWidth: number): number {
  if (x < (svgGridBorderWidth + (theCompWidth / 2))) {
    return svgGridBorderWidth + 20
  } else if (x > (svgGridSize - svgGridBorderWidth - (theCompWidth / 2))) {
    return svgGridSize + 20 - svgGridBorderWidth - theCompWidth
  }
  return x - (theCompWidth / 2) + 20
}

export function iconPlaceY (y: number, theCompHeight: number, svgGridSize: number, svgGridBorderWidth: number): number {
  if (y < (svgGridBorderWidth + (theCompHeight / 2))) {
    return svgGridBorderWidth - 10 + (theCompHeight / 2)
  } else if (y > (svgGridSize - svgGridBorderWidth - (theCompHeight / 2))) {
    return svgGridSize - 10 - svgGridBorderWidth - (theCompHeight / 2)
  }
  return y - 10
}

export function triggerPlaceX (x: number, theCompWidth: number, svgGridSize: number, svgGridBorderWidth: number): number {
  if (x < (svgGridBorderWidth + (theCompWidth / 2))) {
    return 10 + (theCompWidth / 2)
  } else if (x > (svgGridSize - svgGridBorderWidth - (theCompWidth / 2))) {
    return svgGridSize - svgGridBorderWidth - (theCompWidth / 2)
  }
  return x
}

export function triggerPlaceY (y: number, theCompHeight: number, svgGridSize: number, svgGridBorderWidth: number): number {
  if (y < (svgGridBorderWidth + (theCompHeight / 2))) {
    return svgGridBorderWidth - 10
  } else if (y > (svgGridSize - svgGridBorderWidth - (theCompHeight / 2))) {
    return svgGridSize - 10 - svgGridBorderWidth - theCompHeight
  }
  return y - 10 - (theCompHeight / 2)
}

export function getTriggerTrianglePoints (x: number, theCompWidth: number, y: number, theCompHeight: number, svgGridSize: number, svgGridBorderWidth: number): string {
  const xPos = triggerPlaceX(x, theCompWidth, svgGridSize, svgGridBorderWidth)
  const yPos = triggerPlaceY(y, theCompHeight, svgGridSize, svgGridBorderWidth)
  return (xPos - 10) + ',' + yPos + ' ' + (xPos + 10) + ',' + yPos + ' ' + xPos + ',' + (yPos + 20)
}

export function inputCirclePlaceX (x: number, theCompWidth: number, svgGridSize: number, svgGridBorderWidth: number): number {
  if (x < (svgGridBorderWidth + (theCompWidth / 2))) {
    return svgGridBorderWidth
  } else if (x > (svgGridSize - svgGridBorderWidth - (theCompWidth / 2))) {
    return svgGridSize - svgGridBorderWidth - theCompWidth
  }
  return x - (theCompWidth / 2)
}

export function inputCirclePlaceY (y: number, theCompHeight: number, index: number, count: number, svgGridSize: number, svgGridBorderWidth: number): number {
  if (y < (svgGridBorderWidth + (theCompHeight / 2))) {
    return svgGridBorderWidth + (theCompHeight / 2) + (index * 20) - (count - 1) * 10
  } else if (y > (svgGridSize - svgGridBorderWidth - (theCompHeight / 2))) {
    return svgGridSize - svgGridBorderWidth - (theCompHeight / 2) + (index * 20) - (count - 1) * 10
  }
  return y + (index * 20) - (count - 1) * 10
}

export function outputCirclePlaceX (x: number, theCompWidth: number, svgGridSize: number, svgGridBorderWidth: number): number {
  if (x < (svgGridBorderWidth + (theCompWidth / 2))) {
    return svgGridBorderWidth + theCompWidth
  } else if (x > (svgGridSize - svgGridBorderWidth - (theCompWidth / 2))) {
    return svgGridSize - svgGridBorderWidth
  }
  return x + (theCompWidth / 2)
}

export function outputCirclePlaceY (y: number, theCompHeight: number, index: number, count: number, svgGridSize: number, svgGridBorderWidth: number): number {
  if (y < (svgGridBorderWidth + (theCompHeight / 2))) {
    return svgGridBorderWidth + (theCompHeight / 2) + (index * 20) - (count - 1) * 10
  } else if (y > (svgGridSize - svgGridBorderWidth - (theCompHeight / 2))) {
    return svgGridSize - svgGridBorderWidth - (theCompHeight / 2) + (index * 20) - (count - 1) * 10
  }
  return y + (index * 20) - (count - 1) * 10
}
