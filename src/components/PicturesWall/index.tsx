import React, { Component } from 'react'
import { Upload, Icon, Modal, message } from 'antd'
import { UploadFile as UploadFileOrigin } from 'antd/lib/upload/interface'
import { reqDeleteImgs } from '@/api/admin'
import { BASE_IMG_URL } from '@/config/common'

type UploadFile = UploadFileOrigin<{
  status: number
  data: any
}>

function getBase64(file: Blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })
}
const initState = {
  previewVisible: false,
  previewImage: '',
  fileList: [] as UploadFile[]
}
type State = Readonly<typeof initState>
interface IProps {
  imgs?: string[]
}

export default class PicturesWall extends Component<IProps, State> {
  state: State = initState

  constructor(props: IProps) {
    super(props)
    const imgs = this.props.imgs
    if (imgs && imgs.length > 0) {
      const fileList = imgs.map<any>((img, index) => ({
        uid: -index,
        name: img,
        status: 'done',
        url: BASE_IMG_URL + img
      })) as UploadFile[]

      // 改变初始化数据
      initState.fileList = fileList
    }
  }
  public getImgs = () => {
    return this.state.fileList.map(file => file.name)
  }
  private handleCancel = () => this.setState({ previewVisible: false })

  private handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = (await getBase64(file.originFileObj!)) as string
    }

    this.setState({
      previewImage: file.url || file.preview!,
      previewVisible: true
    })
  }

  private handleChange = async ({
    file,
    fileList
  }: {
    file: UploadFile
    fileList: UploadFile[]
  }) => {
    if (file.status === 'done') {
      const res = file.response!
      if (res.status === 0) {
        const { name, url } = res.data
        const realFile = fileList[fileList.length - 1] // 其实file和fileList不是一对象
        realFile.name = name
        realFile.url = url
        file.url = url //这个其实在这里没用，但是被删除可以当做标识
        message.success('上传图片成功')
      } else {
        // 不是axios请求的没有拦截
        message.error('上传图片失败')
      }
    } else if (file.status === 'removed') {
      if (file.url) {
        const res = await reqDeleteImgs(file.name)
        if (res) {
          message.success('删除图片成功')
        }
      }
    }
    this.setState({ fileList })
  }

  render() {
    const { previewVisible, previewImage, fileList } = this.state
    const uploadButton = (
      <div>
        <Icon type='plus' />
        <div>上传</div>
      </div>
    )
    return (
      <div className='clearfix'>
        <Upload
          action='/api/manage/img/upload'
          accept='image/*'
          name='image'
          listType='picture-card'
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {fileList.length >= 9 ? null : uploadButton}
        </Upload>
        <Modal
          visible={previewVisible}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img
            alt={previewImage}
            style={{ width: '100%' }}
            src={previewImage}
          />
        </Modal>
      </div>
    )
  }
}
