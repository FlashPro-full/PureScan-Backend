import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

import Model from './model.entity';

@Entity('scans')
export class Scan extends Model {

  @ManyToOne(() => User, (user) => user.scans)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'varchar', length: 50, nullable: true })
  asin: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  title: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  image: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  category: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  author: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  publisher: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  platform: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  itemType: string;

  @Column({ type: 'jsonb', nullable: true })
  weight: {
    unit: string;
    value: number;
  };

  @Column({ type: 'jsonb', nullable: true })
  dimensions: {
    length: number;
    width: number;
    height: number;
  };

  @Column({ type: 'jsonb', nullable: true })
  listPrice: {
    amount: number;
    currency: string;
  };

  @Column({ type: 'varchar', length: 100, nullable: true })
  route: string;
  
  @Column({ type: 'decimal', nullable: true })
  profit: number;

}

