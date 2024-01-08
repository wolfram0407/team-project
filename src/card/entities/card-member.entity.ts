import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Card } from "./card.entity";

@Entity('card_members')
export class CardMember{
  @PrimaryGeneratedColumn({unsigned: true})
  id: number;

 
  
  @ManyToOne((type)=> Card, (card)=> card.cardMember)
  @JoinColumn()
  card: Card;
  @Column({ unsigned: true })
  card_id: number;

}