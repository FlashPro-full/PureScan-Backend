import { Entity, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Product } from './product.entity';

import Model from './model.entity';

export enum Recommendation {
  KEEP = 'keep',
  DISCARD = 'discard',
  WARN = 'warn'
}

@Entity('scans')
export class Scan extends Model {

  @ManyToOne(() => User, (user) => user.scans)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Product, (product) => product.scans)
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column({ type: 'decimal', nullable: true })
  scannedPrice: number;

  @Column({ type: 'enum', enum: Recommendation, default: Recommendation.DISCARD })
  recommendation: Recommendation;

}

