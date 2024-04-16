import { CardCollection } from "../CardCollection.js";
import { Card } from "../Card.js";
import { rename, writeFile } from "node:fs";

/**
 * Represents an operation to modify a card in a collection.
 */
export class ModifyCard {
  /**
   * Creates an instance of ModifyCard.
   * @param Cards The collection of cards to be modified.
   */
  constructor(private Cards: CardCollection) {}

  /**
   * Modifies a card in the collection.
   * @param toModify The card to be modified.
   * @param callback A function to be called when finished.
   */
  modify(
    toModify: Card,
    callback: (error: string | undefined, data: string | undefined) => void,
  ): void {
    const found = this.Cards.collection.find((card) => {
      return card.id === toModify.id;
    });
    if (found) {
      const urlPath = `${this.Cards.getUser()}/${found.name}.json`;
      const toWrite = JSON.stringify(toModify, null, 2);
      writeFile(urlPath, toWrite, { flag: "w" }, (err) => {
        if (err) callback("Error en el servidor", undefined);
      });

      rename(
        urlPath,
        `${this.Cards.getUser()}/${toModify.name}.json`,
        (err) => {
          if (err) callback("Error en el servidor", undefined);
          else
            callback(
              undefined,
              `La carta: ${toModify.id} ha sido modificada en la colección de ${this.Cards.getUser()}`,
            );
        },
      );
    } else {
      callback("La carta a modificar no fue encontrada", undefined);
    }
  }
}
