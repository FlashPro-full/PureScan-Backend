import { Entity, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

import Model from './model.entity';

@Entity('teams')
export class Team extends Model {

    @ManyToOne(() => User, (user) => user.admins)
    @JoinColumn({ name: 'adminUserId' })
    admin: User;

    @ManyToOne(() => User, (user) => user.members)
    @JoinColumn({ name: 'memberUserId' })
    member: User;
}
