import { FC, memo, useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Divider, Empty, Input, Table, Space, Form } from 'antd';
import { getUniqID } from '../../common/helpers.ts';
import { IListItemData, IListItemSingle, IListItemValues } from '@redux/reducers/main/types.ts';
import { useHistory, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from '@redux/hooks.ts';
import { mainRootSelectors } from '@redux/reducers/main/selectors.ts';
import { addList, setList, setHeaderTitle } from '@redux/reducers/main';
import { PlusOutlined } from '@ant-design/icons';

import css from '@pages/Edit/edit.module.scss';
import cn from 'classnames';

type IInputName = 'name' | 'original' | 'translation' | 'info_original' | 'info_translation';
type IFieldType = Record<IInputName, Undefined<string>>;

const INPUT: Record<'full' | 'word' | 'info', Array<IInputName>> = {
    full: ['original', 'translation', 'info_original', 'info_translation'],
    word: ['original', 'translation'],
    info: ['info_original', 'info_translation'],
}

const COLUMNS = [
    {
        title: 'Original',
        dataIndex: 'original',
    },
    {
        title: 'Translation',
        dataIndex: 'translation',
    }
];

const formatString = (a: string, b: string): string => `${a}${b ? ` (${b})` : ''}`;

const Edit: FC = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const [form] = Form.useForm();

    const paramId = useParams<{ listId: string }>().listId;
    const list = useSelector(mainRootSelectors.list);

    const foundListItem = useMemo(() => list.find((el: IListItemSingle) => el.id === paramId), [list, paramId]);
    const [tableError, setTableErrorStatus] = useState<boolean>(false);

    const [listName, setListName] = useState<IListItemSingle['name']>(foundListItem ? foundListItem.name : '');
    const [listWords, setListWords] = useState<IListItemSingle['words']>(foundListItem ? foundListItem.words : []);
    const [rowIdToEdit, setRowIdToEdit] = useState<Nullable<string>>(null);

    const listId = useMemo(() => foundListItem ? foundListItem.id : getUniqID(), [foundListItem]);
    const isTableChanged = useMemo(() =>
        JSON.stringify(foundListItem?.words ?? []) !== JSON.stringify(listWords ?? []), [foundListItem, listWords]);

    const cleanElementInputValues = useCallback(() =>
        form.setFieldsValue(Object.fromEntries(INPUT.full.map(el => [el, '']))), [form]);

    const setListRowId = useCallback((id: string) => {
        const foundRow: IListItemData = listWords.find(el => el.id === id)!;

        setRowIdToEdit(id);
        form.setFieldsValue(Object.fromEntries(INPUT.full.map(el => [el, foundRow[(el as keyof IListItemData)]])));
    }, [listWords, form]);

    const switchTableValues = useCallback(() => {
        setListWords(prev =>
            prev.map(el => ({
                ...el,
                original: el.translation,
                translation: el.original,
                info_original: el.info_translation,
                info_translation: el.info_original,
            })))
    }, []);

    const addElement = useCallback(() => {
        form.validateFields(INPUT.full)
            .then((r: IListItemValues) => {
                const newList: IListItemValues = Object.fromEntries(INPUT.full.map(el => [el, r[(el as keyof IListItemValues)] ?? ''])) as IListItemValues;

                if (rowIdToEdit) {
                    setListWords(prev => prev.map(el => {
                        if (el.id !== rowIdToEdit) return el;

                        return {
                            ...el,
                            ...newList,
                        }
                    }));

                    setRowIdToEdit(null);
                } else {
                    setListWords(prev => [
                        {
                            id: getUniqID(),
                            ...newList,
                        },
                        ...prev
                    ]);

                    setTableErrorStatus(false);
                }

                cleanElementInputValues();
            }).catch(err => console.warn(err));
    }, [cleanElementInputValues, form, rowIdToEdit]);

    const saveList = useCallback(() => {
        const isTableFilled = listWords.length;
        setTableErrorStatus(!isTableFilled);

        form.validateFields(['name']).then(() => {
            if (!isTableFilled) return;

            const newList = {
                name: listName,
                id: listId,
                words: listWords
            };

            dispatch(foundListItem ?
                setList({
                    id: listId,
                    item: newList
                }) :
                addList(newList)
            );

            history.push('/');
        }).catch(err => console.warn(err));
    }, [dispatch, form, foundListItem, history, listId, listName, listWords]);

    const removeElement = useCallback(() => {
        setListWords(prev => prev.filter(el => el.id !== rowIdToEdit));
        setRowIdToEdit(null);
        cleanElementInputValues();
    }, [cleanElementInputValues, rowIdToEdit]);

    useEffect(() => {
        dispatch(setHeaderTitle(`${foundListItem ? 'Edit' : 'Create'} list`));
    }, [dispatch, foundListItem]);

    return (
        <Form
            className={css.Edit}
            name={'basic'}
            form={form}
            initialValues={{
                name: listName,
            }}
            autoComplete={'off'}>
            <div className={css.Edit_title}>
                Name of the list *
            </div>
            <Form.Item<IFieldType>
                name={'name'}
                className={css.Edit_input}
                rules={[{required: true, message: 'Please, enter list name'}]}
            >
                <Input
                    name={'name'}
                    size={'large'}
                    placeholder={'Name of the list'}
                    onInput={e => setListName(e.currentTarget.value)}/>
            </Form.Item>
            <div className={css.Edit_title}>
                Elements *
            </div>
            <Space.Compact className={css.Edit_inputGroup}>
                {
                    INPUT.word.map(el => (
                        <Form.Item<IFieldType>
                            key={el}
                            name={el}
                            className={css.Edit_input}
                            rules={[{required: true, message: 'Field is required'}]}>
                            <Input
                                size={'large'}
                                placeholder={el}/>
                        </Form.Item>
                    ))
                }
            </Space.Compact>
            <div className={css.Edit_excerpt}>
                Extra info
            </div>
            <Space.Compact className={css.Edit_inputGroup}>
                {
                    INPUT.info.map(el => (
                        <Form.Item<IFieldType>
                            key={el}
                            name={el}>
                            <Input
                                size={'large'}
                                placeholder={`For ${el.split('_')[0]}`}/>
                        </Form.Item>
                    ))
                }
            </Space.Compact>
            <div className={css.Edit_buttonGroup}>
                <Button
                    size={'large'}
                    icon={!rowIdToEdit && <PlusOutlined/>}
                    iconPosition={'end'}
                    className={css.Edit_button}
                    type={'primary'}
                    onClick={addElement}>
                    {rowIdToEdit ? 'Edit' : 'Add'}
                </Button>
                {rowIdToEdit && (
                    <Button
                        size={'large'}
                        className={css.Edit_button}
                        type={'primary'}
                        danger
                        onClick={removeElement}>
                        Delete
                    </Button>
                )}
            </div>
            <Divider className={css.Edit_divider}/>
            <div className={css.Edit_titleGroup}>
                <div className={css.Edit_title}>
                    {`${listName || 'List of elements'}:`}
                </div>
                <div className={css.Edit_buttons}>
                    <Button
                        size={'large'}
                        onClick={switchTableValues}
                        disabled={!!rowIdToEdit || !listWords.length}
                        type={'primary'}>
                        Switch
                    </Button>
                    <Button
                        size={'large'}
                        onClick={saveList}
                        type={'primary'}>
                        Save {isTableChanged ? '*' : ''}
                    </Button>
                </div>
            </div>
            <Table className={css.Edit_table}
                   tableLayout={'fixed'}
                   pagination={false}
                   locale={{
                       emptyText: <Empty
                           description={
                               <div className={cn(css.Edit_placeholder, {
                                   [css.Edit_placeholder__error]: tableError
                               })}>
                                   Please, add elements to the list
                               </div>
                           }
                           image={Empty.PRESENTED_IMAGE_SIMPLE}/>
                   }}
                   onRow={({id}) => ({
                       onClick: () => setListRowId(id)
                   })}
                   columns={COLUMNS}
                   dataSource={listWords.map(el => ({
                       ...el,
                       key: el.id,
                       original: formatString(el.original, el.info_original),
                       translation: formatString(el.translation, el.info_translation)
                   }))}
                   size={'small'}/>
        </Form>
    );
};

export default memo(Edit);