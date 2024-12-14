import { Inject, Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel, Types } from 'mongoose';
import { Posts, PostsType } from './schemas/post.schema';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { CreatePostDto } from './dto/createPost.dto';
import { ResponseWithMessage } from 'src/utils/interfaces/message.interface';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { UpdateInfoPostDto } from './dto/updatePost.dto';
import { threeHoursInMiliseconds } from 'src/configs';
import { ExceptionsService } from 'src/utils/exceptions.service';
import { SourceTextModule } from 'vm';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Posts.name) private postModel: PaginateModel<PostsType>,
    private i18n: I18nService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private exceptions: ExceptionsService,
  ) {}

  async existsThisPost(name: string): Promise<Boolean> {
    const postMactch: PostsType = await this.postModel.findOne({ name });
    return !!postMactch;
  }
  async getOnePost(name: string): Promise<PostsType> {
    /*  const cacheMatch: string = await this.cacheManager.get(
      'post:' + name.replaceAll(' ', '-'),
    );

    if (cacheMatch) {
      return JSON.parse(cacheMatch);
    } */
    const postMatch: PostsType = await this.postModel
      .findOne({ name })
      .populate('user tags', 'username name _id img');

    if (!postMatch) this.exceptions.throwNotFound('test.posts.notExists');
    /*  await this.cacheManager.set(
      'post:' + postMatch.name.replaceAll(' ', '-'),
      JSON.stringify(postMatch),
      threeHoursInMiliseconds,
    ); */

    return postMatch;
  }
  async getPostOfAnUser(
    userID: Types.ObjectId,
    page: number = 1,
    order: number = 1,
  ) {
    // ? -1 mas nuevo primero
    // ? mas viejo primero
    return await this.postModel.paginate(
      { user: userID },
      {
        page: page,
        limit: 20,
        sort: {
          createdAt: order,
        },
        select: '-user -updatedAt -__v -content',
        populate: {
          path: 'tags',
          select: '_id name',
        },
      },
    );
  }
  async getBestOfAnUser(user: Types.ObjectId, page: number = 1): Promise<any> {
    return await this.postModel.paginate(
      { user },
      {
        limit: 20,
        sort: {
          likeCount: -1,
        },
        page,
        select: '-user -updatedAt -__v -content',
        populate: {
          path: 'tags',
          select: '_id name',
        },
      },
    );
  }
  async search(
    name: string,
    page: number,
    created: number,
    alphabetical: number,
    tags: Array<Types.ObjectId>,
  ): Promise<any> {
    let query: any = {};
    if (name) query = { name: { $regex: name } };
    if (tags) query.tags = tags;
    return await this.postModel.paginate(query, {
      limit: 30,
      page,
      sort: {
        createdAt: created,
        name: alphabetical,
      },
      select: '-user -updatedAt -__v -content',
      populate: {
        path: 'tags',
        select: '_id name',
      },
    });
  }
  async updateInfoPost(
    name: string,
    updatePostData: UpdateInfoPostDto,
  ): Promise<ResponseWithMessage> {
    if (Object.keys(updatePostData).length <= 0)
      throw new NotAcceptableException(
        this.i18n.t('test.posts.minLengthUpdate', {
          lang: I18nContext.current().lang,
        }),
      );

    if (
      !!updatePostData.name &&
      (await this.existsThisPost(updatePostData.name))
    )
      this.exceptions.throwConflict('test.posts.alreadyExists');

    const updatedPost: PostsType = await this.postModel.findOneAndUpdate(
      { name },
      updatePostData,
      { new: true },
    );

    return {
      message: this.i18n.t('test.posts.updated', {
        lang: I18nContext.current().lang,
      }),
    };
  }
  async deletePost(
    name: string,
    user: Types.ObjectId,
  ): Promise<ResponseWithMessage> {
    const deletedPost: PostsType = await this.postModel.findOneAndDelete({
      name,
    });
    await this.cacheManager.del(
      'post:' + deletedPost.name.replaceAll(' ', '-'),
    );
    return {
      message: this.i18n.t('test.posts.deleted', {
        lang: I18nContext.current().lang,
      }),
    };
  }
  async createPost(
    postData: CreatePostDto,
    userID: Types.ObjectId,
  ): Promise<ResponseWithMessage> {
    if (await this.existsThisPost(postData.name))
      this.exceptions.throwConflict('test.posts.alreadyExists');
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
  async modifyLikeCount(postId: Types.ObjectId, value: number): Promise<void> {
    await this.postModel
      .findByIdAndUpdate(postId, { $inc: { likeCount: value } })
      .exec();
    return;
  }
}
