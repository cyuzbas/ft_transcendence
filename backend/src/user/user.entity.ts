import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, ManyToMany, JoinTable } from 'typeorm';

@Entity()
export class User {
 
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', unsigned: true })
	public id: number;

  @Column({ name: 'intra_ID', unique: true })
  intraID: string;

  @Column({nullable: true })
	public avatar: string;


  @Column({ unique: true, nullable: true })
	public username: string;

  @ManyToMany(() => User, {})
  @JoinTable({
    name: "friendsTable",
    joinColumn: { name: "userId1", referencedColumnName: "id" },
    inverseJoinColumn: { name: "userId2", referencedColumnName: "id" }
  })
  friends: User[];
}

export default {User};