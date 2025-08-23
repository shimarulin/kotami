import { Gdk } from 'ags/gtk4'
import { PasswdRecord } from '@utils/readPasswdToJson'
import { createImagePainitable } from '@utils/createImagePainitable'

export interface UserListItem {
  userName: string
  realName: string
  userPicture?: Gdk.Paintable
}

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
