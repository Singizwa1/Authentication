import { Sequelize,Model,DataTypes } from "sequelize";

interface UserAttribute{
  id:string,
  name:string,
  email:string,
  password:string,
  role:string,
  googleId?:string,
  photo?:string,
  lastLogin?:Date,
  gender:'male'|'female'|'other',
  CreatedAt?:Date,
  UpdatedAt?:Date,
  deletedAt:Date|null
}

export interface UserCreationAttribute extends Omit<UserAttribute, 'id'> {
    id?: string
}

export class User extends Model<UserAttribute, UserCreationAttribute> implements UserAttribute {
    public id!: string;
    public email!: string;
    public password!: string;
    public role!: string;
    public gender!: "male" | "female" | "other";
    public updateAt!: Date;
    public googleId!: string;
    public photo!: string ;
    public lastLogin!: Date 
    public deletedAt!: Date|null;
    public createdAt: Date = new Date;
    public name!: string;

    public static associate(models: any) {
        User.hasMany(models.Blog, {
            foreignKey: 'author',
            sourceKey: 'email',
            as: 'blogs'
        });
        User.hasMany(models.Comment, {
            foreignKey: 'userId',
            as: 'comments'
        });
        User.hasMany(models.Like, {
            foreignKey: 'userId',
            as: 'likes'
        });
    }
    public toJSON(): Omit<UserAttribute, "password"> {
    const { password, ...values } = this.get();
    return values;
  }
    }

    export const  UserModal=(sequelize:Sequelize)=>{
      User.init({
        id:{
          type:DataTypes.UUID,
          defaultValue:DataTypes.UUIDV4,
          primaryKey:true

        },
        email:{
          type:DataTypes.STRING,
          unique:true,

        },
        password:{
        type:DataTypes.STRING

        },
        name:{
          type:DataTypes.STRING
        },
        role:{
          type:DataTypes.STRING
        },
        gender:{
          type:DataTypes.ENUM('male','female','other')
        },
         googleId: {                 
      type: DataTypes.STRING,
      allowNull: true,
      unique: true
    },
    photo: {                   
      type: DataTypes.STRING,
      allowNull: true
    },
    lastLogin: {                
      type: DataTypes.DATE,
      allowNull: true
    },
         deletedAt: {
        type: DataTypes.DATE,
      },
      },
        {
          sequelize,
        'timestamps': true,
        'modelName': "User",
        'tableName': 'users',
        'paranoid':true
        
        }


      )
      return User

    }