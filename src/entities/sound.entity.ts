import { Entity, Column, OneToMany } from 'typeorm';
import Model from './model.entity';

import { Preference } from './preference.entity';


@Entity('sounds')
export class Sound extends Model {

    @Column({ type: 'varchar', length: 255, nullable: true })
    name: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    url: string;
    
    @OneToMany(() => Preference, (preference) => preference.fbaSound)
    fbaPreferences: Preference[];

    @OneToMany(() => Preference, (preference) => preference.mfSound)
    mfPreferences: Preference[];

    @OneToMany(() => Preference, (preference) => preference.sbybSound)
    sbybPreferences: Preference[];

    @OneToMany(() => Preference, (preference) => preference.ziffitSound)
    ziffitPreferences: Preference[];

    @OneToMany(() => Preference, (preference) => preference.riSound)
    riPreferences: Preference[];

    @OneToMany(() => Preference, (preference) => preference.rejectSound)
    rejectPreferences: Preference[];

    @OneToMany(() => Preference, (preference) => preference.noResultSound)
    noResultPreferences: Preference[];

}