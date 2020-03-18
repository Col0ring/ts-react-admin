import React, { Component } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import ProductList from './ProductList'
import ProductEdit from './ProductEdit'
import ProductDetail from './ProductDetail'
import './index.less'
/**
 * 商品路由
 */
class Product extends Component {
  render() {
    return (
      <Switch>
        <Route path='/product' exact component={ProductList} />
        <Route path='/product/add' component={ProductEdit} />
        <Route path='/product/edit' component={ProductEdit} />
        <Route path='/product/detail' component={ProductDetail} />
        <Redirect to='/product' />
      </Switch>
    )
  }
}

export default Product
