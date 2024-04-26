import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { RestaurantsModule } from './restaurants/restaurants.module';
import { ProductsModule } from './products/products.module';
import { MenusModule } from './menus/menus.module';

@Module({
  imports: [PrismaModule, RestaurantsModule, ProductsModule, MenusModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
