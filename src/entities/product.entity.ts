import { Entity, Column, OneToMany, Index } from 'typeorm';
import { ProductPricing } from './pricing.entity';
import { Scan } from './scan.entity';

import Model from './model.entity';

@Entity('products')
export class Product extends Model {

  @Column({ type: 'varchar', unique: true })
  @Index()
  barcode: string;

  @Column({ type: 'varchar', nullable: true })
  @Index()
  asin: string;

  @Column({ type: 'varchar', nullable: true })
  title: string;

  @Column({ type: 'varchar', nullable: true })
  category: string;

  @Column({ type: 'varchar', nullable: true })
  itemType: string;

  @Column({ type: 'varchar', nullable: true })
  author: string;

  @Column({ type: 'varchar', nullable: true })
  publisher: string;

  @Column({ type: 'varchar', nullable: true })
  platform: string;

  @Column({ type: 'varchar', nullable: true })
  image: string;

  @Column({ type: 'jsonb', nullable: true })
  dimensions: {
    length: {
      value: number;
      unit: string;
    };
    width: {
      value: number;
      unit: string;
    };
    height: {
      value: number;
      unit: string;
    };
  }

  @Column({ type: 'jsonb', nullable: true })
  weight: {
    value: number;
    unit: string;
  };

  @Column({ type: 'varchar', nullable: true })
  salesRank: string;

  @Column({ type: 'jsonb', nullable: true })
  listPrice: {
    amount: number;
    currency: string;
  };

  @OneToMany(() => ProductPricing, (pricing) => pricing.product)
  pricings: ProductPricing[];

  @OneToMany(() => Scan, (scan) => scan.product)
  scans: Scan[];

}

