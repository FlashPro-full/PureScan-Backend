import { Entity, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

import Model from './model.entity';

@Entity('scans')
export class Scan extends Model {

  @ManyToOne(() => User, (user) => user.scans)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'varchar' })
  barcode: string;

  @Column({ type: 'varchar', nullable: true })
  asin: string;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'varchar', nullable: true })
  category: string;

  @Column({ type: 'varchar', nullable: true })
  itemType: string;

  @Column({ type: 'decimal', nullable: true })
  currentPrice: number;

  @Column({ type: 'decimal', nullable: true })
  suggestedPrice: number;

  @Column({ type: 'decimal', nullable: true })
  profit: number;

  @Column({ type: 'varchar' })
  recommendation: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: any;

  @Column({ type: 'jsonb', nullable: true })
  analysisData: any;

  @CreateDateColumn()
  scannedAt: Date;

}

