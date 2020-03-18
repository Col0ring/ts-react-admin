import React, { Component } from 'react'
import { Card, Button } from 'antd'
import ReactEcharts from 'echarts-for-react'

/*
后台管理的柱状图路由组件
 */
const initState = {
  sales: [5, 20, 36, 10, 10, 20], // 销量的数组
  stores: [6, 10, 25, 20, 15, 10] // 库存的数组
}
type State = Readonly<typeof initState>

class Line extends Component<object, State> {
  state: State = initState
  private handleupdate = () => {
    this.setState(state => ({
      sales: state.sales.map(sale => sale + 1),
      stores: state.stores.reduce<number[]>((pre, store) => {
        pre.push(store - 1)
        return pre
      }, [])
    }))
  }

  /*
  返回柱状图的配置对象
   */
  private getOption = (sales: number[], stores: number[]) => {
    return {
      title: {
        text: 'ECharts 入门示例'
      },
      tooltip: {},
      legend: {
        data: ['销量', '库存']
      },
      xAxis: {
        data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
      },
      yAxis: {},
      series: [
        {
          name: '销量',
          type: 'line',
          data: sales
        },
        {
          name: '库存',
          type: 'line',
          data: stores
        }
      ]
    }
  }

  render() {
    const { sales, stores } = this.state
    return (
      <div>
        <Card>
          <Button type='primary' onClick={this.handleupdate}>
            更新
          </Button>
        </Card>

        <Card title='折线图一'>
          <ReactEcharts option={this.getOption(sales, stores)} />
        </Card>
      </div>
    )
  }
}

export default Line
