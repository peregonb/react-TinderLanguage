import {getSvgPath} from 'figma-squircle';

export const getUniqID = (): string => Math.random().toString(36).slice(2);

export const debounce = <T extends unknown[]>(func: (...args: T) => void, wait: number = 100) => {
    let timeout: NodeJS.Timeout;
    return (...args: T) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
};

type IClipCorners = {
    height: number;
    width: number;
    radius: number;
    smoothing: number;
}

export const clipCorners = ({
                                height,
                                width,
                                radius,
                                smoothing = 1
                            }: IClipCorners): string => {
    const svgPath = getSvgPath({
        width: width,
        height: height,
        cornerRadius: radius,
        cornerSmoothing: smoothing,
    });

    return `path('${svgPath}')`;
};

export const languages: Array<{ value: string, label: string }> = [
    {"value": "abkhazian", "label": "Abkhazian 🇬🇪"},
    {"value": "afrikaans", "label": "Afrikaans 🇿🇦"},
    {"value": "albanian", "label": "Albanian 🇦🇱"},
    {"value": "amharic", "label": "Amharic 🇪🇹"},
    {"value": "arabic", "label": "Arabic 🇸🇦"},
    {"value": "armenian", "label": "Armenian 🇦🇲"},
    {"value": "assamese", "label": "Assamese 🇮🇳"},
    {"value": "aymara", "label": "Aymara 🇧🇴"},
    {"value": "azerbaijani", "label": "Azerbaijani 🇦🇿"},
    {"value": "bashkir", "label": "Bashkir 🇷🇺"},
    {"value": "basque", "label": "Basque 🇪🇸"},
    {"value": "belarusian", "label": "Belarusian 🇧🇾"},
    {"value": "bengali", "label": "Bengali 🇧🇩"},
    {"value": "bihari", "label": "Bihari 🇮🇳"},
    {"value": "bislama", "label": "Bislama 🇻🇺"},
    {"value": "bosnian", "label": "Bosnian 🇧🇦"},
    {"value": "breton", "label": "Breton 🇫🇷"},
    {"value": "bulgarian", "label": "Bulgarian 🇧🇬"},
    {"value": "burmese", "label": "Burmese 🇲🇲"},
    {"value": "catalan", "label": "Catalan 🇪🇸"},
    {"value": "chinese", "label": "Chinese 🇨🇳"},
    {"value": "corsican", "label": "Corsican 🇫🇷"},
    {"value": "croatian", "label": "Croatian 🇭🇷"},
    {"value": "czech", "label": "Czech 🇨🇿"},
    {"value": "danish", "label": "Danish 🇩🇰"},
    {"value": "divehi", "label": "Divehi 🇲🇻"},
    {"value": "dutch", "label": "Dutch 🇳🇱"},
    {"value": "dzongkha", "label": "Dzongkha 🇧🇹"},
    {"value": "english", "label": "English 🇬🇧"},
    {"value": "esperanto", "label": "Esperanto 🇪🇺"},
    {"value": "estonian", "label": "Estonian 🇪🇪"},
    {"value": "faroese", "label": "Faroese 🇫🇴"},
    {"value": "fijian", "label": "Fijian 🇫🇯"},
    {"value": "finnish", "label": "Finnish 🇫🇮"},
    {"value": "french", "label": "French 🇫🇷"},
    {"value": "frisian", "label": "Frisian 🇳🇱"},
    {"value": "galician", "label": "Galician 🇪🇸"},
    {"value": "georgian", "label": "Georgian 🇬🇪"},
    {"value": "german", "label": "German 🇩🇪"},
    {"value": "greek", "label": "Greek 🇬🇷"},
    {"value": "greenlandic", "label": "Greenlandic 🇬🇱"},
    {"value": "guarani", "label": "Guarani 🇵🇾"},
    {"value": "gujarati", "label": "Gujarati 🇮🇳"},
    {"value": "haitian creole", "label": "Haitian Creole 🇭🇹"},
    {"value": "hausa", "label": "Hausa 🇳🇬"},
    {"value": "hebrew", "label": "Hebrew 🇮🇱"},
    {"value": "hindi", "label": "Hindi 🇮🇳"},
    {"value": "hungarian", "label": "Hungarian 🇭🇺"},
    {"value": "icelandic", "label": "Icelandic 🇮🇸"},
    {"value": "igbo", "label": "Igbo 🇳🇬"},
    {"value": "indonesian", "label": "Indonesian 🇮🇩"},
    {"value": "interlingua", "label": "Interlingua 🌐"},
    {"value": "inuktitut", "label": "Inuktitut 🇨🇦"},
    {"value": "inupiak", "label": "Inupiak 🇺🇸"},
    {"value": "irish", "label": "Irish 🇮🇪"},
    {"value": "italian", "label": "Italian 🇮🇹"},
    {"value": "japanese", "label": "Japanese 🇯🇵"},
    {"value": "javanese", "label": "Javanese 🇮🇩"},
    {"value": "kannada", "label": "Kannada 🇮🇳"},
    {"value": "kashmiri", "label": "Kashmiri 🇮🇳"},
    {"value": "kazakh", "label": "Kazakh 🇰🇿"},
    {"value": "khmer", "label": "Khmer 🇰🇭"},
    {"value": "kinyarwanda", "label": "Kinyarwanda 🇷🇼"},
    {"value": "kirundi", "label": "Kirundi 🇧🇮"},
    {"value": "korean", "label": "Korean 🇰🇷"},
    {"value": "kurdish", "label": "Kurdish 🇮🇶"},
    {"value": "kyrgyz", "label": "Kyrgyz 🇰🇬"},
    {"value": "lao", "label": "Lao 🇱🇦"},
    {"value": "latin", "label": "Latin 🇻🇦"},
    {"value": "latvian", "label": "Latvian 🇱🇻"},
    {"value": "lingala", "label": "Lingala 🇨🇩"},
    {"value": "lithuanian", "label": "Lithuanian 🇱🇹"},
    {"value": "luxembourgish", "label": "Luxembourgish 🇱🇺"},
    {"value": "macedonian", "label": "Macedonian 🇲🇰"},
    {"value": "malagasy", "label": "Malagasy 🇲🇬"},
    {"value": "malay", "label": "Malay 🇲🇾"},
    {"value": "malayalam", "label": "Malayalam 🇮🇳"},
    {"value": "maltese", "label": "Maltese 🇲🇹"},
    {"value": "maori", "label": "Maori 🇳🇿"},
    {"value": "marathi", "label": "Marathi 🇮🇳"},
    {"value": "marshallese", "label": "Marshallese 🇲🇭"},
    {"value": "mongolian", "label": "Mongolian 🇲🇳"},
    {"value": "nauru", "label": "Nauru 🇳🇷"},
    {"value": "navajo", "label": "Navajo 🇺🇸"},
    {"value": "nepali", "label": "Nepali 🇳🇵"},
    {"value": "northern sami", "label": "Northern Sami 🇳🇴"},
    {"value": "norwegian", "label": "Norwegian 🇳🇴"},
    {"value": "occitan", "label": "Occitan 🇫🇷"},
    {"value": "oriya", "label": "Oriya 🇮🇳"},
    {"value": "oromo", "label": "Oromo 🇪🇹"},
    {"value": "ossetian", "label": "Ossetian 🇬🇪"},
    {"value": "pali", "label": "Pali 🇮🇳"},
    {"value": "pashto", "label": "Pashto 🇦🇫"},
    {"value": "persian", "label": "Persian 🇮🇷"},
    {"value": "polish", "label": "Polish 🇵🇱"},
    {"value": "portuguese", "label": "Portuguese 🇵🇹"},
    {"value": "punjabi", "label": "Punjabi 🇮🇳"},
    {"value": "quechua", "label": "Quechua 🇵🇪"},
    {"value": "romanian", "label": "Romanian 🇷🇴"},
    {"value": "romansh", "label": "Romansh 🇨🇭"},
    {"value": "russian", "label": "Russian 🇷🇺"},
    {"value": "samoan", "label": "Samoan 🇼🇸"},
    {"value": "sango", "label": "Sango 🇨🇫"},
    {"value": "sanskrit", "label": "Sanskrit 🇮🇳"},
    {"value": "sardinian", "label": "Sardinian 🇮🇹"},
    {"value": "scottish gaelic", "label": "Scottish Gaelic 🏴󠁧󠁢󠁳󠁣󠁴󠁿"},
    {"value": "serbian", "label": "Serbian 🇷🇸"},
    {"value": "sesotho", "label": "Sesotho 🇱🇸"},
    {"value": "setswana", "label": "Setswana 🇧🇼"},
    {"value": "shona", "label": "Shona 🇿🇼"},
    {"value": "sindhi", "label": "Sindhi 🇵🇰"},
    {"value": "sinhala", "label": "Sinhala 🇱🇰"},
    {"value": "siswati", "label": "Siswati 🇸🇿"},
    {"value": "slovak", "label": "Slovak 🇸🇰"},
    {"value": "slovenian", "label": "Slovenian 🇸🇮"},
    {"value": "somali", "label": "Somali 🇸🇴"},
    {"value": "spanish", "label": "Spanish 🇪🇸"},
    {"value": "sundanese", "label": "Sundanese 🇮🇩"},
    {"value": "swahili", "label": "Swahili 🇹🇿"},
    {"value": "swedish", "label": "Swedish 🇸🇪"},
    {"value": "tagalog", "label": "Tagalog 🇵🇭"},
    {"value": "tahitian", "label": "Tahitian 🇵🇫"},
    {"value": "tajik", "label": "Tajik 🇹🇯"},
    {"value": "tamil", "label": "Tamil 🇮🇳"},
    {"value": "tatar", "label": "Tatar 🇷🇺"},
    {"value": "telugu", "label": "Telugu 🇮🇳"},
    {"value": "thai", "label": "Thai 🇹🇭"},
    {"value": "tibetan", "label": "Tibetan 🇨🇳"},
    {"value": "tigrinya", "label": "Tigrinya 🇪🇷"},
    {"value": "tonga", "label": "Tonga 🇹🇴"},
    {"value": "tsonga", "label": "Tsonga 🇿🇦"},
    {"value": "turkish", "label": "Turkish 🇹🇷"},
    {"value": "turkmen", "label": "Turkmen 🇹🇲"},
    {"value": "twi", "label": "Twi 🇬🇭"},
    {"value": "uighur", "label": "Uighur 🇨🇳"},
    {"value": "ukrainian", "label": "Ukrainian 🇺🇦"},
    {"value": "urdu", "label": "Urdu 🇵🇰"},
    {"value": "uzbek", "label": "Uzbek 🇺🇿"},
    {"value": "venda", "label": "Venda 🇿🇦"},
    {"value": "vietnamese", "label": "Vietnamese 🇻🇳"},
    {"value": "volapuk", "label": "Volapük 🌐"},
    {"value": "walloon", "label": "Walloon 🇧🇪"},
    {"value": "welsh", "label": "Welsh 🏴󠁧󠁢󠁷󠁬󠁳󠁿"},
    {"value": "wolof", "label": "Wolof 🇸🇳"},
    {"value": "xhosa", "label": "Xhosa 🇿🇦"},
    {"value": "yiddish", "label": "Yiddish 🇮🇱"},
    {"value": "yoruba", "label": "Yoruba 🇳🇬"},
    {"value": "zhuang", "label": "Zhuang 🇨🇳"},
    {"value": "zulu", "label": "Zulu 🇿🇦"}
];

export enum ELanguageLevel {
    A1 = 'A1',
    A2 = 'A2',
    B1 = 'B1',
    B2 = 'B2',
    C1 = 'C1',
    C2 = 'C2',
}

export const languageLevel: Array<{ value: ELanguageLevel, label: string }> = [
    {"value": ELanguageLevel.A1, "label": "A1 Beginner"},
    {"value": ELanguageLevel.A2, "label": "A2 Elementary"},
    {"value": ELanguageLevel.B1, "label": "B1 Intermediate"},
    {"value": ELanguageLevel.B2, "label": "B2 Upper-Intermediate"},
    {"value": ELanguageLevel.C1, "label": "C1 Advanced"},
    {"value": ELanguageLevel.C2, "label": "C2 Mastery"},
]

export const languageListLimit: Array<{ value: string, label: string }> = [
    {"value": "5 - 10", "label": "5 - 10"},
    {"value": "10 - 20", "label": "10 - 20"},
    {"value": "20 - 30", "label": "20 - 30"},
    {"value": "30 - 40", "label": "30 - 40"},
    {"value": "40 - 50", "label": "40 - 50"},
]

export const LLM: Array<{ value: string, label: string }> = [
    {"value": "gpt-5", "label": "gpt-5"},
    {"value": "gpt-5-mini", "label": "gpt-5-mini"},
    {"value": "gpt-5-nano", "label": "gpt-5-nano"},
    {"value": "claude-opus-4-1", "label": "claude-opus-4-1"},
    {"value": "claude-sonnet-4", "label": "claude-sonnet-4"},
    {"value": "deepseek-ai/DeepSeek-R1", "label": "DeepSeek-R1"},
    {"value": "grok-3", "label": "grok-3"},
    {"value": "grok-3-fast", "label": "grok-3-fast"},
    {"value": "grok-3-mini", "label": "grok-3-mini"},
    {"value": "openrouter:google/gemini-2.5-flash", "label": "gemini-2.5-flash"},
    {"value": "openrouter:google/gemini-2.5-pro", "label": "gemini-2.5-pro"},
]

export const dynamicFontSize = (text: string) => {
    const baseFontSize = 32;
    const minFontSize = 20;

    return Math.max(minFontSize, baseFontSize - text.length * 0.5);
}

interface ISelectLabel {
    value: string,
    label: string
}

export const sortLabels = (a: ISelectLabel, b: ISelectLabel): number => (a?.label ?? '').toLowerCase().localeCompare((b?.label ?? '').toLowerCase());

export const getRatio = (a: number, b: number): number => {
    if (a === 0 && b === 0) return 50;

    const total = a + b;
    return (a / total) * 100;
};

