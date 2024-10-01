import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel, Types } from 'mongoose';
import { Posts, PostsType } from './schemas/post.schema';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { CreatePostDto } from './dto/createPost.dto';
import { ResponseWithMessage } from 'src/utils/interfaces/message.interface';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Posts.name) private postModel: PaginateModel<PostsType>,
    private i18n: I18nService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async existsThisPost(name: string): Promise<Boolean> {
    const postMactch: PostsType = await this.postModel.findOne({ name });
    return !!postMactch;
  }

  async getOnePost(name: string): Promise<PostsType> {
    const cacheMatch: string = await this.cacheManager.get(
      'post:' + name.replaceAll(' ', '-'),
    );
    if (cacheMatch) return JSON.parse(cacheMatch);

    const postMatch: PostsType = await this.postModel.findOne({ name });

    if (!postMatch)
      throw new NotFoundException(
        this.i18n.t('test.posts.notExists', {
          lang: I18nContext.current().lang,
        }),
      );
    await this.cacheManager.set(
      'post:' + name.replaceAll(' ', '-'),
      JSON.stringify(postMatch),
    );
    return postMatch;
  }

  async getPostOfAnUser(
    userID: Types.ObjectId,
    page: number = 1,
    order: number = 1,
  ) {
    await this.postModel.paginate(
      { user: userID },
      {
        page: page,
        limit: 20,
        sort: {
          createdAt: order,
        },
      },
    );
  }

  async createPost(
    postData: CreatePostDto,
    userID: Types.ObjectId,
  ): Promise<ResponseWithMessage> {
    if (await this.existsThisPost(postData.name))
      throw new ConflictException(
        this.i18n.t('test.posts.alreadyExists', {
          lang: I18nContext.current().lang,
        }),
      );
    const newPost: PostsType = await new this.postModel({
      ...postData,
      user: userID,
    }).save();

    await this.cacheManager.set(
      'post:' + newPost.name.replaceAll(' ', '-'),
      JSON.stringify(newPost),
    );
    return {
      message: this.i18n.t('test.posts.created', {
        lang: I18nContext.current().lang,
      }),
    };
  }
}
