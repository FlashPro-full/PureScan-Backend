import { Entity, Column, OneToMany } from 'typeorm';
import { TriggerRule } from './rule.entity';

import Model from './model.entity';

export enum Outcome {
  FBA = 'FBA',
  MF = 'MF',
  SBYB = 'SBYB',
  REJECT = 'Reject',
}

@Entity('trigger_groups')
export class TriggerGroup extends Model {

  @Column({ type: 'varchar', nullable: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: Outcome,
  })
  outcome: Outcome;

  @OneToMany(() => TriggerRule, (rule) => rule.group, { cascade: true })
  rules: TriggerRule[];

}

