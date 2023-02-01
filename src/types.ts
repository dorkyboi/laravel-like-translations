type Dot<T extends string, U extends string> = "" extends U ? T : `${T}.${U}`;
export type Paths<T> = T extends string
    ? ""
    : { [K in Extract<keyof T, string>]: Dot<K, Paths<T[K]>> }[Extract<keyof T, string>];

export type TranslationReplacements = { [key: string]: string | number | undefined | null };
