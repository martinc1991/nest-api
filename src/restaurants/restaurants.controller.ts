import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtStrategyUser } from 'src/auth/common/decorators';
import { JwtAuthGuard } from 'src/auth/common/guards';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { RestaurantsService } from './restaurants.service';

@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Get()
  findAll() {
    return this.restaurantsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const restaurant = await this.restaurantsService.findOne(id);

    if (!restaurant) throw new NotFoundException('Restaurant not found');

    return restaurant;
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createRestaurantDto: CreateRestaurantDto,
    @JwtStrategyUser() user: JwtStrategyUser,
  ) {
    const existingRestaurant = await this.restaurantsService.findOneByOwner(
      user.id,
    );

    if (existingRestaurant)
      throw new ForbiddenException('User already have a restaurant');

    return this.restaurantsService.create(createRestaurantDto, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRestaurantDto: UpdateRestaurantDto,
  ) {
    return this.restaurantsService.update(id, updateRestaurantDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.restaurantsService.remove(id);
  }
}
