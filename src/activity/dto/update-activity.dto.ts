import { PickType } from "@nestjs/mapped-types";
import { CreateActivityDto } from "./create-activity.dto";

export class UpdateActivityDto extends PickType(CreateActivityDto) {
  "content";
}
