import {FC, memo, useEffect} from 'react';
import css from '@pages/AI/ai.module.scss';
import {useDispatch} from "@redux/hooks.ts";
import {setHeaderTitle} from "@redux/reducers/main";

const AI: FC = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setHeaderTitle('AI list'));
    }, [dispatch]);

    return (
        <div className={css.AI}>

        </div>
    )
}

export default memo(AI);