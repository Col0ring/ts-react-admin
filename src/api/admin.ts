import jsonp from 'jsonp'
import request from '@/utils/request'
import Response from '@/interface/Response'

export function reqLogin(form: {
  username: string
  password: string
}): Response {
  return request({
    url: '/login',
    method: 'post',
    data: form
  })
}
export function reqWeather(
  city: string
): Promise<{
  url: string
  weather: string
}> {
  const ak = '3p49MVra6urFRGOT9s8UBWr2'
  const url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=${ak}`
  return new Promise((resolve, reject) => {
    jsonp(url, (error, data) => {
      if (!error && data.status === 'success') {
        const { dayPictureUrl: url, weather } = data.results[0].weather_data[0]
        resolve({ url, weather })
      } else {
        reject(error)
      }
    })
  })
}

export function reqDeleteImgs(name: string): Response {
  return request({
    url: '/manage/img/delete',
    method: 'post',
    data: {
      name
    }
  })
}
