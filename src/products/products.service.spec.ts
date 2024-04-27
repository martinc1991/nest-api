import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductsService } from './products.service';
import { createProductStub } from './stub/create-product.stub';

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

  it('create method should call prisma.product.create with expected arguments', async () => {
    await service.create(createProductStub);

    const expectedArguments = { data: createProductStub };

    expect(prismaMock.product.create).toHaveBeenCalledWith(expectedArguments);
  });
  it('findAll method should call prisma.product.findMany with expected arguments', async () => {
    await service.findAll();

    expect(prismaMock.product.findMany).toHaveBeenCalled();
  });
  it('findOne method should call prisma.product.findUniqueOrThrow with expected arguments', async () => {
    const id = 'some-id';

    await service.findOne(id);

    const expectedArguments = { where: { id } };

    expect(prismaMock.product.findUniqueOrThrow).toHaveBeenCalledWith(
      expectedArguments,
    );
  });
  it('update method should call prisma.product.update with expected arguments', async () => {
    const id = 'some-id';
    const updateProductDto = createProductStub;

    await service.update(id, updateProductDto);

    const expectedArguments = {
      where: { id },
      data: updateProductDto,
    };

    expect(prismaMock.product.update).toHaveBeenCalledWith(expectedArguments);
  });
  it('remove method should call prisma.product.delete with expected arguments', async () => {
    const id = 'some-id';

    await service.remove(id);

    const expectedArguments = { where: { id } };

    expect(prismaMock.product.delete).toHaveBeenCalledWith(expectedArguments);
  });
});
