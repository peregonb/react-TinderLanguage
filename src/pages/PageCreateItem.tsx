import { FC, memo, useCallback, useEffect, useState } from 'react';
import { Button, Divider, Empty, Input, Table } from 'antd';
import { getUniqID } from '@components/common/helpers';
import { T_elementData, T_itemValues } from '@redux/types';
import { useDispatch } from 'react-redux';
import { changeList, setHeaderTitle, setList } from '@redux/app-reducer';
import { useHistory, useRouteMatch } from 'react-router-dom';
import useSelector from '@hooks/useSelector';

const className = 'edit';

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

type T_tableData = {
    key: string,
    id: number,
    original: string,
    translation: string,
}

type T_routeTypes = {
    itemId?: string
}

type T_validateElement = {
    showErrorOriginal: boolean,
    showErrorTranslation: boolean
}

type T_validateList = {
    setValidation: boolean,
    name: boolean,
    data: boolean
}

type T_editState = {
    state: boolean,
    id: null | number
}

const DEFAULT_ITEM_VALUES: T_itemValues = {
    original: '',
    translation: '',
    excerpt: {
        original: '',
        translation: ''
    }
};
const DEFAULT_VALIDATE_ELEMENT: T_validateElement = {
    showErrorOriginal: false,
    showErrorTranslation: false
};
const DEFAULT_VALIDATE_LIST: T_validateList = {
    setValidation: false,
    name: false,
    data: false
};
const DEFAULT_EDIT_STATE: T_editState = {
    state: false,
    id: null
};

export const PageCreateItem: FC = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const {params} = useRouteMatch<T_routeTypes>();
    const {list} = useSelector(state => state.app);

    const targetListItemTarget = list.find(el => el.key === params.itemId);
    const [nameValue, setNameValue] = useState(params.itemId ? targetListItemTarget!.name : '');
    const [itemValues, setItemValues] = useState<T_itemValues>(DEFAULT_ITEM_VALUES);
    const [validateList, setValidateList] = useState<T_validateList>(DEFAULT_VALIDATE_LIST);
    const [validateElement, setValidateElement] = useState<T_validateElement>(DEFAULT_VALIDATE_ELEMENT);
    const [data, setData] = useState<T_elementData[]>(params.itemId ? targetListItemTarget!.words : []);
    const [tableData, setTableData] = useState<T_tableData[]>([]);
    const [isEdit, setIsEdit] = useState<T_editState>(DEFAULT_EDIT_STATE);


    const cleanInputValues = (): void => {
        setItemValues(DEFAULT_ITEM_VALUES);
    }

    const cleanElementInputValues = (): void => {
        cleanInputValues();
        setValidateElement(DEFAULT_VALIDATE_ELEMENT);
    }

    const validateForm = useCallback((): boolean => {
        const elementsData: T_validateElement = {
            showErrorOriginal: !itemValues.original.trim().length,
            showErrorTranslation: !itemValues.translation.trim().length
        };

        setValidateElement(elementsData);

        return !Object.values(elementsData).includes(true);
    }, [itemValues]);

    const addElement = () => {
        const commonData: T_itemValues = {
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

        cleanElementInputValues();
    };

    const removeElement = (): void => {
        setData(val => (val.filter(el => el.id !== isEdit.id)));
        cleanElementInputValues();
        setIsEdit(DEFAULT_EDIT_STATE);
    }

    const submitForm = (): void => {
        setValidateList({
            setValidation: true,
            name: !!nameValue,
            data: !!data.length
        });

        if (!!nameValue.trim() && !!data.length) {
            if (params.itemId) {
                dispatch(changeList({
                    name: nameValue,
                    words: data,
                    key: params.itemId,
                    id: parseInt(params.itemId)
                }, params.itemId));
            } else {
                dispatch(setList({
                    name: nameValue,
                    words: data,
                    key: getUniqID(list),
                    id: parseInt(getUniqID(list))
                }));
            }

            history.push('/');
        }
    }

    useEffect(() => {
        setTableData(data.map(el => ({
            key: el.key,
            id: el.id,
            original: `${el.original}${el.excerpt.original ? ` (${el.excerpt.original})` : ''}`,
            translation: `${el.translation}${el.excerpt.translation ? ` (${el.excerpt.translation})` : ''}`
        })));
    }, [data]);

    useEffect(() => {
        dispatch(setHeaderTitle(params.itemId ? 'Edit list' : 'Create list'));
    }, []);

    return (
        <div className={`${className}`}>
            <div className={`${className}-title`}>
                Name of the list *
            </div>
            <Input
                onFocus={() => setValidateList({...validateList, setValidation: false})}
                className={`${className}-input${(!validateList.setValidation || validateList.name) ? '' : ' error'}`}
                value={nameValue} placeholder={'Name of the list'}
                onInput={e => setNameValue(e.currentTarget.value)}/>
            <div className={`${className}-title`}>
                Elements *
            </div>
            <Input.Group compact className={`${className}-inputGroup`}>
                <Input
                    onFocus={() => setValidateElement({...validateElement, showErrorOriginal: false})}
                    className={`${className}-input${validateElement.showErrorOriginal ? ' error' : ''}`}
                    value={itemValues.original}
                    onInput={e => setItemValues({...itemValues, original: e.currentTarget.value})}
                    placeholder={'Original'}/>
                <Input
                    onFocus={() => setValidateElement({...validateElement, showErrorTranslation: false})}
                    className={`${className}-input${validateElement.showErrorTranslation ? ' error' : ''}`}
                    value={itemValues.translation}
                    onInput={e => setItemValues({...itemValues, translation: e.currentTarget.value})}
                    placeholder={'Translation'}/>
            </Input.Group>
            <div className={`${className}-excerpt`}>
                Extra info
            </div>
            <Input.Group compact className={`${className}-inputGroup`}>
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
            </Input.Group>
            <div className={`${className}-buttonGroup`}>
                <Button className={`${className}-button`} type={'primary'} onClick={() => {
                    if(validateForm()) return addElement();
                }}>
                    {isEdit.state ? 'Edit' : 'Add'}
                </Button>
                {isEdit.state &&
                    <Button className={`${className}-button`} type={'primary'} danger onClick={() => removeElement()}>
                        Delete
                    </Button>}
            </div>
            <Divider className={`${className}-divider`}/>
            <div className={`${className}-titleGroup`}>
                <div className={`${className}-title`}>
                    {nameValue ? `${nameValue.trim()}:` : 'List of elements:'}
                </div>
                <div className={`${className}-buttons`}>
                    <Button onClick={() => {
                        setData((val: T_elementData[]) => val.map((el: T_elementData) => ({
                            ...el,
                            original: el.translation,
                            translation: el.original,
                            excerpt: {
                                original: el.excerpt.translation,
                                translation: el.excerpt.original
                            }
                        })))
                    }} type={'primary'}>Switch</Button>
                    <Button onClick={() => submitForm()} type={'primary'}>Save</Button>
                </div>
            </div>
            <Table className={`${className}-table`}
                   pagination={false}
                   locale={{
                       emptyText: <Empty
                           description={
                               <div
                                   className={`${className}-placeholder${(!validateList.setValidation || validateList.data) ? '' : ' error'}`}>
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