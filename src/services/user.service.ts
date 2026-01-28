import { FindOptionsWhere } from 'typeorm';
import { AppDataSource } from '../data-source';
import { User } from '../entities/user.entity';
import { Team } from '../entities/team.entity';

const userRepo = AppDataSource.getRepository(User);
const teamRepo = AppDataSource.getRepository(Team);

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

export const findTeam = async (adminId: number) => {
    let result = null;

    result = await teamRepo.find({
        select: ['member'],
        where: { admin: { id: adminId } },
        relations: ['member']
    });

    return result;
}
