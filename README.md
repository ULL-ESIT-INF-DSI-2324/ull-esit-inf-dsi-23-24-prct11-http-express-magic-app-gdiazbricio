[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/7bX30zK4)

[![Tests](https://github.com/ULL-ESIT-INF-DSI-2324/ull-esit-inf-dsi-23-24-prct11-http-express-magic-app-gdiazbricio/actions/workflows/node.js.yml/badge.svg)](https://github.com/ULL-ESIT-INF-DSI-2324/ull-esit-inf-dsi-23-24-prct11-http-express-magic-app-gdiazbricio/actions/workflows/node.js.yml)

[![Coverage Status](https://coveralls.io/repos/github/ULL-ESIT-INF-DSI-2324/ull-esit-inf-dsi-23-24-prct11-http-express-magic-app-gdiazbricio/badge.svg?branch=main)](https://coveralls.io/github/ULL-ESIT-INF-DSI-2324/ull-esit-inf-dsi-23-24-prct11-http-express-magic-app-gdiazbricio?branch=main)

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=ULL-ESIT-INF-DSI-2324_ull-esit-inf-dsi-23-24-prct11-http-express-magic-app-gdiazbricio&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=ULL-ESIT-INF-DSI-2324_ull-esit-inf-dsi-23-24-prct11-http-express-magic-app-gdiazbricio)

### INFORME: https://ull-esit-inf-dsi-2324.github.io/ull-esit-inf-dsi-23-24-prct11-http-express-magic-app-gdiazbricio/
# PRÁCTICA 11: DISEÑO DE UNA APLICACIÓN EXPRESS SERVIDOR PARA LA GESTIÓN DE CARTAS MAGIC.
### Guillermo Díaz Bricio - Desarrollo de Sistemas Informáticos, 3º Grado en Ingeniería Informática
## Contenidos:
  * [Contenidos.](#contenidos)
  * [Resumen.](#resumen)
  * [Objetivos.](#objetivos)
  * [Ejercicio propuesto en el guión:](#ejercicio-propuesto-en-el-guión)
  * [Ejercicio propuesto en el aula:](#ejercicio-propuesto-en-el-aula)
  * [Conclusiones.](#conclusiones)
  * [Bibliografía.](#bibliografía)

## Resumen:
En esta práctica se ha realizado una apliación multiusuario cliente servidor, permitiendo gestionar peticiones concurrentes para la gestión de colecciones de cartas Magic de diferentes usuarios. Cada usuario podrá realizar operaciones sobre su colección. Se deberá seguir trabajando con Objetos, Clases, Interfaces, gesitión del sistema de archivos,etcétera. Además de trabajar con la librería express que ofrece el framework express, la cual permite trabajar con puntos de acceso http.
## Objetivos:
Los objetivos son:
1. Manejar adecuadamente objetos.
1. Aplicar principios SOLID. 
1. Diseño de un código consistente y bien formateado (mediante el uso de herramintas como ESLint y Prettier).
1. Desarrollo integrado mediante pruebas, utilizando Mocha y Chai.
1. Creación de documentación automátizada mediante TypeDoc.
1. Cubrimiento de código mediante c8 y coveralls.
1. Calidad de código por SonarCloud.
1. Trabajar con la librería express.

## Ejercicio propuesto en el guión:
En esta práctica se requería diseñar e implementar una aplicación express que permitiera a diferentes usuarios manejar su colección de cartas Magic, de manera que cada uno de ellos pueda realizar operaciones sobre la misma.

En primer lugar, se define la interfaz `Card`, que define la forma que debe tener un objeto de tipo carta Magic
```typescript
export interface Card {
  id: number,
  name: string,
  mana: number,
  color: Colors,
  typeLine: TypeLines,
  oddity: Oddities,
  rules: string,
  strength?: number,
  endurance?: number,
  loyalty?: number,
  marketValue: number
}
```

Lo más importante a destacar son los campos opcionales, marcados con un `?` al lado de su identificador, nos permite definir campos que pueden estar presentes, o no.

Se definen también los siguientes enumerados:
* Colors: Define los colores que pueden tener las cartas.
* TypeLines: Define los tipos que puede tener la carta.
* Oddities: Define las diferentes rarezas que puede tener la carta.

Una vez podamos definir cartas, es necesaria la implementación de una clase que almacene todas esas cartas, es aquí donde entra en juego la clase `CardCollection`:
``` typescript
/**
 * Represents a collection of cards.
 */
export class CardCollection {
  /**
   * The collection of cards.
   */
  public collection: Card[];

  /**
   * Creates an instance of CardCollection.
   * @param user The user associated with the collection.
   */
  constructor(private user: string) {
    this.collection = [];
  }

  /**
   * Read a user's collection of cards.
   * @param callback A function to be called when finishede.
   */
  read(
    callback: (error: string | undefined, data: string | undefined) => void,
  ): void {
    access(this.user, constants.F_OK, (err) => {
      if (err) {
        callback("El usuario no existe", undefined);
      } else {
        let filesRead = 0;
        readdir(this.user, (err, files) => {
          if (err)
            callback("No se pudo leer la carpeta del usuario", undefined);
          else {
            if (files.length === 0)
              callback(undefined, "No hay ningun archivo que leer");
            files.forEach((file) => {
              readFile(`${this.user}/${file}`, (error, data) => {
                if (error) callback(`Error al leer archivo ${file}`, undefined);
                else {
                  this.collection.push(JSON.parse(data.toString()));
                  filesRead++;
                  if (filesRead === files.length)
                    callback(undefined, "Se ha añadido a la colección");
                }
              });
            });
          }
        });
      }
    });
  }

  /**
   * Gets the user associated with the collection.
   * @returns The user associated with the collection.
   */
  getUser(): string {
    return this.user;
  }
}
```
El constructor de la clase recibe un `user`, que será el usuario al que pertenece la colección, en el mismo constructor se inicializa un vector que contendrá la colección, que se actualizará cada vez que se llame al método `read`, que lee el directorio del usuario e itera sobre los archivos del mismo, insertando las cartas en la colección. Todos los accesos a los métodos para la gestión del sistema de archivos se realizan mediante la API asíncrona basada en callbacks de `net`. Podemos observar que dicho método se implementa también utilizando el patrón callback, que nos permitirá gestionar de una mejor manera los errores que puedan ocurrir durante la ejecución.

Se define el método `getUser` que devuelve el usuario al que pertenece la colección.

Por modularidad y cumplimiento del principio SOLID Open-Close se han declarado las diferentes operaciones que se pueden realizar sobre las colecciones en diferentes clases, todas han sido diseñadas siguiendo el patrón callback, por el mismo motivo que se mencionó anteriormente, además de que resultará más fácil a la hora de enviar la respuesta del servidor. Veremos en primer lugar la clase `AddCard`:

```typescript
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
```

Se le pasará por constructor la colección sobre la que queremos hacer la operación, esto se repetirá en todas las clases de operaciones. Más adelante se define el método `add`, que primero compruba que la carta no esté ya en la colección, si no lo está la introduce.

También se define la clase `DeleteCard`:
```typescript
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
```

El método `delete` primero comprobará que la carta a eliminar existe, buscando su ID en la colección, si existe la elimina, si no existe emite un mensaje de error.

La clase `ListCards`:
```typescript
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
```
El método `list` se encarga de comprobar que la lista no esté vacía, pondrá en el campo `data` de la función `callback` la colección.

La clase `ModifyCard`:
```typescript
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
```
Se accede a la carta a modificar, si se encuentra se modifica con la nueva información, en el caso de que se haya cambiado el nombre, también se cambia el nombre del fichero que la contiene, si no la encuentra, simplemente emite un mensaje de error.

La clase `ShowCard`, no nos centraremos en su implementación, pues es muy similar a la clase `ListCards`, pero simplemente sobre una carta.

En cuanto al código del lado del servidor, primero se crea una aplicación express, que se pone a escuchar en el puerto 60300, luego se incluyen las diferentes operaciones crud junto con su implementación.
```typescript
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
```
Además, se añade el método `all`, que junto con `*` gestiona las peticiones a operaciones que no están soportadas por la aplicación.

En este caso, no es necesario código cliente, pues son peticiones a la dirección http, aún así se ilustran algunas:
* `http://localhost:60300/cards?user=Guille` junto con el método `GET`, devolverá todas las cartas del usuario Guille.
* `http://localhost:60300/cards?user=Guille` junto con `POST`, insertará la carta que se le pase en el cuerpo de la petición en la colección de Guille.
* `http://localhost:60300/cards?user=Guille&id=3` usando el metodo `DELETE` eliminará la carta con `id=3`.
* `http://localhost:60300/cards?user=Guille` junto con `PATCH`, modificará la carta que se le pase en el cuerpo de la petición en la colección de Guille.

## Ejercicios propuestos en el aula:

Se solicitaba un cambio en dos de las operaciones implementadas, de manera que pasaran de usar el patron callback, a promesas, además de utilizar la API de filesystem de Node en su versión asíncrona basada en promesas. En este caso, se decidió modificar la operación `add` y `delete`:

```typescript
import { CardCollection } from "../CardCollection.js";
import { Card } from "../Card.js";
import { access, writeFile } from "node:fs/promises";

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
  add(newCard: Card): Promise<string> {
    const urlPath = `${this.Cards.getUser()}/${newCard.name}.json`;
    const toWrite = JSON.stringify(newCard, null, 2);
    return new Promise((resolve, reject) => {
      access(urlPath)
        .then(() => {
          reject("La carta ya existe en la colección");
        })
        .catch(() => {
          writeFile(urlPath, toWrite, { flag: "w" })
            .then(() => {
              resolve(
                `La carta se ha añadido a la colección de ${this.Cards.getUser()}`,
              );
            })
            .catch(() => {
              reject("Error en el servidor");
            });
        });
    });
  }
}
```
Vemos como ahora, la función devuelve una promesa de tipo `string`, dentro de la propia función, se usa los métodos del filesystem basados en promesas, obteniendo si se tuvo éxito o no mediante los métodos `then` y `catch`, y finalmente, dependiendo del flujo de la función, se llama a `resolve` si se tiene éxito y a `reject` si se incumplió la promesa.

```typescript
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
```


## Conclusiones:
La realización de la práctica proporcionó un conocimiento más profundo acerca de la creación de aplicaciones express. Así como la consolidación de conceptos del lenguaje como Objetos, Clases, interfaces, principios SOLID y sus aplicaciones,sobre patrones de diseño y gestión del sistema de archivos. Además de seguir mejorando la lógica de programación, no solamente aplicada a TypeScript si no a cualquier lenguaje y a continuar prosperando con elementos como el desarrollo basado en pruebas, la generación de documentación automática y el cubrimiento de código.

## Bibliografía
* [Documentación sobre objetos de Mozzilla](https://developer.mozilla.org/es/docs/Web/JavaScript/Guide/Working_with_objects).
* [Documentación sobre clases de Mozzilla](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Classes)
* [Documentación de JavaScript de Mozzilla](https://developer.mozilla.org/es/docs/Web/JavaScript).
* [Documentación de Mocha](https://mochajs.org/).
* [Documentación de Chai](https://www.chaijs.com/).
* [Documentación de TypeDoc](https://typedoc.org/).
* [Documentación de Node](https://nodejs.org/docs/latest/api/).
* [Web de Coveralls](https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=&cad=rja&uact=8&ved=2ahUKEwj3tsPGj9OEAxWVT6QEHcycA4AQFnoECAcQAQ&url=https%3A%2F%2Fcoveralls.io%2F&usg=AOvVaw2PjKrDGWUgtP9bnQyMWMrr&opi=89978449).
* [Web de SonarCloud](https://sonarcloud.io/).
* [Documentación de Express](https://expressjs.com/es/).