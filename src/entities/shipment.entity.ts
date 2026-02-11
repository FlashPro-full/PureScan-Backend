import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import Model from './model.entity';

import { User } from './user.entity';

@Entity('shipments')
export class Shipment extends Model {

    @ManyToOne(() => User, (user) => user.shipments)
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column({ type: 'varchar', length: 255, nullable: true })
    module: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    name: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    current: boolean;
}