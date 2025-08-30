import { Gdk } from 'ags/gtk4'

export interface UserListItem {
  userName: string
  realName: string
  userPicture?: Gdk.Paintable
}
