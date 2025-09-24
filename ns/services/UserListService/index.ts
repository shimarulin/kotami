import { Accessor, createComputed, createState } from 'ags'

import { getAvailableUsers } from '@providers/users'
import { useLoginStorageService } from '@services/LoginStorageService'
import { LoginStorageRecord } from '@services/LoginStorageService/types'

import { createUserList } from './createUserList'
import { UserListItem } from './types'

const [userList, setUserList] = createState<UserListItem[]>([])
const [selectedUserIndex, setSelectedUserIndex] = createState<number>(-1)

const selectedUser = selectedUserIndex(index => userList.get()[index])
const selectedUserName = createComputed([selectedUser], (user) => {
  return user.userName
})

const setSelectedUserIndexByUserName = (userName: string) => {
  const index = userList.get().findIndex(user => user.userName === userName)
  setSelectedUserIndex(index >= 0 ? index : 0)
}

const getCashedSessionByUser = (cachedLoginStorageRecord: Accessor<LoginStorageRecord | null>) => {
  return cachedLoginStorageRecord.get()?.user
}

const useUserListService = () => {
  const { cachedLoginStorageRecord } = useLoginStorageService()
  if (userList.get().length === 0) {
    setUserList(createUserList(getAvailableUsers()))
  }

  // TODO: fill from active session
  const activeUserNameString: string | undefined = undefined
  const selectedUserNameString: string | undefined = getCashedSessionByUser(cachedLoginStorageRecord)

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
    selectedUserName,
    setSelectedUserIndex,
  }
}

export {
  useUserListService,
}
