// server/controllers/studentController.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// ১. সব স্টুডেন্ট দেখা
export const getStudents = async (req, res) => {
  try {
    const students = await prisma.student.findMany({
      include: {
        user: { select: { name: true, email: true } },
        class: true,
      },
    });
    res.json(students);
  } catch (error) {
    console.error("Get Error:", error);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
};

// ২. আপডেট করা
export const updateStudent = async (req, res) => {
    const { id } = req.params;
    const { name, phone, classId } = req.body;
  
    try {
      const studentId = parseInt(id);

      const existingStudent = await prisma.student.findUnique({
        where: { id: studentId },
      });
  
      if (!existingStudent) {
        return res.status(404).json({ message: "Student not found" });
      }
  
      await prisma.$transaction([
        prisma.user.update({
          where: { id: existingStudent.userId },
          data: { name: name },
        }),
        prisma.student.update({
          where: { id: studentId },
          data: { 
            phone: phone, 
            classId: parseInt(classId) 
          },
        }),
      ]);
  
      res.json({ message: "Updated successfully" });
  
    } catch (error) {
      console.error("Update Error:", error);
      res.status(500).json({ error: 'Update failed' });
    }
};

// ৩. ডিলিট করা
export const deleteStudent = async (req, res) => {
    const { id } = req.params;
  
    try {
      const studentId = parseInt(id);

      const student = await prisma.student.findUnique({
        where: { id: studentId },
      });
  
      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }
  
      await prisma.student.delete({
        where: { id: studentId },
      });

      await prisma.user.delete({
        where: { id: student.userId },
      });
  
      res.json({ message: "Deleted successfully" });
  
    } catch (error) {
      console.error("Delete Error:", error);
      res.status(500).json({ error: 'Delete failed' });
    }
};


// ... আগের ইম্পোর্ট এবং ফাংশনগুলো থাকবে

// ৪. সব ক্লাসের লিস্ট পাওয়ার জন্য (নতুন)
export const getAllClasses = async (req, res) => {
  try {
    const classes = await prisma.class.findMany();
    res.json(classes);
  } catch (error) {
    console.error("Class Fetch Error:", error);
    res.status(500).json({ error: 'Failed to fetch classes' });
  }
};

// export লিস্টে এটা যোগ করুন
// আগে ছিল: export { getStudents, updateStudent, deleteStudent };
// এখন হবে:
// (যেহেতু আমরা export const ব্যবহার করছি, আলাদা করে নিচে না লিখলেও হবে, শুধু ওপরের কোডটুকু বসালেই হবে)


// ... আগের সব কোড থাকবে

// ৫. ড্যাশবোর্ড স্ট্যাটস (নতুন)
export const getDashboardStats = async (req, res) => {
  try {
    // ডাটাবেস থেকে সংখ্যা বের করা
    const totalStudents = await prisma.student.count();
    const totalClasses = await prisma.class.count();
    
    // টিচার বা ইউজার সংখ্যা (অপশনাল)
    const totalTeachers = await prisma.user.count({
        where: { role: 'TEACHER' } // যদি আপনার সিস্টেমে টিচার রোল থাকে
    });

    res.json({
      totalStudents,
      totalClasses,
      totalTeachers
    });

  } catch (error) {
    console.error("Stats Error:", error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
};