import { PickType } from "@nestjs/swagger";
import { Card } from "../entities/card.entity";

export class MoveCardDto extends PickType(Card, ['position']){
}