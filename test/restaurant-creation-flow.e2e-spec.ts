import { INestApplication, ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { AllExceptionsFilter } from 'src/all-exceptions.filter';
import { AuthDto } from 'src/auth/dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { createRestaurantStub } from 'src/restaurants/stub/create-restaurant.stub';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

const userOne: AuthDto = { email: 'nLsDv@example.com', password: '1234567' };

const SIGNUP_ROUTE = '/auth/signup';
const SIGNIN_ROUTE = '/auth/signin';
const CREATE_RESTAURANT_ROUTE = '/restaurants';

describe('Restaurant creation flow', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Config from the main.ts file
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    const { httpAdapter } = app.get(HttpAdapterHost);
    app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

    // Config for the e2e test only
    app.useLogger(false); // Just for the console to be cleaner

    await app.init();

    prisma = moduleFixture.get<PrismaService>(PrismaService);

    // Restart db
    await prisma.restaurant.deleteMany();
    await prisma.user.deleteMany();
  });

  describe('Restaurant creation', () => {
    let access_token = '';

    it('A user, when created, should not have any restaurant', async () => {
      await request(app.getHttpServer()).post(SIGNUP_ROUTE).send(userOne);

      const user = await prisma.user.findUnique({
        where: { email: userOne.email },
        include: { restaurant: true },
      });

      expect(user?.restaurant).toBe(null);
    });
    it('A user should not be able to create a restaurant if he is not validated', async () => {
      const response = await request(app.getHttpServer())
        .post(CREATE_RESTAURANT_ROUTE)
        .set({ Authorization: 'Bearer ' + access_token })
        .send(createRestaurantStub);

      expect(response.status).toBe(401);
    });
    it('A user should be able to create a restaurant if he is validated', async () => {
      const loggedInUser = await request(app.getHttpServer())
        .post(SIGNIN_ROUTE)
        .send(userOne);

      access_token = loggedInUser.body.access_token;

      const response = await request(app.getHttpServer())
        .post(CREATE_RESTAURANT_ROUTE)
        .set('Authorization', 'Bearer ' + access_token)
        .send(createRestaurantStub);

      expect(response.status).toBe(201);
    });
    it('A user should be able to create only one restaurant', async () => {
      const response = await request(app.getHttpServer())
        .post(CREATE_RESTAURANT_ROUTE)
        .set('Authorization', 'Bearer ' + access_token)
        .send(createRestaurantStub);

      expect(response.status).toBe(403);
    });
  });
});
