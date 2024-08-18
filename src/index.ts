import {Paths, TranslationReplacements} from "./types";

export interface MakeTranslatorConfig<Shape, T extends { [key: string]: Shape } = { [key: string]: Shape }> {
    translations: T,
    fallbackLocale?: keyof T,
    hidePluralisationWarnings?: boolean;
}

function deepGet(obj: any, path: string): string | undefined {
    return path.split('.').reduce((o, i) => o?.[i], obj);
}

const applyReplacements = (message: string, replacements: TranslationReplacements) => {
    for (const replacementName in replacements) {
        const replacement = replacements[replacementName]?.toString() || "";

        // 'welcome' => 'Welcome, :name' => 'Welcome, dayle'
        message = message.replace(
            new RegExp(':' + replacementName, 'g'),
            replacement
        );

        // 'welcome' => 'Welcome, :NAME' => 'Welcome, DAYLE'
        message = message.replace(
            new RegExp(':' + replacementName.toUpperCase(), 'g'),
            replacement.toUpperCase()
        );

        // 'welcome' => 'Welcome, :Name' => 'Welcome, Dayle'
        message = message.replace(
            new RegExp(':' + (replacementName.charAt(0).toUpperCase() + replacementName.slice(1)), 'g'),
            replacement.charAt(0).toUpperCase() + replacement.slice(1)
        );
    }

    return message;
};

function makeTranslator<Shape, T extends { [key: string]: Shape } = { [key: string]: Shape }>({
    translations,
    fallbackLocale,
    hidePluralisationWarnings,
}: MakeTranslatorConfig<Shape, T>) {
    return function translate(key: Paths<Shape>, locale: keyof T, replacements?: number | string | TranslationReplacements) {
        let translated = deepGet(translations[locale], key);
        if (!translated && fallbackLocale)
            translated = deepGet(translations[fallbackLocale], key);

        // If no translations, return key
        if (!translated)
            return key;

        let replacementsObject = null;
        if (replacements) {
            if (typeof replacements === "object")
                replacementsObject = replacements;

            if (typeof replacements === "number")
                replacementsObject = {count: replacements};

            if (typeof replacements === "string")
                replacementsObject = {default: replacements};
        }

        // If no need for customization, simply return translated string
        if (!replacementsObject)
            return translated;

        /*
         * If there is pluralization, first split by | to extract different variants.
         * In english there are only 2 variants, singular is only needed when count === 1, otherwise
         * plural translation is used.
         * If count is empty, pluralization is not needed.
         */
        if (replacementsObject.count !== undefined) {
            const variants = translated.split('|');

            if (variants.length < 2 && !hidePluralisationWarnings) {
                console.warn('Translation for "' + key + '" is supposed to have pluralization variants');
            }

            translated = variants.length === 1 ? variants[0] : variants[replacementsObject.count === 1 ? 0 : 1];

            if (translated === undefined) {
                console.warn('Missing pluralization variant of "' + key + '" for count "' + replacementsObject.count + '"');
                return key;
            }
        }

        // Apply replacements if needed
        if (replacementsObject)
            translated = applyReplacements(translated, replacementsObject);

        return translated;
    };
}

export default makeTranslator;
