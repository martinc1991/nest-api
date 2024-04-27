import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { PrismaService } from 'src/prisma/prisma.service';
import { RestaurantsController } from './restaurants.controller';
import { RestaurantsService } from './restaurants.service';
import { createRestaurantStub } from './stub/create-restaurant.stub';

describe('RestaurantsController', () => {
  let controller: RestaurantsController;
  let prismaMock: DeepMockProxy<PrismaClient>;
  let serviceMock: DeepMockProxy<RestaurantsService>;

  const id = 'some-id';

  beforeEach(async () => {
    prismaMock = mockDeep<PrismaClient>();
    serviceMock = mockDeep<RestaurantsService>();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [RestaurantsController],
      providers: [
        { provide: RestaurantsService, useValue: serviceMock },
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    controller = module.get<RestaurantsController>(RestaurantsController);
  });

  it('create method should call create service method with expected arguments', async () => {
    await controller.create(createRestaurantStub);
    expect(serviceMock.create).toHaveBeenCalledWith(createRestaurantStub);
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
    await controller.update(id, createRestaurantStub);
    expect(serviceMock.update).toHaveBeenCalledWith(id, createRestaurantStub);
  });
  it('remove method should call remove service method with expected arguments', async () => {
    await controller.remove(id);
    expect(serviceMock.remove).toHaveBeenCalledWith(id);
  });
});
