import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { LineItem } from './LineItem';

@Entity('order')
export class Order {
    @PrimaryColumn('uuid')
    id: string;

    @Column()
    platform_id: string;

    @OneToMany(() => LineItem, (lineItem) => lineItem.order, { cascade: true })
    line_items!: LineItem[]; 

    constructor(id: string, platform_id: string) {
        this.id = id;
        this.platform_id = platform_id;
    }
}