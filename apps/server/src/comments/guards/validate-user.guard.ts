import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UserRequest } from 'src/auth/interfaces/userRequest.interface';
import { CommentsService } from '../comments.service';
import { CommentType } from '../schemas/comments.schema';
import { isValidObjectId } from 'mongoose';
import { ExceptionsService } from 'src/utils/exceptions.service';

@Injectable()
export class ValidateUserGuard implements CanActivate {
  constructor(
    private commentService: CommentsService,
    private exceptions: ExceptionsService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: UserRequest = context.switchToHttp().getRequest();

    const { id: userId } = req.user;
    const { id } = req.params;

    if (!isValidObjectId(id))
      this.exceptions.throwNotAceptable('test.idNotAcceptable');

    const commentMatch: CommentType = await this.commentService.findOneComment(
      id,
      userId,
    );
    if (!commentMatch) this.exceptions.throwITeapot('test.auth.notMainUser');

    return true;
  }
}
