import P5 from "p5";
import { Validator } from "@ryannhg/safe-json";

interface Emotes {
  config: {
    baseUrl: string;
    sizes: string[];
  };
  groups: {
    [key: string]: string[];
  };
}

interface Velocity {
  min: number;
  max: number;
}

interface DropInstance {
  p5: P5;
  image: P5.Image;
  landed: boolean;
  wobble: number;
  position: P5.Vector;
  landTime: number;
}

interface DropConfig {
  emoteMultiplier: number;
  velocities: Velocity;
  strategy: string;
  size?: string;
}

interface Config {
  maxVisibleDrops: number;
  test: boolean;
  dropTimeout: number;
  drops: {
    [key: string]: DropConfig;
  };
}

interface Strategies {
  [key: string]: (dropConfig: DropConfig) => void;
}

type Fields<T> = {
  [K in keyof T]: Validator<T[K]>;
};

type SocketEvent<T> = {
  data: T;
};

export enum MainframeEvents {
  sub = "sub",
  dropuser = "dropuser",
  dropemotes = "dropemotes",
  weather = "weather",
  raid = "raid",
  cheer = "cheer",
  specialuserjoin = "specialuserjoin",
  settrailing = "settrailing",
}

export type {
  Velocity,
  DropInstance,
  DropConfig,
  Config,
  Emotes,
  Strategies,
  Fields,
  SocketEvent,
};
