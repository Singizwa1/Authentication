import { Sequelize,Model,DataTypes } from "sequelize";

interface BlogAttribute{
    id:string,
    slug: string,
    title: string,
    author: string,
    content: string,
    isPublished: boolean,
    description?: string,
    createdAt?: Date
    updatedAt?: Date
    deletedAt: Date|null

}

export interface BlogCreationAttribute extends Omit<BlogAttribute, 'id'> {
    id?: string
}
export class Blog extends Model<BlogAttribute,BlogCreationAttribute> implements BlogAttribute{
 public id!:string;
 public slug!:string;
 public title!: string;
 public author!: string;
 public content!: string;
 public description!: string;
 public isPublished!: boolean;
 public updatedAt!: Date ;
 public createdAt!: Date;
 public deletedAt!: Date | null;
 
 public association(modal:any){

 }


}


