import { Sequelize, Model, DataTypes } from "sequelize";
import { User } from "./user";
import { Blog } from "./blogModal";

interface LikeAttribute {
    id: string;
    userId: string;
    blogId: string;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date | null;
}

export interface LikeCreationAttribute extends Omit<LikeAttribute, 'id'> {
    id?: string;
}

export class Like extends Model<LikeAttribute, LikeCreationAttribute> implements LikeAttribute {
    public id!: string;
    public userId!: string;
    public blogId!: string;
    public createdAt!: Date;
    public updatedAt!: Date;
    public deletedAt!: Date | null;

    public static associate(models: any) {
        Like.belongsTo(models.User, {
            foreignKey: 'userId',
            as: 'user'
        });
        Like.belongsTo(models.Blog, {
            foreignKey: 'blogId',
            as: 'blog'
        });
    }
}

export const LikeModel = (sequelize: Sequelize) => {
    Like.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true
            },
            userId: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id'
                }
            },
            blogId: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: 'blogs',
                    key: 'id'
                }
            },
            createdAt: {
                type: DataTypes.DATE,
                allowNull: false
            },
            updatedAt: {
                type: DataTypes.DATE,
                allowNull: false
            },
            deletedAt: {
                type: DataTypes.DATE,
                allowNull: true
            }
        },
        {
            sequelize,
            modelName: "Like",
            tableName: "likes",
            paranoid: true,
            timestamps: true,
            indexes: [
                {
                    unique: true,
                    fields: ['userId', 'blogId']
                }
            ]
        }
    );
    return Like;
}
