import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTodoDto {
  @ApiProperty({ description: 'The title of the todo.', example: 'Buy groceries' })
  @IsNotEmpty()
  @IsString({ message: 'Email can not be only numbers' })
  title: string;

  @ApiProperty({ description: 'The description of the todo.', example: 'Milk, eggs, bread' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'The status of the todo.', example: false })
  @IsString()
  @IsOptional()
  status: boolean;
}
