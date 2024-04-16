[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/7bX30zK4)

[![Tests](https://github.com/ULL-ESIT-INF-DSI-2324/ull-esit-inf-dsi-23-24-prct10-fs-proc-sockets-magic-app-gdiazbricio/actions/workflows/node.js.yml/badge.svg)](https://github.com/ULL-ESIT-INF-DSI-2324/ull-esit-inf-dsi-23-24-prct10-fs-proc-sockets-magic-app-gdiazbricio/actions/workflows/node.js.yml)

[![Coverage Status](https://coveralls.io/repos/github/ULL-ESIT-INF-DSI-2324/ull-esit-inf-dsi-23-24-prct10-fs-proc-sockets-magic-app-gdiazbricio/badge.svg?branch=main)](https://coveralls.io/github/ULL-ESIT-INF-DSI-2324/ull-esit-inf-dsi-23-24-prct10-fs-proc-sockets-magic-app-gdiazbricio?branch=main)

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=ULL-ESIT-INF-DSI-2324_ull-esit-inf-dsi-23-24-prct10-fs-proc-sockets-magic-app-gdiazbricio&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=ULL-ESIT-INF-DSI-2324_ull-esit-inf-dsi-23-24-prct10-fs-proc-sockets-magic-app-gdiazbricio)

### INFORME: https://ull-esit-inf-dsi-2324.github.io/ull-esit-inf-dsi-23-24-prct10-fs-proc-sockets-magic-app-gdiazbricio/
# PRÁCTICA 10: DISEÑO DE UNA APLICACIÓN CLIENTE SERVIDOR PARA LA GESTIÓN DE CARTAS MAGIC.
### Guillermo Díaz Bricio - Desarrollo de Sistemas Informáticos, 3º Grado en Ingeniería Informática
## Contenidos:
  * [Contenidos.](#contenidos)
  * [Resumen.](#resumen)
  * [Objetivos.](#objetivos)
  * [Ejercicio propuesto en el guión:](#ejercicio-propuesto-en-el-guión)
  * [Conclusiones.](#conclusiones)
  * [Bibliografía.](#bibliografía)

## Resumen:
En esta práctica se ha realizado una apliación multiusuario cliente servidor, permitiendo gestionar peticiones concurrentes para la gestión de colecciones de cartas Magic de diferentes usuarios. Cada usuario podrá realizar operaciones sobre su colección. Se deberá seguir trabajando con Objetos, Clases, Interfaces, gesitión del sistema de archivos,etcétera. Además de trabajar con la librería `net` que ofrece `node`, la cual permite trabajar con sockets.
## Objetivos:
Los objetivos son:
1. Manejar adecuadamente objetos.
1. Aplicar principios SOLID. 
1. Diseño de un código consistente y bien formateado (mediante el uso de herramintas como ESLint y Prettier).
1. Desarrollo integrado mediante pruebas, utilizando Mocha y Chai.
1. Creación de documentación automátizada mediante TypeDoc.
1. Cubrimiento de código mediante c8 y coveralls.
1. Calidad de código por SonarCloud.
1. Trabajar con la API del sistema de ficheros de Node.
1. Trabajar con paquetes de lectura de argumentos como yargs y de formateo de la terminal como chalk.
1. Aplicar el patrón petición-respuesta.

## Ejercicio propuesto en el guión:
En esta práctica se requería diseñar e implementar una aplicación cliente servidor que permitiera a diferentes usuarios manejar su colección de cartas Magic, de manera que cada uno de ellos pueda realizar operaciones sobre la misma.

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

En cuanto al código del lado del servidor, tenemos que tener en cuenta que debía ser capaz de saber cuando el cliente ha enviado una petición completa, para que sólo entonces pueda procesarla y devolver una respuesta. No se permitía el uso de la flag `AllowHalfOpen`, por lo que se debía crear un evento personalizado, que se emitiría cuando se haya leído toda la información de la petición del cliente, y luego fuera manejado en el servidor para procesarla.

Es por ello que surge la clase `MessageEventEmitter`, que hereda de la clase `EventEmitter`:
```typescript
export class MessageEventEmitter extends EventEmitter {
  constructor(private connection: EventEmitter) {
    super();
    let fullData = "";
    connection.on("data", (dataChunk) => {
      fullData += dataChunk;
      let finish = fullData.indexOf("\n");
      while (finish !== -1) {
        const message = fullData.substring(0, finish);
        fullData = fullData.substring(finish + 1);
        this.emit("message", JSON.parse(message.toString()));
        finish = fullData.indexOf("\n");
      }
    });
  }
}
```

Cuando el socket que le pasemos por parámetros reciba un evento data, acumulará los datos en la variable `fullData`, una vez se llegue al final del mensaje (marcado por un "\n"), el objeto emitirá un evento "message", que debe manejar el servidor, como veremos a continuación:

```typescript
/ Creamos el servidor.
net
  .createServer((connection) => {
    // Pasamos el socket como argumento al constructor del evento personalizado.
    const socket = new MessageEventEmitter(connection);
    // Capturamos el evento message.
    socket.on("message", (message) => {
      if (message.operation === "add") {
        const myCollection = new CardCollection(message.user);
        const myCard: Card = {
          id: message.id,
          name: message.name,
          mana: message.mana,
          color: message.color,
          typeLine: message.typeLine,
          oddity: message.oddity,
          rules: message.rules,
          strength: message.strength,
          endurance: message.endurance,
          marketValue: message.marketValue,
        };
        myCollection.read((err) => {
          if (err) {
            connection.write(JSON.stringify({ result: "error", message: err }));
            connection.destroy();
          } else {
            const myAdder = new AddCard(myCollection);
            myAdder.add(myCard, (err, data) => {
              if (err)
                connection.write(
                  JSON.stringify({ result: "error", message: err }),
                );
              else if (data)
                connection.write(
                  JSON.stringify({ result: "success", message: data }),
                );
              connection.destroy();
            });
          }
        });
```
Para ilustrarlo se ha añadido el controlador de la petición `add`, cuando se recibe el evento "message", se comprueba el tipo de operación, luego se realiza y se envía el resultado de la operación en formato JSON, aprovechándonos de la implementación de las funciones de callback.


Para ilustrar el código cliente de la aplicación, usaremos de ejemplo el comando `list`:
```typescript
const client = net.connect({ port: 60300 });

yargs(hideBin(process.argv))
  .command(
    "list",
    "List the cards of a collection",
    {
      user: {
        description: "User of the collection to list",
        type: "string",
        demandOption: true,
      },
    },
    (argv) => {
      client.write(
        JSON.stringify({
          operation: "list",
          user: argv.user,
        }) + "\n",
      );

      let fullData = "";
      client.on("data", (dataChunk) => {
        fullData += dataChunk;
      });

      client.on("end", () => {
        const response = JSON.parse(fullData);
        if (response.result === "error")
          console.log(chalk.red(response.message));
        else if (response.result === "success") {
          for (const card of response.message) {
            console.log(
              `ID: ${card.id}, Nombre: ${card.name}, Mana: ${card.mana}, Color: ${chalk.hex(Correspondencies[card.color])(Colors[card.color])}, TypeLine: ${TypeLines[card.typeLine]}, Rareza: ${Oddities[card.oddity]}, Reglas: ${card.rules}, Fuerza: ${card.strength ?? ""}, Resistencia: ${card.endurance ?? ""}, Lealtad: ${card.loyalty ?? ""}, Valor de mercado: ${card.marketValue}`,
            );
          }
        } else console.log(chalk.red("Ocurrió algún errror"));
      });
    },
  )
  .help().argv;
```
Primero, el cliente debe establecer concxión con el servidor, luego se procesa la línea de comandos, una vez sabemos que queremos realizar un `list`, escribimos la petición, usando el campo `operation` para que el servidor sepa la operación a realizar y dándole los datos necesarios. Cuando el cliente reciba el evento "data", es por que el servidor está introduciendo datos en el socket, como estos datos pueden venir fragmentados, los acumulamos en una variable. Dado que el servidor destruye el socket una vez envía la respuesta, podemos manejar en el cliente el evento "end", que se lanzará, por tanto, cuando se haya dejado de enviar información, así que ya habremos acumulado todos los datos. 

Lo único que falta por hacer es procesar la respuesta, en este caso accedemos al campo `result`, para comprobar si la operación se pudo realizar o no. El mensaje de la respuesta se envía en el campo `message`. Por útimo, se formatea la entrada haciendo uso de `chalk`.


## Conclusiones:
La realización de la práctica proporcionó un conocimiento más profundo acerca del patrón petición-respuesta y del manejo de sockets a través de la API "net" de Node. Así como la consoludación de conceptos del lenguaje como Objetos, Clases, interfaces, principios SOLID y sus aplicaciones,sobre patrones de diseño y gestión del sistema de archivos. Además de seguir mejorando la lógica de programación, no solamente aplicada a TypeScript si no a cualquier lenguaje y a continuar prosperando con elementos como el desarrollo basado en pruebas, la generación de documentación automática y el cubrimiento de código.

## Bibliografía
* [Documentación sobre objetos de Mozzilla](https://developer.mozilla.org/es/docs/Web/JavaScript/Guide/Working_with_objects).
* [Documentación sobre clases de Mozzilla](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Classes)
* [Documentación de JavaScript de Mozzilla](https://developer.mozilla.org/es/docs/Web/JavaScript).
* [Documentación de Mocha](https://mochajs.org/).
* [Documentación de Chai](https://www.chaijs.com/).
* [Documentación de Chalk](https://github.com/chalk/chalk).
* [Documentación de Yargs](https://yargs.js.org/).
* [Documentación de TypeDoc](https://typedoc.org/).
* [Documentación de Node](https://nodejs.org/docs/latest/api/).
* [Web de Coveralls](https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=&cad=rja&uact=8&ved=2ahUKEwj3tsPGj9OEAxWVT6QEHcycA4AQFnoECAcQAQ&url=https%3A%2F%2Fcoveralls.io%2F&usg=AOvVaw2PjKrDGWUgtP9bnQyMWMrr&opi=89978449).
* [Web de SonarCloud](https://sonarcloud.io/).