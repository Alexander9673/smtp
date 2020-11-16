import net from "net";
import tls from "tls";

export interface Email {
  user: string;
  host: string;
}

export interface SocketData {
  id: string;
  host?: string;
  from?: Email;
  msg?: string;
  to?: Email;
}

export interface NSocket extends net.Socket {
  data: SocketData;
}

export interface TSocket extends tls.TLSSocket {
  data: SocketData;
}
