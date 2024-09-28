import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('product')
export class Product {
    @PrimaryColumn('uuid') 
    id!: string;

    @Column()
    platform_id!: string;

    @Column()
    name!: string;

    constructor(id: string, platform_id: string, name: string) {
        this.id = id;
        this.platform_id = platform_id;
        this.name = name;
    }
}