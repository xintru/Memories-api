import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Field, ObjectType } from '@nestjs/graphql'
import { User } from '../user/user.model'

@ObjectType()
@Entity('Adventure')
export class Adventure extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Field()
  @Column()
  name: string

  @Field()
  @Column()
  description: string

  @Field(() => [User])
  @ManyToMany(() => User, (user: User) => user.adventures, { eager: false })
  users: User[]

  @Field()
  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created: Date
}
