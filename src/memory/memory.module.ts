import { Module } from '@nestjs/common'
import { MemoryService } from './memory.service'
import { MemoryResolver } from './memory.resolver'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Memory } from './memory.model'

@Module({
  imports: [TypeOrmModule.forFeature([Memory])],
  providers: [MemoryService, MemoryResolver],
})
export class MemoryModule {}
