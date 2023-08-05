import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { CreatedModified } from './created-at';

@Entity('todos')
export class Todo extends CreatedModified {
  @ApiProperty({ description: 'The unique identifier of the todo.' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'The ID of the user associated with this access token.' })
  @Column()
  userId: string;

  @ApiProperty({ description: 'The title of the todo.', example: 'Buy groceries' })
  @Column({ nullable: false })
  title: string;

  @ApiProperty({ description: 'The description of the todo.', example: 'Remember to buy milk and eggs.' })
  @Column({ nullable: true })
  description: string;

  @ApiProperty({ description: 'The status of the todo.', example: false })
  @Column({ default: false })
  status: boolean;
}
