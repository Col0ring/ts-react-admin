import React, { Component } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { Card, Select, Input, Button, Icon, Table } from 'antd'
import { ColumnProps } from 'antd/es/table'
import { IProductListItem } from '@/interface/Product'
import {
  reqGetProductList,
  reqSearchProduct,
  reqUpdateProductStatus
} from '@/api/product'
import { PAGE_SIZE } from '@/config/common'
const Option = Select.Option

const initState = {
  loading: false,
  total: 0, // 商品总数量
  currentPage: 1,
  productList: [] as IProductListItem[],
  searchType: 'productName' as 'productName' | 'productDesc',
  searchName: ''
}
type State = Readonly<typeof initState>

class ProductList extends Component<RouteComponentProps, State> {
  state: State = initState
  private columns: ColumnProps<IProductListItem>[] = [
    {
      title: '商品名称',
      dataIndex: 'name',
      align: 'center',
      width: 200
    },
    {
      title: '商品描述',
      dataIndex: 'desc',
      align: 'center'
    },
    {
      title: '价格',
      dataIndex: 'price',
      align: 'center',
      width: 100,
      render: price => '￥' + price
    },
    {
      title: '状态',
      align: 'center',
      width: 100,
      render: ({ status, _id }: IProductListItem) => {
        const newStatus = status === 1 ? 2 : 1
        return (
          <div>
            <Button
              type='primary'
              onClick={() => this.handleUpdateProductState(_id, newStatus)}
            >
              {status === 1 ? '下架' : '上架'}
            </Button>
            <span>{status === 1 ? '在售' : '已下架'}</span>
          </div>
        )
      }
    },
    {
      title: '操作',
      align: 'center',
      width: 100,
      render: product => {
        return (
          <div>
            <Button
              type='link'
              onClick={() => {
                this.props.history.push({
                  pathname: '/product/detail',
                  state: { product }
                })
              }}
            >
              详情
            </Button>
            <Button
              type='link'
              onClick={() =>
                this.props.history.push({
                  pathname: '/product/edit',
                  state: { product }
                })
              }
            >
              修改
            </Button>
          </div>
        )
      }
    }
  ]
  componentDidMount() {
    this.getProductList(1)
  }
  private getProductList = async (
    pageNum: number,
    pageSize: number = PAGE_SIZE
  ) => {
    this.setState({
      loading: true
    })
    const { searchType, searchName } = this.state
    let res = null
    if (searchName.trim()) {
      res = await reqSearchProduct(pageNum, pageSize, searchName, searchType)
    } else {
      res = await reqGetProductList(pageNum, pageSize)
    }
    if (res) {
      const { total, list } = res.data.data
      this.setState({
        loading: false,
        total,
        productList: list
      })
    } else {
      this.setState({
        loading: false
      })
    }
  }
  private handleSearchProduct = () => {
    this.getProductList(1).then(() => {
      this.setState({
        currentPage: 1
      })
    })
  }
  private handleUpdateProductState = async (
    productId: string,
    status: 1 | 2
  ) => {
    const res = await reqUpdateProductStatus({ productId, status })
    if (res) {
      this.getProductList(this.state.currentPage)
    }
  }
  render() {
    const title = (
      <div>
        <Select
          value={this.state.searchType}
          style={{ width: 150 }}
          onChange={(value: 'productName' | 'productDesc') => {
            this.setState({
              searchType: value
            })
          }}
        >
          <Option value='productName'>按名称搜索</Option>
          <Option value='productDesc'>按描述搜索</Option>
        </Select>
        <Input
          placeholder='关键字'
          style={{ width: 150, margin: '0 15px' }}
          value={this.state.searchName}
          onChange={e => {
            this.setState({
              searchName: e.target.value
            })
          }}
          onPressEnter={this.handleSearchProduct}
        />
        <Button type='primary' onClick={this.handleSearchProduct}>
          搜索
        </Button>
      </div>
    )
    const extra = (
      <Button
        type='primary'
        onClick={() => this.props.history.push('/product/add')}
      >
        <Icon type='plus' />
        添加商品
      </Button>
    )
    return (
      <Card title={title} extra={extra}>
        <Table<IProductListItem>
          loading={this.state.loading}
          dataSource={this.state.productList}
          columns={this.columns}
          bordered
          rowKey='_id'
          pagination={{
            total: this.state.total,
            current: this.state.currentPage,
            defaultPageSize: PAGE_SIZE,
            showQuickJumper: true,
            onChange: pageNum => {
              this.setState({
                currentPage: pageNum
              })
              this.getProductList(pageNum)
            }
          }}
        />
      </Card>
    )
  }
}

export default ProductList
