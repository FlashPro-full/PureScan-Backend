import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { TriggerGroup } from './group.entity';

import Model from './model.entity';

@Entity('trigger_rules')
export class TriggerRule extends Model {

  @ManyToOne(() => TriggerGroup, (group) => group.rules, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'groupId' })
  group: TriggerGroup;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'decimal' })
  minProfit: number;

  @Column({ type: 'jsonb' })
  maxDimensions: { length: number; width: number; height: number };

  @Column('simple-array')
  categories: string[];

  @Column({ type: 'boolean', default: true })
  enabled: boolean;

}

