const { 
  GraphQLObjectType, GraphQLSchema, GraphQLString, 
  GraphQLID, GraphQLList, GraphQLFloat, GraphQLNonNull 
} = require('graphql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/user');
const Employee = require('./models/employee');
const { auth } = require('./middleware/auth');

// Generate JWT Token Function
const generateToken = (user) => {
  return jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// User Type
const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
      id: { type: GraphQLID },
      username: { type: GraphQLString },
      email: { type: GraphQLString }
  })
});

// Employee Type
const EmployeeType = new GraphQLObjectType({
  name: 'Employee',
  fields: () => ({
      id: { type: GraphQLID },
      first_name: { type: GraphQLString },
      last_name: { type: GraphQLString },
      email: { type: GraphQLString },
      gender: { type: GraphQLString },
      designation: { type: GraphQLString },
      salary: { type: GraphQLFloat },
      date_of_joining: { type: GraphQLString },
      department: { type: GraphQLString },
      employee_photo: { type: GraphQLString },
      created_at: { type: GraphQLString }
  })
});

// Root Query
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
      login: {
          type: GraphQLString,
          args: {
              email: { type: new GraphQLNonNull(GraphQLString) },
              password: { type: new GraphQLNonNull(GraphQLString) }
          },
          async resolve(_, args) {
              const user = await User.findOne({ email: args.email });
              if (!user) throw new Error("User not found");

              const isMatch = await bcrypt.compare(args.password, user.password);
              if (!isMatch) throw new Error("Incorrect password");

              return generateToken(user);
          }
      },
      getEmployees: {
          type: new GraphQLList(EmployeeType),
          async resolve(_, __, context) {
              auth(context);
              return await Employee.find();
          }
      },
      searchEmployee: {
          type: EmployeeType,
          args: { id: { type: new GraphQLNonNull(GraphQLID) } },
          async resolve(_, args, context) {
              auth(context);
              return await Employee.findById(args.id);
          }
      },
      searchEmployeeByDesignationOrDept: {
          type: new GraphQLList(EmployeeType),
          args: { designation: { type: GraphQLString }, department: { type: GraphQLString } },
          async resolve(_, args, context) {
              auth(context);
              return await Employee.find({
                  $or: [{ designation: args.designation }, { department: args.department }]
              });
          }
      }
  }
});

// Mutations
const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
      signup: {
          type: GraphQLString,
          args: {
              username: { type: new GraphQLNonNull(GraphQLString) },
              email: { type: new GraphQLNonNull(GraphQLString) },
              password: { type: new GraphQLNonNull(GraphQLString) }
          },
          async resolve(_, args) {
              const existingUser = await User.findOne({ email: args.email });
              if (existingUser) throw new Error("Email is already registered.");

              const hashedPassword = await bcrypt.hash(args.password, 10);
              const newUser = new User({
                  username: args.username,
                  email: args.email,
                  password: hashedPassword
              });

              await newUser.save();
              return generateToken(newUser);
          }
      },
      addEmployee: {
          type: EmployeeType,
          args: {
              first_name: { type: GraphQLString },
              last_name: { type: GraphQLString },
              email: { type: GraphQLString },
              gender: { type: GraphQLString },
              designation: { type: GraphQLString },
              salary: { type: GraphQLFloat },
              date_of_joining: { type: GraphQLString },
              department: { type: GraphQLString },
              employee_photo: { type: GraphQLString }
          },
          async resolve(_, args, context) {
              auth(context);
              return await new Employee({ ...args }).save();
          }
      },
      updateEmployee: {
        type: EmployeeType,
        args: {
            id: { type: new GraphQLNonNull(GraphQLID) },
            first_name: { type: GraphQLString },
            last_name: { type: GraphQLString },
            email: { type: GraphQLString },
            gender: { type: GraphQLString },
            designation: { type: GraphQLString },
            salary: { type: GraphQLFloat },
            date_of_joining: { type: GraphQLString },
            department: { type: GraphQLString },
            employee_photo: { type: GraphQLString }
        },
        async resolve(_, args, context) {
            auth(context); // Ensure user is authenticated
            return await Employee.findByIdAndUpdate(args.id, args, { new: true });
        }
    },    
      deleteEmployee: {
          type: EmployeeType,
          args: { id: { type: new GraphQLNonNull(GraphQLID) } },
          async resolve(_, args, context) {
              auth(context);
              return await Employee.findByIdAndDelete(args.id);
          }
      }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});
