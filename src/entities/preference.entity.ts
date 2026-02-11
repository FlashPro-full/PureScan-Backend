import { Entity, Column, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import Model from './model.entity';

import { User } from './user.entity';

import { Sound } from './sound.entity';

@Entity('preferences')
export class Preference extends Model {

    @OneToOne(() => User, (user) => user.preference)
    @JoinColumn({ name: 'userId' })
    user: User;

    @ManyToOne(() => Sound, (sound) => sound.fbaPreferences)
    @JoinColumn({ name: 'fbaSoundId' })
    fbaSound: Sound;

    @ManyToOne(() => Sound, (sound) => sound.mfPreferences)
    @JoinColumn({ name: 'mfSoundId' })
    mfSound: Sound;

    @ManyToOne(() => Sound, (sound) => sound.sbybPreferences)
    @JoinColumn({ name: 'sbybSoundId' })
    sbybSound: Sound;

    @ManyToOne(() => Sound, (sound) => sound.ziffitPreferences)
    @JoinColumn({ name: 'ziffitSoundId' })
    ziffitSound: Sound;

    @ManyToOne(() => Sound, (sound) => sound.riPreferences)
    @JoinColumn({ name: 'riSoundId' })
    riSound: Sound;

    @ManyToOne(() => Sound, (sound) => sound.rejectPreferences)
    @JoinColumn({ name: 'rejectSoundId' })
    rejectSound: Sound;

    @ManyToOne(() => Sound, (sound) => sound.noResultPreferences)
    @JoinColumn({ name: 'noResultSoundId' })
    noResultSound: Sound;

}