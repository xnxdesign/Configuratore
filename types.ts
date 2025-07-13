
export enum Flow {
  Stradale = 'stradale',
  Motard = 'motard',
}

export enum GraphicType {
  Meta = 'meta',
  Intero = 'intero',
}

export enum FinishType {
  Lucida = 'lucida',
  Opaca = 'opaca',
  Cromata = 'cromata',
  Olografica = 'olografica',
  Glitter = 'glitter',
}

export interface StradaleConfiguration {
  type: Flow.Stradale;
  graficaType: GraphicType;
  primaryColor: string;
  secondaryColor?: string;
  texture?: File;
  finish: FinishType;
}

export interface KitOptions {
  type: GraphicType;
  primaryColor: string;
  secondaryColor?: string;
  texture?: File;
  finish: FinishType;
}

export interface MotardConfiguration {
  type: Flow.Motard;
  kits: {
    canale: boolean;
    raggi: boolean;
    nipples: boolean;
  };
  canaleOptions: KitOptions;
  raggiColor: string;
  nipplesColor: string;
}

export type Configuration = StradaleConfiguration | MotardConfiguration;

export interface ColorInfo {
  name: string;
  hex: string;
  style: string;
}

export interface Prices {
  [key: string]: number;
}

export interface ProductIds {
  [key: string]: string;
}
