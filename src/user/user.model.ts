import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Field, ObjectType } from '@nestjs/graphql'
import { Memory } from '../memory/memory.model'
import { Comment } from '../comment/comment.model'

@ObjectType()
@Entity('User')
export class User extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Field()
  @Column({ unique: true })
  email: string

  @Field()
  @Column()
  name: string

  @Column()
  password: string

  @Field()
  @Column({
    default: '',
  })
  avatar_url: string

  @ManyToMany(() => Memory, (memory: Memory) => memory.user, {
    cascade: true,
  })
  @JoinTable({
    name: 'user_has_memory',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'memory_id', referencedColumnName: 'id' },
  })
  @Field(() => [Memory])
  memories: Memory[]

  @Field(() => [Comment])
  @OneToMany(() => Comment, (comment: Comment) => comment.user)
  comments: Comment[]
}
