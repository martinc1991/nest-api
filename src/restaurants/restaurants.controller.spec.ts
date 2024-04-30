import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { jwtTokenStub } from 'src/auth/stub/jwt-token.stub';
import { PrismaService } from 'src/prisma/prisma.service';
import { RestaurantsController } from './restaurants.controller';
import { RestaurantsService } from './restaurants.service';
import { createRestaurantStub } from './stub/create-restaurant.stub';
import { restaurantStub } from './stub/restaurant.stub';

describe('RestaurantsController', () => {
  let controller: RestaurantsController;
  let prismaMock: DeepMockProxy<PrismaClient>;
  let serviceMock: DeepMockProxy<RestaurantsService>;

  const id = 'some-id';

  beforeEach(async () => {
    jest.resetAllMocks();

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

  it('create handler should check if user already have a restaurant', async () => {
    await controller.create(createRestaurantStub, jwtTokenStub);
    expect(serviceMock.findOneByOwner).toHaveBeenCalledWith(jwtTokenStub.id);
  });
  it('create handler should throw an error if user already have a restaurant', async () => {
    const spy = jest.spyOn(serviceMock, 'findOneByOwner');
    spy.mockResolvedValueOnce(restaurantStub);

    expect.assertions(1);

    try {
      await controller.create(createRestaurantStub, jwtTokenStub);
    } catch (error) {
      expect(error.response.message).toBe('User already have a restaurant');
    }
  });
  it('create handler should call create service method with expected arguments', async () => {
    await controller.create(createRestaurantStub, jwtTokenStub);
    expect(serviceMock.create).toHaveBeenCalledWith(
      createRestaurantStub,
      jwtTokenStub.id,
    );
  });
  it('findAll handler should call findAll service method with expected arguments', async () => {
    await controller.findAll();
    expect(serviceMock.findAll).toHaveBeenCalledWith();
  });
  it('findOne handler should call findOne service method with expected arguments', async () => {
    const spy = jest.spyOn(serviceMock, 'findOne');
    spy.mockResolvedValueOnce(restaurantStub);

    await controller.findOne(id);
    expect(serviceMock.findOne).toHaveBeenCalledWith(id);
  });
  it('findOne handler should throw an error if restaurant not found', async () => {
    const spy = jest.spyOn(serviceMock, 'findOne');
    spy.mockResolvedValueOnce(null);

    expect.assertions(1);

    try {
      await controller.findOne(id);
    } catch (error) {
      expect(error.response.message).toBe('Restaurant not found');
    }
  });
  it('update handler should call update service method with expected arguments', async () => {
    await controller.update(id, createRestaurantStub);
    expect(serviceMock.update).toHaveBeenCalledWith(id, createRestaurantStub);
  });
  it('remove handler should call remove service method with expected arguments', async () => {
    await controller.remove(id);
    expect(serviceMock.remove).toHaveBeenCalledWith(id);
  });
});
