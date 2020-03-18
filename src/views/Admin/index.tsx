import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Layout } from 'antd'
import LeftNav from '@/components/LeftNav/index'
import Header from '@/components/Header'
import { Switch, Route, Redirect } from 'react-router-dom'
import Home from '@/views/Home'
import Category from '@/views/Category'
import Product from '@/views/Product'
import User from '@/views/User'
import Role from '@/views/Role'
import Bar from '@/views/Charts/Bar'
import Line from '@/views/Charts/Line'
import Pie from '@/views/Charts/Pie'
import NotFound from '@/views//NotFound/index'
import { RootState } from '@/redux/reducers'
import { LoginUser } from '@/utils/auth'

const { Footer, Sider, Content } = Layout

const initState = {}
interface IProps {
  user: LoginUser
}
type State = Readonly<typeof initState>

class Admin extends Component<IProps, State> {
  state: State = initState
  render() {
    const { user } = this.props
    if (!user || !user._id) {
      return <Redirect to='/login' />
    }
    return (
      <Layout style={{ minHeight: '100%' }}>
        <Sider>
          <LeftNav />
        </Sider>
        <Layout>
          <Header />
          <Content style={{ margin: 20, backgroundColor: '#fff' }}>
            <Switch>
              <Redirect exact from='/' to='/home' />
              <Route path='/home' component={Home} />
              <Route path='/category' component={Category} />
              <Route path='/product' component={Product} />
              <Route path='/role' component={Role} />
              <Route path='/user' component={User} />
              <Route path='/charts/bar' component={Bar} />
              <Route path='/charts/line' component={Line} />
              <Route path='/charts/pie' component={Pie} />
              <Route component={NotFound} />
            </Switch>
          </Content>
          <Footer style={{ textAlign: 'center', color: '#ccc' }}>
            推荐使用谷歌浏览器，可以获得更加页面操作体验
          </Footer>
        </Layout>
      </Layout>
    )
  }
}
const mapStateToProps = (state: RootState) => {
  return {
    user: state.user
  }
}
export default connect(mapStateToProps)(Admin)
