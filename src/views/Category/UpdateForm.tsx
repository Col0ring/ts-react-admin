import React, { forwardRef, useImperativeHandle } from 'react'
import { Form, Input } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
const Item = Form.Item
interface IProps extends FormComponentProps {
  categoryName: string
}
const UpdateForm = forwardRef<FormComponentProps, IProps>(
  ({ form, categoryName }: IProps, ref) => {
    useImperativeHandle(ref, () => ({
      form
    }))
    const { getFieldDecorator } = form
    return (
      <Form>
        <Item>
          {getFieldDecorator('categoryName', {
            initialValue: categoryName,
            rules: [
              { required: true, whitespace: true, message: '请输入分类名' }
            ]
          })(<Input placeholder='请输入分类名称' />)}
        </Item>
      </Form>
    )
  }
)

// class UpdateForm extends Component<IProps> {
//   render() {
//     const {
//       form: { getFieldDecorator },
//       categoryName
//     } = this.props
//     return (
//       <Form>
//         <Item>
//           {getFieldDecorator('categoryName', {
//             initialValue: categoryName
//           })(<Input placeholder='请输入分类名称' />)}
//         </Item>
//       </Form>
//     )
//   }
// }
// 经过包装后的Login组件
const WrapUpdateForm = Form.create<IProps>()(UpdateForm)

export default WrapUpdateForm
