import React, { Component } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { Button, Card, Icon, List } from 'antd'
import { reqGetCategory } from '@/api/category'
import { IProductListItem } from '@/interface/Product.ts'
import { BASE_IMG_URL } from '@/config/common'
/**
 * Product的详情页
 */
const initState = {
  categoryName: '',
  subCategoryName: ''
}
type State = Readonly<typeof initState>
class ProductDetail extends Component<RouteComponentProps, State> {
  state: State = initState
  constructor(props: RouteComponentProps) {
    super(props)
    if (!this.props.location.state) {
      this.props.history.goBack()
    }
  }
  componentDidMount() {
    this.getCategoryName()
  }
  private getCategoryName = async () => {
    const { pCategoryId, categoryId } = this.props.location.state.product
    if (pCategoryId === '0') {
      const res = await reqGetCategory(pCategoryId)
      if (res) {
        this.setState({
          categoryName: res.data.data.name
        })
      }
    } else {
      const [res1, res2] = await Promise.all([
        reqGetCategory(pCategoryId),
        reqGetCategory(categoryId)
      ])
      this.setState({
        categoryName: res1.data.data.name,
        subCategoryName: res2.data.data.name
      })
    }
  }

  render() {
    const title = (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Button
          type='link'
          style={{ fontSize: 20 }}
          onClick={() => {
            this.props.history.goBack()
          }}
        >
          <Icon type='arrow-left' />
        </Button>
        <span>商品详情</span>
      </div>
    )
    const { name, desc, price, detail, imgs } = this.props.location.state
      .product as IProductListItem
    const { categoryName, subCategoryName } = this.state
    return (
      <Card title={title} className='product-detail'>
        <List>
          <List.Item>
            <span className='left'>商品名称：</span>
            <div>
              <span>{name}</span>
            </div>
          </List.Item>
          <List.Item>
            <span className='left'>商品描述：</span>
            <div>
              <span>{desc}</span>
            </div>
          </List.Item>
          <List.Item>
            <span className='left'>商品价格：</span>
            <div>
              <span>{price}元</span>
            </div>
          </List.Item>
          <List.Item>
            <span className='left'>所属分类：</span>
            <div>
              <span>
                {categoryName} {subCategoryName ? '--> ' + subCategoryName : ''}
              </span>
            </div>
          </List.Item>
          <List.Item>
            <span className='left'>商品图片：</span>
            <div>
              {imgs.map(img => (
                <img
                  className='product-img'
                  key={img}
                  src={BASE_IMG_URL + img}
                  alt='商品图片'
                />
              ))}
            </div>
          </List.Item>
          <List.Item>
            <span className='left'>商品详情：</span>
            <div
              dangerouslySetInnerHTML={{
                __html: detail
              }}
            ></div>
          </List.Item>
        </List>
      </Card>
    )
  }
}

export default ProductDetail
