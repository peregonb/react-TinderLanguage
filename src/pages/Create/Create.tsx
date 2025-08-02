import {FC, memo, useEffect} from 'react';
import css from '@pages/Create/create.module.scss';
import {Card, Tag} from "antd";
import {Link} from "react-router-dom";
import {useDispatch} from "@redux/hooks.ts";
import {setHeaderTitle} from "@redux/reducers/main";

const Create: FC = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setHeaderTitle('Create list'));
    }, [dispatch]);

    return (
        <div className={css.Create}>
            <Link to={'/list-manually'}>
                <Card size={'small'}
                      title={'Create a list manually'}
                      extra={<Tag style={{margin: 0}} color="red">Slow</Tag>}>
                    You manually create a list by specifying the original word and its translation.
                </Card>
            </Link>
            <Link to={'/list-ai'}>
                <Card size={'small'}
                      title={'Create a list with AI'}
                      extra={<Tag style={{margin: 0}} color="green">Fast</Tag>}>
                    You specify a topic for the word list and AI will generate a list with translations for you.
                </Card>
            </Link>
            <Link to={'/list'}>
                <Card size={'small'}
                      title={'List words without translation'}
                      extra={<Tag style={{margin: 0}} color="yellow">Moderate</Tag>}>
                    You list the words manually without translations, and AI will generate the translations for you.
                </Card>
            </Link>
        </div>
    )
}

export default memo(Create);