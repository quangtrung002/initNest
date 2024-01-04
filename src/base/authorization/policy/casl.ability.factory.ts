import {
  AbilityBuilder,
  AbilityOptionsOf,
  ExtractSubjectType,
  InferSubjects,
  MongoAbility,
  createMongoAbility,
} from '@casl/ability';
import { UserEntity } from 'src/app/user/entities/user.entity';

export enum Action {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

type Subject = InferSubjects<typeof UserEntity> | 'all';

export type AppAbility = MongoAbility<[Action, Subject]>;

export class CaslAbilityFactory {
  createForUser(user: UserEntity) {
    const { build } = this.newAbilityBuilder();
    return this.buildPolicy(build);
  }

  protected newAbilityBuilder(): AbilityBuilder<AppAbility> {
    return new AbilityBuilder<AppAbility>(createMongoAbility);
  }

  protected buildPolicy(build : ((option : AbilityOptionsOf<AppAbility>) => any)) : AppAbility {
    return build({
      detectSubjectType : item => item.constructor as ExtractSubjectType<Subject>
    })
  }
}
