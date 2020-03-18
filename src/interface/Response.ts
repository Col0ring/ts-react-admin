import { AxiosPromise } from 'axios'

type Response = AxiosPromise<{ status: number; data: any }>

export default Response
