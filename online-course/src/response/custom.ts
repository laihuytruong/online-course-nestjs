import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  NotFoundException,
} from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<any>) {
    return next.handle().pipe(
      map((response) => {
        if (response === undefined) throw new NotFoundException();
        if (response) {
          if (!response.response) {
            const { statusCode, message, data } = response;

            return {
              statusCode:
                statusCode || context.switchToHttp().getResponse().statusCode,
              message,
              data: instanceToPlain(data),
            };
          }
        }
      }),
    );
  }
}
