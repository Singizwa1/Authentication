import { UserModal, User } from "./user";
import { BlogModal, Blog } from "./blogModal";
import { CommentModel, Comment } from "./Comment";
import { LikeModel, Like } from "./Like";
import { Sequelize } from "sequelize";

interface Models {
    User: typeof User;
    Blog: typeof Blog;
    Comment: typeof Comment;
    Like: typeof Like;
}

export const AllModal = (sequelize: Sequelize): Models => {
    const models = {
        User: UserModal(sequelize),
        Blog: BlogModal(sequelize),
        Comment: CommentModel(sequelize),
        Like: LikeModel(sequelize)
    };

    // Set up associations
    Object.values(models).forEach(model => {
        if (typeof model.associate === 'function') {
            model.associate(models);
        }
    });

    return models;
}