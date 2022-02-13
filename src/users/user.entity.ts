import { Report } from '../reports/report.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: false })
  admin: boolean;

  // First argument solves the circular reference issue.
  // We can't refer to the Report entity if this User entity is loaded first.
  // The first argument means that some point in time after loading,
  // Report entity will be available and can be referred to.
  // Second argument solves the multiple reference issue.
  // For example, when we need to refer the User entity in 2 different
  // type of associations.
  @OneToMany(() => Report, (report) => report.user)
  reports: Report[];
}
