import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtStrategyUser, LocalStrategyUser } from './common/decorators';
import { JwtAuthGuard, LocalAuthGuard } from './common/guards';
import { AuthDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() dto: AuthDto) {
    return this.authService.signup(dto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  signin(@LocalStrategyUser() user: LocalStrategyUser) {
    return this.authService.signin({ email: user.email, id: user.id });
  }

  @UseGuards(JwtAuthGuard)
  @Post('signout')
  logout(@JwtStrategyUser() user: JwtStrategyUser) {
    return this.authService.signout(user.id);
  }

  // TODO: add refresh token functionality
  // @UseGuards(JwtAuthGuard)
  // @Post('refresh')
  // refresh(@JwtStrategyUser() user: JwtStrategyUser) {
  //   return this.authService.refreshTokens(user.id, user.refreshToken);
  // }
}
