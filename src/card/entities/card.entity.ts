import { IsNotEmpty } from "class-validator";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Card {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  list_id: number;

  @IsNotEmpty({message: "title을 입력해주세요"})
  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  member:string;
  
  @Column()
  notice:boolean;
  
  @Column()
  label: string;

  @Column()
  start_date: Date;
  
  @Column()
  end_date: Date;

  @Column()
  image_path: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

}
