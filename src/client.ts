import net from "net";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import {
  getColorsByName,
  getTypeLineByName,
  getOddityByName,
} from "./helpers.js";
import { Correspondencies, Colors, TypeLines, Oddities } from "./Card.js";
import chalk from "chalk";

const client = net.connect({ port: 60300 });

/**
 * Main functionality for proccessing the stantard input.
 */
yargs(hideBin(process.argv))
  .command(
    "add",
    "Adds a card to the collection",
    {
      user: {
        description: "User of the collection to modify",
        type: "string",
        demandOption: true,
      },

      id: {
        description: "Id of the card to add",
        type: "number",
        demandOption: true,
      },

      name: {
        description: "Name of the card to add",
        type: "string",
        demandOption: true,
      },

      mana: {
        description: "Mana of the card to add",
        type: "number",
        demandOption: true,
      },

      color: {
        description: "Color of the card to add",
        type: "string",
        demandOption: true,
      },

      typeLine: {
        description: "TypeLine of the card to add",
        type: "string",
        demandOption: true,
      },

      oddity: {
        description: "Oddity of the card to add",
        type: "string",
        demandOption: true,
      },

      rules: {
        description: "Rules of the card to add",
        type: "string",
        demandOption: true,
      },

      strength: {
        description: "Strength of the card to add",
        type: "number",
        demandOption: false,
      },

      endurance: {
        description: "Endutance of the card to add",
        type: "number",
        demandOption: false,
      },

      loyalty: {
        description: "Loyalty of the card to add",
        type: "number",
        demandOption: false,
      },

      marketValue: {
        description: "Market value of the card to add",
        type: "number",
        demandOption: true,
      },
    },
    (argv) => {
      client.write(
        JSON.stringify({
          operation: "add",
          user: argv.user,
          id: argv.id,
          name: argv.name,
          mana: argv.mana,
          color: getColorsByName(argv.color),
          typeLine: getTypeLineByName(argv.typeLine),
          oddity: getOddityByName(argv.oddity),
          rules: argv.rules,
          strength: argv.strength,
          endurance: argv.endurance,
          marketValue: argv.marketValue,
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
        else if (response.result === "success")
          console.log(chalk.green(response.message));
        else console.log(chalk.red("Ocurrió algún errror"));
      });
    },
  )
  .help().argv;

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

yargs(hideBin(process.argv))
  .command(
    "update",
    "Updates a card of a collection",
    {
      user: {
        description: "User of the collection to modify",
        type: "string",
        demandOption: true,
      },

      id: {
        description: "Id of the card to modify",
        type: "number",
        demandOption: true,
      },

      name: {
        description: "Name of the card to modify",
        type: "string",
        demandOption: true,
      },

      mana: {
        description: "Mana of the card to modify",
        type: "number",
        demandOption: true,
      },

      color: {
        description: "Color of the card to modify",
        type: "string",
        demandOption: true,
      },

      typeLine: {
        description: "TypeLine of the card to modify",
        type: "string",
        demandOption: true,
      },

      oddity: {
        description: "Oddity of the card to modify",
        type: "string",
        demandOption: true,
      },

      rules: {
        description: "Rules of the card to modify",
        type: "string",
        demandOption: true,
      },

      strength: {
        description: "Strength of the card to modify",
        type: "number",
        demandOption: false,
      },

      endurance: {
        description: "Endutance of the card to modify",
        type: "number",
        demandOption: false,
      },

      loyalty: {
        description: "Loyalty of the card to modify",
        type: "number",
        demandOption: false,
      },

      marketValue: {
        description: "Market value of the card to modify",
        type: "number",
        demandOption: true,
      },
    },
    (argv) => {
      client.write(
        JSON.stringify({
          operation: "update",
          user: argv.user,
          id: argv.id,
          name: argv.name,
          mana: argv.mana,
          color: getColorsByName(argv.color),
          typeLine: getTypeLineByName(argv.typeLine),
          oddity: getOddityByName(argv.oddity),
          rules: argv.rules,
          strength: argv.strength,
          endurance: argv.endurance,
          marketValue: argv.marketValue,
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
        else if (response.result === "success")
          console.log(chalk.green(response.message));
        else console.log(chalk.red("Ocurrió algún errror"));
      });
    },
  )
  .help().argv;

yargs(hideBin(process.argv))
  .command(
    "read",
    "List a card of a collection",
    {
      user: {
        description: "User of the collection to show card",
        type: "string",
        demandOption: true,
      },

      id: {
        description: "Id of the card to show",
        type: "number",
        demandOption: true,
      },
    },
    (argv) => {
      client.write(
        JSON.stringify({
          operation: "read",
          user: argv.user,
          id: argv.id,
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
        else if (response.result === "success")
          console.log(
            `ID: ${response.message.id}, Nombre: ${response.message.name}, Mana: ${response.message.mana}, Color: ${chalk.hex(Correspondencies[response.message.color])(Colors[response.message.color])}, TypeLine: ${TypeLines[response.message.typeLine]}, Rareza: ${Oddities[response.message.oddity]}, Reglas: ${response.message.rules}, Fuerza: ${response.message.strength ?? ""}, Resistencia: ${response.message.endurance ?? ""}, Lealtad: ${response.message.loyalty ?? ""}, Valor de mercado: ${response.message.marketValue}`,
          );
        else console.log(chalk.red("Ocurrió algún errror"));
      });
    },
  )
  .help().argv;

yargs(hideBin(process.argv))
  .command(
    "remove",
    "Remove a card of a collection",
    {
      user: {
        description: "User of the collection to remove card",
        type: "string",
        demandOption: true,
      },

      id: {
        description: "Id of the card to remove",
        type: "number",
        demandOption: true,
      },
    },
    (argv) => {
      client.write(
        JSON.stringify({
          operation: "remove",
          user: argv.user,
          id: argv.id,
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
        else if (response.result === "success")
          console.log(chalk.green(response.message));
        else console.log(chalk.red("Ocurrió algún errror"));
      });
    },
  )
  .help().argv;
