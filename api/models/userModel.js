module.exports = (sequelize, DataTypes) => {
    const userAuth = sequelize.define("userAuth", {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      userName: {
        type: DataTypes.STRING,
      },
      name: {
        type: DataTypes.STRING,
      },
      email: {
        type: DataTypes.STRING,
      },
      password: {
        type: DataTypes.STRING,
      },
      phoneNumber: {
        type: DataTypes.STRING,
      },
      userType: {
        type: DataTypes.STRING,
      }
    },
    {
        timestamps: true,
        freezeTableName: true,
    }
    );

    userAuth.sync();
    return userAuth;
};