import { Injectable } from '@nestjs/common';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MenusService {
  constructor(private prisma: PrismaService) {}
  create(createMenuDto: CreateMenuDto) {
    return this.prisma.menu.create({ data: createMenuDto });
  }

  findAll() {
    return this.prisma.menu.findMany();
  }

  findOne(id: string) {
    return this.prisma.menu.findUniqueOrThrow({ where: { id } });
  }

  update(id: string, updateMenuDto: UpdateMenuDto) {
    return this.prisma.menu.update({
      where: { id },
      data: updateMenuDto,
    });
  }

  remove(id: string) {
    return this.prisma.menu.delete({ where: { id } });
  }
}
