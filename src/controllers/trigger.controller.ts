import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { saveTrigger, findTriggerByCondition, updateTriggerById } from '../services/trigger.service';
import { User } from '../entities/user.entity';
import { ModuleEnum } from '../entities/trigger.entity';
import { defaultConfig } from '../utils/constants';

type DefaultCategory = 'Books' | 'Music' | 'Videos' | 'VideoGames';
type DefaultModule = 'fba' | 'mf';

export const setDefaultTriggerHandler = async (req: AuthRequest, res: Response) => {
    try {
        const userId = Number(req.user!.id);
        const category = req.body.category;
        const module = req.body.module;

        const exist = await findTriggerByCondition({
            user: { id: userId },
            category: category,
            module: module === 'fba' ? ModuleEnum.FBA : ModuleEnum.MF
        });

        if (exist) {
            await updateTriggerById(exist.id, {
                config: defaultConfig[category as DefaultCategory][module as DefaultModule]
            });

            res.status(200).json({
                result: true,
                trigger: {
                    ...exist,
                    config: defaultConfig[category as DefaultCategory][module as DefaultModule]
                }
            });
        } else {
            const newTrigger = await saveTrigger({
                user: { id: userId } as User,
                module: module === 'fba' ? ModuleEnum.FBA : ModuleEnum.MF,
                category,
                config: defaultConfig[category as DefaultCategory][module as DefaultModule]
            });

            res.status(200).json({
                result: true,
                trigger: newTrigger
            });
        }
        
    } catch (error: any) {
        console.error('Create default trigger error:', error);
        res.status(500).json({
            result: false,
            error: 'Failed to create default trigger'
        });
    }
}

export const createTriggerHandler = async (req: AuthRequest, res: Response) => {
    try {
        const userId = Number(req.user!.id);
        const module = req.body.module;
        const category = req.body.category;

        const newTrigger = await saveTrigger({
            user: { id: userId } as User,
            module: module === 'fba' ? ModuleEnum.FBA : ModuleEnum.MF,
            category: category,
            enabled: true,
            config: []
        });

        res.status(200).json({
            result: true,
            trigger: newTrigger 
        });
    } catch (error: any) {
        console.error('Create trigger error:', error);
        return res.status(500).json({ result: false, error: 'Failed to create trigger' });
    }
}

export const getTriggerHandler = async (req: AuthRequest, res: Response) => {
    try {
        const userId = Number(req.user!.id);
        const category = req.body.category;
        const module = req.body.module;

        const trigger = await findTriggerByCondition({
            user: { id: userId },
            category: category as string,
            module: module === 'fba' ? ModuleEnum.FBA : ModuleEnum.MF
        });

        res.status(200).json({
            result: true,
            trigger: trigger
        });
    } catch (error: any) {
        console.error('Get trigger list error:', error);
        res.status(500).json({
            result: false,
            error: 'Failed to get trigger list'
        });
    }
}

export const updateTriggerHandler = async (req: Request, res: Response) => {
    try {
        const trigger = req.body.trigger;

        await updateTriggerById(Number(trigger.id), trigger);

        res.status(200).json({
            result: true,
            message: 'Trigger updated successfully'
        });
    } catch (error: any) {
        console.error('Update trigger error:', error);
        res.status(500).json({
            result: false,
            error: 'Failed to update trigger'
        });
    }
}

export const updateEnabledHandler = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const enabled = req.body.enabled;

        await updateTriggerById(Number(id), {
            enabled: enabled
        });

        res.status(200).json({
            result: true,
            message: 'Trigger enabled updated successfully'
        });
    } catch (error: any) {
        console.error('Update trigger enabled error:', error);
        res.status(500).json({
            result: false,
            error: 'Failed to update trigger enabled'
        });
    }
}

export const updateDisabledMissingHandler = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const disabledMissing = req.body.disabledMissing;
        const missingOptions = req.body.missingOptions;

        await updateTriggerById(Number(id), {
            disabledMissing: disabledMissing,
            missingOptions: missingOptions
        });

        res.status(200).json({
            result: true,
            message: 'Trigger disabled missing updated successfully'
        });
    } catch (error: any) {
        console.error('Update trigger disabled missing error:', error);
        res.status(500).json({
            result: false,
            error: 'Failed to update trigger disabled missing'
        });
    }
}

export const updateDisplayHandler = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const displayText = req.body.displayText;
        const bgColor = req.body.bgColor;
        
        
        await updateTriggerById(Number(id), {
            displayText: displayText,
            bgColor: bgColor
        });

        res.status(200).json({
            result: true,
            message: 'Trigger display updated successfully'
        });
    } catch (error: any) {
        console.error('Update trigger display error:', error);
        res.status(500).json({
            result: false,
            error: 'Failed to update trigger display'
        });
    }
}

export const updateMfValueHander = async (req: Request, res: Response) => {
    try {
        const { id } = req.params; 
        const mfExtraValue = req.body.mfExtraValue;

        await updateTriggerById(Number(id), {
            mfExtraValue: mfExtraValue
        });

        res.status(200).json({
            result: true,
            message: "Trigger mf value updated successfully"
        }); 
    } catch (error: any) {
        console.error('Update trigger mf value error:', error);
        res.status(500).json({
            result: false,
            error: "Failed to update trigger mf value"
        });
    }
}
