import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Field, ObjectType } from '@nestjs/graphql'
import { Adventure } from '../adventure/adventure.model'

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

  @ManyToMany(() => Adventure, (adventure: Adventure) => adventure.user, {
    cascade: true,
  })
  @JoinTable({
    name: 'user_has_adventure',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'adventure_id', referencedColumnName: 'id' },
  })
  @Field(() => [Adventure])
  adventures: Adventure[]
}
