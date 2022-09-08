export interface IMedlineValue {
  _value: string;
}

export interface IMedlineType extends IMedlineValue {
  type: string;
}

export interface IMedlineId extends IMedlineValue {
  lang: string;
}

export interface IMedlineScheme {
  scheme: string;
  term: string;
}

export interface IMedlineAuthor {
  name: IMedlineValue;
  uri: IMedlineValue;
}

export interface IMedlineLink {
  href: string;
  rel: string;
}

export interface IMedlinEntry {
  id: IMedlineValue;
  link: IMedlineLink[];
  summary: IMedlineType;
  title: IMedlineType;
  updated: IMedlineValue;
}

export interface IMedlineFeed {
  author: IMedlineAuthor;
  base: string;
  category: IMedlineScheme[];
  entry: IMedlinEntry[];
  id: IMedlineValue;
  lang: string;
  subtitle: IMedlineType;
  title: IMedlineType;
  updated: IMedlineValue;
  xsi: string;
}

export interface IMedline {
  feed: IMedlineFeed;
}

export interface IMedlineRequest {
  languageCode: string;
  problemCode: string;
  problemCodingSystem: string;
  problemName: string;
}
