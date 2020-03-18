import React, { Component } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { Card, Button, Icon, Form, Input, Cascader, message } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import PicturesWall from '@/components/PicturesWall'
import RichTextEditor from '@/components/RichTextEditor'
import { reqGetCategoryList } from '@/api/category'
import {
  reqAddProduct,
  reqUpdateProduct,
  AddProductForm,
  UpdateProductForm
} from '@/api/product'
import { validatePrice } from '@/utils/validate'
import { ICategoryTableItem } from '@/interface/Category'
import { IProductListItem } from '@/interface/Product'
import { CascaderOptionType } from 'antd/lib/cascader'
const TextArea = Input.TextArea
/**
 * 商品的添加和编辑组件
 */

const initState = {
  cascaderOptions: [] as CascaderOptionType[]
}
type State = Readonly<typeof initState>
interface IProps extends FormComponentProps, RouteComponentProps {}

class ProductEdit extends Component<IProps, State> {
  state: State = initState
  private isEdit: boolean = false
  private picturesWall: React.RefObject<PicturesWall>
  private richTextEditor: React.RefObject<RichTextEditor>
  constructor(props: IProps) {
    super(props)
    if (this.props.location.state) {
      this.isEdit = true
    } else {
      if (this.props.location.pathname.includes('edit')) {
        this.props.history.replace('/product/add')
      }
    }
    this.picturesWall = React.createRef()
    this.richTextEditor = React.createRef()
  }
  componentDidMount() {
    this.getCategoryList('0')
  }
  private handleLoadSubCategoryList = async (
    selectedOptions?: CascaderOptionType[]
  ) => {
    const targetOption = selectedOptions![0]
    targetOption.loading = true
    const subCategoryList = await this.getCategoryList(targetOption.value!)
    targetOption.loading = false
    if (subCategoryList && subCategoryList.length > 0) {
      const subCascaderOptions = subCategoryList.map<CascaderOptionType>(
        item => ({
          value: item._id,
          label: item.name,
          isLeaf: true
        })
      )
      targetOption.children = subCascaderOptions
    } else {
      // 没有二级分类
      targetOption.isLeaf = true
    }
    this.setState({
      cascaderOptions: [...this.state.cascaderOptions]
    })
  }
  private getCategoryList = async (parentId: string) => {
    const res = await reqGetCategoryList(parentId)

    if (res) {
      const categroyList: ICategoryTableItem[] = res.data.data
      if (parentId === '0') {
        const cascaderOptions = categroyList.map<CascaderOptionType>(item => ({
          value: item._id,
          label: item.name,
          isLeaf: false
        }))

        if (this.isEdit) {
          const { pCategoryId } = this.props.location.state
            .product as IProductListItem
          if (pCategoryId !== '0') {
            const subCategoryList = await this.getCategoryList(pCategoryId)
            const subCascaderOptions = subCategoryList!.map<CascaderOptionType>(
              item => ({
                value: item._id,
                label: item.name,
                isLeaf: true
              })
            )
            const targetOption = cascaderOptions.find(
              option => option.value === pCategoryId
            )
            if (targetOption) {
              targetOption.children = subCascaderOptions
            }
          }
        }
        this.setState({
          cascaderOptions
        })
      } else {
        return categroyList
      }
    }
  }
  private handleSubmit = () => {
    this.props.form.validateFields(async (error, values) => {
      if (!error) {
        const { name, desc, price, categoryIds } = values
        let pCategoryId, categoryId
        if (categoryIds.length === 1) {
          pCategoryId = '0'
          categoryId = categoryIds[0]
        } else {
          pCategoryId = categoryIds[0]
          categoryId = categoryIds[1]
        }
        const imgs = this.picturesWall.current!.getImgs()
        const detail = this.richTextEditor.current!.getDetail()
        let res
        if (this.isEdit) {
          const _id = this.props.location.state.product._id
          const form: UpdateProductForm = {
            _id,
            name,
            desc,
            price,
            pCategoryId,
            categoryId,
            imgs,
            detail
          }
          res = await reqUpdateProduct(form)
        } else {
          const form: AddProductForm = {
            name,
            desc,
            price,
            pCategoryId,
            categoryId,
            imgs,
            detail
          }
          res = await reqAddProduct(form)
        }
        if (res) {
          this.props.history.goBack()
          message.success(`${this.isEdit ? '更新' : '添加'}商品成功`)
        }
      }
    })
  }
  render() {
    const title = (
      <div>
        <Button type='link' onClick={() => this.props.history.goBack()}>
          <Icon type='arrow-left' style={{ fontSize: 20 }} />
        </Button>
        <span>{this.isEdit ? '更新' : '添加'}商品</span>
      </div>
    )
    const formItemLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 8 }
    }
    const { getFieldDecorator } = this.props.form
    let product: IProductListItem
    const categoryIds: string[] = []
    if (this.isEdit) {
      product = this.props.location.state.product
      const { categoryId, pCategoryId } = product
      if (product.pCategoryId === '0') {
        categoryIds.push(categoryId)
      } else {
        categoryIds.push(pCategoryId)
        categoryIds.push(categoryId)
      }
    } else {
      product = {
        name: '',
        desc: '',
        price: '',
        detail: '',
        imgs: [] as string[]
      } as IProductListItem
    }

    return (
      <Card title={title}>
        <Form {...formItemLayout}>
          <Form.Item label='商品名称'>
            {getFieldDecorator('name', {
              initialValue: product.name,
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: '请输入商品名称'
                }
              ]
            })(<Input placeholder='请输入商品名称' />)}
          </Form.Item>
          <Form.Item label='商品描述'>
            {getFieldDecorator('desc', {
              initialValue: product.desc,
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: '请输入商品描述'
                }
              ]
            })(
              <TextArea
                placeholder='请输入商品描述'
                autoSize={{ minRows: 2, maxRows: 6 }}
              />
            )}
          </Form.Item>
          <Form.Item label='商品价格'>
            {getFieldDecorator('price', {
              initialValue: product.price,
              validateFirst: true,
              rules: [
                {
                  required: true,
                  message: '请输入商品价格'
                },
                {
                  validator: validatePrice
                }
              ]
            })(
              <Input
                placeholder='请输入商品价格'
                type='number'
                addonAfter='元'
                min='0'
              />
            )}
          </Form.Item>
          <Form.Item label='商品分类'>
            {getFieldDecorator('categoryIds', {
              initialValue: categoryIds,
              rules: [
                {
                  required: true,
                  message: '请选择商品分类'
                }
              ]
            })(
              <Cascader
                options={this.state.cascaderOptions}
                loadData={this.handleLoadSubCategoryList}
                placeholder='请选择商品分类'
              />
            )}
          </Form.Item>
          <Form.Item label='商品图片'>
            <PicturesWall ref={this.picturesWall} imgs={product.imgs} />
          </Form.Item>
          <Form.Item
            label='商品详情'
            labelCol={{ span: 2 }}
            wrapperCol={{ span: 20 }}
          >
            <RichTextEditor ref={this.richTextEditor} detail={product.detail} />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 2, span: 8 }}>
            <Button
              type='primary'
              block
              size='large'
              onClick={this.handleSubmit}
            >
              提交
            </Button>
          </Form.Item>
        </Form>
      </Card>
    )
  }
}

const wrapProuctEdit = Form.create<IProps>()(ProductEdit)

export default wrapProuctEdit
