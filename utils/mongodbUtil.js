require('dotenv').config();
const mongoose=require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI_Cluster, {
      tls: true,
      tlsAllowInvalidCertificates: false
      
    });
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err.message);
    process.exit(1);
  }
};

connectDB();

module.exports={connectDB};
