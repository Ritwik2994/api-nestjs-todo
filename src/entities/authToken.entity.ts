import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

import { CreatedModified } from './created-at';

@Entity('auth_token')
export class AuthToken extends CreatedModified {
  @ApiProperty({ description: 'The unique identifier of the access token.' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'The ID of the user associated with this access token.' })
  @Column()
  userId: string;

  @ApiProperty({ description: 'The authentication token for the access token.' })
  @Index('auth_token-idx')
  @Column({ nullable: false })
  authToken: string;

  @ApiProperty({ description: 'The refresh token for the access token.' })
  @Index('refresh_token-idx')
  @Column({ nullable: false })
  refreshToken: string;

  @ApiProperty({ description: 'Whether the access token is active or not.' })
  @Column({ default: true })
  isActive: boolean;
}
