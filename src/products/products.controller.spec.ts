import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { createProductStub } from './stub/create-product.stub';

describe('ProductsController', () => {
  let controller: ProductsController;
  let prismaMock: DeepMockProxy<PrismaClient>;
  let serviceMock: DeepMockProxy<ProductsService>;

  const id = 'some-id';

  beforeEach(async () => {
    prismaMock = mockDeep<PrismaClient>();
    serviceMock = mockDeep<ProductsService>();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        { provide: ProductsService, useValue: serviceMock },
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
  });

  it('create method should call create service method with expected arguments', async () => {
    await controller.create(createProductStub);
    expect(serviceMock.create).toHaveBeenCalledWith(createProductStub);
  });
  it('findAll method should call findAll service method with expected arguments', async () => {
    await controller.findAll();
    expect(serviceMock.findAll).toHaveBeenCalledWith();
  });
  it('findOne method should call findOne service method with expected arguments', async () => {
    await controller.findOne(id);
    expect(serviceMock.findOne).toHaveBeenCalledWith(id);
  });
  it('update method should call update service method with expected arguments', async () => {
    await controller.update(id, createProductStub);
    expect(serviceMock.update).toHaveBeenCalledWith(id, createProductStub);
  });
  it('remove method should call remove service method with expected arguments', async () => {
    await controller.remove(id);
    expect(serviceMock.remove).toHaveBeenCalledWith(id);
  });
});
