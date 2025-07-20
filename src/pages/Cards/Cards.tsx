import {
    FC,
    memo,
    TouchEvent,
    useCallback,
    useEffect,
    useMemo,
    useReducer,
    useRef,
    useState
} from 'react';
import {useHistory, useRouteMatch} from 'react-router-dom';
import {IListItemData} from '@redux/reducers/main/types';
import {CloseOutlined, CheckOutlined, SyncOutlined} from '@ant-design/icons';
import {useSelector} from '@redux/hooks';
import {mainRootSelectors} from '@redux/reducers/main/selectors';

import css from '@pages/Cards/cards.module.scss';
import cn from 'classnames';
import {Button} from "antd";
import {clipCorners} from "../../common/helpers.ts";

// ------
const SWIPE_THRESHOLD = 50;
const DECK_CARD_DISTANCE = 3;
const DECK_LENGTH = 5;
const {min, max, abs, round} = Math;

// ------
type State = {
    words: IListItemData[];
    wordsToRepeat: IListItemData[];
    currentIndex: number;
    isFinished: boolean;
};

type Action =
    | { type: 'SWIPE_RIGHT' }
    | { type: 'SWIPE_LEFT' }
    | { type: 'RESET_DECK' }
    | { type: 'RESTART_WITH_INITIAL_WORDS', payload: IListItemData[] };

const flashcardReducer = (state: State, action: Action): State => {
    const {words, currentIndex, wordsToRepeat} = state;

    const isLastCard = currentIndex >= words.length - 1;

    switch (action.type) {
        case 'SWIPE_LEFT': {
            const newWordsToRepeat = [...wordsToRepeat, words[currentIndex]];
            if (isLastCard) {
                // Если это была последняя карта, начинаем раунд с теми, что нужно повторить
                return {
                    ...state,
                    words: newWordsToRepeat,
                    wordsToRepeat: [],
                    currentIndex: 0,
                    isFinished: newWordsToRepeat.length === 0,
                };
            }
            return {...state, currentIndex: currentIndex + 1, wordsToRepeat: newWordsToRepeat};
        }
        case 'SWIPE_RIGHT': {
            if (isLastCard) {
                // Если это была последняя карта, начинаем раунд с теми, что нужно повторить
                return {
                    ...state,
                    words: wordsToRepeat,
                    wordsToRepeat: [],
                    currentIndex: 0,
                    isFinished: wordsToRepeat.length === 0,
                };
            }
            return {...state, currentIndex: currentIndex + 1};
        }
        case 'RESET_DECK':
            return {...state, currentIndex: 0, wordsToRepeat: []}; // Пример для возможного расширения
        case 'RESTART_WITH_INITIAL_WORDS':
            return {
                words: action.payload,
                wordsToRepeat: [],
                currentIndex: 0,
                isFinished: action.payload.length === 0,
            };
        default:
            return state;
    }
};

const useFlashcardDeck = (initialWords: IListItemData[]) => {
    const initialState: State = {
        words: initialWords,
        wordsToRepeat: [],
        currentIndex: 0,
        isFinished: initialWords.length === 0,
    };

    const [state, dispatch] = useReducer(flashcardReducer, initialState);

    const advanceCard = useCallback((direction: 'left' | 'right') => {
        if (direction === 'left') {
            dispatch({type: 'SWIPE_LEFT'});
        } else {
            dispatch({type: 'SWIPE_RIGHT'});
        }
    }, []);

    const restartDeck = useCallback(() => {
        dispatch({type: 'RESTART_WITH_INITIAL_WORDS', payload: initialWords});
    }, [initialWords]);

    return {
        currentWord: state.words[state.currentIndex],
        deckCount: max(0, state.words.length - state.currentIndex - 1),
        isFinished: state.isFinished,
        advanceCard,
        restartDeck
    };
};

const useSwipe = ({onSwipeEnd, threshold = SWIPE_THRESHOLD}: {
    onSwipeEnd: (direction: 'left' | 'right') => void;
    threshold?: number;
}) => {
    const startX = useRef(0);
    const [touchDifference, setTouchDifference] = useState(0);

    const handleTouchStart = useCallback((e: TouchEvent<HTMLDivElement>) => {
        startX.current = round(e.changedTouches[0].screenX);
    }, []);

    const handleTouchMove = useCallback((e: TouchEvent<HTMLDivElement>) => {
        const currentX = round(e.changedTouches[0].screenX);
        const difference = currentX - startX.current;
        setTouchDifference(max(-threshold, min(threshold, difference)));
    }, [threshold]);

    const handleTouchEnd = useCallback(() => {
        if (abs(touchDifference) >= threshold) {
            onSwipeEnd(touchDifference > 0 ? 'right' : 'left');
        }
        setTouchDifference(0);
    }, [touchDifference, threshold, onSwipeEnd]);

    const swipeHandlers = {
        onTouchStart: handleTouchStart,
        onTouchMove: handleTouchMove,
        onTouchEnd: handleTouchEnd,
    };

    return {touchDifference, swipeHandlers};
};


const Card: FC<{ shift: number }> = memo(({shift}) => (
    <div
        className={css.Cards_single}
        style={{
            transform: `translate(${DECK_CARD_DISTANCE * shift}px, ${DECK_CARD_DISTANCE * shift}px)`,
            zIndex: -shift,
        }}
    >
        <div className={css.Cards_single__front}/>
        <div className={css.Cards_single__back}/>
    </div>
));

const Deck: FC<{ counter: number }> = memo(({counter}) => {
    const cards = useMemo(() => {
        return Array.from({length: min(counter, DECK_LENGTH)}, (_, i) => (
            <Card key={i} shift={i + 1}/>
        ));
    }, [counter]);

    return <div className={css.Cards_deck}>{cards}</div>;
});

const Cards: FC = () => {
    const {params} = useRouteMatch<{ listId: string }>();
    const list = useSelector(mainRootSelectors.list);
    const history = useHistory();

    const initialWords = useMemo(() => list.find(el => el.id === params.listId)?.words ?? [], [params.listId, list]);

    const [animationTrigger, setAnimationTrigger] = useState<'left' | 'right' | null>(null);
    const [isCardFlipped, setIsCardFlipped] = useState(false);

    useEffect(() => {
        if (!initialWords.length && !params.listId) {
            history.push('/');
        }
    }, [initialWords, params.listId, history]);

    const {currentWord, deckCount, isFinished, advanceCard, restartDeck} = useFlashcardDeck(initialWords);

    const handleSwipeEnd = useCallback((direction: 'left' | 'right') => {
        setIsCardFlipped(false);
        advanceCard(direction);
    }, [advanceCard]);

    const {touchDifference, swipeHandlers} = useSwipe({onSwipeEnd: handleSwipeEnd});

    useEffect(() => {
        if (!animationTrigger) return;

        const animationDuration = 300;

        const timer = setTimeout(() => {
            handleSwipeEnd(animationTrigger);
            setAnimationTrigger(null);
        }, animationDuration);

        return () => clearTimeout(timer);
    }, [animationTrigger, handleSwipeEnd]);

    const {translateX, rotation, shadowOpacity, shadowColor} = useMemo(() => {
        const difference = animationTrigger
            ? (animationTrigger === 'right' ? SWIPE_THRESHOLD : -SWIPE_THRESHOLD)
            : touchDifference;

        const translateX = difference;
        const rotation = difference / 20;
        const shadowOpacity = min(1, abs(difference / SWIPE_THRESHOLD));
        const shadowColor = difference > 0 ? '#1cab9c' : '#ab1c2b';

        return {translateX, rotation, shadowOpacity, shadowColor};
    }, [touchDifference, animationTrigger]);

    const cardDynamicStyles = {
        transform: `translateX(${translateX}px) rotate(${rotation}deg)`,
        transition: animationTrigger ? 'transform 0.2s' : 'none',
    };

    const shadowStyles = {
        backgroundColor: shadowColor,
        opacity: shadowOpacity,
        transition: animationTrigger ? 'opacity 0.2s' : 'none',
    };

    if (isFinished) {
        return (
            <div className={css.Cards_finished}>
                <h2>🎉 Well done!</h2>
                <p>
                    All the words are successfully learned. <br/>
                    You can go back to the main page or try again.
                </p>
                <div className={css.Cards_finished__buttons}>
                    <Button type={'primary'}
                            size={'large'}
                            onClick={() => history.push('/')}>
                        Main page
                    </Button>
                    <Button type={'primary'}
                            size={'large'}
                            onClick={restartDeck}>
                        Restart list
                    </Button>
                </div>
            </div>
        );
    }

    if (!currentWord) {
        return <div className={css.Cards_loading}><SyncOutlined spin/></div>;
    }

    return (
        <div className={css.Cards}>
            <div className={css.Cards_wrapper}>
                <div
                    className={cn(css.Cards_single, {[css.Cards_single_active]: isCardFlipped})}
                    style={cardDynamicStyles}
                    {...swipeHandlers}
                    onClick={() => !animationTrigger && setIsCardFlipped(val => !val)} // Блокируем клик во время анимации
                >
                    <div
                        className={css.Cards_shadowContainer}
                        style={{opacity: shadowStyles.opacity}}
                    >
                        <div className={css.Cards_shadow} style={shadowStyles}>
                            {translateX < 0 ?
                                <CloseOutlined className={css.Cards_shadow__icon}/> :
                                <CheckOutlined className={css.Cards_shadow__icon}/>}
                        </div>
                    </div>
                    <div className={css.Cards_single__front}>
                        {currentWord.original} <br/>
                        <span>{currentWord.info_original}</span>
                    </div>
                    <div className={css.Cards_single__back}>
                        {currentWord.translation} <br/>
                        <span>{currentWord.info_translation}</span>
                    </div>
                </div>

                <Deck counter={deckCount}/>
            </div>
            <div className={css.Cards_actions}>
                <button
                    className={css.Cards_actions__single}
                    onClick={() => setAnimationTrigger('left')}
                    disabled={!!animationTrigger}
                >
                    <CloseOutlined/>
                </button>
                <button
                    className={css.Cards_actions__single}
                    onClick={() => setAnimationTrigger('right')}
                    disabled={!!animationTrigger}
                >
                    <CheckOutlined/>
                </button>
            </div>

            <style>
                {` .${css.Cards_single__back}, 
                .${css.Cards_single__front}, 
                .${css.Cards_shadowContainer} { 
                clip-path: ${clipCorners({
                    width: 250,
                    height: 250 / 3 * 4,
                    radius: 25,
                    smoothing: 1
                })}; } `}
            </style>
        </div>
    );
};

export default memo(Cards);