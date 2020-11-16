import net from "net";
import tls from "tls";
import { EventEmitter } from "events";

// Types
import { SMTPOptions } from "../Types/SMTPOptions";
import { NSocket, TSocket } from "../Types/Socket";

class SMTP extends EventEmitter {
  private conn: net.Server | tls.Server;
  private id: number = 0;

  constructor(private opts?: SMTPOptions) {
    super();

    if (opts.isSecure)
      this.conn = tls.createServer({
        key: opts.cert.key,
        cert: opts.cert.cert,
      });
    else this.conn = net.createServer();

    const port = opts.isSecure ? 465 : 25;
    this.conn.listen(port, () => console.log("Now Starting up on port", port));

    this.start();
  }

  public genID() {
    const date = BigInt(Date.now());
    const buf = Buffer.alloc(12);

    buf.writeBigInt64LE(date);
    buf.writeUInt32LE(this.id++, 8);

    return buf
      .toString("hex")
      .match(/.{1,4}/g)
      .join("-");
  }

  /**
   * Writes data to the socket, bind the socket as the 'this' object
   */
  private writeData(data: string | Buffer) {
    const self = (this as any) as TSocket | NSocket;
    return new Promise((resolve) => self.write(data + "\r\n", resolve));
  }

  private getEmail(key: string, data: string) {
    let email = data.split(key).join("").trim();

    if (email.startsWith("<")) email = email.slice(1);
    if (email.endsWith(">")) email = email.slice(0, -1);

    const eData = email.split("@");
    return {
      user: eData[0],
      host: eData[1],
    };
  }

  private async handleData(socket: TSocket | NSocket, chunk: Buffer) {
    const str = chunk.toString()?.trim();
    const infos = str.split(/ +/g);

    const cmd = infos[0]?.trim();
    const cmdData = infos.slice(1).join("")?.trim();

    const writer = this.writeData.bind(socket);

    switch (cmd) {
      case "HELO": {
        await writer("502 Please use the EHLO command instead.");
        break;
      }

      case "EHLO": {
        socket.data.host = cmdData;
        await writer("220 Ready for mail");
        break;
      }

      case "MAIL": {
        if (!socket.data.host)
          return await writer(
            "503 The server has encountered a bad sequence of commands."
          );

        const email = this.getEmail("FROM:", cmdData);
        socket.data.from = email;

        await writer("250 OK");
        break;
      }

      case "RCPT": {
        if (!socket.data.from)
          return await writer(
            "503 The server has encountered a bad sequence of commands."
          );

        const email = this.getEmail("TO:", cmdData);
        socket.data.to = email;

        await writer("250 OK");
        break;
      }

      case "DATA": {
        if (!socket.data.from || !socket.data.to)
          return await writer(
            "503 The server has encountered a bad sequence of commands."
          );
        break;
      }

      default: {
        if (str.endsWith(".")) {
          socket.data.msg = str;
          await writer("250 OK");
          socket.end();
        }
        break;
      }
    }
  }

  private start() {
    if (this.opts.isSecure) {
      const serv = this.conn as tls.Server;
      serv.on("newSession", (id, data) => {
        console.log(id, data);

        serv.on("secureConnection", (socket: TSocket) => {
          socket.on("data", (chunk: Buffer) => this.handleData(socket, chunk));
        });
      });
    } else {
      const serv = this.conn as net.Server;
      serv.on("connection", async (socket: NSocket) => {
        socket.data = {
          id: this.genID(),
        };

        console.log("New Connection:", socket.data);

        socket.on("close", (err) => {
          if (err) console.log("Socket", socket.data, "Errored out.");
          else console.log("Socket", socket.data, "disconnected");
        });

        socket.on("data", (chunk: Buffer) => this.handleData(socket, chunk));
      });
    }
  }
}

export default SMTP;
