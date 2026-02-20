import { Entity, Column, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import Model from './model.entity';

import { User } from './user.entity';

@Entity('preferences')
export class Preference extends Model {

    @OneToOne(() => User, (user) => user.preference)
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column({ type: 'varchar', length: 255, default: 'chime' })
    fbaSound: string;

    @Column({ type: 'varchar', length: 255, default: 'ding' })
    mfSound: string;

    @Column({ type: 'varchar', length: 255, default: 'error_buzz' })
    rejectSound: string;

}