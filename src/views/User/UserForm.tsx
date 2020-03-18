import React, { forwardRef, useImperativeHandle } from 'react'
import { Form, Input, Select } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import { validatePwd } from '@/utils/validate'
import { IRoleListItem } from '@/interface/Role'
import { IUserListItem } from '@/interface/User'
const Item = Form.Item
const Option = Select.Option

interface IProps extends FormComponentProps {
  roleList: IRoleListItem[]
  user: IUserListItem
}
const UserForm = forwardRef<FormComponentProps, IProps>(
  ({ form, roleList, user }: IProps, ref) => {
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
        <Item label='用户名'>
          {getFieldDecorator('username', {
            initialValue: user.username,
            rules: [
              { required: true, whitespace: true, message: '请输入用户名' },
              { min: 4, message: '用户名至少为4位' },
              { max: 12, message: '用户名最多为12位' },
              {
                pattern: /^[A-Za-z0-9_]+$/,
                message: '用户名必须是英文、数字或下划线组成'
              }
            ]
          })(<Input placeholder='请输入用户名' />)}
        </Item>
        {user._id ? null : (
          <Item label='密码'>
            {getFieldDecorator('password', {
              //自定义校验
              validateFirst: true,
              initialValue: '',
              rules: [
                { required: true, whitespace: true, message: '请输入密码' },
                { validator: validatePwd }
              ]
            })(
              <Input
                type='password'
                placeholder='密码'
                autoComplete='current-password'
              />
            )}
          </Item>
        )}
        <Item label='手机号'>
          {getFieldDecorator('phone', {
            initialValue: user.phone,
            validateFirst: true,
            rules: [
              { required: true, whitespace: true, message: '请输入手机号' },
              {
                pattern: /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-7|9])|(?:5[0-3|5-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[1|8|9]))\d{8}$/,
                message: '手机号格式不正确'
              }
            ]
          })(<Input placeholder='手机号' />)}
        </Item>
        <Item label='邮箱'>
          {getFieldDecorator('email', {
            validateFirst: true,
            initialValue: user.email,
            rules: [
              { required: true, whitespace: true, message: '请输入邮箱' },
              {
                pattern: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
                message: '邮箱格式不正确'
              }
            ]
          })(<Input placeholder='请输入邮箱' />)}
        </Item>
        <Item label='角色'>
          {getFieldDecorator('role_id', {
            initialValue: user.role_id,
            rules: [{ required: true, whitespace: true, message: '请选择角色' }]
          })(
            <Select placeholder='请选择角色'>
              {roleList.map(role => (
                <Option key={role._id} value={role._id}>
                  {role.name}
                </Option>
              ))}
            </Select>
          )}
        </Item>
      </Form>
    )
  }
)

const WrapUserForm = Form.create<IProps>()(UserForm)

export default WrapUserForm
