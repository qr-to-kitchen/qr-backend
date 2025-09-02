import {
  ArrayNotEmpty,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { CreateOrUpdateBranchDishDto } from './create-or-update-branch-dish.dto';

export class BulkSaveBranchDishes {
  @IsArray({ message: 'Los items deben ser una lista.' })
  @ArrayNotEmpty({ message: 'Los items no pueden estar vacíos.' })
  @ValidateNested({ each: true, message: 'Cada item debe ser válido.' })
  @Type(() => CreateOrUpdateBranchDishDto)
  @ApiProperty({
    example: [
      { id: 1, isAvailable: false },
      { isAvailable: true, customPrice: 10.4, branchId: 4, dishId: 3 }
    ]
  })
  branchDishes: CreateOrUpdateBranchDishDto[];
}