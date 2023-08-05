import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { User } from '../../../entities/user.entity';

export const GetRequest = createParamDecorator((_data, context: ExecutionContext): Promise<User> => {
  return context.switchToHttp().getRequest();
});
