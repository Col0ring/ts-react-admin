export interface IProductListItem {
  _id: string
  name: string
  desc: string
  price: string
  detail: string
  imgs: string[]
  categoryId: string
  pCategoryId: string
  status: 1 | 2
}
