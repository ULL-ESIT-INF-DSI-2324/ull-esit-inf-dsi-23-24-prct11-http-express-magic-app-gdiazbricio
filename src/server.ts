import { CardCollection } from "./CardCollection.js";
import { AddCard } from "./operations/AddCard.js";
import { ModifyCard } from "./operations/ModifyCard.js";
import { ShowCard } from "./operations/ShowCard.js";
import { DeleteCard } from "./operations/DeleteCard.js";
import { ListCards } from "./operations/ListCards.js";


import express from "express";


/**
 * Main express server functionality
 * 
 */

const app = express();
app.use(express.json());

app.get("/cards", (req, res) => {
  if (!req.query.user) return res.send({type: "error", message: "No se ha indicado usuario"});
  const user = req.query.user.toString();
  const myCollection = new CardCollection(user);
  if (!req.query.id) {
    return myCollection.read((err) => {
      if (err) return res.send( {result: "error", message: err} );
      else {
        const myLister = new ListCards(myCollection);
        myLister.list((err, data) => {
          if (err) return res.send({ result: "error", message: err });
          return res.send({ result: "success", message: data });
        });
        return;
      }
    })
  }
  return myCollection.read((err) => {
    if (err) return res.send( { result: "error", message: err} );
    else {
      const myReader = new ShowCard(myCollection);
      myReader.showCard(Number(req.query.id?.toString()), ((err, data) => {
        if (err) return res.send ( {result: "error", message: err} );
        return res.send({ result: "success", message: data});
      }));
      return;
    }
  });
});

app.post("/cards", (req, res) => {
  if (!req.query.user) return res.send({type: "error", message: "No se ha indicado usuario"});
  const user = req.query.user.toString();
  const myCollection = new CardCollection(user);
  return myCollection.read((err) => {
      if (err) return res.send( {result: "error", message: err} );
      else {
        const myAdder = new AddCard(myCollection);
        myAdder.add(req.body, (err, data) => {
          if (err) return res.send({ result: "error", message: err });
          return res.send({ result: "success", message: data });
        });
        return;
      }
    })
});

app.delete("/cards", (req, res) => {
  if (!req.query.user) return res.send({type: "error", message: "No se ha indicado usuario"});
  const user = req.query.user.toString();
  const myCollection = new CardCollection(user);
  return myCollection.read((err) => {
      if (err) return res.send( {result: "error", message: err} );
      else {
        const myRemover = new DeleteCard(myCollection);
        myRemover.delete(Number(req.query.id?.toString()), (err, data) => {
          if (err) return res.send({ result: "error", message: err });
          return res.send({ result: "success", message: data });
        });
        return;
      }
    })
});

app.patch("/cards", (req, res) => {
  if (!req.query.user) return res.send({type: "error", message: "No se ha indicado usuario"});
  const user = req.query.user.toString();
  const myCollection = new CardCollection(user);
  return myCollection.read((err) => {
      if (err) return res.send( {result: "error", message: err} );
      else {
        const myModifier = new ModifyCard(myCollection);
        myModifier.modify(req.body, (err, data) => {
          if (err) return res.send({ result: "error", message: err });
          return res.send({ result: "success", message: data });
        });
        return;
      }
    })
});

app.all("*", (_, res) => {
  res.status(501).send("Operación no soportada");
});


app.listen(60300, () => {
  console.log("Server running on port 60300");
});