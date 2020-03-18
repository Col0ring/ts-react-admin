// 对密码验证
export function validatePwd(rule: any, value: string, callback: any) {
  if (!value.trim()) {
    callback('请输入密码')
  } else if (value.length < 4) {
    callback('密码长度至少为4位')
  } else if (value.length > 12) {
    callback('密码长度至多为12位')
  } else {
    callback()
  }
}

//对价格验证
export function validatePrice(rule: any, value: string, callback: any) {
  if (+value > 0) {
    callback()
  } else {
    callback('商品价格需要大于0')
  }
}
