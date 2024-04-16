import { EventEmitter } from "events";

/**
 * This class is responsible for emitting event message when data is done reading.
 */
export class MessageEventEmitter extends EventEmitter {
  /**
   * The constructor check if the message is complete and emits "message" event.
   * @param connection The socket connection.
   */
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
