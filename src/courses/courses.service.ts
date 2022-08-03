import { HttpException, Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course } from './entities/course.entity';
import { Tag } from './entities/tag.entity';

@Injectable()
export class CoursesService {
  constructor(
    @Inject('COURSE_REPOSITORY')
    private readonly coursesRepository: Repository<Course>,
    @Inject('TAG_REPOSITORY')
    private readonly tagsRepositoy: Repository<Tag>,
  ) {}

  async findAll() {
    return await this.coursesRepository.find({
      relations: ['tags'],
    });
  }

  async findOne(id: number) {
    const course = await this.coursesRepository.findOne({
      where: { id },
      relations: ['tags'],
    });

    if (!course) {
      throw new HttpException('Curso não encontrado', 404);
    }

    return course;
  }

  async create(createCourseDto: CreateCourseDto) {
    const tags = await Promise.all(
      createCourseDto.tags.map((name) => this.preloadTagByName(name)),
    );
    const course = this.coursesRepository.create({
      ...createCourseDto,
      tags,
    });

    console.log(course);
    return await this.coursesRepository.save(course);
  }

  async update(id: number, updateCourseDto: UpdateCourseDto) {
    const tags =
      updateCourseDto.tags &&
      (await Promise.all(
        updateCourseDto.tags.map((name) => this.preloadTagByName(name)),
      ));
    const course = await this.coursesRepository.preload({
      id: +id,
      ...updateCourseDto,
      tags,
    });

    return await this.coursesRepository.save(course);
  }

  async remove(id: number) {
    const course = await this.coursesRepository.findOne({
      where: { id },
    });

    return this.coursesRepository.remove(course);
  }

  private async preloadTagByName(name: string): Promise<Tag> {
    const tag = await this.tagsRepositoy.findOne({
      where: {
        name,
      },
    });

    if (tag) {
      return tag;
    }

    return this.tagsRepositoy.create({
      name,
    });
  }
}
