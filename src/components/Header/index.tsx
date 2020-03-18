import React, { Component } from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { connect } from 'react-redux'
import { RootState } from '@/redux/reducers'
import { Button, message, Modal } from 'antd'
import { reqWeather } from '@/api/admin'
import { formatDate } from '@/utils/time'
import { logout } from '@/redux/action'
import { LoginUser } from '@/utils/auth'
import './index.less'
const initState = {
  currentTime: formatDate(Date.now()),
  weatherPicUrl: '',
  weather: ''
}
type State = Readonly<typeof initState>

interface IProps extends RouteComponentProps {
  headTitle: string
  user: LoginUser
  logout: typeof logout
}

class Header extends Component<IProps, State> {
  state: State = initState
  private timer!: NodeJS.Timer
  componentDidMount() {
    this.getTime()
    this.getWeather()
  }
  componentWillUnmount() {
    clearInterval(this.timer)
  }
  private getTime = () => {
    this.timer = setInterval(() => {
      const currentTime = formatDate(Date.now())
      this.setState({ currentTime })
    }, 1000)
  }
  private getWeather = async () => {
    try {
      const res = await reqWeather('成都')

      this.setState({
        weather: res.weather,
        weatherPicUrl: res.url
      })
    } catch (err) {
      message.error('获取天气信息失败')
    }
  }
  private handleLogout = () => {
    Modal.confirm({
      title: '提示',
      content: '确认退出吗？',
      okText: '确认',
      cancelText: '取消',
      maskClosable: true,
      onOk: () => {
        this.props.logout()
      }
    })
  }

  render() {
    const { currentTime, weatherPicUrl, weather } = this.state
    const { username } = this.props.user
    const title = this.props.headTitle

    return (
      <div className='header'>
        <div className='header-top'>
          <span>欢迎，{username}</span>
          <Button type='link' onClick={this.handleLogout}>
            退出
          </Button>
        </div>
        <div className='header-bottom'>
          <div className='header-bottom-left'>{title}</div>
          <div className='header-bottom-right'>
            <span>{currentTime}</span>
            <img src={weatherPicUrl} alt='weather' />
            <span>{weather}</span>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state: RootState) => ({
  headTitle: state.headTitle,
  user: state.user
})

const mapDispatchToProps = {
  logout
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Header))
