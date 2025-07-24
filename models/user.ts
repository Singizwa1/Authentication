import { Sequelize,Model,DataTypes } from "sequelize";

interface UserAttribute{
  id:string,
  name:string,
  email:string,
  password:string,
  role:string,
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
    public deletedAt!: Date|null;
    public createdAt: Date = new Date;
    public name!: string;

    public association(modal: any) {
        
    }
    public toJSON(): object | UserAttribute {
        return {
            id: this.id,
            name: this.name,
            email: this.email,
            password: this.password,
            gender: this.gender,
            role: this.role,
            updateAt: this.updateAt,
            createdAt: this.createdAt
        }
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