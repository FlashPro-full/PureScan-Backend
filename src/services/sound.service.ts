import { AppDataSource } from '../data-source';
import { Sound } from '../entities/sound.entity';

const soundRepo = AppDataSource.getRepository(Sound);

export const saveSound = async (sound: Partial<Sound>) => {
    let result = null;

    result = await soundRepo.save(sound);

    return result;
}

export const findAllSounds = async () => {
    let result = null;

    result = await soundRepo.find();

    return result;
}

export const deleteSoundById = async (id: number) => {
    let result = null;

    result = await soundRepo.delete({ id: id });

    return result;
}