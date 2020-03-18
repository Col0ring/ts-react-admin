import React, { Component, FormEventHandler } from 'react'
import { RouteComponentProps, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { Form, Icon, Button, Input } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import { validatePwd } from '@/utils/validate'
import { login } from '@/redux/action'
import logo from '@/assets/images/logo.png'
import './Login.less'
import { RootState } from '@/redux/reducers'
import { LoginUser } from '@/utils/auth'

const initState = {
  loading: false
}
interface IProps extends FormComponentProps {
  user: LoginUser
  login: typeof login
}
type State = Readonly<typeof initState>

class Login extends Component<IProps & RouteComponentProps, State> {
  state: State = initState

  private handleSubmit: FormEventHandler = e => {
    e.preventDefault()
    // 获取form
    const { form } = this.props
    form.validateFields((err, values) => {
      // 检验成功
      if (!err) {
        this.setState({
          loading: true
        })
        const { username, password } = values
        this.props.login({ username, password }, () => {
          this.setState({ loading: false })
        })
      }
    })
    // // 获取表单项输入数据
    // const values = form.getFieldsValue()
  }

  render() {
    // 如果用户已登录自动跳转到管理界面
    const { user } = this.props
    if (user && user._id) {
      return <Redirect to='/home' />
    }
    const { getFieldDecorator } = this.props.form
    const { loading } = this.state
    return (
      <div className='login'>
        <header className='login-header'>
          <img src={logo} alt='logo' />
          <h1>React后台管理系统</h1>
        </header>
        <section className='login-content'>
          <h2>用户登录</h2>
          <Form onSubmit={this.handleSubmit} className='login-form'>
            <Form.Item>
              {getFieldDecorator('username', {
                validateFirst: true,
                initialValue: '',
                // 声明式验证
                rules: [
                  { required: true, whitespace: true, message: '请输入用户名' },
                  { min: 4, message: '用户名至少为4位' },
                  { max: 12, message: '用户名最多为12位' },
                  {
                    pattern: /^[A-Za-z0-9_]+$/,
                    message: '用户名必须是英文、数字或下划线组成'
                  }
                ]
              })(
                <Input
                  prefix={
                    <Icon type='user' style={{ color: 'rgba(0,0,0,.25)' }} />
                  }
                  placeholder='用户名'
                  autoComplete='current-username'
                />
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('password', {
                //自定义校验
                validateFirst: true,
                initialValue: '',
                rules: [{ validator: validatePwd }]
              })(
                <Input
                  prefix={
                    <Icon type='lock' style={{ color: 'rgba(0,0,0,.25)' }} />
                  }
                  type='password'
                  placeholder='密码'
                  autoComplete='current-password'
                />
              )}
            </Form.Item>
            <Form.Item>
              <Button
                loading={loading}
                type='primary'
                htmlType='submit'
                className='login-form-button'
              >
                登录
              </Button>
            </Form.Item>
          </Form>
        </section>
      </div>
    )
  }
}

// 经过包装后的Login组件
const WrapLogin = Form.create<IProps & RouteComponentProps>()(Login)
const mapStateToProps = (state: RootState) => {
  return {
    user: state.user
  }
}

const mapDispatchToProps = {
  login
} as any

export default connect(mapStateToProps, mapDispatchToProps)(WrapLogin)
