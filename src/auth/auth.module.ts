import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { CryptoModule } from 'src/crypto/crypto.module';
import { CryptoService } from 'src/crypto/crypto.service';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy, LocalStrategy } from './strategies';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '24h' },
    }),
    UsersModule,
    PassportModule,
    CryptoModule,
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, CryptoService],
  controllers: [AuthController],
})
export class AuthModule {}
