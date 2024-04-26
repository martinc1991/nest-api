import { Prisma } from '@prisma/client';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateRestaurantDto implements Prisma.RestaurantCreateInput {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}
