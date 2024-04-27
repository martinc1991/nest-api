import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { PrismaService } from 'src/prisma/prisma.service';
import { MenusController } from './menus.controller';
import { MenusService } from './menus.service';
import { createMenuStub } from './stub/create-menu.stub';

describe('MenusController', () => {
  let controller: MenusController;
  let prismaMock: DeepMockProxy<PrismaClient>;
  let serviceMock: DeepMockProxy<MenusService>;

  const id = 'some-id';

  beforeEach(async () => {
    prismaMock = mockDeep<PrismaClient>();
    serviceMock = mockDeep<MenusService>();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [MenusController],
      providers: [
        { provide: MenusService, useValue: serviceMock },
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    controller = module.get<MenusController>(MenusController);
  });

  it('create method should call create service method with expected arguments', async () => {
    await controller.create(createMenuStub);
    expect(serviceMock.create).toHaveBeenCalledWith(createMenuStub);
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
    await controller.update(id, createMenuStub);
    expect(serviceMock.update).toHaveBeenCalledWith(id, createMenuStub);
  });
  it('remove method should call remove service method with expected arguments', async () => {
    await controller.remove(id);
    expect(serviceMock.remove).toHaveBeenCalledWith(id);
  });
});
