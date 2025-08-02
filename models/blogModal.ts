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
 
 public static associate(models: any) {
        Blog.hasMany(models.Comment, {
            foreignKey: 'blogId',
            as: 'comments'
        });
        Blog.hasMany(models.Like, {
            foreignKey: 'blogId',
            as: 'likes'
        });
        Blog.belongsTo(models.User, {
            foreignKey: 'author',
            targetKey: 'email',
            as: 'authorDetails'
        });
    }

}

export const BlogModal=(sequelize:Sequelize)=>{
    Blog.init(
        {
            id:{
            type:DataTypes.UUID,
            defaultValue:DataTypes.UUIDV4,
            primaryKey:true,
            },
            slug:{
                type:DataTypes.STRING,
                allowNull:false,
                unique:true,
            },
            title:{
             type:DataTypes.STRING,
             allowNull:false,
            },
            author:{
                   type:DataTypes.STRING,
                   allowNull:false,
            },

            content:{
                type:DataTypes.TEXT,
                allowNull:false,
            },
            description:{
                type:DataTypes.TEXT,
                allowNull:true,
            },
            isPublished:{
                type:DataTypes.BOOLEAN,
                defaultValue:false,
                allowNull:false,
            }
        } as any,
       {
        sequelize,
        modelName:"Blog",
        tableName:"blogs",
        paranoid:true,
        timestamps:true
       }
    )
return Blog
}


