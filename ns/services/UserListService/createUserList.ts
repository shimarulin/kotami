import { PasswdRecord } from '@providers/users'
import { createImagePainitable } from '@utils/createImagePainitable'

import { UserListItem } from './types'

const createUserListItem = (passwdRecord: PasswdRecord): UserListItem => {
  return {
    userName: passwdRecord.username,
    realName: passwdRecord.gecos.fullname.length > 0 ? passwdRecord.gecos.fullname : passwdRecord.username,
    userPicture: createImagePainitable(`/var/lib/AccountsService/icons/${passwdRecord.username}`) || createImagePainitable(`/home/${passwdRecord.username}/.face`),
  }
}

export const createUserList = (passwdRecordList: PasswdRecord[]): UserListItem[] => {
  return passwdRecordList.map(createUserListItem)
}
