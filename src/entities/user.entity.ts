import { Entity, Column, OneToMany, OneToOne } from 'typeorm';
import { Scan } from './scan.entity';
import { Subscription } from './subscription.entity';

import Model from './model.entity';
import { Preference } from './preference.entity';
import { Shipment } from './shipment.entity';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

@Entity('users')
export class User extends Model {

  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column({ type: 'varchar' })
  password: string;

  @Column({ type: 'varchar', nullable: true })
  name: string;

  @OneToMany(() => Scan, (scan) => scan.user)
  scans: Scan[];

  @OneToMany(() => Subscription, (subscription) => subscription.user)
  subscriptions: Subscription[];

  @OneToOne(() => Preference, (preference) => preference.user)
  preference: Preference;

  @OneToMany(() => Shipment, (shipment) => shipment.user)
  shipments: Shipment[];

}

