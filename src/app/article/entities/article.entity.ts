import { UserEntity } from 'src/app/user/entities/user.entity';
import { BaseEntity } from 'src/base/entities/common.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('articles')
export class ArticleEntity extends BaseEntity {
  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'varchar' })
  description?: string;

  @Column({ type: 'int' })
  user_id: number;

  @ManyToOne(() => UserEntity, (user) => user.articles)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
