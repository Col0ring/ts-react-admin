import React, { Component } from 'react'
import { Card, Button, Icon, Table, Modal } from 'antd'
import { ColumnProps } from 'antd/es/table'
import AddForm from './AddForm'
import UpdateForm from './UpdateForm'
import {
  reqGetCategoryList,
  reqUpdateCategory,
  reqAddCategory
} from '@/api/category'
import { ICategoryTableItem } from '@/interface/Category'
import { FormComponentProps } from 'antd/lib/form'
/**
 * 商品分类
 */
const initState = {
  loading: false,
  categoryList: [] as ICategoryTableItem[],
  subCategoryList: [] as ICategoryTableItem[],
  parentId: '0', // 当前需要展示的分类列表的父分类Id
  parentName: '', //当前需要显示的分类列表的父分类名称
  showStatus: 0,
  confirmLoading: false
}
type State = Readonly<typeof initState>

class Category extends Component<any, State> {
  state: State = initState
  private updateForm: React.RefObject<FormComponentProps>
  private addForm: React.RefObject<FormComponentProps>
  private columns: ColumnProps<ICategoryTableItem>[] = [
    {
      title: '分类名称',
      dataIndex: 'name'
    },
    {
      title: '操作',
      width: 300,
      align: 'center',
      render: category => (
        <div>
          <Button
            type='link'
            onClick={() => {
              this.handleShowModal(2, category)
            }}
          >
            修改分类
          </Button>
          {this.state.parentId === '0' ? (
            <Button
              type='link'
              onClick={() => {
                this.handleShowSubCategory(category)
              }}
            >
              查看子分类
            </Button>
          ) : null}
        </div>
      )
    }
  ]
  private updateCategory?: ICategoryTableItem

  constructor(props: object) {
    super(props)
    this.updateForm = React.createRef()
    this.addForm = React.createRef()
  }

  private getCategoryList = async (parentId?: string) => {
    this.setState({
      loading: true
    })
    const res = await reqGetCategoryList(parentId || this.state.parentId)
    if (res) {
      if (this.state.parentId === '0') {
        this.setState({
          loading: false,
          categoryList: res.data.data
        })
      } else {
        this.setState({
          loading: false,
          subCategoryList: res.data.data
        })
      }
    } else {
      this.setState({
        loading: false
      })
    }
  }
  private handleShowSubCategory = (category: ICategoryTableItem) => {
    const { _id, name } = category
    this.setState(
      {
        parentId: _id,
        parentName: name
      },
      () => {
        this.getCategoryList()
      }
    )
  }
  private handleShowCategory = () => {
    this.setState({
      parentId: '0',
      parentName: ''
    })
  }
  private handleCancelModal = () => {
    const { showStatus } = this.state
    if (showStatus === 1) {
      this.addForm.current!.form.resetFields()
    } else if (showStatus === 2) {
      this.updateForm.current!.form.resetFields()
    }
    this.setState({
      showStatus: 0
    })
  }
  private handleShowModal = (status: number, category?: ICategoryTableItem) => {
    if (category) {
      this.updateCategory = category
    }
    this.setState({
      showStatus: status
    })
  }
  private handleSubmitAdd = () => {
    const form = this.addForm.current!.form
    form.validateFields(async (err, values) => {
      // 检验成功
      if (!err) {
        this.setState({
          confirmLoading: true
        })
        const { categoryName, parentId } = values
        const res = await reqAddCategory({ categoryName, parentId })
        if (res) {
          this.setState(
            {
              confirmLoading: false,
              showStatus: 0
            },
            () => {
              form.resetFields()
              if (parentId === this.state.parentId) {
                // 只有加入的分类与当前分类项一致或添加一级分类时才重新获取
                this.getCategoryList()
              } else if (parentId === '0') {
                this.getCategoryList('0')
              }
            }
          )
        } else {
          this.setState({
            confirmLoading: false
          })
        }
      }
    })
  }

  private handleSubmitUpdate = () => {
    const form = this.updateForm.current!.form
    form.validateFields(async (err, values) => {
      // 检验成功
      if (!err) {
        this.setState({
          confirmLoading: true
        })
        const { categoryName } = values
        const categoryId = this.updateCategory!._id
        const res = await reqUpdateCategory({ categoryName, categoryId })
        if (res) {
          this.setState(
            {
              confirmLoading: false,
              showStatus: 0
            },
            () => {
              form.resetFields()
              this.getCategoryList()
            }
          )
        } else {
          this.setState({
            confirmLoading: false
          })
        }
      }
    })
  }
  componentDidMount() {
    this.getCategoryList()
  }
  render() {
    const title =
      this.state.parentId === '0' ? (
        '一级分类列表'
      ) : (
        <div>
          <Button type='link' onClick={this.handleShowCategory}>
            一级分类列表
          </Button>
          <Icon type='arrow-right' style={{ marginRight: 5 }} />
          {this.state.parentName}
        </div>
      )
    const extra = (
      <Button
        type='primary'
        onClick={() => {
          this.handleShowModal(1)
        }}
      >
        <Icon type='plus' />
        添加
      </Button>
    )
    return (
      <Card title={title} extra={extra}>
        <Table<ICategoryTableItem>
          rowKey='_id'
          bordered
          loading={this.state.loading}
          dataSource={
            this.state.parentId === '0'
              ? this.state.categoryList
              : this.state.subCategoryList
          }
          columns={this.columns}
          pagination={{ defaultPageSize: 5, showQuickJumper: true }}
        />
        <Modal
          title='添加分类'
          visible={this.state.showStatus === 1}
          onCancel={this.handleCancelModal}
          confirmLoading={this.state.confirmLoading}
          onOk={this.handleSubmitAdd}
          okText='确定'
          cancelText='取消'
          maskClosable={false}
        >
          <AddForm
            categoryList={this.state.categoryList}
            parentId={this.state.parentId}
            wrappedComponentRef={this.addForm}
          />
        </Modal>
        <Modal
          title='更新分类'
          visible={this.state.showStatus === 2}
          onCancel={this.handleCancelModal}
          onOk={this.handleSubmitUpdate}
          confirmLoading={this.state.confirmLoading}
          okText='确定'
          cancelText='取消'
          maskClosable={false}
        >
          <UpdateForm
            categoryName={this.updateCategory ? this.updateCategory.name : ''}
            wrappedComponentRef={this.updateForm}
          />
        </Modal>
      </Card>
    )
  }
}

export default Category
