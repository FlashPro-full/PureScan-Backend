import { Entity, Column, OneToMany } from 'typeorm';
import { Scan } from './scan.entity';
import { Inventory } from './inventory.entity';
import { Subscription } from './subscription.entity';
import { Team } from './team.entity';

import Model from './model.entity';

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

  @Column({ type: 'varchar', nullable: true })
  defaultScreen: string;

  @Column({ type: 'jsonb', nullable: true })
  dashboardLayout: any;

  @Column({ type: 'boolean', default: true })
  emailNotifications: boolean;

  @Column({ type: 'boolean', default: true })
  soundEnabled: boolean;

  @Column({ type: 'boolean', default: true })
  autoSound: boolean;

  @Column({ type: 'varchar', nullable: true })
  defaultScanMode: string;

  @Column({ type: 'varchar', default: 'en' })
  language: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @OneToMany(() => Scan, (scan) => scan.user)
  scans: Scan[];

  @OneToMany(() => Inventory, (inventory) => inventory.user)
  inventories: Inventory[];

  @OneToMany(() => Subscription, (subscription) => subscription.user)
  subscriptions: Subscription[];

  @OneToMany(() => Team, (team) => team.admin)
  admins: Team[];

  @OneToMany(() => Team, (team) => team.member)
  members: Team[];

}

