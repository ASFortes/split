import { Injectable, Inject } from '@nestjs/common';
import { compare } from '../../../libs/utils/bcrypt';
import { TYPES } from '../../users/interfaces/types';
import { GetUserService } from '../../users/interfaces/services/get.user.service.interface';
import { ValidateUserAuthService } from '../interfaces/services/validate-user.auth.service.interface';

@Injectable()
export default class ValidateUserAuthServiceImpl
  implements ValidateUserAuthService
{
  constructor(
    @Inject(TYPES.services.GetUserService)
    private getUserService: GetUserService,
  ) {}

  public async validateUserWithCredentials(
    email: string,
    plainTextPassword: string,
  ) {
    const user = await this.getUserService.getByEmail(email);
    if (!user) return null;
    const passwordsMatch = await this.verifyPassword(
      plainTextPassword,
      user.password,
    );
    if (!passwordsMatch) return null;
    return user;
  }

  public validateUserById(userId: string) {
    return this.getUserService.getById(userId);
  }

  public validateUserByRefreshToken(authorization: string, userId: string) {
    const refreshToken = authorization.replace('Bearer', '').trim();
    return this.getUserService.getUserIfRefreshTokenMatches(
      refreshToken,
      userId,
    );
  }

  private async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ) {
    const isPasswordMatching = await compare(plainTextPassword, hashedPassword);
    if (!isPasswordMatching) return null;
    return isPasswordMatching;
  }
}
