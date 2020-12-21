import { MemoriesConfigService } from '../config/config.service'
import * as fs from 'fs'

const configInstance = new MemoriesConfigService()
fs.writeFileSync(
  'ormconfig.json',
  JSON.stringify(configInstance.createTypeOrmOptions(), null, 2),
)
