import React, { Component } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { connect } from 'react-redux'
import { Card, Button, Table, Modal, message } from 'antd'
import AddForm from './AddForm'
import AuthForm from './AuthForm'
import { ColumnProps } from 'antd/es/table'
import { IRoleListItem } from '@/interface/Role'
import { PAGE_SIZE } from '@/config/common'
import { TableEventListeners } from 'antd/lib/table'
import { reqGetRoleList, reqAddRole, reqUpdateRole } from '@/api/role'
import { FormComponentProps } from 'antd/lib/form'
import { LoginUser } from '@/utils/auth'
import { formatDate } from '@/utils/time'
import { logout } from '@/redux/action'
import { RootState } from '@/redux/reducers'
/**
 * 权限路由
 */
const initState = {
  roleList: [] as IRoleListItem[],
  seletedRole: {} as IRoleListItem,
  isAddFormShow: false,
  isAuthFormShow: false,
  confirmLoading: false,
  loading: false
}
type State = Readonly<typeof initState>

interface IProps extends RouteComponentProps {
  user: LoginUser
  logout: typeof logout
}

class Role extends Component<IProps, State> {
  state: State = initState
  private addForm: React.RefObject<FormComponentProps>
  private authForm: React.RefObject<AuthForm>
  private columns: ColumnProps<IRoleListItem>[] = [
    {
      title: '角色名称',
      dataIndex: 'name',
      align: 'center'
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      render: formatDate,
      align: 'center'
    },
    {
      title: '授权时间',
      dataIndex: 'auth_time',
      render: formatDate,
      align: 'center'
    },
    {
      title: '授权人',
      dataIndex: 'auth_name',
      align: 'center'
    }
  ]
  private tableOnRow = (seletedRole: IRoleListItem): TableEventListeners => {
    return {
      onClick: () => {
        this.setState({
          seletedRole
        })
      }
    }
  }
  constructor(props: IProps) {
    super(props)
    this.addForm = React.createRef()
    this.authForm = React.createRef()
  }

  componentDidMount() {
    this.getRoleList()
  }

  private getRoleList = async () => {
    this.setState({
      loading: true
    })
    const res = await reqGetRoleList()
    if (res) {
      this.setState({
        loading: false,
        roleList: res.data.data
      })
    }
  }
  private handleCancelModal = () => {
    if (this.state.isAddFormShow) {
      this.addForm.current!.form.resetFields()
      this.setState({
        isAddFormShow: false
      })
    } else if (this.state.isAuthFormShow) {
      this.setState({
        isAuthFormShow: false
      })
    }
  }
  private handleSubmitAdd = () => {
    const form = this.addForm.current!.form
    form.validateFields(async (error, values) => {
      if (!error) {
        const roleName = values.roleName
        this.setState({
          confirmLoading: true
        })
        const res = await reqAddRole(roleName)
        if (res) {
          message.success('添加角色成功')
          //不重新请求，而是将返回值添加回来
          // this.getRoleList()
          const role = res.data.data
          form.resetFields()
          this.setState(({ roleList }) => ({
            isAddFormShow: false,
            confirmLoading: false,
            roleList: [...roleList, role]
          }))
        } else {
          this.setState({
            confirmLoading: false
          })
        }
      }
    })
  }
  private handleSubmitUpdate = async () => {
    const menus = this.authForm.current!.getMenus()
    // 改变引用变量的值
    const newRole = this.state.seletedRole
    newRole.menus = menus
    newRole.auth_name = this.props.user.username
    this.setState({
      confirmLoading: true
    })
    const res = await reqUpdateRole(newRole)
    if (res) {
      // 更新自己的权限强制退出
      if (newRole._id === this.props.user.role_id) {
        this.props.logout()
        message.info('角色权限更新，请重新登录')
      } else {
        message.success('设置权限成功')
        this.setState(({ roleList }) => ({
          confirmLoading: false,
          roleList: [...roleList],
          isAuthFormShow: false
        }))
      }
    } else {
      this.setState({
        confirmLoading: false
      })
    }
  }

  render() {
    const title = (
      <div>
        <Button
          type='primary'
          style={{ marginRight: 15 }}
          onClick={() => this.setState({ isAddFormShow: true })}
        >
          创建角色
        </Button>
        <Button
          type='primary'
          disabled={!this.state.seletedRole._id}
          onClick={() => this.setState({ isAuthFormShow: true })}
        >
          设置角色权限
        </Button>
      </div>
    )
    return (
      <Card title={title}>
        <Table
          bordered
          dataSource={this.state.roleList}
          loading={this.state.loading}
          rowKey='_id'
          columns={this.columns}
          pagination={{ defaultPageSize: PAGE_SIZE }}
          rowSelection={{
            type: 'radio',
            selectedRowKeys: [this.state.seletedRole._id],
            onSelect: (seletedRole: IRoleListItem) => {
              this.setState({
                seletedRole
              })
            }
          }}
          onRow={this.tableOnRow}
        />
        <Modal
          title='添加角色'
          visible={this.state.isAddFormShow}
          onCancel={this.handleCancelModal}
          onOk={this.handleSubmitAdd}
          confirmLoading={this.state.confirmLoading}
          okText='确定'
          cancelText='取消'
          maskClosable={false}
        >
          <AddForm wrappedComponentRef={this.addForm} />
        </Modal>
        <Modal
          title='设置角色权限'
          visible={this.state.isAuthFormShow}
          onCancel={this.handleCancelModal}
          onOk={this.handleSubmitUpdate}
          confirmLoading={this.state.confirmLoading}
          okText='确定'
          cancelText='取消'
          maskClosable={false}
        >
          <AuthForm role={this.state.seletedRole} ref={this.authForm} />
        </Modal>
      </Card>
    )
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    user: state.user
  }
}

const mapDispatchToProps = {
  logout
}

export default connect(mapStateToProps, mapDispatchToProps)(Role)
