import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductsService } from './products.service';

describe('ProductsService', () => {
  let service: ProductsService;
  let prismaMock: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    // https://medium.com/@bonaventuragal/nestjs-testing-recipe-mocking-prisma-274c212d4b80
    prismaMock = mockDeep<PrismaClient>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // TODO: Seguir aca, escribir los tests

  it('should return user if exists', async () => {
    const existingProduct = {
      username: 'existing-product',
      name: 'Existing product',
    };

    await service.findOne(existingProduct.username);
    expect(prismaMock.products.findUniqueOrThrow).toHaveBeenCalledTimes(1);
  });
});
