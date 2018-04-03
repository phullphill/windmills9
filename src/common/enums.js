
import { Enum } from './enum';
import { CompassEnum } from './compassEnum';

/**
 * @typedef {enum} compassDirection
 * A value that defines a compass direction, eg, for movement
 * It has values for 'NORTH', 'NORTHEAST', 'EAST', 'SOUTHEAST', 'SOUTH', 'SOUTHWEST', 'WEST', 'NORTHWEST'
 * @readonly
 * @enum {string}
 * @public
 */
export const COMPASS = new CompassEnum();

/**
 * @typedef {enum} spinDirection
 * A value that defines the direction something is rotating
 * @readonly
 * @enum {string}
 * @public
 */
export const SPIN = new Enum('CLOCKWISE', 'ANTICLOCKWISE', 'NOSPIN');
