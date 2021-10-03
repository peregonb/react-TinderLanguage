import {Button, Divider, Empty, Input, Table} from "antd";
import {FC, useEffect, useState} from "react";
import {getUniqID} from "@components/common/helpers";
import {I_listItemSingle, I_state, T_elementData, T_itemValues} from "@redux/types";
import {connect} from "react-redux";
import {setList} from "@redux/app-reducer";

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
    original: string,
    translation: string,
}

interface I_propTypes {
    list: I_listItemSingle[],
    setList: (list: I_listItemSingle) => void
}

export const PageCreateItemContainer: FC<I_propTypes> = ({list, setList}) => {
    const [nameValue, setNameValue] = useState('');
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
    const [data, setData] = useState<T_elementData[]>([
        // {
        //     key: '0',
        //     id: '0',
        //     original: 'Яблоко',
        //     translation: 'Apple',
        //     excerpt: {
        //         original: 'yabloko',
        //         translation: ''
        //     }
        // }
    ]);
    const [tableData, setTableData] = useState<T_tableData[]>([]);

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

    const addElement = (): void => {
        setValidateElement({
            showErrorOriginal: !itemValues.original,
            showErrorTranslation: !itemValues.translation
        });

        if (!!itemValues.original.trim() && !!itemValues.translation.trim()) {
            setData(val => [...[{
                key: getUniqID(data),
                id: getUniqID(data),
                original: itemValues.original,
                translation: itemValues.translation,
                excerpt: {
                    original: itemValues.excerpt.original,
                    translation: itemValues.excerpt.translation
                }
            }], ...val]);

            cleanInputValues();

            setValidateElement({
                showErrorOriginal: false,
                showErrorTranslation: false
            });
        }
    }

    const submitForm = (): void => {
        setValidateList({
            setValidation: true,
            name: !!nameValue,
            data: !!data.length
        });

        if (!!nameValue.trim() && !!data.length) {
            setList({
                name: nameValue,
                words: data,
                key: getUniqID(list),
                id: parseInt(getUniqID(list))
            })
        }
    }

    useEffect(() => {
        setTableData(data.map(el => {
            return {
                key: el.key,
                original: `${el.original}${!!el.excerpt.original ? ` (${el.excerpt.original})` : ''}`,
                translation: `${el.translation}${!!el.excerpt.translation ? ` (${el.excerpt.translation})` : ''}`
            }
        }));
    }, [data]);

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
            <Button className={`${className}-button`} type={'primary'} onClick={() => addElement()}>Add</Button>
            <Divider className={`${className}-divider`}/>
            <div className={`${className}-titleGroup`}>
                <div className={`${className}-title`}>
                    {!!nameValue ? `${nameValue.trim()}:` : 'List of elements:'}
                </div>
                <Button onClick={() => submitForm()} type={'primary'}>Save</Button>
            </div>
            <Table className={`${className}-table`}
                   pagination={false} locale={{
                emptyText: <Empty description={<div
                    className={`${className}-placeholder${(!validateList.setValidation || validateList.data) ? '' : ' error'}`}>Please,
                    add elements to the list</div>}
                                  image={Empty.PRESENTED_IMAGE_SIMPLE}/>
            }}
                   columns={columns} dataSource={tableData}
                   size="small"/>
        </div>
    )
}


let mapStateToProps = (state: I_state) => {
    return {
        list: state.app.list,
    }
};

export const PageCreateItem = connect(mapStateToProps, {setList})(PageCreateItemContainer);