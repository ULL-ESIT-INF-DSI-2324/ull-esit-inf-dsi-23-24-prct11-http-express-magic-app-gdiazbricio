/**
 * Enum representing different colors of cards.
 */
export enum Colors {
  White,
  Blue,
  Black,
  Red,
  Green,
  Acolor,
  Multicolor,
}

/**
 * Corresponding color codes for each color in the `Colors` enum.
 */
export const Correspondencies = [
  "#ffffff",
  "0000ff",
  "000000",
  "ff00000",
  "00ff00",
  "ffffff",
  "ffffff",
];

/**
 * Enum representing different types of card lines.
 */
export enum TypeLines {
  Ground,
  Creature,
  Enchanting,
  Conjure,
  Instant,
  Artefact,
  Planeswalker,
}

/**
 * Enum representing the rarity of a card.
 */
export enum Oddities {
  Common,
  Unfrecuent,
  Mithic,
}

/**
 * Interface representing a card.
 */
export interface Card {
  id: number;
  name: string;
  mana: number;
  color: Colors;
  typeLine: TypeLines;
  oddity: Oddities;
  rules: string;
  strength?: number;
  endurance?: number;
  loyalty?: number;
  marketValue: number;
}
