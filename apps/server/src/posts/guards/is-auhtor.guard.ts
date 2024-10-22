import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UserRequest } from 'src/auth/interfaces/userRequest.interface';
import { PostsService } from '../posts.service';
import { PostsType } from '../schemas/post.schema';
import { ExceptionsService } from 'src/utils/exceptions.service';

@Injectable()
export class IsAuhtorGuard implements CanActivate {
  constructor(
    private postService: PostsService,
    private exceptions: ExceptionsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: UserRequest = context.switchToHttp().getRequest();
    const { user, params } = req;

    const postToUse: PostsType = await this.postService.getOnePost(params.name);
    if (postToUse.user != user.id)
      this.exceptions.throwITeapot('test.auth.notMainUser');

    return true;
  }
}
