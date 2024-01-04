import { DeepPartial, Not, Repository, SelectQueryBuilder } from 'typeorm';
import { BaseEntity } from '../entities/common.entity';
import { validate, ValidatorOptions } from 'class-validator';
import { Status } from 'src/base/constants/status';
import { CustomException, NotFoundException } from 'src/base/exceptions/custom.exception';
import { HttpStatusCode } from 'axios';

export class CommonService<T extends BaseEntity> {
  constructor(repository?: Repository<T>) {
    if (repository) {
      this.repository = repository;
    }
  }

  protected limit: number = 20;
  protected page: number = 1;
  protected aliasName: string = '';
  protected repository: Repository<T>;
  protected cache: boolean = false;
  protected hasStatusField = true;
  protected softDelete = true;

  public async findAll(
    currentUser,
    params,
    isPaginate: boolean,
  ): Promise<any> {
    let pagination = {};
    let query = this.repository.createQueryBuilder(this.aliasName);

    const select = this._selectFields(params);
    if (select.length > 0) {
      query.select(select);
    }
    if (this.cache) {
      query.cache(this.cache);
    }
    if (isPaginate) {
      if (!params['excludeCountItem']) {
        const total = await query.getCount();
        pagination = await this.paginate(params, total);
      } else {
        this.limit = params.limit && params.limit > 0 ? params.limit : 20;
        this.page = params.page && params.page > 0 ? params.page : 1;
      }

      let offset = this.limit * (this.page - 1);
      offset = offset > 0 ? offset : 0;
      query.skip(offset).take(this.limit);
    }

    const result = await query.getMany();
    return {
      data: result,
      pagination,
    };
  }

  public async view(currentUser, id: number, params): Promise<any> {
    let query: SelectQueryBuilder<T> = await this.repository.createQueryBuilder(
      this.aliasName,
    );

    const select = this._selectFields(params);
    if (select.length > 0) {
      const selectInView = this._viewSelectFields();
      query.select([...select, ...selectInView]);
    }
    query.andWhere(this.aliasName + '.id = :paramId', { paramId: id });
    query = await this._joinRelation(query, params);
    query = await this._viewJoinRelation(query);
    query = await this._filterByUser(currentUser, query);

    let results = await query.getOne();
    if (!results) {
      throw new NotFoundException();
    }
    return results;
  }

  public async create(currentUser, data: DeepPartial<T>): Promise<any> {
    const dataEntity = this._beforeInsertData(currentUser, data);

    const entity: T = this.repository.create(dataEntity);
    const dataAlreadyExist = await this._checkDataExist(
      currentUser,
      null,
      data,
    );
    if (!dataAlreadyExist.success) {
      throw new CustomException(dataAlreadyExist.errorCode);
    }

    const response = await this.repository.save(entity);

    return { id: response['id'] };
  }

  /**
   * Update record
   * @param currentUser
   * @param id
   * @param data
   */
  public async update(
    currentUser,
    id: number,
    data: DeepPartial<T> | T,
  ): Promise<any> {
    const dataEntity = this._beforeUpdateData(currentUser, data);
    const select = this._selectFields({});

    let query = this.repository.createQueryBuilder(this.aliasName);
    query = query.select(select);
    query.where(this.aliasName + '.id = :paramId', { paramId: id });
    const entity = await query.getOne();

    if (!entity) {
      throw new CustomException(
        'Data not found',
        false,
        HttpStatusCode.NotFound,
      );
    }

    this.repository.merge(entity, dataEntity);

    const dataAlreadyExist = await this._checkDataExist(currentUser, id, data);
    if (!dataAlreadyExist.success) {
      throw new CustomException(dataAlreadyExist.errorCode);
    }

    entity['updatedAt'] = this.getCurrentTime();
    await this.repository.save(entity);

    throw new CustomException('Update seccessfully', true, HttpStatusCode.Ok);
  }

  /**
   * Delete record
   * @param currentUser
   * @param id
   */
  public async delete(currentUser, id: number): Promise<any> {
    const select = this._selectFields({});

    let query = this.repository.createQueryBuilder(this.aliasName);
    query = query.select(select);
    query.where(this.aliasName + '.id = :paramId', { paramId: id });

    const entity = await query.getOne();
    if (!entity) {
      throw new CustomException(
        'Data not found',
        false,
        HttpStatusCode.NotFound,
      );
    }

    if (entity['status'] === Status.DELETED) {
      throw new CustomException(
        'Sorry. Your account has been deleted. Please contact admin to reopen!',
        false,
      );
    }

    if (!this.softDelete || !this.hasStatusField) {
      await this.repository.delete(+id);
    } else {
      entity['status'] = Status.DELETED;

      await this.repository.save(entity);
    }

    throw new CustomException('Delete seccessfully', true, HttpStatusCode.Ok);
  }

  public async paginate(params, $total): Promise<any> {
    let $from = 0,
      $lastPage = 0,
      $to = this.limit - 1;
    if (params.limit && params.limit > 0) {
      this.limit = parseInt(params.limit);
    } else {
      this.limit = 20;
    }
    if (this.limit) {
      $lastPage = Math.ceil($total / this.limit);
    }
    if (params.page && params.page > 0) {
      this.page = parseInt(params.page);
      if (this.page > $lastPage) {
        this.page = $lastPage;
      }
    } else {
      this.page = 1;
    }

    if (this.page >= 1) {
      $from = this.limit * (this.page - 1);
      $to = this.limit + $from - 1;
    }
    if ($to >= $total) {
      $to = $total - 1;
    }

    return {
      total: $total,
      per_page: this.limit,
      current_page: this.page,
      last_page: $lastPage,
      from: $from,
      to: $to > 0 ? $to : 0,
    };
  }

  protected async validate(entity: T, options?: ValidatorOptions) {
    const validateErr = {
      validationError: {
        target: true,
        value: false,
      },
    };
    const errors = await validate(entity, {
      ...validateErr,
      options,
    } as ValidatorOptions);

    if (errors.length > 0) {
      return {
        success: false,
        error: Object.values(errors[0].constraints)[0],
      };
    }

    return {
      success: true,
      error: '',
    };
  }

  protected _beforeInsertData(currentUser, data: DeepPartial<T> | T) {
    data['createdAt'] = this.getCurrentTime();
    data['updatedAt'] = this.getCurrentTime();
    return data;
  }

  public async _afterInsert(currentUser, data: DeepPartial<T>) {
    data.createdAt = this.getCurrentTime();
    data.updatedAt = this.getCurrentTime();
    return data;
  }

  public async _checkDataExist(
    currentUser,
    id,
    data: DeepPartial<T>,
  ): Promise<any> {
    return {
      success: true,
    };
  }

  public async _checkFieldExist($value, $field, $id) {
    const $where = {};
    $where[$field] = $value;
    if ($id) {
      $where['id'] = Not($id);
    }
    const $count = await this.repository.count({
      where: $where,
    });

    return $count > 0;
  }

  public _filterSelect() {
    const arr = this._selectFields({});
    return arr.filter(
      (item) =>
        !item.includes('status') &&
        !item.includes('createdAt') &&
        !item.includes('updatedAt'),
    );
  }

  protected _selectFields(param: {}) {
    return [];
  }

  protected _viewSelectFields() {
    return [];
  }

  protected async _checkViewRecord(results, currentUser, params) {
    return false;
  }

  protected _joinRelation(queryBuilder: SelectQueryBuilder<T>, params = {}) {
    return queryBuilder;
  }

  protected _filterByUser(
    currentUser,
    queryBuilder: SelectQueryBuilder<T>,
    params = {},
  ) {
    return queryBuilder;
  }

  protected _viewJoinRelation(queryBuilder: SelectQueryBuilder<T>) {
    return queryBuilder;
  }

  protected _orderList(query, params): any {
    return query;
  }

  protected async _formatViewResponse($is, $data, params) {
    return $data;
  }

  protected _beforeUpdateData(currentUser, data: DeepPartial<T> | T) {
    return data;
  }

  protected async _afterSaveData($id: number, $entity, $data) {
    return {};
  }

  protected async _afterDeleteData($id: number, $entity) {
    return {};
  }

  protected async _checkDataBeforeDelete(currentUser, entity) {
    return {
      success: true,
    };
  }

  public showError() {
    return {
      success: false,
      error: 'Dữ liệu không hợp lệ, bạn vui lòng kiểm tra lại!',
    };
  }

  public getCurrentTime() {
    return new Date();
  }
}
