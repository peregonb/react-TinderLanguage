import { FC, memo, useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Divider, Empty, Input, Table, Space, Form } from 'antd';
import { getUniqID } from '@components/common/helpers';
import { IListItemData, IListItemSingle } from '@redux/reducers/main/types';
import { useHistory, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from '@redux/hooks';
import { mainRootSelectors } from '@redux/reducers/main/selectors';
import { addList, setList, setHeaderTitle } from '@redux/reducers/main';
import { PlusOutlined } from '@ant-design/icons';

import css from '@styles/pages/Edit.module.scss';
import cn from 'classnames';

type IFieldType = {
    name?: string;
    original?: string;
    translation?: string;
    ['excerpt.original']?: string;
    ['excerpt.translation']?: string;
};

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

const PageEditList: FC = () => {
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
    const isTableChanged = useMemo(() => JSON.stringify(foundListItem?.words ?? []) !== JSON.stringify(listWords ?? []), [foundListItem, listWords]);

    const cleanElementInputValues = useCallback(() => {
        form.setFieldsValue({
            'original': '',
            'translation': '',
            'excerpt.original': '',
            'excerpt.translation': '',
        });
    }, [form]);

    const setListRowId = useCallback((id: string) => {
        const {original, translation, excerpt}: IListItemData = listWords.find(el => el.id === id)!;

        setRowIdToEdit(id);
        form.setFieldsValue({
            'original': original,
            'translation': translation,
            'excerpt.original': excerpt.original,
            'excerpt.translation': excerpt.translation,
        });
    }, [listWords, form]);

    const switchTableValues = useCallback(() => {
        setListWords(prev =>
            prev.map(el => ({
                ...el,
                original: el.translation,
                translation: el.original,
                excerpt: {
                    original: el.excerpt.translation,
                    translation: el.excerpt.original,
                }
            })))
    }, []);

    const addElement = useCallback(() => {
        form.validateFields(['original', 'translation', 'excerpt.original', 'excerpt.translation'])
            .then(r => {
                if (rowIdToEdit) {
                    setListWords(prev => prev.map(el => {
                        if (el.id !== rowIdToEdit) return el;

                        return {
                            ...el,
                            original: r.original,
                            translation: r.translation,
                            excerpt: {
                                original: r['excerpt.original'] || '',
                                translation: r['excerpt.translation'] || '',
                            }
                        }
                    }));

                    setRowIdToEdit(null);
                } else {
                    setListWords(prev => [{
                        id: getUniqID(),
                        original: r.original,
                        translation: r.translation,
                        excerpt: {
                            original: r['excerpt.original'] || '',
                            translation: r['excerpt.translation'] || '',
                        }
                    }, ...prev]);

                    setTableErrorStatus(false);
                }

                cleanElementInputValues();
                return r;
            })
            .catch(err => console.error('Error adding element:', err));
    }, [cleanElementInputValues, form, rowIdToEdit]);

    const saveList = useCallback(() => {
        const isTableFilled = listWords.length;
        setTableErrorStatus(!isTableFilled);

        form.validateFields(['name']).then(r => {
            if (isTableFilled) {
                const newList = {
                    name: listName,
                    id: listId,
                    words: listWords
                };

                if (foundListItem) {
                    dispatch(setList({
                        id: listId,
                        item: newList
                    }));
                } else {
                    dispatch(addList(newList));
                }

                history.push('/');
            }
            return r;
        }).catch(err => console.error('Error creating list:', err));
    }, [dispatch, form, foundListItem, history, listId, listName, listWords]);

    const removeElement = useCallback(() => {
        setListWords(prev => prev.filter(el => el.id !== rowIdToEdit));
        setRowIdToEdit(null);
        cleanElementInputValues();
    }, [cleanElementInputValues, rowIdToEdit]);

    useEffect(() => {
        dispatch(setHeaderTitle(foundListItem ? 'Edit list' : 'Create list'));
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
                <Form.Item<IFieldType>
                    name={'original'}
                    className={css.Edit_input}
                    rules={[{required: true, message: 'Field is required'}]}>
                    <Input
                        size={'large'}
                        placeholder={'Original'}/>
                </Form.Item>
                <Form.Item<IFieldType>
                    name={'translation'}
                    className={css.Edit_input}
                    rules={[{required: true, message: 'Field is required'}]}>
                    <Input
                        size={'large'}
                        placeholder={'Translation'}/>
                </Form.Item>
            </Space.Compact>
            <div className={css.Edit_excerpt}>
                Extra info
            </div>
            <Space.Compact className={css.Edit_inputGroup}>
                <Form.Item<IFieldType> name={'excerpt.original'}>
                    <Input size={'large'}
                           placeholder={'For original'}/>
                </Form.Item>
                <Form.Item<IFieldType> name={'excerpt.translation'}>
                    <Input size={'large'}
                           placeholder={'For translation'}/>
                </Form.Item>
            </Space.Compact>
            <div className={css.Edit_buttonGroup}>
                <Button
                    icon={!rowIdToEdit && <PlusOutlined/>}
                    iconPosition={'end'}
                    className={css.Edit_button}
                    type={'primary'}
                    onClick={addElement}>
                    {rowIdToEdit ? 'Edit' : 'Add'}
                </Button>
                {rowIdToEdit && (
                    <Button
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
                        onClick={switchTableValues}
                        disabled={!!rowIdToEdit || !listWords.length}
                        type={'primary'}>
                        Switch
                    </Button>
                    <Button
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
                       original: formatString(el.original, el.excerpt.original),
                       translation: formatString(el.translation, el.excerpt.translation)
                   }))}
                   size={'small'}/>
        </Form>
    );
};

export default memo(PageEditList);