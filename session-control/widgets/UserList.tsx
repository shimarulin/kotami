// import app from "ags/gtk4/app"
// import { Astal, Gtk, Gdk } from "ags/gtk4"
// import { execAsync } from "ags/process"
// import { createPoll } from "ags/time"
// import AstalGreet from "gi://AstalGreet"
// import AccountsService from "gi://AccountsService"

export interface UserListItem {
    name: string
}

export interface UserListProps {
    items: UserListItem[];
    user: string;
}

export default function UserList({user, items}: UserListProps) {
//   const AG = AstalGreet
//   const userManager = new AccountsService.UserManager()
//   const userList = userManager.list_users()
//   const userListItems: UserListItem[] = []

  return (
    <box>
      {items.map((user) => (
        <label label={ user.name } />
      ))}
    </box>
  )
}
