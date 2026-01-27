import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Product } from './product.entity';

import Model from './model.entity';

@Entity('product_pricing')
export class ProductPricing extends Model {

  @ManyToOne(() => Product, (product) => product.pricings)
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column({ type: 'varchar', nullable: true })
  source: string;

  @Column({ type: 'decimal', nullable: true })
  buyBoxPrice: number;

  @Column({ type: 'decimal', nullable: true })
  lowestMfPrice: number;

  @Column({ type: 'decimal', nullable: true })
  fbaFees: number;

  @Column({ type: 'decimal', default: 0.15 })
  referralFeeRate: number;

  @Column({ type: 'decimal', default: 1.8 })
  closingFee: number;

  @Column({ type: 'decimal', nullable: true })
  fulfillmentFee: number;

  @Column({ type: 'decimal', nullable: true })
  storageFee: number;

  @Column({ type: 'timestamp' })
  effectiveDate: Date;

  @Column({ type: 'timestamp' })
  expiresAt: Date;

}

