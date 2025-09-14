import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { CreateOrUpdateExtraBranchDishDto } from './create-or-update-extra-branch-dish.dto';

export class BulkSaveExtraBranchDishes {
  @IsArray({ message: 'Los items deben ser una lista.' })
  @ArrayNotEmpty({ message: 'Los items no pueden estar vacíos.' })
  @ValidateNested({ each: true, message: 'Cada item debe ser válido.' })
  @ApiProperty({
    example: [
      { id: 1, isAvailable: false },
      { isAvailable: true, customPrice: 10.4, extraBranchId: 4, branchDishId: 3 }
    ]
  })
  @Type(() => CreateOrUpdateExtraBranchDishDto)
  extraBranchDishes: CreateOrUpdateExtraBranchDishDto[];

  @IsNotEmpty({ message: 'El id del socket es obligatorio.'})
  @ApiProperty({ example: 'string' })
  socketId: string;
}