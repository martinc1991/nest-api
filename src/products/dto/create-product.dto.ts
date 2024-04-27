import { Prisma } from '@prisma/client';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateProductDto implements Prisma.ProductCreateWithoutMenuInput {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  section?: string;

  @IsNumber()
  price: number;

  @IsString()
  menuId: string;

  @IsBoolean()
  @IsOptional()
  published?: boolean;
}
