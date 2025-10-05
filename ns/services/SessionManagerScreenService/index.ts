import { createState } from 'ags'

const [windowVisible, setWindowVisible] = createState<boolean>(false)

const useSessionManagerScreenService = () => {
  return {
    windowVisible,
    setWindowVisible,
  }
}

export {
  useSessionManagerScreenService,
}
