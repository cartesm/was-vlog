import {
  CanActivate,
  ExecutionContext,
  ImATeapotException,
  Injectable,
} from '@nestjs/common';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { Observable } from 'rxjs';
import { UserRequest } from 'src/auth/interfaces/userRequest.interface';
import { PostsService } from '../posts.service';
import { PostsType } from '../schemas/post.schema';

@Injectable()
export class IsAuhtorGuard implements CanActivate {
  constructor(
    private i18n: I18nService,
    private postService: PostsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: UserRequest = context.switchToHttp().getRequest();
    const { user, params } = req;

    const postToUse: PostsType = await this.postService.getOnePost(params.name);
    if (postToUse.user != user.id)
      throw new ImATeapotException(
        this.i18n.t('test.auth.notMainUser', {
          lang: I18nContext.current().lang,
        }),
      );

    return true;
  }
}
