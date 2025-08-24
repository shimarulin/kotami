import { createState } from 'ags'
import { readPasswdToJson } from '@utils/readPasswdToJson'
import { createUserList, UserListItem } from './createUserList'

// const [activeUserName, setActiveUserName] = createState<string | null>(null)
// const [activeUserSession, setActiveUserSession] = createState<string | null>(null)
const [selectedUserIndex, setSelectedUserIndex] = createState<number>(0)
// const [selectedUserSession, setSelectedUserSession] = createState<string | null>(null)
const [userList, setUserList] = createState<UserListItem[]>([])

const selectedUser = selectedUserIndex(index => userList.get()[index])

const setSelectedUserIndexByUserName = (userName: string) => {
  const index = userList.get().findIndex(user => user.userName === userName)
  setSelectedUserIndex(index >= 0 ? index : 0)
}

const useUserListService = () => {
  if (userList.get().length === 0) {
    setUserList(createUserList(readPasswdToJson()))
  }

  // TODO: fill from active session
  const activeUserNameString: string | null = null
  // TODO: fill from cache file
  const selectedUserNameString: string | null = null

  if (activeUserNameString) {
    setSelectedUserIndexByUserName(activeUserNameString)
  }
  else if (selectedUserNameString) {
    setSelectedUserIndexByUserName(selectedUserNameString)
  }
  else {
    setSelectedUserIndex(0)
  }

  return {
    userList,
    selectedUser,
    selectedUserIndex,
    setSelectedUserIndex,
  }
}

export {
  useUserListService,
}
