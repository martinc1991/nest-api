import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { jwtTokenStub } from 'src/auth/stub/jwt-token.stub';
import { PrismaService } from 'src/prisma/prisma.service';
import { RestaurantsService } from './restaurants.service';
import { createRestaurantStub } from './stub/create-restaurant.stub';

describe('RestaurantsService', () => {
  let service: RestaurantsService;
  let prismaMock: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    prismaMock = mockDeep<PrismaClient>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RestaurantsService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<RestaurantsService>(RestaurantsService);
  });

  it('create method should call prisma.restaurants.create with expected arguments', async () => {
    await service.create(createRestaurantStub, jwtTokenStub.id);

    const expectedArguments = {
      data: {
        name: createRestaurantStub.name,
        owner: {
          connect: {
            id: jwtTokenStub.id,
          },
        },
      },
    };

    expect(prismaMock.restaurant.create).toHaveBeenCalledWith(
      expectedArguments,
    );
  });
  it('findAll method should call prisma.restaurants.findMany with expected arguments', async () => {
    await service.findAll();

    expect(prismaMock.restaurant.findMany).toHaveBeenCalled();
  });
  it('findOne method should call prisma.restaurants.findUnique with expected arguments', async () => {
    const id = 'some-id';

    await service.findOne(id);

    const expectedArguments = { where: { id } };

    expect(prismaMock.restaurant.findUnique).toHaveBeenCalledWith(
      expectedArguments,
    );
  });
  it('findOneByOwner method should call prisma.restaurants.findUnique with expected arguments', async () => {
    const id = 'some-id';

    await service.findOneByOwner(id);

    const expectedArguments = { where: { ownerId: id } };

    expect(prismaMock.restaurant.findUnique).toHaveBeenCalledWith(
      expectedArguments,
    );
  });
  it('update method should call prisma.restaurants.update with expected arguments', async () => {
    const id = 'some-id';
    const updateProductDto = createRestaurantStub;

    await service.update(id, updateProductDto);

    const expectedArguments = {
      where: { id },
      data: updateProductDto,
    };

    expect(prismaMock.restaurant.update).toHaveBeenCalledWith(
      expectedArguments,
    );
  });
  it('remove method should call prisma.restaurants.delete with expected arguments', async () => {
    const id = 'some-id';

    await service.remove(id);

    const expectedArguments = { where: { id } };

    expect(prismaMock.restaurant.delete).toHaveBeenCalledWith(
      expectedArguments,
    );
  });
});
