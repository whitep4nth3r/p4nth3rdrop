import P5 from "p5";
import { Validator } from "@ryannhg/safe-json";

interface Emotes {
  config: {
    baseUrl: string;
    baseUrlV2: string;
    sizes: string[];
  };
  groups: {
    [key: string]: { v1: string[]; v2: string[] } | any;
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
  teammemberjoin = "teammemberjoin",
  yeetuser = "yeetuser",
  follow = "follow",
  imagedrop = "imagedrop",
  startgiveaway = "startgiveaway",
  endgiveaway = "endgiveaway",
  drawgiveaway = "drawgiveaway",
  announcegiveaway = "announcegiveaway",
  merch = "merch",
}

interface SocketOptions {
  reconnect: boolean;
}

type Callback = (data: unknown) => void;

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
  teammemberjoin: Set<Callback>;
  follow: Set<Callback>;
  yeetuser: Set<Callback>;
  imagedrop: Set<Callback>;
  startgiveaway: Set<Callback>;
  endgiveaway: Set<Callback>;
  drawgiveaway: Set<Callback>;
  announcegiveaway: Set<Callback>;
  merch: Set<Callback>;
};

type TrustedEvent = keyof TrustedEventMap;

export enum ImageDrops {
  Netlify = "netlify",
  Partner = "partner",
  Merch = "merch",
  Battlesnake = "battlesnake",
  TheClaw = "theclaw",
  Spooky = "spooky",
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
  SocketOptions,
  Callback,
  TrustedEventMap,
  TrustedEvent,
};
