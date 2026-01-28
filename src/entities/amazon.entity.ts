import { Entity, Column, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

import Model from './model.entity';

@Entity('amazon')
export class Amazon extends Model {

    @OneToOne(() => User, (user) => user.amazon)
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column({ type: 'varchar', nullable: true })
    clientId: string;

    @Column({ type: 'varchar', nullable: true })
    clientSecret: string;

    @Column({ type: 'varchar', nullable: true })
    refreshToken: string;

}