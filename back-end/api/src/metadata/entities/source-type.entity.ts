import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity("source_types")
export class SourceTypeEntity {
    @PrimaryColumn({type: "int"})
    id: number;

    @Column({type: "varchar"})
    name: string;

    @Column({type: "varchar"})
    description: string;

}