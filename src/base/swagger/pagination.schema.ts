import { ApiProperty } from "@nestjs/swagger"

export const defaulPayload = {
  success : true,
  errorCode : '000000',
  msg : '',
}

export class PaginatedMeta{
  @ApiProperty()
  total : number; 

  @ApiProperty()
  per_page : number;

  @ApiProperty()
  current_page : number;

  @ApiProperty()
  last_page : number;

  @ApiProperty()
  from : number;

  @ApiProperty()
  to : number;
}

export class PaginatedResult<TData>{
  @ApiProperty()
  data : TData

  @ApiProperty()
  pagination : PaginatedMeta

  
}