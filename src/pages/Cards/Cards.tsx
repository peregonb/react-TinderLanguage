import { FC, memo, TouchEvent, useEffect, useMemo, useState } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { IListItemData } from '@redux/reducers/main/types';
import { CloseOutlined, CheckOutlined } from '@ant-design/icons'
import { useSelector } from '@redux/hooks';
import { mainRootSelectors } from '@redux/reducers/main/selectors';

import css from '@pages/Cards/cards.module.scss'
import cn from 'classnames';
import { debounce } from '../../common/helpers.ts';

const scrollLimit = 50;
const deckCardDistance = 3;
const deckLength = 5;
const {round, min, max, abs} = Math;

const Card: FC<{ shift: number }> = memo(({shift}) => (
    <div className={css.Cards_single}
         style={{
             transform: `translate(${deckCardDistance * shift}px, ${deckCardDistance * shift}px)`,
             zIndex: -shift
         }}>
        <div className={css.Cards_single__front}/>
        <div className={css.Cards_single__back}/>
    </div>
));

const Deck: FC<{ counter: number }> = memo(({counter}) => {
    const cards = [];

    for (let i = 0; i < counter; i++) {
        cards.push(<Card key={i} shift={i + 1}/>);
    }

    return (
        <div className={css.Cards_deck}>
            {cards}
        </div>
    )
});

const Cards: FC = () => {
    const {params} = useRouteMatch<{ listId: string }>();
    const list = useSelector(mainRootSelectors.list)
    const history = useHistory();
    // const dispatch = useDispatch();

    const id = params.listId;
    const [isActiveCard, setIsActiveCard] = useState<boolean>(false);

    const foundList = useMemo(() => list.find(el => el.id === id), [id, list]);

    useEffect(() => {
        if (!foundList) history.push('/');
    }, [foundList, history]);

    const [words, setWords] = useState<IListItemData[]>(foundList?.words ?? []);
    const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);

    const currentWord = useMemo(() => words[currentWordIndex], [currentWordIndex, words]);
    const currentWordsLimit = useMemo(() => words.length - 1, [words]);

    // const [cardTranslateX, setCardTranslateX] = useState<{ startValue: number, difference: number }>({
    //     startValue: 0,
    //     difference: 0
    // });

    const [touchDifference, setTouchDifference] = useState<number>(0);

    const [wordsToRepeat, setWordsToRepeat] = useState<IListItemData[]>([]);

    const cardEvents = useMemo(() => {
        let startX = 0;

        const handleGesture = (difference: number) => {
            if (difference <= -scrollLimit) {
                setWordsToRepeat(val => val.concat(currentWord));
                console.log('swiped left!');
            }
            if (difference >= scrollLimit) {
                console.log('swiped right!')
            }

            if (!(difference > -scrollLimit && difference < scrollLimit)) {
                console.log(currentWordIndex, currentWordsLimit, currentWord)
                if (currentWordIndex !== currentWordsLimit) {
                    setCurrentWordIndex(val => ++val);
                } else {
                    console.log('finish', {wordsToRepeat});

                    setWords(wordsToRepeat);
                }
            }
        }

        return {
            onTouchStartCapture: (e: TouchEvent<HTMLDivElement>) => {
                startX = round(e.changedTouches[0].screenX);
            },
            onTouchMove: debounce((e: TouchEvent<HTMLDivElement>) => {
                const distance = startX - round(e.changedTouches[0].screenX);

                setTouchDifference(max(-scrollLimit, min(scrollLimit, distance)));
            }, 10),
            onTouchEnd: (e: TouchEvent<HTMLDivElement>) => {
                handleGesture(round(e.changedTouches[0].screenX) - startX);
                setTouchDifference(0);
            },
        }
    }, [currentWord, currentWordIndex, currentWordsLimit, wordsToRepeat]);

    console.log('RERENDER');

    const shadowStyles = useMemo(() => {
        const color = -touchDifference > 0 ? '#1cab9c' : -touchDifference === 0 ? 'transparent' : '#ab1c2b';
        return {
            transform: `translateX(${-touchDifference}px)`,
            backgroundColor: color,
            color: -touchDifference !== 0 ? '#ffffff' : 'transparent',
            boxShadow: `rgba(${color}, .4) 0 2px 4px, rgba(${color}, .3) 0 7px 13px -3px, rgba(${color}, .2) 0 -3px 0 inset`,
            opacity: abs(touchDifference / scrollLimit)
        }
    }, [touchDifference]);

    return (
        <>
            <div className={css.Cards}>
                <div className={css.Cards_wrapper}>
                    {currentWord && <>
                        <div className={cn(css.Cards_single, {
                            [css.Cards_single_active]: isActiveCard
                        })}
                             {...cardEvents}
                             onClick={() => setIsActiveCard(val => !val)}>
                            <div className={css.Cards_single__front}>
                                {currentWord.original} <br/>
                                <span>{currentWord.info_original}</span>
                            </div>
                            <div className={css.Cards_single__back}>
                                {currentWord.translation} <br/>
                                <span>{currentWord.info_translation}</span>
                            </div>
                        </div>
                        <div className={css.Cards_shadow}
                             style={shadowStyles}
                        >
                            <CloseOutlined className={css.Cards_shadow__close}/>
                            <CheckOutlined className={css.Cards_shadow__check}/>
                        </div>
                    </>}
                    <Deck counter={min(currentWordsLimit - currentWordIndex, deckLength)}/>
                </div>
            </div>
        </>
    )
}

export default memo(Cards);