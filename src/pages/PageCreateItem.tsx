import {Button, Divider, Empty, Input, Table} from "antd";
import {useEffect, useState} from "react";
import {getUniqID} from "@components/common/helpers";

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

type T_elementData = T_itemValues & {
    key: string
}

type T_tableData = {
    key: string,
    original: string,
    translation: string,
}

type T_itemValues = {
    original: string,
    translation: string,
    excerpt: {
        original: string,
        translation: string
    }
}

export const PageCreateItem = () => {
    const [nameValue, setNameValue] = useState('');
    const [itemValues, setItemValues] = useState<T_itemValues>({
        original: '',
        translation: '',
        excerpt: {
            original: '',
            translation: ''
        }
    });
    const [validateObj, setValidateObj] = useState({
            setValidation: false,
            name: false,
            data: false
        });
    const [data, setData] = useState<T_elementData[]>([
        {
            key: '0',
            original: 'Яблоко',
            translation: 'Apple',
            excerpt: {
                original: 'yabloko',
                translation: ''
            }
        }
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
        console.table({
            originalValue: itemValues.original,
            translationValue: itemValues.translation,
            originalExcerptValue: itemValues.excerpt.original,
            translationExcerptValue: itemValues.excerpt.translation
        })

        setData(val => [...[{
            key: getUniqID(data),
            original: itemValues.original,
            translation: itemValues.translation,
            excerpt: {
                original: itemValues.excerpt.original,
                translation: itemValues.excerpt.translation
            }
        }], ...val])

        cleanInputValues();
    }

    const submitForm = (): void => {
        setValidateObj({
            setValidation: true,
            name: !!nameValue,
            data: !!data.length
        });
    }

    useEffect(() => {
        setTableData(data.map(el => {
            return {
                key: el.key,
                original: `${el.original}${!!el.excerpt.original ? ` (${el.excerpt.original})` : ''}`,
                translation: `${el.translation}${!!el.excerpt.translation ? ` (${el.excerpt.translation})` : ''}`
            }
        }));

        console.log(getUniqID(data), data)
    }, [data]);

    useEffect(() => {
        console.log(validateObj)
    }, [validateObj])

    return (
        <div className={`${className}`}>
            <div className={`${className}-title`}>
                Name of the list *
            </div>
            <Input className={`${className}-input${(!validateObj.setValidation || validateObj.name) ? '' : ' error'}`}
                   onFocus={() => setValidateObj(val => ({...val, ...{name: true}}))}
                   value={nameValue} placeholder={'Name of the list'}
                   onInput={e => setNameValue(e.currentTarget.value)}/>
            <div className={`${className}-title`}>
                Elements *
            </div>
            <Input.Group compact className={`${className}-inputGroup`}>
                <Input value={itemValues.original}
                       onInput={e => setItemValues(val => ({...val, ...{original: e.currentTarget.value}}))}
                       placeholder={'Original'}/>
                <Input value={itemValues.translation}
                       onInput={e => setItemValues(val => ({...val, ...{translation: e.currentTarget.value}}))}
                       placeholder={'Translation'}/>
            </Input.Group>
            <div className={`${className}-excerpt`}>
                Extra info
            </div>
            <Input.Group compact className={`${className}-inputGroup`}>
                <Input value={itemValues.excerpt.original}
                       onInput={e => setItemValues(val => ({
                           ...val, ...{
                               excerpt: {
                                   original: e.currentTarget.value,
                                   translation: val.translation
                               }
                           }
                       }))}
                       placeholder={'For original'}/>
                <Input value={itemValues.excerpt.translation}
                       onInput={e => setItemValues(val => ({
                           ...val, ...{
                               excerpt: {
                                   original: val.original,
                                   translation: e.currentTarget.value
                               }
                           }
                       }))}
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
                emptyText: <Empty description={'Please, add elements to the list'}
                                  image={Empty.PRESENTED_IMAGE_SIMPLE}/>
            }}
                   columns={columns} dataSource={tableData}
                   size="small"/>
        </div>
    )
}