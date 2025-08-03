import { Model, DataTypes, Optional ,Sequelize} from 'sequelize';

import { v4 as uuidv4 } from 'uuid';

interface SubscriberAttributes {
  id?: string;
  email: string;
  unsubscribeToken?: string;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SubscriberInput extends Optional<SubscriberAttributes, 'id' | 'unsubscribeToken' | 'isActive'> {}
export interface SubscriberOutput extends Required<SubscriberAttributes> {}

export class Subscriber extends Model<SubscriberAttributes, SubscriberInput> implements SubscriberAttributes {
  public id!: string;
  public email!: string;
  public unsubscribeToken!: string;
  public isActive!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  
  static associate: (models: any) => void;
}

export const SubscribeModal = (sequelize: Sequelize) => {
  Subscriber.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    unsubscribeToken: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      unique: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: 'Subscriber',
    tableName: 'subscribers',
  }
);

  
  Subscriber.associate = function(models: any) {
    // Add any associations here if needed
    // For example, if you want to track which user subscribed:
    // Subscriber.belongsTo(models.User, { foreignKey: 'userId' });
  };

  return Subscriber;
}
