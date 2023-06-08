import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';

@Entity()
export class User {
 
  @PrimaryGeneratedColumn()
	public id?: number;

  @Column({ name: 'intra_ID', unique: true })
  intraID: string;

  @Column({nullable: true })
	public avatar: string;


  @Column({ unique: true, nullable: true })
	public username: string;

}
export default User;