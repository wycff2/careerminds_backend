import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '@app/app/user/user.service';

@Injectable()
export class TokenAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService, private userService: UserService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const headers = request.headers;
    const token = headers['x-access-token'] as string;

    if (!token) {
      throw new UnauthorizedException('token is required');
    }
    try {
      const decoded = this.jwtService.verify(token);

      const user = await this.userService.getById(decoded['_id']);

      if (!user) {
        throw new Error('Invalid user');
      }

      request['user'] = user;

      return true;
    } catch (Err) {
      throw new UnauthorizedException(Err.message ?? 'Unauthorized');
    }
  }
}
