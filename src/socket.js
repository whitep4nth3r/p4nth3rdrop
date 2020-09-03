export default class Socket {
  constructor(uri, opts, ...protocols) {
    this.isSecure = /^(wss:\/\/)/.test(uri);
    this.reconn = opts.reconnect !== undefined ? opts.reconnect : true;
    this.uri = uri;
    this.protocols = protocols;

    this.connected = false;

    this.constructor.createConnection.call(this);

    this.methods = {
      onopen: [],
      onclose: [],
      onerror: [],
      onmessage: [],
    };
  }

  static createConnection() {
    this.connection = new WebSocket(this.uri, ...this.protocols);
    this.connection.onopen = this.constructor.triggerOpen.bind(this);
    this.connection.onerror = this.constructor.triggerError.bind(this);
    this.connection.onmessage = this.constructor.triggerMessage.bind(this);
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
    this.methods.onclose.forEach((f) => {
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
    this.methods.onerror.forEach((f) => {
      if (typeof f !== "function") {
        throw new Error("Argument is not a function, can't call it!");
      } else {
        if (event.target === this.connection) {
          f(event.type, event.code, event.reason, event.timeStamp);
        }
      }
    });
  }

  static triggerMessage(event) {
    this.methods.onmessage.forEach((f) => {
      if (typeof f !== "function") {
        throw new Error("Argument is not a function, can't call it!");
      } else {
        if (event.target === this.connection) {
          f(event.data, event.type, event.timeStamp);
        }
      }
    });
  }

  static triggerOpen(event) {
    this.methods.onopen.forEach((f) => {
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
    if (ev === "close") {
      this.methods.onclose.push(cb);
    } else if (ev === "open") {
      this.methods.onopen.push(cb);
    } else if (ev === "error") {
      this.methods.onerror.push(cb);
    } else if (ev === "message") {
      this.methods.onmessage.push(cb);
    } else {
      return;
    }
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
      this.connection.send(data);
    }
    if (Array.isArray(data)) {
    }
  }
}
