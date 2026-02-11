import { FindOptionsWhere } from 'typeorm';
import { AppDataSource } from '../data-source';
import { User } from '../entities/user.entity';

const userRepo = AppDataSource.getRepository(User);

export const saveUser = async (user: Partial<User>) => {
    let result = null;

    result = await userRepo.save(user);

    return result;
}

export const updateUser = async (user: Partial<User>) => {
    let result = null;

    result = await userRepo.update({ id: user.id }, user);

    return result;
}

export const findUserByCondition = async (condition: FindOptionsWhere<User>) => {
    let result = null;

    result = await userRepo.findOne({
        where: condition
    });

    return result;
}
