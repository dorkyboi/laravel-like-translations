import { Paths, TranslationReplacements } from "./types";
export interface MakeTranslatorConfig<Shape, T extends {
    [key: string]: Shape;
} = {
    [key: string]: Shape;
}> {
    translations: T;
    fallbackLocale?: keyof T;
}
declare function makeTranslator<Shape, T extends {
    [key: string]: Shape;
} = {
    [key: string]: Shape;
}>({ translations, fallbackLocale, }: MakeTranslatorConfig<Shape, T>): (key: Paths<Shape>, locale: keyof T, replacements?: number | string | TranslationReplacements) => string;
export default makeTranslator;
//# sourceMappingURL=index.d.ts.map