import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateTodoDto {
  @ApiProperty({ required: false, description: 'The title of the todo.', example: 'Buy groceries' })
  @IsString({ message: 'Email can not be only numbers' })
  @IsOptional()
  title?: string;

  @ApiProperty({ required: false, description: 'The description of the todo.', example: 'Milk, eggs, bread' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ required: false, description: 'The status of the todo.', example: false })
  @IsString()
  @IsOptional()
  status?: boolean;
}
