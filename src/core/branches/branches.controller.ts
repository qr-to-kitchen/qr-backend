import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { BranchesService } from './branches.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../security/jwt-auth.guard';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { CreateBranchUserDto } from './dto/create-branch-user.dto';

@Controller('branches')
export class BranchesController {

  constructor(private readonly branchesService: BranchesService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() createBranchDto: CreateBranchDto) {
    return this.branchesService.create(createBranchDto);
  }

  @Post('branch-user')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  createBranchWithUser(@Body() createUserBranchDto: CreateBranchUserDto) {
    return this.branchesService.createBranchWithUser(createUserBranchDto);
  }

  @Get('my')
  @ApiBearerAuth('jwt-auth')
  @UseGuards(JwtAuthGuard)
  getMyBranch(@Request() req: any) {
    return this.branchesService.findByUserId(req.user.id);
  }

  @Get('user/:id')
  getBranchByUserId(@Param('id', new ParseIntPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un número") })) id: number) {
    return this.branchesService.findByUserId(id);
  }

  @Get('restaurant/:id')
  getBranchByRestaurantId(@Param('id', new ParseIntPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un número") })) id: number) {
    return this.branchesService.findByRestaurantId(id);
  }

  @Get(':id')
  getBranchById(@Param('id', new ParseIntPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un número") })) id: number) {
    return this.branchesService.findById(id);
  }

  @Get()
  getAll() {
    return this.branchesService.getAll();
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  updateById(@Param('id', new ParseIntPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un número") })) id: number, @Body() updateBranchDto: UpdateBranchDto) {
    return this.branchesService.updateById(id, updateBranchDto);
  }

  @Put('dailyCode/:id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  refreshDailyCodeByBranchId(@Param('id', new ParseIntPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un número") })) id: number) {
    return this.branchesService.refreshDailyCodeByBranchId(id);
  }

  @Delete(':id')
  deleteById(@Param('id', new ParseIntPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un número") })) id: number) {
    return this.branchesService.deleteById(id);
  }
}
