import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}
  @Get('/')
  async findAll(@Res() response: Response) {
    const courses = await this.coursesService.findAll();
    return response.status(200).json(courses);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() response: Response) {
    const course = await this.coursesService.findOne(Number(id));
    return response.status(200).json(course);
  }

  @Post('/')
  async create(@Body() createCourseDto: CreateCourseDto) {
    return await this.coursesService.create(createCourseDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCourseDto: UpdateCourseDto,
    @Res() response: Response,
  ) {
    const updatedCourse = await this.coursesService.update(
      Number(id),
      updateCourseDto,
    );
    return response.status(200).json(updatedCourse);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.coursesService.remove(Number(id));
  }
}
