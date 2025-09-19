// import { getPamFaillock } from './getPamFaillock'
import { getPamFaillockConf, PAMConfig } from './getPamFaillockConf'

let config: PAMConfig

export function usePamFaillockConf(): PAMConfig {
  if (!config) {
    config = getPamFaillockConf()
  }

  return config
}

export function usePamFaillocks(): number {
  const _config = usePamFaillockConf()
  const secondsLeft = _config.unlock_time

  if (_config.dir) {
    // TODO: Обходим каталог и по каждому пользователю составляем ограничения если есть
    // const lock = getPamFaillock(`${_config.dir}/userlockfile`)
  }

  return secondsLeft
}
