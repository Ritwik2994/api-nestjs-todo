import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class SignedUrlDto {
  @ApiProperty()
  @IsNotEmpty()
  fileName: string;

  @ApiProperty()
  @IsNotEmpty()
  fileType: string;

  @ApiProperty()
  @IsNotEmpty()
  filePath: string;
}
