import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { CryptoService } from 'src/crypto/crypto.service';
import { UsersService } from 'src/users/users.service';
import { AuthDto } from './dto';
import { Tokens } from './types';
import { JWTUserInfo } from './types/jwt-user-info.type';

@Injectable()
export class AuthService {
  constructor(
    private jwt: JwtService,
    private usersService: UsersService,
    private cryptoService: CryptoService,
  ) {}

  async signup(dto: AuthDto) {
    const user = await this.usersService.createUser(dto.email, dto.password);

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refresh_token);

    return { ...user, ...tokens };
  }

  async signin({ id, email }: { id: string; email: string }) {
    const user = await this.usersService.findOneByEmail(email);

    const tokens = await this.getTokens(id, email);
    await this.updateRefreshToken(id, tokens.refresh_token);

    return { ...user, ...tokens };
  }

  async signout(userId: string) {
    const user = await this.usersService.updateUser(userId, {
      refreshToken: null,
    });

    return user;
  }

  // TODO: add refresh token functionality
  // async refreshTokens(userId: string, refreshToken: string): Promise<Tokens> {
  //   const user = await this.usersService.findOne(userId);

  //   if (!user || !user.refreshToken)
  //     throw new ForbiddenException('Access Denied');

  //   const refreshTokenMatches = await bcrypt.compare(
  //     refreshToken,
  //     user.refreshToken,
  //   );

  //   if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');

  //   const tokens = await this.getTokens(user.id, user.email);
  //   await this.updateRefreshToken(user.id, tokens.refresh_token);

  //   return tokens;
  // }

  // ------------------------- Utils -------------------------
  async getTokens(userId: string, email: string): Promise<Tokens> {
    const userJwtInfo: JWTUserInfo = { id: userId, email };

    const [at, rt] = await Promise.all([
      this.jwt.signAsync(userJwtInfo),
      this.jwt.signAsync(userJwtInfo),
    ]);
    return { access_token: at, refresh_token: rt };
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.findOneByEmail(email);

    if (!user) return null;

    const passwordMatches = await this.cryptoService.compare({
      hashedPassword: user.password,
      password,
    });

    if (!passwordMatches) return null;

    return user;
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await this.cryptoService.hash(refreshToken);

    await this.usersService.updateUser(userId, {
      refreshToken: hashedRefreshToken,
    });
  }
}
