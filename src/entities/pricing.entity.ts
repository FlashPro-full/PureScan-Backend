import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Product } from './product.entity';

import Model from './model.entity';

@Entity('product_pricing')
export class ProductPricing extends Model {

  @ManyToOne(() => Product, (product) => product.pricings)
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column({ type: 'jsonb', nullable: true })
  suggestedPrice: {
    amount: number;
    currency: string;
  };

  @Column({ type: 'jsonb', nullable: true })
  fees: {
    amount: number;
    currency: string;
  };

  @Column({ type: 'timestamp' })
  effectiveDate: Date;

  @Column({ type: 'timestamp' })
  expiresAt: Date;

}

