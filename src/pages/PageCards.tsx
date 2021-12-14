import {FC, useEffect, useState} from "react";
import {RouteComponentProps} from "react-router";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {I_listItemSingle, I_state} from "@redux/types";
import {setHeaderTitle} from "@redux/app-reducer";
import {CloseOutlined, CheckOutlined} from '@ant-design/icons'

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


const PageCardsContainer: FC<I_propTypes> = ({match, list, setHeaderTitle}) => {
    const id = match?.params?.itemId;
    const main = list.filter(el => el.id === parseInt(id))[0];
    const [isActiveCard, setIsActiveCard] = useState(false);
    const [cardTranslateX, setCardTranslateX] = useState({
        startValue: 0,
        difference: 0
    });

    const handleGesture = () => {
        if (touchendX < touchstartX) console.log('swiped left!')
        if (touchendX > touchstartX) console.log('swiped right!')
    };

    // useEffect(() => {
    //     setHeaderTitle(main.name);
    //
    //     console.log(list, id);
    // }, []);

    useEffect(() => {
        console.log(cardTranslateX);

    }, [cardTranslateX])

    return (
        <>
            <div className={`${className}`}>
                <div className={`${className}-wrapper`}>
                    <div className={`${className}-card${isActiveCard ? ' active' : ''}`}
                         onTouchEnd={e => {
                             touchendX = e.changedTouches[0].screenX;
                             handleGesture();
                             setCardTranslateX(val => ({...val, difference: 0}))
                         }}
                         onTouchMove={e => {
                             const limit = 50;
                             setCardTranslateX(val => {
                                 let distance = val.startValue - e.changedTouches[0].screenX;
                                 return {
                                     ...val,
                                     difference: distance > limit ? limit : distance < -limit ? -limit : distance
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
                            Cat
                        </div>
                        <div className={`${className}-card-back`}>
                            Кот
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
                                 boxShadow: `rgba(${color}, .4) 0 2px 4px, rgba(${color}, .3) 0 7px 13px -3px, rgba(${color}, .2) 0 -3px 0 inset`
                             }
                         })()}>
                        <CloseOutlined/>
                        <CheckOutlined/>
                    </div>
                </div>
            </div>
            <style>{`html,body{overflow: hidden}`}</style>
        </>
    )
}

let mapStateToProps = (state: I_state) => ({
    list: state.app.list,
});

export const PageCards = connect(
    mapStateToProps, {setHeaderTitle}
)(withRouter(PageCardsContainer));