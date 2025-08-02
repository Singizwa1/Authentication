import { Sequelize, Model, DataTypes } from "sequelize";
import { User } from "./user";
import { Blog } from "./blogModal";

interface CommentAttribute {
    id: string;
    content: string;
    userId: string;
    blogId: string;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date | null;
}

export interface CommentCreationAttribute extends Omit<CommentAttribute, 'id'> {
    id?: string;
}

export class Comment extends Model<CommentAttribute, CommentCreationAttribute> implements CommentAttribute {
    public id!: string;
    public content!: string;
    public userId!: string;
    public blogId!: string;
    public createdAt!: Date;
    public updatedAt!: Date;
    public deletedAt!: Date | null;

    public static associate(models: any) {
        Comment.belongsTo(models.User, {
            foreignKey: 'userId',
            as: 'user'
        });
        Comment.belongsTo(models.Blog, {
            foreignKey: 'blogId',
            as: 'blog'
        });
    }
}

export const CommentModel = (sequelize: Sequelize) => {
    Comment.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true
            },
            content: {
                type: DataTypes.TEXT,
                allowNull: false
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
            modelName: "Comment",
            tableName: "comments",
            paranoid: true,
            timestamps: true
        }
    );
    return Comment;
}
