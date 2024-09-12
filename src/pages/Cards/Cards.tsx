import { FC, memo, useCallback, useEffect, useState } from 'react';
import { useRouteMatch } from 'react-router-dom';
import { IListItemData } from '@redux/reducers/main/types';
import { CloseOutlined, CheckOutlined } from '@ant-design/icons'
import { setHeaderTitle } from '@redux/reducers/main';
import { useDispatch, useSelector } from '@redux/hooks';
import { mainRootSelectors } from '@redux/reducers/main/selectors';


const className = 'play';
let touchstartX = 0;
let touchendX = 0;
const scrollLimit = 50;
const deckCardDistance = 3;

const Card: FC<{ shift: number }> = ({shift}) => (
    <div className={`${className}-card`}
         style={{
             transform: `translate(${deckCardDistance * shift}px, ${deckCardDistance * shift}px)`,
             zIndex: -shift
         }}>
        <div className={`${className}-card-front`}/>
        <div className={`${className}-card-back`}/>
    </div>
);

const Deck: FC<{ counter: number }> = ({counter}) => {
    const cards = [];

    for (let i = 0; i < counter; i++) {
        cards.push(<Card key={i} shift={i + 1}/>);
    }

    return (
        <div className={`${className}-deck`}>
            {cards}
        </div>
    )
}
// TODO rewrite

const Cards: FC = () => {
    const {params} = useRouteMatch<{ listId: string }>();
    const list = useSelector(mainRootSelectors.list)
    const dispatch = useDispatch();

    const id = params.listId;

    console.log(id)
    const main = list.find(el => el.id === id);
    const [isActiveCard, setIsActiveCard] = useState<boolean>(false);
    const [words, setWords] = useState<IListItemData[]>(list.find(el => el.id === id)!.words);
    const [cardTranslateX, setCardTranslateX] = useState<{ startValue: number, difference: number }>({
        startValue: 0,
        difference: 0
    });
    const [currentWordInfo, setCurrentWordInfo] = useState<{ index: number, limit: number }>({
        index: 0,
        limit: words.length - 1
    });
    const currentWord = words[currentWordInfo.index];
    const [wordsToRepeat, setWordsToRepeat] = useState<IListItemData[]>([]);

    const handleGesture = useCallback(() => {
        const difference = touchendX - touchstartX;

        if (difference <= -scrollLimit) {
            setWordsToRepeat(val => val.concat(currentWord));
            console.log('swiped left!');
        }
        if (difference >= scrollLimit) {
            console.log('swiped right!')
        }

        if (!(difference > -scrollLimit && difference < scrollLimit)) {
            console.log(currentWordInfo.index, currentWordInfo.limit, currentWord)
            if (currentWordInfo.index !== currentWordInfo.limit) {
                setCurrentWordInfo(val => ({...val, index: ++val.index}));
            } else {
                console.log('finish', {wordsToRepeat});

                setWords(wordsToRepeat);
            }
        }
    }, [currentWord, currentWordInfo.index, currentWordInfo.limit, wordsToRepeat]);

    useEffect(() => {
        dispatch(setHeaderTitle(main?.name ?? 'List'));

        console.log(words);
    }, [dispatch, main, words]);

    return (
        <>
            <div className={`${className}`}>
                <div className={`${className}-wrapper`}>
                    {currentWord && <>
                        <div className={`${className}-card${isActiveCard ? ' active' : ''}`}
                             onTouchEnd={e => {
                                 touchendX = e.changedTouches[0].screenX;
                                 handleGesture();
                                 setCardTranslateX(val => ({...val, difference: 0}))
                             }}
                             onTouchMove={e => {
                                 setCardTranslateX(val => {
                                     const distance = val.startValue - e.changedTouches[0].screenX;
                                     return {
                                         ...val,
                                         difference: distance > scrollLimit ? scrollLimit : distance < -scrollLimit ? -scrollLimit : distance
                                     }
                                 });
                             }}
                             onTouchStart={e => touchstartX = e.changedTouches[0].screenX}
                             onTouchStartCapture={e => {
                                 touchstartX = e.changedTouches[0].screenX
                                 setCardTranslateX(val => ({...val, startValue: e.changedTouches[0].screenX}))
                             }}
                             onClick={() => setIsActiveCard(val => !val)}>
                            <div className={`${className}-card-front`}>
                                {currentWord.original} <br/>
                                <span>{currentWord.info_original}</span>
                            </div>
                            <div className={`${className}-card-back`}>
                                {currentWord.translation} <br/>
                                <span>{currentWord.info_translation}</span>
                            </div>
                        </div>
                        <div className={`${className}-shadow`}
                             style={(() => {
                                 const {difference} = cardTranslateX;
                                 const color = -difference > 0 ? '#1cab9c' : -difference === 0 ? 'transparent' : '#ab1c2b';
                                 return {
                                     transform: `translateX(${-difference}px)`,
                                     backgroundColor: color,
                                     color: -difference !== 0 ? '#ffffff' : 'transparent',
                                     boxShadow: `rgba(${color}, .4) 0 2px 4px, rgba(${color}, .3) 0 7px 13px -3px, rgba(${color}, .2) 0 -3px 0 inset`,
                                     opacity: Math.abs(difference / scrollLimit)
                                 }
                             })()}>
                            <CloseOutlined/>
                            <CheckOutlined/>
                        </div>
                    </>}
                    <Deck
                        counter={currentWordInfo.limit - currentWordInfo.index > 5 ? 5 : currentWordInfo.limit - currentWordInfo.index}/>
                </div>
            </div>
            <style>{`html,body{overflow: hidden}`}</style>
        </>
    )
}

export default memo(Cards);