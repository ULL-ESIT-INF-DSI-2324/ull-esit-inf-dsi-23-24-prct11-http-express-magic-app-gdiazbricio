import 'mocha';
import { expect } from 'chai';
import { AddCard } from '../src/operations/AddCard.js';
import { Card, TypeLines, Oddities, Colors } from '../src/Card.js';
import { CardCollection } from '../src/CardCollection.js';
import { DeleteCard } from '../src/operations/DeleteCard.js';
import {ModifyCard} from '../src/operations/ModifyCard.js';
import {ListCards} from '../src/operations/ListCards.js';
import { ShowCard } from '../src/operations/ShowCard.js';

describe('Operations tests', () => {
  const myCollection = new CardCollection("TestUser");



  it('Should add a new card to the collection', () => {
    const addCard = new AddCard(myCollection);
    const newCard: Card = {
      id: 1,
      name: 'Test Card',
      mana: 3,
      color: Colors.Blue,
      typeLine: TypeLines.Creature,
      oddity: Oddities.Common,
      rules: 'Test rules',
      marketValue: 10
    };

    return addCard.add(newCard).then((resolve) => {
      expect(resolve).to.be.equal("La carta se ha añadido a la colección de TestUser");
    });
  });

  it('Should handle error when adding a card that already exists', () => {
    const addCard = new AddCard(myCollection);
    const existingCard: Card = {
      id: 1,
      name: 'Test Card',
      mana: 3,
      color: Colors.Blue,
      typeLine: TypeLines.Creature,
      oddity: Oddities.Common,
      rules: 'Test rules',
      marketValue: 10
    };

    return addCard.add(existingCard).catch((reject) => {
      expect(reject).to.equal('La carta ya existe en la colección');
    });
  });

  it('Should handle error when trying to modify a collection of a non existing user', (done) => {
    const myCollection = new CardCollection("fhsajk");
    const addCard = new AddCard(myCollection);
    const existingCard: Card = {
      id: 1,
      name: 'Test Card',
      mana: 3,
      color: Colors.Blue,
      typeLine: TypeLines.Creature,
      oddity: Oddities.Common,
      rules: 'Test rules',
      marketValue: 10
    };
    myCollection.read((err) => {
      expect(err).to.be.equal("El usuario no existe");
      done();
    });
  });

  it('Should update a card to the collection', (done) => {
    const newCard: Card = {
      id: 1,
      name: 'Test Card',
      mana: 3,
      color: Colors.Blue,
      typeLine: TypeLines.Creature,
      oddity: Oddities.Common,
      rules: 'Test rules',
      marketValue: 10
    };
    myCollection.read((error) => {
      if (!error) {
        const updateCard = new ModifyCard(myCollection);
        updateCard.modify(newCard, (error, data) => {
          expect(error).to.be.undefined;
          expect(data).to.equal(`La carta: 1 ha sido modificada en la colección de TestUser`);
          done();
        });
      }
    });
  });

  it('Should not update a card if its not in the collection', (done) => {
    const myCollection = new CardCollection("TestUser");
    const newCard: Card = {
      id: 4,
      name: 'Test Card',
      mana: 3,
      color: Colors.Blue,
      typeLine: TypeLines.Creature,
      oddity: Oddities.Common,
      rules: 'Test rules',
      marketValue: 10
    };
    myCollection.read((error) => {
      if (!error) {
        const updateCard = new ModifyCard(myCollection);
        updateCard.modify(newCard, (error, data) => {
          expect(error).to.be.equal(`La carta a modificar no fue encontrada`);
          expect(data).to.be.undefined;
          done();
        });
      }
    });
  });

    it('Should list the cards from the collection', (done) => {
      const myCollection = new CardCollection("TestUser");
      myCollection.read((error) => {
        if (!error) {
          const listCard = new ListCards(myCollection);
          const cardIdToDelete = 1;
          listCard.list((error, data) => {
            expect(error).to.be.undefined;
            expect(data).to.be.deep.equal([{
              id: 1,
              name: 'Test Card',
              mana: 3,
              color: Colors.Blue,
              typeLine: TypeLines.Creature,
              oddity: Oddities.Common,
              rules: 'Test rules',
              marketValue: 10
            }]);
            done();
          });
        }
      });
    });

    it('Should show the card given from the collection', (done) => {
      const myCollection = new CardCollection("TestUser");
      myCollection.read((error) => {
        if (!error) {
          const showCard = new ShowCard(myCollection);
          const cardIdToShow = 1;
          showCard.showCard(cardIdToShow, (error, data) => {
            expect(error).to.be.undefined;
            expect(data).to.be.deep.equal({
              id: 1,
              name: 'Test Card',
              mana: 3,
              color: Colors.Blue,
              typeLine: TypeLines.Creature,
              oddity: Oddities.Common,
              rules: 'Test rules',
              marketValue: 10
            });
            done();
          });
        }
      });
    });

    it('Should not show the card given from the collection if not existing', (done) => {
      const myCollection = new CardCollection("TestUser");
      myCollection.read((error) => {
        if (!error) {
          const showCard = new ShowCard(myCollection);
          const cardIdToShow = 999;
          showCard.showCard(cardIdToShow, (error, data) => {
            expect(error).to.be.equal("La carta no fue encontrada");
            expect(data).to.be.be.undefined;
            done();
          });
        }
      });
    });

    it('Should delete a card from the collection', () => {
      const myCollection = new CardCollection("TestUser");
      myCollection.read((error) => {
          const deleteCard = new DeleteCard(myCollection);
          const cardIdToDelete = 1;
          return deleteCard.delete(cardIdToDelete).then((resolve) => {
            expect(resolve).to.be.equal(`La carta ${cardIdToDelete} ha sido eliminada de la colección de ${myCollection.getUser()}`);
          });
      });
    });
  
    it('Should handle error when deleting a card that does not exist', () => {
      const myCollection = new CardCollection("TestUser");
      const deleteCard = new DeleteCard(myCollection);
      const cardIdToDelete = 999;
      return deleteCard.delete(cardIdToDelete).catch((reject) => {
        expect(reject).to.be.equal("La carta no fue encontrada")
      });
    });
});

