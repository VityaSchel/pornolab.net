export type User = {
  id: number
  name: string
}

export type UserMin = Pick<User, 'id' | 'name'>