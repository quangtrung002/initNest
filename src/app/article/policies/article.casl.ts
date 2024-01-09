import { Injectable } from '@nestjs/common';
import { UserEntity } from 'src/app/user/entities/user.entity';
import {
  Action,
  AppAbility,
  CaslAbilityFactory,
} from 'src/base/authorization/policy/casl.ability.factory';
import { ArticleEntity } from '../entities/article.entity';

@Injectable()
export class ArticleCasl extends CaslAbilityFactory {
  createForUser(user: UserEntity): AppAbility {
    const { can, cannot, build } = this.newAbilityBuilder();
    
    can(Action.Update, ArticleEntity, {user_id : user.id} )
    return this.buildPolicy(build);
  }
}
