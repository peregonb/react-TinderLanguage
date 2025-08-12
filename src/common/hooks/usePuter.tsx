import {useCallback, useState} from "react";
import {useDispatch} from '@redux/hooks';
import {addList} from "@redux/reducers/main";
import {ELanguageLevel, getUniqID} from "../helpers.ts";
import {IListItemSingle} from "@redux/reducers/main/types.ts";
import {useHistory} from "react-router-dom";

export interface IFromScratch {
    language_original: string;
    language_translation: string;
    language_level: ELanguageLevel;
    language_list_limit: string;
    topic: string;
}

interface IFromList {
    tags: Array<string>;
    language: string;
}

interface IEntityMap {
    generateFromScratch: IFromScratch;
    generateFromList: IFromList;
}

const puterPrompt: { [K in keyof IEntityMap]: (data: IEntityMap[K]) => string } = {
    generateFromScratch: ({
                              language_original,
                              language_translation,
                              topic,
                              language_level,
                              language_list_limit
                          }) => {
        const [minLength, maxLength] = language_list_limit.split(' - ');
        return `
                          Ты помогаешь составить json объект с набором слов на определенную тематику и переводом этих слов. Тебе нужно вернуть JSON без комментариев, без обертки \`\`\`json и дополнений в формате:
                          {
                            "name" : лаконичное обобщение тематики ${topic} и в конце добавить один emoji флага страны ${language_original} и один emoji флага страны ${language_translation}. Без дополнений и комментариев.
                            "words": [
                                "original": слово на языке ${language_original} преимущественно уровня знания языка ${language_level} на тематику ${topic},
                                "translation": перевеод слова на язык ${language_translation} преимущественно уровня знания языка ${language_level}
                            ]
                          }
                           Количетсво слов в массиве words должно быть обязательно минимум ${minLength} но не более ${maxLength}, слова не должны повторяться и должны быть преимущественно уровня ${language_level} за исключением слов где это невозможно
                          `
    },
    generateFromList: ({tags, language}) => `
            Ты помогаешь перевести список слов из массива ${tags.toString()} на язык ${language}. Тебе нужно вернуть JSON без комментариев, без обертки \`\`\`json и дополнений в формате:
            {
            "name": нужно класифицировать список слов из массива ${tags.toString()}. Вернуть название на английском языке и в конце добавить один emoji флага страны ${language}. Без дополнений и комментариев. ,
            "words": [
                {
                    "original": оригинал слова из списка по очереди,
                    "translation": перевод слова из списка на язык ${language}
                }
            ]
        }
            Если слово нельзя перевести и слово допущено с ошибкой или ты не знаешь что это за слово, то в переводе "translation" поставь в строку прочерк "-"
            `
};

const addUniqueIds = (obj: ExcludeFields<IListItemSingle, 'id'>): IListItemSingle => {
    return {
        id: getUniqID(),
        name: obj.name,
        words: obj.words.flatMap(w => {
            return {
                ...w,
                id: getUniqID()
            }
        })
    }
}

export const usePuter = () => {
    const dispatch = useDispatch();
    const [isPending, setPendingStatus] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const history = useHistory();

    const fetchPuter = useCallback(
        async <T extends keyof IEntityMap>(type: T, data: IEntityMap[T]) => {
            setPendingStatus(true);
            setErrorMessage('');

            if (!window.puter?.ai) {
                setErrorMessage('Puter.js not loaded or AI service unavailable.');
                setPendingStatus(false);
                return;
            }

            try {
                const prompt = puterPrompt[type](data);

                const aiResponse = await window.puter.ai.chat(prompt, {
                    model: 'gpt-5-mini'
                });

                const generatedList = JSON.parse(aiResponse.toString());
                const listWithIds = addUniqueIds(generatedList);

                dispatch(addList(listWithIds));

                history.push(`/list-manually/${listWithIds.id}`);
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : JSON.stringify(error);
                setErrorMessage(`Error with AI: ${errorMessage}`);
            } finally {
                setPendingStatus(false);
            }
        },
        [dispatch, history]
    );
    return [isPending, errorMessage, fetchPuter] as const;
}