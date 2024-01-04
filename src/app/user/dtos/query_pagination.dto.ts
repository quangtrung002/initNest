import { factorySpecificationQueryDto } from "src/base/dtos/query-specification.dto";

export class QueryUserDto extends factorySpecificationQueryDto({
  searchFields : ['username'],
  filterExample : {
    username : "Trung bin"
  }
}){}