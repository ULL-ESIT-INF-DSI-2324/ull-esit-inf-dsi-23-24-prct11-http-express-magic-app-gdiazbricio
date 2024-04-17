import { CardCollection } from "../CardCollection.js";
import { rm } from "node:fs/promises";

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
  delete(toDeleteId: number): Promise<string> {
    const found = this.Cards.collection.find((card) => {
      return card.id === toDeleteId;
    });
    return new Promise<string>((resolve, reject) => {
      if (found) {
        rm(`${this.Cards.getUser()}/${found.name}.json`)
          .then(() => {
            resolve(
              `La carta ${toDeleteId} ha sido eliminada de la colección de ${this.Cards.getUser()}`,
            );
          })
          .catch(() => {
            reject(`Error al eliminar`);
          });
      } else reject("La carta no fue encontrada");
    });
  }
}
