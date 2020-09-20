const EVENT_CODES = {
  NORMAL_CLOSURE: 1000,
  ABNORMAL_CLOSURE: 1006,
};

interface SocketOptions {
  reconnect: boolean;
}

type Callback = Function;

type TrustedEventMap = {
  raw: Set<Callback>;
  open: Set<Callback>;
  close: Set<Callback>;
  error: Set<Callback>;
  sub: Set<Callback>;
  join: Set<Callback>;
  message: Set<Callback>;
  dropuser: Set<Callback>;
  dropemotes: Set<Callback>;
  weather: Set<Callback>;
  raid: Set<Callback>;
  cheer: Set<Callback>;
  specialuserjoin: Set<Callback>;
  settrailing: Set<Callback>;
};

type TrustedEvent = keyof TrustedEventMap;

export default class Socket {
  isSecure: boolean;
  reconn: boolean;
  connected: boolean;
  methods: TrustedEventMap;
  connection: WebSocket;

  constructor(private uri: string, private opts: SocketOptions) {
    this.isSecure = /^(wss:\/\/)/.test(uri) || /^(https:\/\/)/.test(uri);
    this.reconn = opts.reconnect !== undefined ? opts.reconnect : true;

    this.connected = false;

    this.connection = new WebSocket(this.uri);
    this.createConnection();

    this.methods = {
      raw: new Set(),
      open: new Set(),
      close: new Set(),
      error: new Set(),
      sub: new Set(),
      join: new Set(),
      message: new Set(),
      dropuser: new Set(),
      dropemotes: new Set(),
      weather: new Set(),
      raid: new Set(),
      cheer: new Set(),
      specialuserjoin: new Set(),
      settrailing: new Set(),
    };
  }

  createConnection() {
    this.connection = new WebSocket(this.uri);
    this.connection.onopen = (event: Event) => this.triggerOpen(event);
    this.connection.onerror = (event: Event) => this.triggerError(event);
    this.connection.onmessage = (messageEvent: MessageEvent) =>
      this.parseIncoming(messageEvent);
    this.connection.onclose = (event: CloseEvent) => this.triggerClose(event);
    this.connected = true;
  }

  triggerOpen(event: Event) {
    this.methods.open.forEach((func) => {
      if (event.target === this.connection) {
        func(event);
      }
    });
  }

  triggerClose(event: CloseEvent) {
    this.connected = false;

    this.methods.close.forEach((func) => {
      if (event.target === this.connection) {
        func(event);
      }
    });

    if (
      event.target === this.connection &&
      !event.wasClean &&
      event.code === EVENT_CODES.ABNORMAL_CLOSURE
    ) {
      this.reconnect();
    }
  }

  triggerError(event: Event) {
    this.methods.error.forEach((func) => {
      if (event.target === this.connection) {
        func(event);
      }
    });
  }

  parseIncoming(event: MessageEvent) {
    const json: any = JSON.parse(event.data);
    let evt: TrustedEvent = "raw";

    if (json && typeof json === "object" && typeof json.event === "string") {
      evt = json.event.toLowerCase();
    }

    let callbacks = this.methods[evt];

    if (!callbacks) callbacks = this.methods.raw;

    callbacks.forEach((func) => {
      if (event.target === this.connection) {
        func(event);
      }
    });
  }

  on(event: TrustedEvent, callback: Callback) {
    this.methods[event].add(callback);
    return;
  }

  reconnect() {
    if (this.connection.readyState === WebSocket.CLOSED) {
      if (this.reconn) {
        this.createConnection();
      }
    }
  }

  disconnect() {
    this.connection.close(EVENT_CODES.NORMAL_CLOSURE, "Disconnect");
  }
}
