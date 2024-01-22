import {
  Action,
  AppAbility,
  CaslAbilityFactory,
} from 'src/base/authorization/policy/casl.ability.factory';
import { ArticleEntity } from '../entities/article.entity';
import { User } from 'src/auth/interfaces/user.class';
import { Injectable } from '@nestjs/common';
import { RoleGroup } from 'src/base/authorization/role/role.enum';

@Injectable()
export class ArticleCasl extends CaslAbilityFactory {
  createForUser(user: User): AppAbility {
    const { can, cannot, build } = this.newAbilityBuilder();

    can(Action.Create, 'all', { isPublished: false });
    can([Action.Update, Action.Read], ArticleEntity, { user_id: user.id });
    can(Action.Delete, ArticleEntity, { isPublished: false });
    if (RoleGroup.Admins.some((role) => user.role === role)) {
      can(Action.Manage, ArticleEntity);
    }
    return this.buildPolicy(build);
  }
}
