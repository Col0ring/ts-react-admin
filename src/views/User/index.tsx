import React, { Component } from 'react'
import { Card, Table, Modal, Button, message } from 'antd'
import UserForm from './UserForm'
import { formatDate } from '@/utils/time'
import { ColumnProps } from 'antd/es/table'
import { IUserListItem } from '@/interface/User'
import {
  reqGetUserList,
  reqDeleteUser,
  reqAddUser,
  reqUpdateUser
} from '@/api/user'
import { PAGE_SIZE } from '@/config/common'
import { IRoleListItem } from '@/interface/Role'
import { FormComponentProps } from 'antd/lib/form'

const initState = {
  userList: [] as IUserListItem[],
  roleList: [] as IRoleListItem[],
  user: {} as IUserListItem, // 点击的user
  isModalShow: false,
  loading: false,
  confirmLoading: false
}
type State = Readonly<typeof initState>

class User extends Component<object, State> {
  state: State = initState
  private userForm: React.RefObject<FormComponentProps>
  private columns: ColumnProps<IUserListItem>[] = [
    {
      title: '用户名',
      dataIndex: 'username',
      align: 'center'
    },
    {
      title: '电话',
      dataIndex: 'phone',
      align: 'center'
    },
    {
      title: '注册时间',
      dataIndex: 'create_time',
      render: formatDate,
      align: 'center'
    },
    {
      title: '所属角色',
      dataIndex: 'role_id',
      render: (roleId: string) => this.roleNames[roleId],
      align: 'center'
    },
    {
      title: '操作',
      align: 'center',
      render: (user: IUserListItem) => (
        <div>
          <Button type='link' onClick={() => this.handleShowUpdate(user)}>
            修改
          </Button>
          <Button
            type='link'
            onClick={() => {
              this.handleDeleteUser(user)
            }}
          >
            删除
          </Button>
        </div>
      )
    }
  ]
  // roleName映射
  private roleNames: { [key: string]: string } = {}
  constructor(props: object) {
    super(props)
    this.userForm = React.createRef()
  }
  componentDidMount() {
    this.getUserList()
  }
  private handleShowAdd = () => {
    this.setState({
      user: {} as IUserListItem,
      isModalShow: true
    })
  }
  private handleShowUpdate = (user: IUserListItem) => {
    this.setState({
      user,
      isModalShow: true
    })
  }
  private handleDeleteUser = async (user: IUserListItem) => {
    Modal.confirm({
      title: `确认删除${user.username}？`,
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        const res = await reqDeleteUser(user._id)
        if (res) {
          message.success('删除用户成功！')
          this.getUserList()
        }
      }
    })
  }
  private getUserList = async () => {
    const res = await reqGetUserList()
    if (res) {
      this.roleNames = (res.data.data.roles as IRoleListItem[]).reduce<{
        [key: string]: string
      }>((pre, role) => {
        pre[role._id] = role.name
        return pre
      }, {})
      this.setState({
        roleList: res.data.data.roles,
        userList: res.data.data.users
      })
    }
  }
  private hanleModalCancel = () => {
    this.userForm.current!.form.resetFields()
    this.setState({
      isModalShow: false
    })
  }
  private handleSubmitForm = () => {
    const form = this.userForm.current!.form
    form.validateFields(async (error, values) => {
      if (!error) {
        this.setState({
          confirmLoading: true
        })
        let res
        const isUpdate = this.state.user._id ? true : false
        if (isUpdate) {
          res = await reqUpdateUser({ _id: this.state.user._id, ...values })
        } else {
          res = await reqAddUser(values)
        }

        if (res) {
          message.success(`${isUpdate ? '修改' : '添加'}用户成功`)
          this.setState({
            confirmLoading: false,
            isModalShow: false
          })
          form.resetFields()
          this.getUserList()
        } else {
          this.setState({
            confirmLoading: false
          })
        }
      }
    })
  }
  render() {
    const title = (
      <Button type='primary' onClick={this.handleShowAdd}>
        添加用户
      </Button>
    )
    return (
      <Card title={title}>
        <Table
          bordered
          rowKey='_id'
          columns={this.columns}
          loading={this.state.loading}
          dataSource={this.state.userList}
          pagination={{ defaultPageSize: PAGE_SIZE }}
        />
        <Modal
          title={this.state.user._id ? '更新分类' : '添加分类'}
          visible={this.state.isModalShow}
          onCancel={this.hanleModalCancel}
          onOk={this.handleSubmitForm}
          maskClosable={false}
          confirmLoading={this.state.confirmLoading}
          okText='确定'
          cancelText='取消'
        >
          <UserForm
            roleList={this.state.roleList}
            user={this.state.user}
            wrappedComponentRef={this.userForm}
          />
        </Modal>
      </Card>
    )
  }
}

export default User
