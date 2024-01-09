import {
  AbilityBuilder,
  AbilityOptionsOf,
  CanParameters,
  ExtractSubjectType,
  InferSubjects,
  MongoAbility,
  createMongoAbility,
} from '@casl/ability';
import { isInstance } from 'class-validator';
import { UserEntity } from 'src/app/user/entities/user.entity';
import * as _ from 'lodash';
import { ForbiddenException } from 'src/base/exceptions/custom.exception';
import { ArticleEntity } from 'src/app/article/entities/article.entity';

export enum Action {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

type Subject = InferSubjects<typeof UserEntity> | typeof ArticleEntity | 'all';

export type AppAbility = MongoAbility<[Action, Subject]>;

export class CaslAbilityFactory {
  createForUser(user: UserEntity) {
    const { build } = this.newAbilityBuilder();
    return this.buildPolicy(build);
  }

  protected newAbilityBuilder(): AbilityBuilder<AppAbility> {
    return new AbilityBuilder<AppAbility>(createMongoAbility);
  }

  protected buildPolicy(
    build: (option: AbilityOptionsOf<AppAbility>) => any,
  ): AppAbility {
    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subject>,
    });
  }

  private getPolicy(userOrPolicy: AppAbility | UserEntity): AppAbility {
    const isUser = isInstance(userOrPolicy, UserEntity);
    return isUser
      ? this.createForUser(userOrPolicy as UserEntity)
      : (userOrPolicy as AppAbility);
  }

  assertAbility(
    userOrPolicy: AppAbility | UserEntity,
    ...[action, subject, field]: CanParameters<any>
  ) {
    const policy = this.getPolicy(userOrPolicy);
    if (!this.hasAbility(userOrPolicy, action, subject, field)) {
      this.throwForbidden(policy, action, subject, field);
    }
  }

  hasAbility(
    userOrPolicy: AppAbility | UserEntity,
    ...[action, subject, field]: CanParameters<any>
  ) {
    const policy = this.getPolicy(userOrPolicy);
    const can = policy.can(action, subject, field);
    const cannot = policy.cannot(action, subject, field);
    return can;
  }

  throwForbidden(
    policy: AppAbility,
    ...[action, subject, field]: CanParameters<any>
  ) {
    const subjectType = policy.detectSubjectType(subject);
    const subjectName = _.snakeCase(_.get(subjectType, 'name')).toUpperCase();
    throw new ForbiddenException(
      `CANNOT_${action.toUpperCase()}_ON_${subjectName}`,
    );
  }
}
