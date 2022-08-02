import { FC, useCallback, useEffect, useState } from "react";
import { RouteComponentProps } from "react-router";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { I_listItemSingle, I_state, T_elementData } from "@redux/types";
import { setHeaderTitle } from "@redux/app-reducer";
import { CloseOutlined, CheckOutlined } from '@ant-design/icons'

type T_routeTypes = {
    itemId: string
}

interface I_propTypes extends RouteComponentProps<T_routeTypes> {
    list: I_listItemSingle[],
    setHeaderTitle: (headline: string) => void
}

const className = 'play';
let touchstartX = 0;
let touchendX = 0;
const scrollLimit = 50;
const deckCardDistance = 3;

const Card: FC<{ shift: number }> = ({ shift }) => (
    <div className={ `${ className }-card` }
         style={ {
             transform: `translate(${ deckCardDistance * shift }px, ${ deckCardDistance * shift }px)`,
             zIndex: -shift
         } }>
        <div className={ `${ className }-card-front` }/>
        <div className={ `${ className }-card-back` }/>
    </div>
);

const Deck: FC<{ counter: number }> = ({ counter }) => {
    const cards = [];

    for (let i = 0; i < counter; i++) {
        cards.push(<Card key={ i } shift={ i + 1 }/>);
    }

    return (
        <div className={ `${ className }-deck` }>
            { cards }
        </div>
    )
}

const PageCardsContainer: FC<I_propTypes> = ({ match, list, setHeaderTitle }) => {
    const id: string = match?.params?.itemId;
    const main = list.find(el => el.id === parseInt(id));
    const [ isActiveCard, setIsActiveCard ] = useState<boolean>(false);
    const [ words, setWords ] = useState<T_elementData[]>(list.find(el => el.key === id)!.words);
    const [ cardTranslateX, setCardTranslateX ] = useState<{ startValue: number, difference: number }>({
        startValue: 0,
        difference: 0
    });
    const [ currentWordInfo, setCurrentWordInfo ] = useState<{ index: number, limit: number }>({
        index: 0,
        limit: words.length - 1
    });
    const currentWord = words[currentWordInfo.index];
    const [ wordsToRepeat, setWordsToRepeat ] = useState<T_elementData[]>([]);

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
                setCurrentWordInfo(val => ({ ...val, index: ++val.index }));
            } else {
                console.log('finish', { wordsToRepeat });

                setWords(wordsToRepeat);
            }
        }
    }, [ currentWord, words ]);

    useEffect(() => {
        main && setHeaderTitle(main.name);

        console.log(words);
    }, []);

    return (
        <>
            <div className={ `${ className }` }>
                <div className={ `${ className }-wrapper` }>
                    { currentWord && <>
                        <div className={ `${ className }-card${ isActiveCard ? ' active' : '' }` }
                             onTouchEnd={ e => {
                                 touchendX = e.changedTouches[0].screenX;
                                 handleGesture();
                                 setCardTranslateX(val => ({ ...val, difference: 0 }))
                             } }
                             onTouchMove={ e => {
                                 setCardTranslateX(val => {
                                     const distance = val.startValue - e.changedTouches[0].screenX;
                                     return {
                                         ...val,
                                         difference: distance > scrollLimit ? scrollLimit : distance < -scrollLimit ? -scrollLimit : distance
                                     }
                                 });
                             } }
                             onTouchStart={ e => touchstartX = e.changedTouches[0].screenX }
                             onTouchStartCapture={ e => {
                                 touchstartX = e.changedTouches[0].screenX
                                 setCardTranslateX(val => ({ ...val, startValue: e.changedTouches[0].screenX }))
                             } }
                             onClick={ () => setIsActiveCard(val => !val) }>
                            <div className={ `${ className }-card-front` }>
                                { currentWord.original } <br/>
                                <span>{ currentWord.excerpt.original }</span>
                            </div>
                            <div className={ `${ className }-card-back` }>
                                { currentWord.translation } <br/>
                                <span>{ currentWord.excerpt.translation }</span>
                            </div>
                        </div>
                        <div className={ `${ className }-shadow` }
                             style={ (() => {
                                 const { difference } = cardTranslateX;
                                 const color = -difference > 0 ? '#1cab9c' : -difference === 0 ? 'transparent' : '#ab1c2b';
                                 return {
                                     transform: `translateX(${ -difference }px)`,
                                     backgroundColor: color,
                                     color: -difference !== 0 ? '#ffffff' : 'transparent',
                                     boxShadow: `rgba(${ color }, .4) 0 2px 4px, rgba(${ color }, .3) 0 7px 13px -3px, rgba(${ color }, .2) 0 -3px 0 inset`,
                                     opacity: Math.abs(difference / scrollLimit)
                                 }
                             })() }>
                            <CloseOutlined/>
                            <CheckOutlined/>
                        </div>
                    </> }
                    <Deck
                        counter={ currentWordInfo.limit - currentWordInfo.index > 5 ? 5 : currentWordInfo.limit - currentWordInfo.index }/>
                </div>
            </div>
            <style>{ `html,body{overflow: hidden}` }</style>
        </>
    )
}

let mapStateToProps = (state: I_state) => (
    {
        list: state.app.list,
    }
);

export const PageCards = connect(
    mapStateToProps,
    {
        setHeaderTitle
    }
)(withRouter(PageCardsContainer));