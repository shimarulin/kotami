import { createState } from 'ags'
import { readPasswdToJson } from '@utils/readPasswdToJson'
import { createUserList, UserListItem } from './createUserList'

// const [activeUserName, setActiveUserName] = createState<string | null>(null)
// const [activeUserSession, setActiveUserSession] = createState<string | null>(null)
const [selectedUserName, setSelectedUserName] = createState<string | null>(null)
// const [selectedUserSession, setSelectedUserSession] = createState<string | null>(null)
const [userList, setUserList] = createState<UserListItem[]>([])

const useUserListService = () => {
  if (userList.get().length === 0) {
    setUserList(createUserList(readPasswdToJson()))
  }

  // TODO: fill from active session
  const activeUserNameString = null

  if (activeUserNameString) {
    // setActiveUserName(activeUserNameString)
    setSelectedUserName(activeUserNameString)
  }

  const selectedUserNameString = selectedUserName.get()

  if (!selectedUserNameString) {
    setSelectedUserName(userList.get()[0].userName)
  }

  return {
    userList,
    selectedUserName,
    setSelectedUserName,
  }
}

export {
  useUserListService,
}
