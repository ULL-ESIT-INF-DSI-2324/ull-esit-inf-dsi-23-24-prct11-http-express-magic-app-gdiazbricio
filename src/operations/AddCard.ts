import { CardCollection } from "../CardCollection.js";
import { Card } from "../Card.js";
import { access, writeFile } from "node:fs";

/**
 * Represents an operation to add a card to a collection.
 */
export class AddCard {
  /**
   * Creates an instance of AddCard.
   * @param Cards The collection of cards to which the card will be added.
   */
  constructor(private Cards: CardCollection) {}

  /**
   * Adds a new card to the collection.
   * @param newCard The card to be added.
   * @param callback A function to be called when finished.
   */
  add(
    newCard: Card,
    callback: (error: string | undefined, data: string | undefined) => void,
  ): void {
    const urlPath = `${this.Cards.getUser()}/${newCard.name}.json`;
    const toWrite = JSON.stringify(newCard, null, 2);
    access(urlPath, (error) => {
      if (!error) {
        callback("La carta ya existe en la colección", undefined);
      } else {
        writeFile(urlPath, toWrite, { flag: "w" }, (error) => {
          if (error) callback("Error en el servidor", undefined);
          else
            callback(
              undefined,
              `La carta se ha añadido a la colección de ${this.Cards.getUser()}`,
            );
        });
      }
    });
  }
}