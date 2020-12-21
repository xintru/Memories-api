import { Module } from '@nestjs/common'
import { MemoriesConfigService } from './config.service'

@Module({
  providers: [MemoriesConfigService],
  exports: [MemoriesConfigService],
})
export class MemoriesConfigModule {}
