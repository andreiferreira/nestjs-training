import { DataSource } from 'typeorm';
import { Course } from './entities/course.entity';
import { Tag } from './entities/tag.entity';

export const courseProviders = [
  {
    provide: 'COURSE_REPOSITORY',
    useFactory: (datasource: DataSource) => datasource.getRepository(Course),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'TAG_REPOSITORY',
    useFactory: (datasource: DataSource) => datasource.getRepository(Tag),
    inject: ['DATA_SOURCE'],
  },
];
