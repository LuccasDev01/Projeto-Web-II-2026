import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"
import { DateUtils } from "typeorm/browser"

@Entity("situations")
export class Situation {
    @PrimaryGeneratedColumn()
    id!: number;
    //nome da situação
    @Column()
    nameSituation!: string;

    @Column({type:"timestamp", default: () => "CURRENT_TIMESTAMP"})
    CreatedAt!: Date;

    @Column({type:"timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP"})
    updatedAt!: Date;

    
    @OneToMany(() => User, (user) => user.situation)
    users!: User[]
}