import React, {useState, useRef, memo, useCallback} from 'react';
import {Button, Form, Input, InputRef, Tag, Typography, Select} from 'antd';
import {PlusOutlined} from '@ant-design/icons';
import css from '@pages/Tabulator/tabulator.module.scss';
import {ELanguageLevel, usePuter} from "../../common/hooks/usePuter.tsx";

const {Text} = Typography;

const languages: Array<{ value: string, label: string }> = [
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

const Tabulator: React.FC = () => {
    const [tags, setTags] = useState<Array<string>>([]);
    const [inputValue, setInputValue] = useState('');
    const [editingIndex, setEditingIndex] = useState<Nullable<number>>(null);
    const inputRef = useRef<Nullable<InputRef>>(null);

    const [form] = Form.useForm();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const handleInputConfirm = () => {
        const newEntries = inputValue
            .split(',')
            .map(tag => tag.trim())
            .filter(tag => tag);

        if (editingIndex !== null) {
            const updated = [...tags];
            updated[editingIndex] = newEntries[0] || tags[editingIndex];
            setTags(updated);
            setEditingIndex(null);
        } else {
            const newTags = newEntries.filter(tag => !tags.includes(tag));
            if (newTags.length > 0) {
                setTags([...tags, ...newTags]);
            }
        }

        setInputValue('');
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            handleInputConfirm();
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    const handleEditTag = (index: number) => {
        setInputValue(tags[index]);
        setEditingIndex(index);

        setTimeout(() => {
            const inputEl = inputRef.current?.input;
            if (inputEl) {
                inputEl.focus();
                inputEl.setSelectionRange(inputEl.value.length, inputEl.value.length);
            }
        }, 0);
    };

    const [isPending, errorMessage, fetchPuter] = usePuter();

    const generateHandler = useCallback(async (values: { language: string }) => {
        await fetchPuter('generateFromList', {
            tags,
            language: values.language,
            topic: 'Nature',
            difficulty: ELanguageLevel.B1
        });
    }, [fetchPuter, tags]);

    return (
        <div className={css.Tabulator}>
            <Form
                form={form}
                onFinish={generateHandler}
                className={css.Tabulator_form}
                autoComplete={'off'}
            >
                <Form.Item
                    name={'language'}
                    rules={[{required: true, message: 'Please, select a translation language'}]}
                >
                    <Select
                        showSearch
                        placeholder={'Select translation language'}
                        size={'large'}
                        options={languages}
                        optionFilterProp="label"
                        filterSort={(a, b) =>
                            (a?.label ?? '').toLowerCase().localeCompare((b?.label ?? '').toLowerCase())
                        }
                    />
                </Form.Item>
                <Form.Item>
                    <Input
                        ref={inputRef}
                        size={'large'}
                        placeholder={'Type a word or phrase, then press Enter or comma'}
                        value={inputValue}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        onBlur={handleInputConfirm}
                        suffix={<PlusOutlined/>}
                    />
                </Form.Item>
            </Form>
            {!!tags.length && (
                <>
                    <div className={css.Tabulator_cloud}>
                        {tags.map((tag, index) => (
                            <Tag
                                key={tag + index}
                                closable
                                onClose={() => handleRemoveTag(tag)}
                                onClick={() => handleEditTag(index)}
                                style={{cursor: 'pointer', margin: 0}}>
                                {tag}
                            </Tag>
                        ))}
                    </div>
                </>
            )}

            <div className={css.Tabulator_buttons}>
                {!!tags.length && (
                    <Button
                        onClick={() => form.submit()}
                        type={'primary'}
                        size={'large'}
                        {...(isPending ? {loading: true} : {})}
                    >
                        {isPending ? 'Generating list...' : 'Generate list'}
                    </Button>
                )}
                {!!errorMessage.length && <Text type="danger">{errorMessage}</Text>}
            </div>
        </div>
    );
};

export default memo(Tabulator);