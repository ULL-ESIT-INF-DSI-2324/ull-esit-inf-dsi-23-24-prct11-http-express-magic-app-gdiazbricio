import { Colors, Oddities, TypeLines } from "./Card.js";

/**
 * Returns the enum value of `Colors` based on the provided color name.
 * @param toSearch The color name to search for.
 * @returns The enum value of `Colors` corresponding to the provided color name.
 */
export function getColorsByName(toSearch: string): Colors {
  toSearch.toLocaleLowerCase();
  switch (toSearch) {
    case "white":
      return Colors.White;
    case "blue":
      return Colors.Blue;
    case "black":
      return Colors.Black;
    case "red":
      return Colors.Red;
    case "green":
      return Colors.Green;
    case "acolor":
      return Colors.Acolor;
    case "multicolor":
      return Colors.Multicolor;
    default:
      return Colors.Acolor;
  }
}

/**
 * Returns the enum value of `TypeLines` based on the provided type line name.
 * @param toSearch The type line name to search for.
 * @returns The enum value of `TypeLines` corresponding to the provided type line name.
 */
export function getTypeLineByName(toSearch: string): TypeLines {
  toSearch.toLocaleLowerCase();
  switch (toSearch) {
    case "ground":
      return TypeLines.Ground;
    case "creature":
      return TypeLines.Creature;
    case "enchanting":
      return TypeLines.Enchanting;
    case "conjure":
      return TypeLines.Conjure;
    case "instant":
      return TypeLines.Instant;
    case "artefact":
      return TypeLines.Artefact;
    case "planeswalker":
      return TypeLines.Planeswalker;
    default:
      return TypeLines.Ground;
  }
}

/**
 * Returns the enum value of `Oddities` based on the provided oddity name.
 * @param toSearch The oddity name to search for.
 * @returns The enum value of `Oddities` corresponding to the provided oddity name.
 */
export function getOddityByName(toSearch: string): Oddities {
  toSearch.toLocaleLowerCase();
  switch (toSearch) {
    case "common":
      return Oddities.Common;
    case "unfrecuent":
      return Oddities.Unfrecuent;
    case "mithic":
      return Oddities.Mithic;
    default:
      return Oddities.Common;
  }
}
