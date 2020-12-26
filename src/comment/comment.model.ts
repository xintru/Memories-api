import { Field, ObjectType } from '@nestjs/graphql'
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { User } from '../user/user.model'
import { Memory } from '../memory/memory.model'

@ObjectType()
@Entity('Comment')
export class Comment extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Field(() => User)
  @ManyToOne(() => User, (user: User) => user.comments, { eager: false })
  user: User

  @Field()
  @Column()
  message: string

  @Field(() => Memory)
  @ManyToOne(() => Memory, (memory: Memory) => memory.comments, {
    eager: false,
  })
  memory: Memory

  @Field()
  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created: Date
}
