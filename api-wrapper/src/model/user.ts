export type UserAccount = {
  type: 'user'
  id: number
  name: string
}

export type GuestUser = {
  type: 'guest'
}

export type User = UserAccount | GuestUser

export type UserMin = User//Pick<User, 'id' | 'name' | 'type'>
