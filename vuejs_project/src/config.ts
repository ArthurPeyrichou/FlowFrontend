/* Theme */
export const THEME: 'dark' | 'light' | 'custom' = 'dark'

/* Grid Parameters */
// The invisible border width which limit components to touch svg's borders.
export const SVG_GRID_SIZE = 5000
export const SVG_GRID_BORDER_WIDTH = 10
export const SVG_MIN_SCALE = 0.1
export const SVG_MAX_SCALE = 2
export const SVG_SCALE_STEP = 0.1

/* Link Rendering */
export const LINK_FILL_COLOR = 'grey'
export const ACTIVE_LINK_FILL_COLOR = 'gold'

/* Data Transfer */
export const TRANSFER_DURATION = 1000
export const TRANSFER_RADIUS = 4
export const TRANSFER_FILL_COLOR = 'gold'
export const TRANSFER_STROKE_COLOR = 'black'
export const TRANSFER_TYPE: 'PATH' | 'CIRCLE' = 'PATH'
export const TRANSFER_BYTES_PRECISION = 2
export const TRANSFER_SHOW_IO: true | false = true

/* Console Parameters */
export const OUTPUT_FONT_SIZE = 12

/* Communication Parameters */
export const COMMUNICATION_TYPE: 'DIRECT' | 'ON_APPLY' = 'ON_APPLY'
export const DATA_LOADING_TYPE: 'ALL_AT_ONCE' | 'ON_CHANGE_TAB' = 'ALL_AT_ONCE'
