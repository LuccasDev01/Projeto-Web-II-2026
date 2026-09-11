import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"
import { DateUtils } from "typeorm/browser"

@Entity("users")
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;
//email do usuário, que deve ser único
    @Column({unique: true})
    email!: string;

     @ManyToOne(() => Situation, (situation) => situation.users)
     @JoinColumn({ name: "situationid" })
    situation!: Situation;

    @Column({type:"timestamp", default: () => "CURRENT_TIMESTAMP"})
    CreatedAt!: Date;

    @Column({type:"timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP"})
    updatedAt!: Date;

    
}