import { Card } from "./Card.js";
import { access, readFile, constants, readdir } from "node:fs";

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
