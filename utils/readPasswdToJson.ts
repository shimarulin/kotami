import { readFile } from 'ags/file'

export interface GecosRecord {
  fullname: string
  address?: string
  officePhone?: string
  homePhone?: string
  contact?: string
}

export interface PasswdRecord {
  username: string
  uid: number
  gid: number
  home: string
  shell: string
  gecos: GecosRecord
}

const GECOS_INDEX = {
  fullname: 0,
  address: 1,
  officePhone: 2,
  homePhone: 3,
  contact: 4,
}

const PASSWD_INDEX = {
  username: 0,
  uid: 2,
  gid: 3,
  gecos: 4,
  home: 5,
  shell: 6,
}

function parseGecos(content: string): GecosRecord {
  const gecos = content.split(',')

  return {
    fullname: gecos[GECOS_INDEX.fullname],
    address: gecos[GECOS_INDEX.address],
    officePhone: gecos[GECOS_INDEX.officePhone],
    homePhone: gecos[GECOS_INDEX.homePhone],
    contact: gecos[GECOS_INDEX.contact],
  }
}

function parsePasswd(content: string): PasswdRecord[] {
  const recordStringList = content.split('\n')

  return recordStringList
    .filter((recordString) => {
      return typeof recordString === 'string' && recordString.length > 0
    })
    .map((u) => {
      const user = u.split(':')

      return {
        username: user[PASSWD_INDEX.username],
        uid: Number(user[PASSWD_INDEX.uid]),
        gid: Number(user[PASSWD_INDEX.gid]),
        gecos: parseGecos(user[PASSWD_INDEX.gecos]),
        home: user[PASSWD_INDEX.home],
        shell: user[PASSWD_INDEX.shell],
      }
    })
}

export function readPasswdToJson(): PasswdRecord[] {
  return parsePasswd(readFile('/etc/passwd'))
    .filter((u) => {
      return u.uid >= 1000 && u.username !== 'nobody'
    })
}
