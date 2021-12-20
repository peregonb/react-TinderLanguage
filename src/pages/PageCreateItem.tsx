import {Button, Divider, Empty, Input, Table} from "antd";
import {FC, useEffect, useState} from "react";
import {getUniqID} from "@components/common/helpers";
import {I_listItemSingle, I_state, T_elementData, T_itemValues} from "@redux/types";
import {connect} from "react-redux";
import {changeList, setHeaderTitle, setList} from "@redux/app-reducer";
import {useHistory, withRouter} from "react-router-dom";
import {RouteComponentProps} from "react-router";

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

interface I_propTypes extends RouteComponentProps<T_routeTypes> {
    list: I_listItemSingle[],
    setList: (list: I_listItemSingle) => void,
    changeList: (list: I_listItemSingle, id: string) => void
    setHeaderTitle: (headline: string) => void
}

export const PageCreateItemContainer: FC<I_propTypes> = ({list, setList, changeList, setHeaderTitle, match}) => {
    const isListItemEdit = match?.params?.itemId;
    const targetListItemTarget = list.filter(el => el.key === match.params.itemId)[0];
    const [nameValue, setNameValue] = useState(!!isListItemEdit ? targetListItemTarget.name : '');
    const [itemValues, setItemValues] = useState<T_itemValues>({
        original: '',
        translation: '',
        excerpt: {
            original: '',
            translation: ''
        }
    });
    const [validateList, setValidateList] = useState({
        setValidation: false,
        name: false,
        data: false
    });
    const [validateElement, setValidateElement] = useState({
        showErrorOriginal: false,
        showErrorTranslation: false
    });
    const [data, setData] = useState<T_elementData[]>(!!isListItemEdit ? targetListItemTarget.words : []);
    const [tableData, setTableData] = useState<T_tableData[]>([]);
    const [isEdit, setIsEdit] = useState<{ state: boolean, id: null | number }>({
        state: false,
        id: null
    });
    let history = useHistory();

    const cleanInputValues = (): void => {
        setItemValues({
            original: '',
            translation: '',
            excerpt: {
                original: '',
                translation: ''
            }
        });
    }

    const cleanElementInputValues = (): void => {
        cleanInputValues();
        setValidateElement({
            showErrorOriginal: false,
            showErrorTranslation: false
        });
    }

    const addElement = (): void => {
        setValidateElement({
            showErrorOriginal: !itemValues.original,
            showErrorTranslation: !itemValues.translation
        });

        if (isEdit.state) {
            if (!!itemValues.original.trim() && !!itemValues.translation.trim()) {
                setData(val => (
                    val.map(el => el.id === isEdit.id ? {
                        ...el,
                        original: itemValues.original,
                        translation: itemValues.translation,
                        excerpt: {
                            original: itemValues.excerpt.original,
                            translation: itemValues.excerpt.translation
                        }
                    } : el)
                ));

                cleanElementInputValues();
            }

            setIsEdit({state: false, id: null});
        } else {
            if (!!itemValues.original.trim() && !!itemValues.translation.trim()) {
                setData(val => {
                    return [...[{
                        key: getUniqID(val),
                        id: parseInt(getUniqID(val)),
                        original: itemValues.original,
                        translation: itemValues.translation,
                        excerpt: {
                            original: itemValues.excerpt.original,
                            translation: itemValues.excerpt.translation
                        }
                    }], ...val];
                });
                cleanElementInputValues();
            }
        }
    }

    const removeElement = (): void => {
        setData(val => (val.filter(el => el.id !== isEdit.id)));
        cleanElementInputValues();
        setIsEdit({state: false, id: null});
    }

    const submitForm = (): void => {
        setValidateList({
            setValidation: true,
            name: !!nameValue,
            data: !!data.length
        });
        console.log(1)

        if (!!nameValue.trim() && !!data.length) {
            console.log(2)
            if (!!isListItemEdit) {
                console.log(3)
                changeList({
                    name: nameValue,
                    words: data,
                    key: isListItemEdit,
                    id: parseInt(isListItemEdit)
                }, isListItemEdit);
            } else {
                console.log(4)
                setList({
                    name: nameValue,
                    words: data,
                    key: getUniqID(list),
                    id: parseInt(getUniqID(list))
                });
            }

            history.push('/');
        }
    }

    useEffect(() => {
        setTableData(data.map(el => {
            return {
                key: el.key,
                id: el.id,
                original: `${el.original}${!!el.excerpt.original ? ` (${el.excerpt.original})` : ''}`,
                translation: `${el.translation}${!!el.excerpt.translation ? ` (${el.excerpt.translation})` : ''}`
            }
        }));
    }, [data]);

    useEffect(() => setHeaderTitle(!!isListItemEdit ? 'Edit list' : 'Create list'), [])

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
                <Button className={`${className}-button`} type={'primary'} onClick={() => addElement()}>
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
                    {!!nameValue ? `${nameValue.trim()}:` : 'List of elements:'}
                </div>
                <div className={`${className}-buttons`}>
                    <Button onClick={() => {
                        setData((val: any) => val.map((el: T_elementData) => ({
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
                   pagination={false} locale={{
                emptyText: <Empty description={
                    <div
                        className={`${className}-placeholder${(!validateList.setValidation || validateList.data) ? '' : ' error'}`}>
                        Please, add elements to the list</div>
                } image={Empty.PRESENTED_IMAGE_SIMPLE}/>
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
                   size="small"/>
        </div>
    )
};


let mapStateToProps = (state: I_state) => ({
    list: state.app.list,
});

export const PageCreateItem = connect(
    mapStateToProps, {setList, changeList, setHeaderTitle}
)(withRouter(PageCreateItemContainer));