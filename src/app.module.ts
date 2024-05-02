import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { MenusModule } from './menus/menus.module';
import { ProductsModule } from './products/products.module';
import { RestaurantsModule } from './restaurants/restaurants.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    AuthModule,
    MenusModule,
    ProductsModule,
    RestaurantsModule,
    UsersModule,
  ],
})
export class AppModule {}
