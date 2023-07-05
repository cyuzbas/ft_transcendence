import { Entity, Column, PrimaryGeneratedColumn, JoinTable,
	ManyToMany,
	OneToMany, } from 'typeorm';

@Entity()
export class User {
 
  @PrimaryGeneratedColumn()
	public id?: number;

  @Column({ name: 'intraId', unique: true })
  intraId: string;

  @Column({nullable: true })
	public avatar: string;


  @Column({nullable: true })
	public avatarSmall: string;


  @Column({ nullable: true })
	public username: string;

  @ManyToMany(() => User, { cascade: true })
	@JoinTable({ joinColumn: { name: 'userId' } })
	friends: User[];
}
export default User;