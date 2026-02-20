import { Entity, Column, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import Model from './model.entity';

import { User } from './user.entity';

import { Sound } from './sound.entity';

@Entity('preferences')
export class Preference extends Model {

    @OneToOne(() => User, (user) => user.preference)
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column({ type: 'varchar', length: 255, nullable: true })
    fbaSound: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    mfSound: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    rejectSound: string;

}