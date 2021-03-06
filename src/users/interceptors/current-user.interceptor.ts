import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Injectable,
} from '@nestjs/common';
import { UsersService } from '../users.service';

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(private usersService: UsersService) {}

  async intercept(context: ExecutionContext, next: CallHandler<any>) {
    const request = context.switchToHttp().getRequest();
    const { userId } = request.session || {};

    if (userId) {
      // Assign the existed user to the request object to later
      // use in other places that exist outside the Dependency Injection system
      // (for example, a decorator)
      const user = await this.usersService.findOne(userId);
      request.currentUser = user;
    }

    return next.handle();
  }
}
