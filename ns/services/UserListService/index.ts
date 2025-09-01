import { createState } from 'ags'
import { readPasswdToJson } from '@utils/readPasswdToJson'
import { createUserList } from './createUserList'
import { useLoginStorageService } from '@services/LoginStorageService'
import { UserListItem } from './types'

const [userList, setUserList] = createState<UserListItem[]>([])
const [selectedUserIndex, setSelectedUserIndex] = createState<number>(-1)

const selectedUser = selectedUserIndex(index => userList.get()[index])

const setSelectedUserIndexByUserName = (userName: string) => {
  const index = userList.get().findIndex(user => user.userName === userName)
  setSelectedUserIndex(index >= 0 ? index : 0)
}

const useUserListService = () => {
  const { cachedLoginStorageRecord } = useLoginStorageService()
  if (userList.get().length === 0) {
    setUserList(createUserList(readPasswdToJson()))
  }

  // TODO: fill from active session
  const activeUserNameString: string | undefined = undefined
  // TODO: fill from cache file
  const selectedUserNameString: string | undefined = cachedLoginStorageRecord.get()?.user

  if (activeUserNameString && selectedUserIndex.get() < 0) {
    setSelectedUserIndexByUserName(activeUserNameString)
  }
  else if (selectedUserNameString && selectedUserIndex.get() < 0) {
    setSelectedUserIndexByUserName(selectedUserNameString)
  }
  else if (selectedUserIndex.get() < 0) {
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
