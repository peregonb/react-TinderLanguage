import {FC, memo, useCallback} from 'react';
import css from '@pages/AI/ai.module.scss';
import {Button, Form, Input, Select, Typography} from 'antd';
import {languageLevel, languageListLimit, languages, sortLabels} from "../../common/helpers.ts";
import {IFromScratch, usePuter} from "../../common/hooks/usePuter.tsx";

const {Text} = Typography;

const AI: FC = () => {
    const [form] = Form.useForm();

    const [isPending, errorMessage, fetchPuter] = usePuter();

    const generateHandler = useCallback(async (values: IFromScratch) => {
        await fetchPuter('generateFromScratch', values);
    }, [fetchPuter]);

    return (
        <div className={css.AI}>
            <Form
                form={form}
                onFinish={generateHandler}
                className={css.AI_form}
                autoComplete={'off'}
            >
                <Form.Item
                    name={'language_original'}
                    className={css.AI_formItem}
                    label={'Select original language'}
                    required={false}
                    rules={[{required: true, message: 'Please, select an original language'}]}
                >
                    <Select
                        showSearch
                        placeholder={'Select original language'}
                        size={'large'}
                        options={languages}
                        optionFilterProp="label"
                        filterSort={sortLabels}
                    />
                </Form.Item>
                <Form.Item
                    name={'language_translation'}
                    className={css.AI_formItem}
                    label={'Select translation language'}
                    required={false}
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
                <Form.Item
                    name={'language_level'}
                    className={css.AI_formItem}
                    label={'Select preferable language level'}
                    required={false}
                    rules={[{required: true, message: 'Please, select a preferable language level'}]}
                >
                    <Select
                        showSearch
                        placeholder={'Select preferable language level'}
                        size={'large'}
                        options={languageLevel}
                        optionFilterProp="label"
                        filterSort={sortLabels}
                    />
                </Form.Item>
                <Form.Item
                    name={'language_list_limit'}
                    className={css.AI_formItem}
                    label={'How many words should be in the list?'}
                    required={false}
                    rules={[{required: true, message: 'Please, select a preferable list length'}]}
                >
                    <Select
                        showSearch
                        placeholder={'How many words should be in the list?'}
                        size={'large'}
                        options={languageListLimit}
                        optionFilterProp="label"
                    />
                </Form.Item>
                <Form.Item
                    name={'topic'}
                    className={css.AI_formItem}
                    label={'What topic should the list be about?'}
                    required={false}
                    rules={[{required: true, message: 'Please, enter list topic'}]}
                >
                    <Input
                        placeholder={'What topic should the list be about?'}
                        size={'large'}
                    />
                </Form.Item>
            </Form>
            <div className={css.AI_buttons}>
                <Button
                    onClick={() => form.submit()}
                    type={'primary'}
                    size={'large'}
                    {...(isPending ? {loading: true} : {})}
                >
                    {isPending ? 'Generating list...' : 'Generate list'}
                </Button>
                {!!errorMessage.length && <Text type="danger">{errorMessage}</Text>}
            </div>
        </div>
    )
}

export default memo(AI);