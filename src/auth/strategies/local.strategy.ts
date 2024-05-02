import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { getMessageFromClassValidatorError } from 'src/lib/errors/class-validator';
import { AuthService } from '../auth.service';
import { AuthDto } from '../dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  // Returns the user object if the credentials are valid and populates req.user with it
  // Any user validation should be done here
  async validate(email: string, password: string) {
    // Validate imputs before sending them to service
    // This happens because Passport strategy is called before controller pipe validation (should only be needed in this case)
    const message = await getMessageFromClassValidatorError(AuthDto, {
      email,
      password,
    });

    if (message) throw new BadRequestException(message);

    const user = await this.authService.validateUser(email, password);

    if (!user) throw new UnauthorizedException();

    return user;
  }
}
