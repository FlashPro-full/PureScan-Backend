import { Entity, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

import Model from './model.entity';

export enum Rating {
  FBA = 'FBA',
  FBM = 'FBM',
  FBC = 'FBC',
  TRASH = 'Trash',
}

@Entity('inventory')
export class Inventory extends Model {

  @ManyToOne(() => User, (user) => user.inventories)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'varchar', nullable: true })
  barcode: string;

  @Column({ type: 'varchar', nullable: true })
  title: string;

  @Column({ type: 'varchar', nullable: true })
  author: string;

  @Column({ type: 'varchar', nullable: true })
  category: string;

  @Column({ type: 'varchar', nullable: true })
  image: string;

  @Column({ type: 'decimal', nullable: true })
  scannedPrice: number;

  @Column({
    type: 'enum',
    enum: Rating,
    default: Rating.FBA,
  })
  rating: Rating;

  @CreateDateColumn({ default: new Date() })
  timestamp: Date;

}

