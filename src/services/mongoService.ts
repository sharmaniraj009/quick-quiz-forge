
import { MongoClient, ObjectId } from "mongodb";
import { Quiz } from "../types/quiz";

// MongoDB connection string - in production, you'd store this in an environment variable
const uri = "mongodb+srv://<username>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority";
const client = new MongoClient(uri);

// Database and collection names
const dbName = "quiz_app";
const collectionName = "quizzes";

export type MongoQuiz = Omit<Quiz, "id"> & { _id?: ObjectId };

// Connect to database
export async function connectToMongo() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    return client.db(dbName);
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}

// Get all quizzes
export async function getAllQuizzes(): Promise<Quiz[]> {
  try {
    const db = await connectToMongo();
    const collection = db.collection(collectionName);
    
    const quizzes = await collection.find({}).toArray();
    
    // Convert MongoDB documents to Quiz type (MongoDB uses _id instead of id)
    return quizzes.map((quiz) => ({
      id: quiz._id.toString(),
      title: quiz.title,
      description: quiz.description,
      questions: quiz.questions,
    }));
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    return [];
  }
}

// Get a single quiz by ID
export async function getQuizById(id: string): Promise<Quiz | null> {
  try {
    const db = await connectToMongo();
    const collection = db.collection(collectionName);
    
    const quiz = await collection.findOne({ _id: new ObjectId(id) });
    
    if (!quiz) return null;
    
    return {
      id: quiz._id.toString(),
      title: quiz.title,
      description: quiz.description,
      questions: quiz.questions,
    };
  } catch (error) {
    console.error(`Error fetching quiz with id ${id}:`, error);
    return null;
  }
}

// Add a new quiz
export async function addQuizToDb(quiz: Omit<Quiz, "id">): Promise<string | null> {
  try {
    const db = await connectToMongo();
    const collection = db.collection(collectionName);
    
    const result = await collection.insertOne(quiz);
    return result.insertedId.toString();
  } catch (error) {
    console.error("Error adding quiz:", error);
    return null;
  }
}

// Close MongoDB connection
export async function closeMongoConnection() {
  await client.close();
  console.log("MongoDB connection closed");
}
