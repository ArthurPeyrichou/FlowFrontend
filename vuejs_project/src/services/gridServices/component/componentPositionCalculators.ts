import { SVG_GRID_SIZE, SVG_GRID_BORDER_WIDTH, TRANSFER_SHOW_IO } from '../../../config'

/*
 * In this file you will find all the function that calculate the component placement
 */

export function rectPlaceX (x: number, theCompWidth: number): number {
  if (x < (SVG_GRID_BORDER_WIDTH + (theCompWidth / 2))) {
    return 10
  } else if (x > (SVG_GRID_SIZE - SVG_GRID_BORDER_WIDTH - (theCompWidth / 2))) {
    return SVG_GRID_SIZE - SVG_GRID_BORDER_WIDTH - theCompWidth
  }
  return x - (theCompWidth / 2)
}

export function rectPlaceY (y: number, theCompHeight: number): number {
  if (y < (SVG_GRID_BORDER_WIDTH + (theCompHeight / 2))) {
    return SVG_GRID_BORDER_WIDTH
  } else if (y > (SVG_GRID_SIZE - SVG_GRID_BORDER_WIDTH - (theCompHeight / 2))) {
    return SVG_GRID_SIZE - SVG_GRID_BORDER_WIDTH - theCompHeight
  }
  return y - (theCompHeight / 2)
}

export function namePlaceX (x: number, theCompWidth: number): number {
  if (x < (SVG_GRID_BORDER_WIDTH + (theCompWidth / 2))) {
    return SVG_GRID_BORDER_WIDTH + 65
  } else if (x > (SVG_GRID_SIZE - SVG_GRID_BORDER_WIDTH - (theCompWidth / 2))) {
    return SVG_GRID_SIZE + 65 - SVG_GRID_BORDER_WIDTH - theCompWidth
  }
  return x - (theCompWidth / 2) + 65
}

export function namePlaceY (y: number, theCompHeight: number): number {
  if (y < (SVG_GRID_BORDER_WIDTH + (theCompHeight / 2))) {
    return SVG_GRID_BORDER_WIDTH - (TRANSFER_SHOW_IO ? 8 : 2) + (theCompHeight / 2)
  } else if (y > (SVG_GRID_SIZE - SVG_GRID_BORDER_WIDTH - (theCompHeight / 2))) {
    return SVG_GRID_SIZE - (TRANSFER_SHOW_IO ? 8 : 2) - SVG_GRID_BORDER_WIDTH - (theCompHeight / 2)
  }
  return y - (TRANSFER_SHOW_IO ? 8 : 2)
}

export function titlePlaceX (x: number, theCompWidth: number): number {
  if (x < (SVG_GRID_BORDER_WIDTH + (theCompWidth / 2))) {
    return SVG_GRID_BORDER_WIDTH + 65
  } else if (x > (SVG_GRID_SIZE - SVG_GRID_BORDER_WIDTH - (theCompWidth / 2))) {
    return SVG_GRID_SIZE + 65 - SVG_GRID_BORDER_WIDTH - theCompWidth
  }
  return x - (theCompWidth / 2) + 65
}

export function titlePlaceY (y: number, theCompHeight: number): number {
  if (y < (SVG_GRID_BORDER_WIDTH + (theCompHeight / 2))) {
    return SVG_GRID_BORDER_WIDTH + (TRANSFER_SHOW_IO ? 8 : 14) + (theCompHeight / 2)
  } else if (y > (SVG_GRID_SIZE - SVG_GRID_BORDER_WIDTH - (theCompHeight / 2))) {
    return SVG_GRID_SIZE + (TRANSFER_SHOW_IO ? 8 : 14) - SVG_GRID_BORDER_WIDTH - (theCompHeight / 2)
  }
  return y + (TRANSFER_SHOW_IO ? 8 : 14)
}

// io for input/output
export function ioPlaceX (x: number, theCompWidth: number): number {
  if (x < (SVG_GRID_BORDER_WIDTH + (theCompWidth / 2))) {
    return SVG_GRID_BORDER_WIDTH + 65
  } else if (x > (SVG_GRID_SIZE - SVG_GRID_BORDER_WIDTH - (theCompWidth / 2))) {
    return SVG_GRID_SIZE + 65 - SVG_GRID_BORDER_WIDTH - theCompWidth
  }
  return x - (theCompWidth / 2) + 65
}

export function ioPlaceY (y: number, theCompHeight: number): number {
  if (y < (SVG_GRID_BORDER_WIDTH + (theCompHeight / 2))) {
    return SVG_GRID_BORDER_WIDTH + 25 + (theCompHeight / 2)
  } else if (y > (SVG_GRID_SIZE - SVG_GRID_BORDER_WIDTH - (theCompHeight / 2))) {
    return SVG_GRID_SIZE + 25 - SVG_GRID_BORDER_WIDTH - (theCompHeight / 2)
  }
  return y + 25
}

export function iconPlaceX (x: number, theCompWidth: number): number {
  if (x < (SVG_GRID_BORDER_WIDTH + (theCompWidth / 2))) {
    return SVG_GRID_BORDER_WIDTH + 20
  } else if (x > (SVG_GRID_SIZE - SVG_GRID_BORDER_WIDTH - (theCompWidth / 2))) {
    return SVG_GRID_SIZE + 20 - SVG_GRID_BORDER_WIDTH - theCompWidth
  }
  return x - (theCompWidth / 2) + 20
}

export function iconPlaceY (y: number, theCompHeight: number): number {
  if (y < (SVG_GRID_BORDER_WIDTH + (theCompHeight / 2))) {
    return SVG_GRID_BORDER_WIDTH - 10 + (theCompHeight / 2)
  } else if (y > (SVG_GRID_SIZE - SVG_GRID_BORDER_WIDTH - (theCompHeight / 2))) {
    return SVG_GRID_SIZE - 10 - SVG_GRID_BORDER_WIDTH - (theCompHeight / 2)
  }
  return y - 10
}

export function triggerPlaceX (x: number, theCompWidth: number): number {
  if (x < (SVG_GRID_BORDER_WIDTH + (theCompWidth / 2))) {
    return 10 + (theCompWidth / 2)
  } else if (x > (SVG_GRID_SIZE - SVG_GRID_BORDER_WIDTH - (theCompWidth / 2))) {
    return SVG_GRID_SIZE - SVG_GRID_BORDER_WIDTH - (theCompWidth / 2)
  }
  return x
}

export function triggerPlaceY (y: number, theCompHeight: number): number {
  if (y < (SVG_GRID_BORDER_WIDTH + (theCompHeight / 2))) {
    return SVG_GRID_BORDER_WIDTH - 10
  } else if (y > (SVG_GRID_SIZE - SVG_GRID_BORDER_WIDTH - (theCompHeight / 2))) {
    return SVG_GRID_SIZE - 10 - SVG_GRID_BORDER_WIDTH - theCompHeight
  }
  return y - 10 - (theCompHeight / 2)
}

export function getTriggerTrianglePoints (x: number, theCompWidth: number, y: number, theCompHeight: number): string {
  const xPos = triggerPlaceX(x, theCompWidth)
  const yPos = triggerPlaceY(y, theCompHeight)
  return (xPos - 10) + ',' + yPos + ' ' + (xPos + 10) + ',' + yPos + ' ' + xPos + ',' + (yPos + 20)
}

export function inputCirclePlaceX (x: number, theCompWidth: number): number {
  if (x < (SVG_GRID_BORDER_WIDTH + (theCompWidth / 2))) {
    return SVG_GRID_BORDER_WIDTH
  } else if (x > (SVG_GRID_SIZE - SVG_GRID_BORDER_WIDTH - (theCompWidth / 2))) {
    return SVG_GRID_SIZE - SVG_GRID_BORDER_WIDTH - theCompWidth
  }
  return x - (theCompWidth / 2)
}

export function inputCirclePlaceY (y: number, theCompHeight: number, index: number, count: number): number {
  if (y < (SVG_GRID_BORDER_WIDTH + (theCompHeight / 2))) {
    return SVG_GRID_BORDER_WIDTH + (theCompHeight / 2) + (index * 20) - (count - 1) * 10
  } else if (y > (SVG_GRID_SIZE - SVG_GRID_BORDER_WIDTH - (theCompHeight / 2))) {
    return SVG_GRID_SIZE - SVG_GRID_BORDER_WIDTH - (theCompHeight / 2) + (index * 20) - (count - 1) * 10
  }
  return y + (index * 20) - (count - 1) * 10
}

export function outputCirclePlaceX (x: number, theCompWidth: number): number {
  if (x < (SVG_GRID_BORDER_WIDTH + (theCompWidth / 2))) {
    return SVG_GRID_BORDER_WIDTH + theCompWidth
  } else if (x > (SVG_GRID_SIZE - SVG_GRID_BORDER_WIDTH - (theCompWidth / 2))) {
    return SVG_GRID_SIZE - SVG_GRID_BORDER_WIDTH
  }
  return x + (theCompWidth / 2)
}

export function outputCirclePlaceY (y: number, theCompHeight: number, index: number, count: number): number {
  if (y < (SVG_GRID_BORDER_WIDTH + (theCompHeight / 2))) {
    return SVG_GRID_BORDER_WIDTH + (theCompHeight / 2) + (index * 20) - (count - 1) * 10
  } else if (y > (SVG_GRID_SIZE - SVG_GRID_BORDER_WIDTH - (theCompHeight / 2))) {
    return SVG_GRID_SIZE - SVG_GRID_BORDER_WIDTH - (theCompHeight / 2) + (index * 20) - (count - 1) * 10
  }
  return y + (index * 20) - (count - 1) * 10
}
