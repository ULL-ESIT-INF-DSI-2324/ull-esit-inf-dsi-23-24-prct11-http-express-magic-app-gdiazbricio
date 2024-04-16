import { CardCollection } from "../CardCollection.js";
import { Card } from "../Card.js";

/**
 * Represents an operation to show details of a specific card.
 */
export class ShowCard {
  /**
   * Creates an instance of ShowCard.
   * @param Cards The collection of cards from which the card details will be shown.
   */
  constructor(private Cards: CardCollection) {}

  /**
   * Shows the details of a specific card.
   * @param toShowId The id of the card to show.
   */
  showCard(
    toShowId: number,
    callback: (error: string | undefined, data: Card | undefined) => void,
  ): void {
    const found = this.Cards.collection.find((card) => {
      return card.id === toShowId;
    });
    if (found) {
      callback(undefined, found);
    } else {
      callback("La carta no fue encontrada", undefined);
    }
  }
}
