import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

import Model from './model.entity';

@Entity('subscriptions')
export class Subscription extends Model {

  @ManyToOne(() => User, (user) => user.subscriptions)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'varchar', nullable: true })
  plan: string;

  @Column({ type: 'varchar', nullable: true })
  status: string;

  @Column({ type: 'varchar', nullable: true })
  stripeCustomerId: string;

  @Column({ type: 'varchar', nullable: true })
  stripeSubscriptionId: string;

  @Column({ type: 'timestamp', nullable: true })
  expiresAt: Date;

}

