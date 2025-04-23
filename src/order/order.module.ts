import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { PromoModule } from 'src/promo/promo.module';
import { CartModule } from 'src/cart/cart.module';

@Module({
  imports: [PromoModule, CartModule],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
