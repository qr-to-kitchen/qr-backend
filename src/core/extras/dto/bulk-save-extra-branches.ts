import {
  ArrayNotEmpty,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { CreateExtraBranchDto } from './create-extra-branch.dto';

export class BulkSaveExtraBranches {
  @IsArray({ message: 'Los items deben ser una lista.' })
  @ArrayNotEmpty({ message: 'Los items no pueden estar vacíos.' })
  @ValidateNested({ each: true, message: 'Cada item debe ser válido.' })
  @Type(() => CreateExtraBranchDto)
  @ApiProperty({
    example: [
      { id: 1, isAvailable: false },
      { isAvailable: true, customPrice: 10.4, extraBranchId: 4, branchDishId: 3 }
    ]
  })
  extraBranches: CreateExtraBranchDto[];
}