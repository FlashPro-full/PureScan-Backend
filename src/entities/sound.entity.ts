import { Entity, Column, OneToMany } from 'typeorm';
import Model from './model.entity';

import { Preference } from './preference.entity';


@Entity('sounds')
export class Sound extends Model {

    @Column({ type: 'varchar', length: 255, nullable: true })
    name: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    url: string;

}