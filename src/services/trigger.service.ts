import { FindOptionsWhere } from 'typeorm';
import { AppDataSource } from '../data-source';
import { Trigger } from '../entities/trigger.entity';

const triggerRepo = AppDataSource.getRepository(Trigger);

export const saveTrigger = async (trigger: Partial<Trigger>) => {
    let result = null;

    result = await triggerRepo.save(trigger);

    return result;
}

export const findTriggerByCondition = async (condition: FindOptionsWhere<Trigger>) => {
    let result = null;

    result = await triggerRepo.findOne({
        where: condition
    });

    return result;
}

export const findTriggersByCondition = async (condition: FindOptionsWhere<Trigger>) => {
    return await triggerRepo.find({
        where: condition
    });
}

export const updateTriggerById = async (id: number, trigger: Partial<Trigger>) => {
    let result = null;

    result = await triggerRepo.update({ id: id }, trigger);

    return result;
}

export const deleteTriggerById = async (id: number) => {
    let result = null;

    result = await triggerRepo.delete({ id: id });

    return result;
}