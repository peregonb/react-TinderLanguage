import React, {useState, useRef, memo, useCallback} from 'react';
import {Button, Form, Input, InputRef, Tag, Typography, Select} from 'antd';
import {PlusOutlined} from '@ant-design/icons';
import css from '@pages/Tabulator/tabulator.module.scss';
import {usePuter} from "../../common/hooks/usePuter.tsx";
import {languages, sortLabels} from "../../common/helpers.ts";

const {Text} = Typography;

const Tabulator: React.FC = () => {
    const [tags, setTags] = useState<Array<string>>([]);
    const [inputValue, setInputValue] = useState('');
    const [editingIndex, setEditingIndex] = useState<Nullable<number>>(null);
    const inputRef = useRef<Nullable<InputRef>>(null);

    const [form] = Form.useForm();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const handleInputConfirm = () => {
        const newEntries = inputValue
            .split(',')
            .map(tag => tag.trim())
            .filter(tag => tag);

        if (editingIndex !== null) {
            const updated = [...tags];
            updated[editingIndex] = newEntries[0] || tags[editingIndex];
            setTags(updated);
            setEditingIndex(null);
        } else {
            const newTags = newEntries.filter(tag => !tags.includes(tag));
            if (newTags.length > 0) {
                setTags([...tags, ...newTags]);
            }
        }

        setInputValue('');
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            handleInputConfirm();
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    const handleEditTag = (index: number) => {
        setInputValue(tags[index]);
        setEditingIndex(index);

        setTimeout(() => {
            const inputEl = inputRef.current?.input;
            if (inputEl) {
                inputEl.focus();
                inputEl.setSelectionRange(inputEl.value.length, inputEl.value.length);
            }
        }, 0);
    };

    const [isPending, errorMessage, fetchPuter] = usePuter();

    const generateHandler = useCallback(async (values: { language: string }) => {
        await fetchPuter('generateFromList', {
            tags,
            language: values.language,
        });
    }, [fetchPuter, tags]);

    return (
        <div className={css.Tabulator}>
            <Form
                form={form}
                onFinish={generateHandler}
                className={css.Tabulator_form}
                autoComplete={'off'}
            >
                <Form.Item
                    name={'language'}
                    rules={[{required: true, message: 'Please, select a translation language'}]}
                >
                    <Select
                        showSearch
                        placeholder={'Select translation language'}
                        size={'large'}
                        options={languages}
                        optionFilterProp="label"
                        filterSort={sortLabels}
                    />
                </Form.Item>
                <Form.Item>
                    <Input
                        ref={inputRef}
                        size={'large'}
                        placeholder={'Type a word or phrase, then press Enter or comma'}
                        value={inputValue}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        onBlur={handleInputConfirm}
                        suffix={<PlusOutlined/>}
                    />
                </Form.Item>
            </Form>
            {!!tags.length && (
                <>
                    <div className={css.Tabulator_cloud}>
                        {tags.map((tag, index) => (
                            <Tag
                                key={tag + index}
                                closable
                                onClose={() => handleRemoveTag(tag)}
                                onClick={() => handleEditTag(index)}
                                style={{cursor: 'pointer', margin: 0}}>
                                {tag}
                            </Tag>
                        ))}
                    </div>
                </>
            )}

            <div className={css.Tabulator_buttons}>
                {!!tags.length && (
                    <Button
                        onClick={() => form.submit()}
                        type={'primary'}
                        size={'large'}
                        {...(isPending ? {loading: true} : {})}
                    >
                        {isPending ? 'Generating list...' : 'Generate list'}
                    </Button>
                )}
                {!!errorMessage.length && <Text type="danger">{errorMessage}</Text>}
            </div>
        </div>
    );
};

export default memo(Tabulator);