export default class Socket {
  constructor(uri, opts, ...protocols) {
    this.isSecure = /^(wss:\/\/)/.test(uri) || /^(https:\/\/)/.test(uri);
    this.reconn = opts.reconnect !== undefined ? opts.reconnect : true;
    this.uri = uri;
    this.protocols = protocols;

    this.connected = false;

    this.constructor.createConnection.call(this);

    this.methods = new Map();
    this.methods.set("raw", new Set());
    this.methods.set("onopen", new Set());
    this.methods.set("onclose", new Set());
    this.methods.set("onerror", new Set());

    // These are the only events we care about in p4nth3rdrop
    this.methods.set("sub", new Set());
    this.methods.set("join", new Set());
    this.methods.set("message", new Set());
    this.methods.set("dropuser", new Set());
    this.methods.set("dropemotes", new Set());
    this.methods.set("weather", new Set());
    this.methods.set("raid", new Set());
    this.methods.set("cheer", new Set());
    this.methods.set("specialuserjoin", new Set());
    this.methods.set("settrailing", new Set());
  }

  static createConnection() {
    this.connection = new WebSocket(this.uri, ...this.protocols);
    this.connection.onopen = this.constructor.triggerOpen.bind(this);
    this.connection.onerror = this.constructor.triggerError.bind(this);
    this.connection.onmessage = this.constructor.parseIncoming.bind(this);
    this.connection.onclose = this.constructor.triggerClose.bind(this);
    this.connected = true;
  }

  set onopen(action) {
    if (typeof action !== "function") {
      throw new Error("Argument is not a function, can't call it!");
    }
    this.methods.onopen.push(action);
  }

  get onopen() {
    return this.methods.onopen;
  }

  set onclose(action) {
    if (typeof action !== "function") {
      throw new Error("Argument is not a function, can't call it!");
    }
    this.methods.onclose.push(action);
  }

  get onclose() {
    return this.methods.onclose;
  }

  set onerror(action) {
    if (typeof action !== "function") {
      throw new Error("Argument is not a function, can't call it!");
    }
    this.methods.onerror.push(action);
  }

  get onerror() {
    return this.methods.onerror;
  }

  set onmessage(action) {
    if (typeof action !== "function") {
      throw new Error("Argument is not a function, can't call it!");
    }
    this.methods.onmessage.push(action);
  }

  get onmessage() {
    return this.methods.onmessage;
  }

  static triggerClose(event) {
    this.connected = false;
    // Emit a disconnected event and set up an interval that tries to reconnect.
    // closeEvent.type && closeEvent.wasClean && closeEvent.code && closeEvent.reason
    this.methods.get("onclose").forEach((f) => {
      if (typeof f !== "function") {
        throw new Error("Argument is not a function, can't call it!");
      } else {
        if (event.target === this.connection) {
          f(
            event.type,
            event.code,
            event.reason,
            event.timeStamp,
            event.wasClean
          );
        }
      }
    });
    if (event.target === this.connection) {
      // this.S.CLOSED && this.S.CLOSING && this.S.OPEN && this.S.CONNECTING;
      if (!event.wasClean) {
        if (event.code === 1006) {
          // Abnormal Closure, try to reconnect!
          this.reconnect();
        }
      }
    }
  }

  static triggerError(event) {
    this.methods.get("onerror").forEach((f) => {
      if (typeof f !== "function") {
        throw new Error("Argument is not a function, can't call it!");
      } else {
        if (event.target === this.connection) {
          f(event.type, event.code, event.reason, event.timeStamp);
        }
      }
    });
  }

  static parseIncoming({
    currentTarget,
    data,
    type,
    origin,
    paths,
    ports,
    target,
    timeStamp,
  }) {
    data = JSON.parse(data);

    let evt = !!data.event ? data.event.toLowerCase() : "raw";
    console.log(evt);
    this.methods.get(evt).forEach((f) => {
      console.dir(f);

      if (typeof f !== "function") {
        throw new Error("Argument is not a function, can't call it!");
      } else {
        if (target === this.connection) {
          f(data, type, timeStamp);
        }
      }
    });
  }

  static triggerOpen(event) {
    this.methods.get("onopen").forEach((f) => {
      if (typeof f !== "function") {
        throw new Error("Argument is not a function, can't call it!");
      } else {
        if (event.target === this.connection) {
          f(event.type, event.timeStamp);
        }
      }
    });
  }

  on(ev, cb) {
    ev = ev.toLowerCase();
    if (typeof cb !== "function") {
      throw new Error(
        "The second arguments must be a function to call on event."
      );
    }

    let to;

    switch (ev) {
      case "close":
        to = "onclose";
        break;
      case "open":
        to = "onopen";
        break;
      case "cheer":
        to = "cheer";
        break;
      case "settrailing":
        to = "settrailing";
        break;
      case "sub":
        to = "sub";
        break;
      case "dropuser":
        to = "dropuser";
        break;
      case "dropemotes":
        to = "dropemotes";
        break;
      case "raid":
        to = "raid";
        break;
      case "specialuserjoin":
        to = "specialuserjoin";
        break;
      case "weather":
        to = "weather";
        break;
      default:
        to = "raw";
    }

    if (this.methods.has(to)) {
      this.methods.get(to).add(cb);
    }

    return;
  }

  reconnect() {
    // Check if the connection is actually down
    if (this.connection.readyState === 3) {
      // readyState = 3; Not Connected, proceed.
      if (this.reconn) {
        // The reconnect flag is set in options so we should try to reconnect
        this.constructor.createConnection.call(this);
      }
    }
  }

  disconnect() {
    this.connection.close(1000, "Disconnect");
  }

  send(data) {
    if (typeof data === "string") {
      return this.connection.send(data);
    }
    if (Array.isArray(data)) {
      return this.connection.send(JSON.stringify({ data: data }));
    }
  }
}
