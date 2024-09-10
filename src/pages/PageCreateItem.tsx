import { FC, memo, useCallback, useEffect, useState } from 'react';
import { Button, Divider, Empty, Input, Table, Space } from 'antd';
import { getUniqID } from '@components/common/helpers';
import { IElementData, IItemValues, IListItemSingle } from '@redux/reducers/main/types.ts';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { useSelector, useDispatch } from '@redux/hooks.ts';
import { mainRootSelectors } from '@redux/reducers/main/selectors.ts';
import { addList, changeList, setHeaderTitle } from '@redux/reducers/main';

import css from '@styles/pages/Create.module.scss';
import cn from 'classnames';

const columns = [
    {
        title: 'Original',
        dataIndex: 'original',
    },
    {
        title: 'Translation',
        dataIndex: 'translation',
    }
];

type ITableData = {
    key: string,
    id: number,
    original: string,
    translation: string,
}

type IValidateElement = {
    showErrorOriginal: boolean,
    showErrorTranslation: boolean
}

type IValidateList = {
    setValidation: boolean,
    name: boolean,
    data: boolean
}

type IEditState = {
    state: boolean,
    id: Nullable<number>,
}

const DEFAULT_ITEM_VALUES: IItemValues = {
    original: '',
    translation: '',
    excerpt: {
        original: '',
        translation: ''
    }
};

const DEFAULT_VALIDATE_ELEMENT: IValidateElement = {
    showErrorOriginal: false,
    showErrorTranslation: false
};

const DEFAULT_VALIDATE_LIST: IValidateList = {
    setValidation: false,
    name: false,
    data: false
};

const DEFAULT_EDIT_STATE: IEditState = {
    state: false,
    id: null
};

const PageCreateItem: FC = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const {params} = useRouteMatch<{ itemId: string }>();
    const list = useSelector(mainRootSelectors.list);

    const targetListItemTarget = list.find((el: IListItemSingle) => el.key === params.itemId);
    const [nameValue, setNameValue] = useState(params.itemId ? targetListItemTarget!.name : '');
    const [itemValues, setItemValues] = useState<IItemValues>(DEFAULT_ITEM_VALUES);
    const [validateList, setValidateList] = useState<IValidateList>(DEFAULT_VALIDATE_LIST);
    const [validateElement, setValidateElement] = useState<IValidateElement>(DEFAULT_VALIDATE_ELEMENT);
    const [data, setData] = useState<IElementData[]>(params.itemId ? targetListItemTarget!.words : []);
    const [tableData, setTableData] = useState<ITableData[]>([]);
    const [isEdit, setIsEdit] = useState<IEditState>(DEFAULT_EDIT_STATE);

    const cleanInputValues = useCallback(() => {
        setItemValues(DEFAULT_ITEM_VALUES);
    }, []);

    const cleanElementInputValues = useCallback(() => {
        cleanInputValues();
        setValidateElement(DEFAULT_VALIDATE_ELEMENT);
    }, [cleanInputValues]);

    const validateForm = useCallback((): boolean => {
        const elementsData: IValidateElement = {
            showErrorOriginal: !itemValues.original.trim().length,
            showErrorTranslation: !itemValues.translation.trim().length
        };

        setValidateElement(elementsData);

        return !Object.values(elementsData).includes(true);
    }, [itemValues]);

    const changeTableData = useCallback(() => {
        setTableData(data.map(el => ({
            key: el.key,
            id: el.id,
            original: `${el.original}${el.excerpt.original ? ` (${el.excerpt.original})` : ''}`,
            translation: `${el.translation}${el.excerpt.translation ? ` (${el.excerpt.translation})` : ''}`
        })));
    }, [data]);
    // TODO rewrite

    const addElement = useCallback(() => {
        const commonData: IItemValues = {
            original: itemValues.original,
            translation: itemValues.translation,
            excerpt: {
                original: itemValues.excerpt.original,
                translation: itemValues.excerpt.translation
            }
        }

        if (isEdit.state) {
            setData(val => (
                val.map(el => el.id === isEdit.id ? {
                    ...el,
                    ...commonData
                } : el)
            ));
            setIsEdit(DEFAULT_EDIT_STATE);
        } else {
            setData(val => [...[{
                key: getUniqID(val),
                id: parseInt(getUniqID(val)),
                ...commonData
            }], ...val]);
        }

        changeTableData();
        cleanElementInputValues();
    }, [changeTableData, cleanElementInputValues, isEdit.id, isEdit.state, itemValues.excerpt.original, itemValues.excerpt.translation, itemValues.original, itemValues.translation]);

    const removeElement = useCallback(() => {
        setData(val => (val.filter(el => el.id !== isEdit.id)));
        cleanElementInputValues();
        setIsEdit(DEFAULT_EDIT_STATE);
    }, [cleanElementInputValues, isEdit.id]);

    const submitForm = useCallback(() => {
        setValidateList({
            setValidation: true,
            name: !!nameValue,
            data: !!data.length
        });

        if (!!nameValue.trim() && !!data.length) {
            if (params.itemId) {
                dispatch(changeList({
                    item: {
                        name: nameValue,
                        words: data,
                        key: params.itemId,
                        id: parseInt(params.itemId)
                    },
                    id: Number(params.itemId)
                }));
            } else {
                dispatch(addList({
                    name: nameValue,
                    words: data,
                    key: getUniqID(list),
                    id: parseInt(getUniqID(list))
                }));
            }

            history.push('/');
        }
    }, [data, dispatch, history, list, nameValue, params.itemId]);

    useEffect(() => {
        dispatch(setHeaderTitle(params.itemId ? 'Edit list' : 'Create list'));
    }, [dispatch, params.itemId]);

    useEffect(() => {
        console.log(tableData)
    }, [tableData]);

    console.log(228);
    return (
        <div className={css.Create}>
            <div className={css.Create_title}>
                Name of the list *
            </div>
            <Input
                onFocus={() => setValidateList({...validateList, setValidation: false})}
                className={cn(css.Create_input, {
                    [css.Create_input__error]: !(!validateList.setValidation || validateList.name)
                })}
                value={nameValue} placeholder={'Name of the list'}
                onInput={e => setNameValue(e.currentTarget.value)}/>
            <div className={css.Create_title}>
                Elements *
            </div>
            <Space.Compact className={css.Create_inputGroup}>
                <Input
                    onFocus={() => setValidateElement({...validateElement, showErrorOriginal: false})}
                    className={cn(css.Create_input, {
                        [css.Create_input__error]: validateElement.showErrorOriginal
                    })}
                    value={itemValues.original}
                    onInput={e => setItemValues({...itemValues, original: e.currentTarget.value})}
                    placeholder={'Original'}/>
                <Input
                    onFocus={() => setValidateElement({...validateElement, showErrorTranslation: false})}
                    className={cn(css.Create_input, {
                        [css.Create_input__error]: validateElement.showErrorTranslation
                    })}
                    value={itemValues.translation}
                    onInput={e => setItemValues({...itemValues, translation: e.currentTarget.value})}
                    placeholder={'Translation'}/>
            </Space.Compact>
            <div className={css.Create_excerpt}>
                Extra info
            </div>
            <Space.Compact className={css.Create_inputGroup}>
                <Input value={itemValues.excerpt.original}
                       onInput={e => setItemValues({
                           ...itemValues, excerpt: {
                               original: e.currentTarget.value,
                               translation: itemValues.excerpt.translation
                           }
                       })}
                       placeholder={'For original'}/>
                <Input value={itemValues.excerpt.translation}
                       onInput={e => setItemValues({
                           ...itemValues, excerpt: {
                               original: itemValues.excerpt.original,
                               translation: e.currentTarget.value
                           }
                       })}
                       placeholder={'For translation'}/>
            </Space.Compact>
            <div className={css.Create_buttonGroup}>
                <Button className={css.Create_button} type={'primary'} onClick={() => {
                    if (validateForm()) return addElement();
                }}>
                    {isEdit.state ? 'Edit' : 'Add'}
                </Button>
                {isEdit.state &&
                    <Button className={css.Create_button} type={'primary'} danger onClick={() => removeElement()}>
                        Delete
                    </Button>}
            </div>
            <Divider className={css.Create_divider}/>
            <div className={css.Create_titleGroup}>
                <div className={css.Create_title}>
                    {nameValue ? `${nameValue.trim()}:` : 'List of elements:'}
                </div>
                <div className={css.Create_buttons}>
                    <Button onClick={() => {
                        setData((val: IElementData[]) => val.map((el: IElementData) => ({
                            ...el,
                            original: el.translation,
                            translation: el.original,
                            excerpt: {
                                original: el.excerpt.translation,
                                translation: el.excerpt.original
                            }
                        })))
                    }} disabled={!tableData.length} type={'primary'}>Switch</Button>
                    <Button onClick={() => submitForm()} type={'primary'}>Save</Button>
                </div>
            </div>
            <Table className={css.Create_table}
                   pagination={false}
                   locale={{
                       emptyText: <Empty
                           description={
                               <div className={cn(css.Create_placeholder, {
                                   [css.Create_placeholder__error]: !(!validateList.setValidation || validateList.data)
                               })}>
                                   Please, add elements to the list
                               </div>
                           }
                           image={Empty.PRESENTED_IMAGE_SIMPLE}/>
                   }}
                   onRow={record => ({
                       onClick: () => {
                           setIsEdit({state: true, id: record.id});
                           setItemValues({
                               original: record.original.match(/ \(/g) ? record.original.split(' (')[0] : record.original,
                               translation: record.translation.match(/ \(/g) ? record.translation.split(' (')[0] : record.translation,
                               excerpt: {
                                   original: record.original.match(/ \(/g) ? record.original.split(' (')[1].slice(0, -1) : '',
                                   translation: record.translation.match(/ \(/g) ? record.translation.split(' (')[1].slice(0, -1) : '',
                               }
                           });
                       }
                   })}
                   columns={columns} dataSource={tableData}
                   size={'small'}/>
        </div>
    );
};

export default memo(PageCreateItem);