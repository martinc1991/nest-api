import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { PrismaService } from 'src/prisma/prisma.service';
import { MenusService } from './menus.service';
import { createMenuStub } from './stub/create-menu.stub';

describe('MenusService', () => {
  let service: MenusService;
  let prismaMock: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    prismaMock = mockDeep<PrismaClient>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MenusService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<MenusService>(MenusService);
  });

  it('create method should call prisma.menus.create with expected arguments', async () => {
    await service.create(createMenuStub);

    const expectedArguments = { data: createMenuStub };

    expect(prismaMock.menu.create).toHaveBeenCalledWith(expectedArguments);
  });
  it('findAll method should call prisma.menus.findMany with expected arguments', async () => {
    await service.findAll();

    expect(prismaMock.menu.findMany).toHaveBeenCalled();
  });
  it('findOne method should call prisma.menus.findUniqueOrThrow with expected arguments', async () => {
    const id = 'some-id';

    await service.findOne(id);

    const expectedArguments = { where: { id } };

    expect(prismaMock.menu.findUniqueOrThrow).toHaveBeenCalledWith(
      expectedArguments,
    );
  });
  it('update method should call prisma.menus.update with expected arguments', async () => {
    const id = 'some-id';
    const updateProductDto = createMenuStub;

    await service.update(id, updateProductDto);

    const expectedArguments = {
      where: { id },
      data: updateProductDto,
    };

    expect(prismaMock.menu.update).toHaveBeenCalledWith(expectedArguments);
  });
  it('remove method should call prisma.menus.delete with expected arguments', async () => {
    const id = 'some-id';

    await service.remove(id);

    const expectedArguments = { where: { id } };

    expect(prismaMock.menu.delete).toHaveBeenCalledWith(expectedArguments);
  });
});
