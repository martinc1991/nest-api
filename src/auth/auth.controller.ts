import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtStrategyUser, LocalStrategyUser } from './common/decorators';
import { JwtAuthGuard, LocalAuthGuard } from './common/guards';
import { AuthDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  signup(@Body() dto: AuthDto) {
    return this.authService.signup(dto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  @HttpCode(HttpStatus.OK)
  signin(@LocalStrategyUser() user: LocalStrategyUser) {
    return this.authService.signin({ email: user.email, id: user.id });
  }

  @UseGuards(JwtAuthGuard)
  @Post('signout')
  @HttpCode(HttpStatus.OK)
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
