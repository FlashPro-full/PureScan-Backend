import { AppDataSource } from "../data-source";
import { Preference } from "../entities/preference.entity";

const preferenceRepo = AppDataSource.getRepository(Preference);

export const savePreference = async (preference: Partial<Preference>) => {
    let result = null;

    result = await preferenceRepo.save(preference);

    return result;
}

export const updatePreference = async (preference: Partial<Preference>) => {
    let result = null;

    result = await preferenceRepo.update({ id: preference.id }, preference);

    return result;
}

export const findPreferenceByUserId = async (userId: number) => {
    let result = null;

    result = await preferenceRepo.findOne({
        where: { user: { id: userId } }
    });

    return result;
}