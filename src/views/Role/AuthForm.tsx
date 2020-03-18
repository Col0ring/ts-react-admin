import React, { Component } from 'react'
import { Form, Input, Tree } from 'antd'
import { IRoleListItem } from '@/interface/Role'
import menuList, { IMenuList } from '@/config/menuList'
const Item = Form.Item
const TreeNode = Tree.TreeNode

interface IProps {
  role: IRoleListItem
}
// 需要保存props做会缓存
interface IState {
  checkedKeys: string[]
  props: IProps
}
type State = Readonly<IState>

class AuthForm extends Component<IProps, State> {
  private renderTreeNodes = (data: IMenuList) =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        )
      }
      return <TreeNode key={item.key} {...item} />
    })
  constructor(props: IProps) {
    super(props)
    const menus = this.props.role.menus
    this.state = {
      checkedKeys: menus,
      props
    }
  }
  // state和props变化都会触发，需要hack
  static getDerivedStateFromProps(
    nextProps: IProps,
    preState: State
  ): State | null {
    // 需要保存props做会缓存
    const role = nextProps.role
    if (role.menus !== preState.props.role.menus) {
      return {
        checkedKeys: role.menus,
        props: {
          role
        }
      }
    }
    return null
  }
  public getMenus = () => {
    return this.state.checkedKeys
  }
  private handleCheck = (
    checkedKeys:
      | string[]
      | {
          checked: string[]
          halfChecked: string[]
        }
  ) => {
    if (Array.isArray(checkedKeys)) {
      this.setState({
        checkedKeys
      })
    }
  }
  render() {
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 19 }
    }
    const { role } = this.props
    return (
      <React.Fragment>
        <Form {...formItemLayout}>
          <Item label='角色名称'>
            <Input value={role.name} disabled />
          </Item>
        </Form>
        <Tree
          checkable
          defaultExpandAll
          checkedKeys={this.state.checkedKeys}
          onCheck={this.handleCheck}
        >
          {this.renderTreeNodes(menuList)}
        </Tree>
      </React.Fragment>
    )
  }
}

export default AuthForm
