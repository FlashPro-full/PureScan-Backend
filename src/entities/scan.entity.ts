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

  @Column({ type: 'varchar', length: 100, nullable: true })
  salesRank: string;

  @Column({ type: 'decimal', nullable: true })
  eScore: number;

  @Column({ type: 'decimal', nullable: true })
  lowestNew: number;

  @Column({ type: 'decimal', nullable: true })
  lowestUsed: number;

  @Column({ type: 'decimal', nullable: true })
  newBB: number;

  @Column({ type: 'decimal', nullable: true })
  usedBB: number;

  @Column({ type: 'boolean', default: false })
  fbaAccept: boolean;

  @Column({ type: 'boolean', default: false })
  mfAccept: boolean;

  @Column({ type: 'decimal', nullable: true})
  fbaTargetPrice: number;

  @Column({ type: 'decimal', nullable: true})
  mfTargetPrice: number;

  @Column({ type: 'decimal', nullable: true})
  fbaProfit: number;

  @Column({ type: 'decimal', nullable: true})
  mfProfit: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  route: string;
  
  @Column({ type: 'decimal', nullable: true })
  profit: number;

}

