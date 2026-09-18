import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { User } from "./Users";

@Entity("situations")
export class Situation {
    @PrimaryGeneratedColumn()
    id!: number;

    //nome da situação
    @Column()
    nameSituation!: string;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    CreatedAt!: Date;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
    updatedAt!: Date;

    @OneToMany(() => User, (user) => user.situation)
    users!: User[];
}