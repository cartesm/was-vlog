import { Inject, Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AggregatePaginateModel, Types } from 'mongoose';
import { Posts, PostsType } from './schemas/post.schema';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { CreatePostDto } from './dto/createPost.dto';
import { ResponseWithMessage } from 'src/utils/interfaces/message.interface';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { UpdateInfoPostDto } from './dto/updatePost.dto';
import { ExceptionsService } from 'src/utils/exceptions.service';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Posts.name)
    private postModel: AggregatePaginateModel<PostsType>,
    private i18n: I18nService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private exceptions: ExceptionsService,
  ) {}

  async existsThisPost(name: string): Promise<Boolean> {
    const postMactch: PostsType = await this.postModel.findOne({ name });
    return !!postMactch;
  }
  async getOnePost(name: string, userId?: Types.ObjectId): Promise<any> {
    const postMatch: any = await this.postModel.aggregate([
      {
        $match: {
          name,
        },
      },
      {
        $lookup: {
          from: 'postlikes',
          let: {
            localId: { $toString: '$_id' },
          },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$post', '$$localId'] },
              },
            },
            {
              $project: { userId: 1 }, // Solo incluir userId para optimizar
            },
          ],
          as: 'likeCount',
        },
      },
      {
        $addFields: {
          like: userId
            ? {
                $in: [
                  userId,
                  {
                    $map: {
                      input: '$likeCount',
                      as: 'likes',
                      in: '$$likes.userId',
                    },
                  },
                ],
              }
            : false,
          likeCount: {
            $size: '$likeCount',
          },
        },
      },
    ]);
    if (postMatch?.length <= 0)
      this.exceptions.throwNotFound('test.posts.notExists');
    return (
      await this.postModel.populate(postMatch, {
        path: 'user tags',
        select: 'username name _id img',
      })
    )[0];
  }
  async getPostOfAnUser({
    postOf,
    userId,
    page,
    order,
    best,
  }: {
    postOf: Types.ObjectId;
    userId: Types.ObjectId;
    page: number;
    order: number;
    best: number;
  }) {
    // ? -1 mas nuevo primero
    // ? mas viejo primero
    const aggregate = this.postModel.aggregate([
      {
        $match: {
          user: postOf,
        },
      },
      {
        $lookup: {
          from: 'postlikes',
          let: {
            localId: { $toString: '$_id' },
          },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$post', '$$localId'] },
              },
            },
            {
              $project: { userId: 1 },
            },
          ],
          as: 'likeCount',
        },
      },
      {
        $lookup: {
          from: 'comments',
          let: {
            localId: { $toString: '$_id' },
          },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$post', '$$localId'] },
              },
            },
            {
              $project: { userId: 1 },
            },
          ],
          as: 'commentCount',
        },
      },
      {
        $addFields: {
          likeCount: {
            $size: '$likeCount',
          },
          commentCount: {
            $size: '$commentCount',
          },
          like: userId
            ? {
                $in: [
                  userId,
                  {
                    $map: {
                      input: '$likeCount',
                      as: 'likes',
                      in: '$$likes.userId',
                    },
                  },
                ],
              }
            : false,
        },
      },
      {
        $lookup: {
          from: 'users',
          let: {
            userId: { $toObjectId: '$user' },
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$_id', '$$userId'],
                },
              },
            },
            {
              $project: {
                _id: 1,
                username: 1,
                name: 1,
                img: 1,
              },
            },
          ],
          as: 'user',
        },
      },
      {
        $unwind: {
          path: '$user',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'tags',
          let: {
            tagId: '$tags',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: [
                    '$_id',
                    {
                      $map: {
                        input: '$$tagId',
                        as: 'tagId',
                        in: { $toObjectId: '$$tagId' },
                      },
                    },
                  ],
                },
              },
            },
            {
              $project: {
                name: 1,
                _id: 1,
              },
            },
          ],
          as: 'tags',
        },
      },
    ]);
    return await this.postModel.aggregatePaginate(aggregate, {
      page,
      limit: 20,
      sort:
        best == -1
          ? {
              likeCount: best,
            }
          : {
              createdAt: order,
            },
    });
  }
  async search(
    name: string,
    page: number,
    created: number,
    alphabetical: number,
    tags: Array<Types.ObjectId>,
    userId: Types.ObjectId,
  ): Promise<any> {
    const query: any = {
      name: { $regex: name, $options: 'i' },
      ...(tags?.length > 0 && { tags: { $all: tags } }),
    };
    const aggregate = this.postModel.aggregate([
      {
        $match: query,
      },
      {
        $lookup: {
          from: 'postlikes',
          let: {
            localId: { $toString: '$_id' },
          },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$post', '$$localId'] },
              },
            },
            {
              $project: { userId: 1 },
            },
          ],
          as: 'likeCount',
        },
      },
      {
        $lookup: {
          from: 'comments',
          let: {
            localId: { $toString: '$_id' },
          },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$post', '$$localId'] },
              },
            },
            {
              $project: { userId: 1 },
            },
          ],
          as: 'commentCount',
        },
      },
      {
        $addFields: {
          likeCount: {
            $size: '$likeCount',
          },
          commentCount: {
            $size: '$commentCount',
          },
          like: userId
            ? {
                $in: [
                  userId,
                  {
                    $map: {
                      input: '$likeCount',
                      as: 'likes',
                      in: '$$likes.userId',
                    },
                  },
                ],
              }
            : false,
        },
      },
      {
        $lookup: {
          from: 'users',
          let: {
            userId: { $toObjectId: '$user' },
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$_id', '$$userId'],
                },
              },
            },
            {
              $project: {
                _id: 1,
                username: 1,
                name: 1,
                img: 1,
              },
            },
          ],
          as: 'user',
        },
      },
      {
        $unwind: {
          path: '$user',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'tags',
          let: {
            tagId: '$tags',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: [
                    '$_id',
                    {
                      $map: {
                        input: '$$tagId',
                        as: 'tagId',
                        in: { $toObjectId: '$$tagId' },
                      },
                    },
                  ],
                },
              },
            },
            {
              $project: {
                name: 1,
                _id: 1,
              },
            },
          ],
          as: 'tags',
        },
      },
    ]);
    return await this.postModel.aggregatePaginate(aggregate, {
      page,
      limit: 20,
      sort: {
        createdAt: created,
        name: alphabetical,
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
      {
        ...updatePostData,
        tags: !updatePostData.tags ? [] : updatePostData.tags,
      },
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

  async getMetadata(postName: string): Promise<PostsType> {
    const postMatch: PostsType = await this.postModel
      .findOne({ name: postName })
      .populate('user tags', 'username _id name')
      .select('languaje tags _id name description user');
    if (!postMatch) this.exceptions.throwNotFound('test.posts.notExists');
    return postMatch;
  }
}
