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
    let signUpEndpoint: request.Test;

    beforeEach(async () => {
      signUpEndpoint = request(app.getHttpServer()).post(SIGNUP_ROUTE);
      await prisma.user.deleteMany();
    });

    it('A user should not be able to sign up, if invalid email is provided', async () => {
      const { status, body } = await signUpEndpoint.send({
        ...userOne,
        email: invalidUser.email,
      });

      expect(status).toBe(400);
      expect(body.response.message).toContain('Email must be a valid email');
    });
    it('A user should not be able to sign up, if invalid password is provided', async () => {
      const { status, body } = await signUpEndpoint.send({
        ...userOne,
        password: invalidUser.password,
      });

      expect(status).toBe(400);
      expect(body.response.message).toContain(
        'Password must be at least 6 characters',
      );
    });
    it('A user should be able to sign up, if valid email and password are provided', async () => {
      const { status } = await signUpEndpoint.send(userOne);

      expect(status).toBe(201);
    });
    it('A user should not be able to sign up if email is already taken', async () => {
      const user = await signUpEndpoint.send(userOne);
      expect(user.status).toBe(201);

      const alreadyTakenUser = await signUpEndpoint.send(userOne);

      expect(alreadyTakenUser.status).toBe(409);
    });
  });

  describe.only('User signin', () => {
    it('A user should not be able to signin, if invalid email is provided', async () => {});
    it('A user should not be able to signin, if invalid password is provided', async () => {});
    it('A user should not be able to signin, if valid email is provided but password is incorrect', async () => {});
    it('A user should be able to signin, if valid email and password are provided and they match', async () => {});
  });
});
