import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOne(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findOneByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async createUser(email: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    return user;
  }

  async updateUser(id: string, data: Partial<User>) {
    const user = await this.prisma.user.update({
      where: { id },
      data,
    });

    return user;
  }
}
