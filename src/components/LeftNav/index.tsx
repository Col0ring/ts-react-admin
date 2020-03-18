import React, { Component } from 'react'
import { Link, withRouter, RouteComponentProps } from 'react-router-dom'
import { connect } from 'react-redux'
import { Menu, Icon } from 'antd'
import { setHeadTitle } from '@/redux/action'
import menuList, { IMenuList, IMenuListItem } from '@/config/menuList'
import logo from '@/assets/images/logo.png'
import './index.less'
import { LoginUser } from '@/utils/auth'
import { RootState } from '@/redux/reducers'
const { SubMenu } = Menu

interface IProps extends RouteComponentProps {
  setHeadTitle: typeof setHeadTitle
  user: LoginUser
}

class LeftNav extends Component<IProps> {
  private openKey = ''
  private menuNodes: JSX.Element[]
  constructor(props: IProps) {
    super(props)
    this.menuNodes = this.getMenuList_reduce(menuList)
  }
  private filterMenus = (item: IMenuListItem) => {
    const { key, isPublic } = item
    const username = this.props.user.username
    if (username === 'admin') {
      return true
    }
    const menus = this.props.user.role!.menus
    if (isPublic || menus.includes(key)) {
      return true
    } else if (item.children) {
      return !!item.children.find(child => menus.includes(child.key))
    }
    return false
  }
  private getMenuList = (menuList: IMenuList) => {
    const filterMenus = menuList.filter(item => {
      return this.filterMenus(item)
    })
    return filterMenus.map(item => {
      const { pathname } = this.props.location
      if (item.children) {
        const cItem = item.children.find(
          cItem => pathname.indexOf(cItem.key) === 0
        )
        if (cItem) {
          this.openKey = item.key
        }
        return (
          <SubMenu
            key={item.key}
            title={
              <span>
                <Icon type={item.icon} />
                <span>{item.title}</span>
              </span>
            }
          >
            {this.getMenuList(item.children)}
          </SubMenu>
        )
      } else {
        if (item.key === pathname || pathname.indexOf(item.key) === 0) {
          this.props.setHeadTitle(item.title)
        }
        return (
          <Menu.Item key={item.key}>
            <Link
              to={item.key}
              onClick={() => this.props.setHeadTitle(item.title)}
            >
              <Icon type={item.icon} />
              <span>{item.title}</span>
            </Link>
          </Menu.Item>
        )
      }
    })
  }
  private getMenuList_reduce = (menuList: IMenuList) => {
    return menuList.reduce<JSX.Element[]>((pre, item) => {
      // 过滤
      const { pathname } = this.props.location
      if (this.filterMenus(item)) {
        if (item.children) {
          const cItem = item.children.find(
            cItem => pathname.indexOf(cItem.key) === 0
          )
          if (cItem) {
            this.openKey = item.key
          }
          pre.push(
            <SubMenu
              key={item.key}
              title={
                <span>
                  <Icon type={item.icon} />
                  <span>{item.title}</span>
                </span>
              }
            >
              {this.getMenuList_reduce(item.children)}
            </SubMenu>
          )
        } else {
          if (item.key === pathname || pathname.indexOf(item.key) === 0) {
            this.props.setHeadTitle(item.title)
          }

          pre.push(
            <Menu.Item key={item.key}>
              <Link
                to={item.key}
                onClick={() => this.props.setHeadTitle(item.title)}
              >
                <Icon type={item.icon} />
                <span>{item.title}</span>
              </Link>
            </Menu.Item>
          )
        }
      }
      return pre
    }, [])
  }
  render() {
    let { pathname } = this.props.location
    if (pathname.indexOf('/product') === 0) {
      pathname = '/product'
    }
    return (
      <div className='left-nav'>
        <Link to='/' className='left-nav-header'>
          <img src={logo} alt='logo' />
          <h1>硅谷后台</h1>
        </Link>
        <Menu
          mode='inline'
          theme='dark'
          selectedKeys={[pathname]}
          defaultOpenKeys={[this.openKey]}
        >
          {this.menuNodes}
        </Menu>
      </div>
    )
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    user: state.user
  }
}

const mapDispatchToProps = {
  setHeadTitle
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(LeftNav))
