import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import Model from './model.entity';

import { User } from './user.entity';

export enum ModuleEnum {
    FBA = 'FBA',
    MF = 'MF'
}

@Entity('triggers')
export class Trigger extends Model {

    @ManyToOne(() => User, (user) => user.triggers)
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column({ type: 'enum', enum: ModuleEnum, nullable: true })
    module: ModuleEnum;

    @Column({ type: 'varchar', length: 255 })
    category: string;

    @Column({ type: 'boolean', default: false })
    enabled: boolean;

    @Column({ type: 'boolean', default: true })
    disabledMissing: boolean;

    @Column({ type: 'jsonb', nullable: true })
    missingOptions: {
        targetPricePercentage?: number;
        fixedPrice?: number;
    };

    @Column({ type: 'varchar', length: 255, nullable: true })
    displayText: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    bgColor: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    mfExtraValue: number;

    @Column({ type: 'jsonb', nullable: true })
    config: {
        name?: string;
        skipEScore?: boolean;
        minEScore?: number;
        maxEScore?: number;
        minSalesrank?: number;
        maxSalesrank?: number;
        fbaSlot?: number;
        usedSlot?: number;
        amazonOffPercentage?: number;
        targetProfit?: number;
        ceiling1?: boolean;
        ceiling1Options?: {
            option: string;
            discount: number;
        };
        primeLess?: boolean;
        primeLessOptions?: {
            option: string;
            bumpUpDollars: number;
            bumpUpPercentage: number;
        };
        ceiling2?: boolean;
        ceiling2Options?: {
            option: string;
            bumpUpDollars: number;
            bumpUpPercentage: number;
        };
        bbCompare?: boolean;
        alwaysReject?: boolean;
    }[];
}