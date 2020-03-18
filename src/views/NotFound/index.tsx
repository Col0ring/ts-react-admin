import React, { Component } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { Button, Row, Col } from 'antd'
import './index.less'
/*
前台404页面
 */
export default class NotFound extends Component<RouteComponentProps> {
  render() {
    return (
      <Row className='not-found'>
        <Col span={12} className='left'></Col>
        <Col span={12} className='right'>
          <h1>404</h1>
          <h2>抱歉，你访问的页面不存在</h2>
          <div>
            <Button
              type='primary'
              onClick={() => this.props.history.replace('/home')}
            >
              回到首页
            </Button>
          </div>
        </Col>
      </Row>
    )
  }
}
