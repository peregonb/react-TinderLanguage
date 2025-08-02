import {useCallback, useState} from "react";
import {useDispatch} from '@redux/hooks';
import {addList} from "@redux/reducers/main";
import {getUniqID} from "../helpers.ts";
import {IListItemSingle} from "@redux/reducers/main/types.ts";
import {useHistory} from "react-router-dom";

export type IGenerateType = 'generateFromScratch' | 'generateFromList';

export enum ELanguageLevel {
    A1 = 'A1',
    A2 = 'A2',
    B1 = 'B1',
    B2 = 'B2',
    C1 = 'C1',
    C2 = 'C2',
}

type IPuterData = {
    tags: Array<string>,
    language: string,
    topic: string,
    difficulty: ELanguageLevel
}

const puterPrompt = {
    generateFromScratch: () => '',
    generateFromList: ({tags, language}: { tags: IPuterData['tags'], language: IPuterData['language'] }) => `
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
        async (type: IGenerateType, data: IPuterData) => {
            setPendingStatus(true);
            setErrorMessage('');

            if (!window.puter?.ai) {
                setErrorMessage('Puter.js not loaded or AI service unavailable.');
                setPendingStatus(false);
                return;
            }

            try {
                const prompt = puterPrompt[type]({tags: data.tags, language: data.language});
                const aiResponse = await window.puter.ai.chat(prompt, {
                    model: 'o1-mini'
                });

                const generatedList = JSON.parse(aiResponse.toString());
                const listWithIds = addUniqueIds(generatedList);

                dispatch(addList(listWithIds));

                history.push(`/list-manually/${listWithIds.id}`);
            } catch (error) {
                setErrorMessage(`Error with AI: ${JSON.stringify(error)}`);
            } finally {
                setPendingStatus(false);
            }
        },
        [dispatch, history]
    );
    return [isPending, errorMessage, fetchPuter] as const;
}