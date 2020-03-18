import React, { forwardRef, useImperativeHandle } from 'react'
import { Form, Select, Input } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import { ICategoryTableItem } from '@/interface/Category'
const Item = Form.Item
const Option = Select.Option

interface IProps extends FormComponentProps {
  categoryList: ICategoryTableItem[]
  parentId: string
}
const AddForm = forwardRef<FormComponentProps, IProps>(
  ({ form, categoryList, parentId }: IProps, ref) => {
    useImperativeHandle(ref, () => ({
      form
    }))
    const { getFieldDecorator } = form
    return (
      <Form>
        <Item>
          {getFieldDecorator('parentId', {
            initialValue: parentId
          })(
            <Select>
              <Option value='0'>一级分类</Option>
              {categoryList.map(item => (
                <Option value={item._id}>{item.name}</Option>
              ))}
            </Select>
          )}
        </Item>
        <Item>
          {getFieldDecorator('categoryName', {
            initialValue: '',
            rules: [
              { required: true, whitespace: true, message: '请输入分类名' }
            ]
          })(<Input placeholder='请输入分类名称' />)}
        </Item>
      </Form>
    )
  }
)

// class AddForm extends Component<IProps> {
//   render() {
//     const { categoryList, parentId } = this.props
//     const { getFieldDecorator } = this.props.form
//     return (
//       <Form>
//         <Item>
//           {getFieldDecorator('parentId', {
//             initialValue: parentId
//           })(
//             <Select>
//               <Option value='0'>一级分类</Option>
//               {categoryList.map(item => (
//                 <Option value={item._id}>{item.name}</Option>
//               ))}
//             </Select>
//           )}
//         </Item>
//         <Item>
//           {getFieldDecorator('categoryName', {
//             initialValue: ''
//           })(<Input placeholder='请输入分类名称' />)}
//         </Item>
//       </Form>
//     )
//   }
// }
// 经过包装后的Login组件
const WrapAddForm = Form.create<IProps>()(AddForm)

export default WrapAddForm
