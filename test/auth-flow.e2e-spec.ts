import { INestApplication, ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { AllExceptionsFilter } from 'src/all-exceptions.filter';
import { AuthDto } from 'src/auth/dto';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from 'src/prisma/prisma.service';

const userOne: AuthDto = { email: 'nLsDv@example.com', password: '1234567' };
const invalidUser = { email: 'not-an-email', password: '123' };

const SIGNUP_ROUTE = '/auth/signup';
const SIGNIN_ROUTE = '/auth/signin';

describe('Auth flow', () => {
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
  });

  describe('User signup', () => {
    beforeEach(async () => {
      await prisma.user.deleteMany();
    });

    it('A user should not be able to sign up, if invalid email is provided', async () => {
      const { status, body } = await request(app.getHttpServer())
        .post(SIGNUP_ROUTE)
        .send({
          ...userOne,
          email: invalidUser.email,
        });

      expect(status).toBe(400);
      expect(body.response.message).toContain('Email must be a valid email');
    });
    it('A user should not be able to sign up, if invalid password is provided', async () => {
      const { status, body } = await request(app.getHttpServer())
        .post(SIGNUP_ROUTE)
        .send({
          ...userOne,
          password: invalidUser.password,
        });

      expect(status).toBe(400);
      expect(body.response.message).toContain(
        'Password must be at least 6 characters',
      );
    });
    it('A user should be able to sign up, if valid email and password are provided', async () => {
      const { status } = await request(app.getHttpServer())
        .post(SIGNUP_ROUTE)
        .send(userOne);

      expect(status).toBe(201);
    });
    it('A user should not be able to sign up if email is already taken', async () => {
      const user = await request(app.getHttpServer())
        .post(SIGNUP_ROUTE)
        .send(userOne);
      expect(user.status).toBe(201);

      const alreadyTakenUser = await request(app.getHttpServer())
        .post(SIGNUP_ROUTE)
        .send(userOne);

      expect(alreadyTakenUser.status).toBe(409);
      expect(alreadyTakenUser.body.response.message).toContain(
        'Email already taken',
      );
    });
  });

  describe('User signin', () => {
    beforeAll(async () => {
      await prisma.user.deleteMany();
      await request(app.getHttpServer()).post(SIGNUP_ROUTE).send(userOne);
    });

    it('A user should not be able to signin, if invalid email or password are provided', async () => {
      const invalidEmailReq = await request(app.getHttpServer())
        .post(SIGNIN_ROUTE)
        .send({ ...userOne, email: invalidUser.email });
      const invalidPasswordReq = await request(app.getHttpServer())
        .post(SIGNIN_ROUTE)
        .send({ ...userOne, password: invalidUser.password });

      expect(invalidEmailReq.status).toBe(400);
      expect(invalidPasswordReq.status).toBe(400);
    });
    it('A user should not be able to signin, if valid email and password are provided but password doesnt match', async () => {
      const invalidPasswordReq = await request(app.getHttpServer())
        .post(SIGNIN_ROUTE)
        .send({ ...userOne, password: 'invalid-password' });

      expect(invalidPasswordReq.status).toBe(401);
    });
    it('A user should be able to signin, if valid email and password are provided and they match', async () => {
      const validReq = await request(app.getHttpServer())
        .post(SIGNIN_ROUTE)
        .send(userOne);

      expect(validReq.status).toBe(200);
    });
    it('A user that successfully signs in should get an access token and a refresh token', async () => {
      const validReq = await request(app.getHttpServer())
        .post(SIGNIN_ROUTE)
        .send(userOne);

      expect(validReq.status).toBe(200);
      expect(validReq.body.access_token).toBeDefined();
      expect(validReq.body.refresh_token).toBeDefined();
    });
  });
});
