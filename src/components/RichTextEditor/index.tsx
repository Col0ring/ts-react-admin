/*
用来指定商品详情的富文本编辑器组件
 */
import React, { Component } from 'react'
import { message } from 'antd'
import { EditorState, convertToRaw, ContentState } from 'draft-js'
import { Editor } from 'react-draft-wysiwyg'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

const initState = {
  editorState: EditorState.createEmpty()
}
type State = Readonly<typeof initState>

interface Iprops {
  detail: string
}

export default class RichTextEditor extends Component<Iprops, State> {
  state: State = initState

  constructor(props: Iprops) {
    super(props)
    const html = this.props.detail
    if (html) {
      // 如果有值, 根据html格式字符串创建一个对应的编辑对象
      const contentBlock = htmlToDraft(html)
      const contentState = ContentState.createFromBlockArray(
        contentBlock.contentBlocks
      )
      const editorState = EditorState.createWithContent(contentState)
      this.state = {
        editorState
      }
    }
  }

  /*
  输入过程中实时的回调
   */
  private onEditorStateChange = (editorState: EditorState) => {
    this.setState({
      editorState
    })
  }

  public getDetail = () => {
    // 返回输入数据对应的html格式的文本
    return draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
  }

  private uploadImageCallBack = (file: File) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.open('POST', '/api/manage/img/upload')
      const data = new FormData()
      data.append('image', file)
      xhr.send(data)
      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText)
          const url = response.data.url // 得到图片的url
          resolve({ data: { link: url } })
        } else {
          message.error('上传文件错误')
          reject(xhr)
        }
      })
      xhr.addEventListener('error', () => {
        const error = JSON.parse(xhr.responseText)
        reject(error)
      })
    })
  }

  render() {
    const { editorState } = this.state
    return (
      <Editor
        editorState={editorState}
        editorStyle={{
          border: '1px solid black',
          minHeight: 200,
          paddingLeft: 10
        }}
        onEditorStateChange={this.onEditorStateChange}
        toolbar={{
          image: {
            uploadCallback: this.uploadImageCallBack,
            alt: { present: true, mandatory: true }
          }
        }}
      />
    )
  }
}
