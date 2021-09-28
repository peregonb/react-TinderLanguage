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

type T_elementData = {
    key: string,
    original: string,
    translation: string,
    excerpt: {
        original: string,
        translation: string
    }
}

type T_tableData = {
    key: string,
    original: string,
    translation: string,
}

export const PageCreateItem = () => {
    const [nameValue, setNameValue] = useState('');
    const [originalValue, setOriginalValue] = useState('');
    const [translationValue, setTranslationValue] = useState('');
    const [originalExcerptValue, setOriginalExcerptValue] = useState('');
    const [translationExcerptValue, setTranslationExcerptValue] = useState('');
    const [data, setData] = useState<T_elementData[]>([
        {
            key: '0',
            original: 'string',
            translation: 'string',
            excerpt: {
                original: 'string',
                translation: 'string'
            }
        }
    ]);
    const [tableData, setTableData] = useState<T_tableData[]>([]);

    const cleanInputValues = (): void => {
        setOriginalValue('');
        setTranslationValue('');
        setOriginalExcerptValue('');
        setTranslationExcerptValue('');
    }

    const addElement = (): void => {
        console.table({
            originalValue: originalValue,
            translationValue: translationValue,
            originalExcerptValue: originalExcerptValue,
            translationExcerptValue: translationExcerptValue
        })

        setData(val => [...[{
            key: getUniqID(data),
            original: originalValue,
            translation: translationValue,
            excerpt: {
                original: originalExcerptValue,
                translation: translationExcerptValue
            }
        }], ...val])

        cleanInputValues();
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
    }, [data])

    return (
        <div className={`${className}`}>
            <div className={`${className}-title`}>
                Name of the list *
            </div>
            <Input className={`${className}-input`} value={nameValue} placeholder={'Name of the list'}
                   onInput={e => setNameValue(e.currentTarget.value)}/>
            <div className={`${className}-title`}>
                Elements *
            </div>
            <Input.Group compact className={`${className}-inputGroup`}>
                <Input value={originalValue} onInput={e => setOriginalValue(e.currentTarget.value)}
                       placeholder={'Original'}/>
                <Input value={translationValue} onInput={e => setTranslationValue(e.currentTarget.value)}
                       placeholder={'Translation'}/>
            </Input.Group>
            <div className={`${className}-excerpt`}>
                Extra info
            </div>
            <Input.Group compact className={`${className}-inputGroup`}>
                <Input value={originalExcerptValue} onInput={e => setOriginalExcerptValue(e.currentTarget.value)}
                       placeholder={'For original'}/>
                <Input value={translationExcerptValue} onInput={e => setTranslationExcerptValue(e.currentTarget.value)}
                       placeholder={'For translation'}/>
            </Input.Group>
            <Button className={`${className}-button`} type={'primary'} onClick={() => addElement()}>Add</Button>
            <Divider className={`${className}-divider`}/>
            <div className={`${className}-titleGroup`}>
                <div className={`${className}-title`}>
                    {!!nameValue ? `${nameValue.trim()}:` : 'List of elements:'}
                </div>
                <Button type={'primary'}>Save</Button>
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