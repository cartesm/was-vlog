import {
  CanActivate,
  ExecutionContext,
  ImATeapotException,
  Injectable,
  NotAcceptableException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserRequest } from 'src/auth/interfaces/userRequest.interface';
import { CommentsService } from '../comments.service';
import { CommentType } from '../schemas/comments.schema';
import { isValidObjectId, Types } from 'mongoose';
import { I18nContext, I18nService } from 'nestjs-i18n';

@Injectable()
export class ValidateUserGuard implements CanActivate {
  constructor(
    private commentService: CommentsService,
    private i18n: I18nService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: UserRequest = context.switchToHttp().getRequest();

    const { id: userId } = req.user;
    const { id } = req.params;

    //TODO: cambiar esto despues
    if (!isValidObjectId(id)) throw new NotAcceptableException('id mala');

    const commentMatch: CommentType = await this.commentService.findOneComment(
      id,
      userId,
    );
    if (!commentMatch)
      throw new ImATeapotException(
        this.i18n.t('test.auth.notMainUser', {
          lang: I18nContext.current().lang,
        }),
      );

    return true;
  }
}
