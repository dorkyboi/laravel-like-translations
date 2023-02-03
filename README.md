# laravel-like-translations
Javascript internalisation helper with nested translations and dot notation access.
```javascript
translate("ke", "en");
//          ^
//          "key1"
//          "keys.a"
//          "keys.b"
```

Heavily inspired by Laravel's internationalisation system

## Installation
npm: `npm i laravel-like-translations`

yarn: `yarn add laravel-like-translations`

## Usage

#### 1. Prepare your translation objects.

```typescript
export interface TranslationShape {
    key1: string,
    keys: {
        a: string,
        b: string,
    },
}
```
```typescript
import { TranslationShape } from "./types";

const En: TranslationShape = {
    key1: "Key 1",
    keys: {
        a: "A",
        b: "B",
    },
};

export default En;
```

#### 2. Make your translation helper.

```typescript
import makeTranslator from "laravel-like-translations";
import { TranslationShape } from "./types";
import En from "./lang/en";

const translator = makeTranslator<TranslationShape>({
    translations: {
        en: En,
    },
    // Optional fallback locale
    fallbackLocale: 'en',
});

export default translator;
```

#### 3. Use your translation helper

```typescript
import translator from "./helpers/translator";
// ...
const translated = translator("key1", "en");
```

## React implementation

#### Create custom hook that retrieves locale and subscribes to locale changes
```typescript
import makeTranslator from "laravel-like-translations";
import { Paths, TranslationReplacements } from "laravel-like-translations/lib/types";
import translator from "./helpers/translator";
import { TranslationShape } from "./types";

function useTranslate() {
    // Implement your locale extractor, for example:
    const locale = useSelector(state => state.app.locale);

    // Create HOC for your translation helper
    function translate(key: Paths<TranslationShape>, replacements?: TranslationReplacements) {
        // HOC inserts extracted locale for you
        return translator(key, locale, replacements);
    }

    // Memoize your HOC if you need to
    return React.useCallback(translate);
}

export default useTranslate;
```

```typescript jsx
import useTranslate from "./hooks/useTranslate";

function YourComponent() {
    const __ = useTranslate();

    return (
        <p>
            {__("key1")}
        </p>
    );
}
```
