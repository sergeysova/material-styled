
/**
 *
 * @param {string} name Name of the palette
 * @param {number} shade Shading for selected palette
 */
export const palette = (name, shade = 0) => props =>
  props.theme.palette[name][shade]
