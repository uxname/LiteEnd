import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Basic ')) {
      this.requestCredentials(response);
      throw new UnauthorizedException('Missing Authorization header');
    }

    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials!, 'base64').toString(
      'ascii',
    );
    const [username, password] = credentials.split(':');

    const expectedUsername = this.configService.getOrThrow<string>(
      'LOGS_ADMIN_PANEL_USER',
    );
    const expectedPassword = this.configService.getOrThrow<string>(
      'LOGS_ADMIN_PANEL_PASSWORD',
    );

    if (username !== expectedUsername || password !== expectedPassword) {
      this.requestCredentials(response);
      throw new UnauthorizedException('Invalid credentials');
    }

    return true;
  }

  private requestCredentials(response: Response): void {
    response.setHeader(
      'WWW-Authenticate',
      'Basic realm="Access to the protected resource"',
    );
  }
}
