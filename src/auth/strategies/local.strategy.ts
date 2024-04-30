import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  // Returns the user object if the credentials are valid and populates req.user with it
  // Any user validation should be done here
  async validate(email: string, password: string) {
    const user = await this.authService.validateUser(email, password);

    if (!user) throw new UnauthorizedException();

    return user;
  }
}
