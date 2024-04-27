import { Module } from '@nestjs/common';
import { MenusModule } from './menus/menus.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProductsModule } from './products/products.module';
import { RestaurantsModule } from './restaurants/restaurants.module';

@Module({
  imports: [PrismaModule, RestaurantsModule, ProductsModule, MenusModule],
})
export class AppModule {}
