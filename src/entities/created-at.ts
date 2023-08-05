import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

export abstract class CreatedModified {
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
