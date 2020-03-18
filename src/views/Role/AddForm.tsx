import React, { forwardRef, useImperativeHandle } from 'react'
import { Form, Input } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
const Item = Form.Item

interface IProps extends FormComponentProps {}
const AddForm = forwardRef<FormComponentProps, IProps>(
  ({ form }: IProps, ref) => {
    useImperativeHandle(ref, () => ({
      form
    }))
    const { getFieldDecorator } = form
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 19 }
    }
    return (
      <Form {...formItemLayout}>
        <Item label='角色名称'>
          {getFieldDecorator('roleName', {
            initialValue: '',
            rules: [
              { required: true, whitespace: true, message: '请输入角色名' }
            ]
          })(<Input placeholder='请输入角色名' />)}
        </Item>
      </Form>
    )
  }
)

// 经过包装后的Login组件
const WrapAddForm = Form.create<IProps>()(AddForm)

export default WrapAddForm
