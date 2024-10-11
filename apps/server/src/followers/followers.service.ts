import { ConflictException, HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PaginateModel, Types } from 'mongoose';
import { ResponseWithMessage } from 'src/utils/interfaces/message.interface';
import { Followers, FollowersType } from './schemas/follower.schema';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { Users, UsersType } from 'src/users/schemas/users.schema';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class FollowersService {
  constructor(
    @InjectModel(Followers.name)
    private followersModel: PaginateModel<FollowersType>,
    private i18n: I18nService,
    private userService: UsersService,
  ) {}
  async followUser(
    user: Types.ObjectId,
    you: Types.ObjectId,
  ): Promise<ResponseWithMessage> {
    const follow: FollowersType = await this.followersModel.findOne({
      user,
      follower: you,
    });
    if (follow)
      throw new ConflictException(
        this.i18n.t('test.followers.exists', {
          lang: I18nContext.current().lang,
        }),
      );

    await new this.followersModel({ user, follower: you }).save();

    return {
      message: this.i18n.t('test.followers.follow', {
        lang: I18nContext.current().lang,
      }),
    };
  }

  async isFollow(follower: Types.ObjectId, you?: Types.ObjectId) {
    const followMatch: FollowersType = await this.followersModel.findOne({
      user: follower,
      follower: you,
    });
    const user = await this.userService.getPublicUserData(follower);
    if (!followMatch) return { user, isFollow: false };
    return { user, isFollow: true };
  }

  async unfollowUser(
    you: Types.ObjectId,
    user: Types.ObjectId,
  ): Promise<ResponseWithMessage> {
    await this.followersModel.findOneAndDelete({
      user,
      follower: you,
    });
    return {
      message: this.i18n.t('test.followers.unfollow', {
        lang: I18nContext.current().lang,
      }),
    };
  }

  async deleteFollower(
    you: Types.ObjectId,
    user: Types.ObjectId,
  ): Promise<ResponseWithMessage> {
    await this.followersModel.findOneAndDelete({
      user: you,
      follower: user,
    });

    return {
      message: this.i18n.t('test.followers.deleteFollower'),
    };
  }

  async getFollowers(page: number, user: Types.ObjectId) {
    return await this.followersModel.paginate(
      {
        user,
      },
      {
        page,
        limit: 50,
        sort: { createdAt: -1 },
        populate: {
          path: 'user follower',
          select: 'username img createdAt',
        },
      },
    );
  }
  async getUserFollings(page: number, user: Types.ObjectId) {
    return await this.followersModel.paginate(
      {
        follower: user,
      },
      {
        page,
        limit: 50,
        sort: { createdAt: -1 },
        populate: {
          path: 'user follower',
          select: 'username img createdAt',
        },
      },
    );
  }
}
