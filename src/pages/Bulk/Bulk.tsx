import { FC, memo } from 'react';
import css from '@pages/Bulk/bulk.module.scss';
import { Button, Form, FormProps, Input } from 'antd';
import { IListItemData } from '@redux/reducers/main/types.ts';

type IInputName = 'textarea';
type IFieldType = Record<IInputName, Undefined<string>>;

const {TextArea} = Input;

const Bulk: FC = () => {
    const onFinish: FormProps<IFieldType>['onFinish'] = (values) => {
        try {
            const value = JSON.parse(values.textarea ?? '');

            if (typeof value === 'object' && !Array.isArray(value)) {
                console.log('obj')

                const keys = Object.keys(value);
                if (keys.length === 3 &&
                    ('id' in value && typeof value.id === 'string') &&
                    ('name' in value && typeof value.name === 'string') &&
                    ('words' in value && typeof Array.isArray(value.words) && value.words.length)) {
                    console.log('good 1 layer')

                    value.words.flatMap((el: unknown) => {
                        if (
                            ('id' in value && typeof value.id === 'string') &&
                            ('original' in value && typeof value.id === 'string') &&
                            ('translation' in value && typeof value.id === 'string') &&
                            ('info_original' in value && typeof value.id === 'string') &&
                            ('info_translation' in value && typeof value.id === 'string')
                        ){
                            return el as IListItemData;
                        }
                    });
                } else {
                    console.log('wrong obj types')
                }
            } else {
                console.log('arr')
            }
        } catch (err) {
            console.error(err)
        }
    };

    const onFinishFailed: FormProps<IFieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <Form
            name={'bulk'}
            autoComplete={'off'}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            className={css.Bulk}>

            <Form.Item<IFieldType>
                name={'textarea'}
                rules={[{required: true, message: 'This field cannot be empty'}]}
            >
                <TextArea
                    rows={7}
                    style={{resize: 'none'}}
                    size={'large'}
                    placeholder={'Paste list object'}
                />
            </Form.Item>
            <Button
                className={css.Bulk_button}
                type={'primary'}
                htmlType={'submit'}>
                Test
            </Button>
        </Form>
    )
}

export default memo(Bulk);