import { CardCollection } from "../CardCollection.js";
import { Card } from "../Card.js";

/**
 * Represents an operation to list cards in a collection.
 */
export class ListCards {
  /**
   * Creates an instance of ListCards.
   * @param Cards The collection of cards to be listed.
   */
  constructor(private Cards: CardCollection) {}

  /**
   * Lists all the cards in the collection with their details.
   * @param callback A function to be called when finished.
   */
  list(
    callback: (error: string | undefined, data: Card[] | undefined) => void,
  ): void {
    if (this.Cards.collection.length === 0)
      callback("No hay cartas en la colección", undefined);
    else {
      callback(undefined, this.Cards.collection);
    }
  }
}
