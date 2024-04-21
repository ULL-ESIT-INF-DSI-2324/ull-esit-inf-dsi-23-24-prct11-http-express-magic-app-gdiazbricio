import { CardCollection } from "../CardCollection.js";
import { rm } from "node:fs";

/**
 * Represents an operation to delete a card from a collection.
 */
export class DeleteCard {
  /**
   * Creates an instance of DeleteCard.
   * @param Cards The collection of cards from which the card will be deleted.
   */
  constructor(private Cards: CardCollection) {}
  /**
   * Deletes a card from the collection based on its id.
   * @param toDeleteId The id of the card to be deleted.
   * @param callback A function to be called when finished.
   */
  delete(
    toDeleteId: number,
    callback: (error: string | undefined, data: string | undefined) => void,
  ): void {
    const found = this.Cards.collection.find((card) => {
      return card.id === toDeleteId;
    });
    if (found) {
      rm(`${this.Cards.getUser()}/${found.name}.json`, (err) => {
        if (err) callback("Error al eliminar", undefined);
        else
          callback(
            undefined,
            `La carta ${toDeleteId} ha sido eliminada de la colección de ${this.Cards.getUser()}`,
          );
      });
    } else callback("La carta no fue encontrada", undefined);
  }
}