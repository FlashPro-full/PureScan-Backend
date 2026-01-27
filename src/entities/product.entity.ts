import { Entity, Column, OneToMany, Index } from 'typeorm';
import { ProductPricing } from './pricing.entity';

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
  upc: string;

  @Column({ type: 'varchar', nullable: true })
  ean: string;

  @Column({ type: 'varchar', nullable: true })
  @Index()
  isbn: string;

  @Column({ type: 'varchar', nullable: true })
  title: string;

  @Column({ type: 'varchar', nullable: true })
  author: string;

  @Column({ type: 'varchar', nullable: true })
  publisher: string;

  @Column({ type: 'varchar', nullable: true })
  category: string;

  @Column({ type: 'varchar', nullable: true })
  itemType: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'jsonb', nullable: true })
  images: string[];

  @Column({ type: 'decimal', nullable: true })
  dimensionsLength: number;

  @Column({ type: 'decimal', nullable: true })
  dimensionsWidth: number;

  @Column({ type: 'decimal', nullable: true })
  dimensionsHeight: number;

  @Column({ type: 'decimal', nullable: true })
  weightOz: number;

  @Column({ type: 'varchar', nullable: true })
  salesRank: string;

  @OneToMany(() => ProductPricing, (pricing) => pricing.product)
  pricings: ProductPricing[];

}

