import { AppDataSource } from "../data-source";
import { Inventory } from "../entities/inventory.entity";
import { FindOptionsWhere } from "typeorm";

const inventoryRepo = AppDataSource.getRepository(Inventory);

export const findInventoryListByUserId = async (userId: number) => {
  let result = [];

  result = await inventoryRepo.find({
    where: { user: { id: userId } },
    order: { timestamp: "DESC" },
  });

  return result;
};

export const findInventoryByCondition = async (
  condition: FindOptionsWhere<Inventory>
) => {
  let result = null;

  result = await inventoryRepo.findOne({
    where: condition,
  });

  return result;
};

export const saveInventory = async (inventory: Partial<Inventory>) => {
  let result = null;

  result = await inventoryRepo.save(inventory);

  return result;
};

export const updateInventory = async (
  id: number,
  inventory: Partial<Inventory>
) => {
  let result = null;

  result = await inventoryRepo.update({ id: id }, inventory);

  return result;
};

export const deleteInventory = async (id: number) => {
  let result = null;

  result = await inventoryRepo.delete(id);

  return result;
};
