// server/test-api.js
// এই স্ক্রিপ্টটি একটি স্টুডেন্ট রেজিস্টার করার চেষ্টা করবে

const testRegistration = async () => {
    try {
        const response = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: "Arnab Test",
                email: "test@novum.com",
                password: "password123",
                role: "STUDENT",
                rollNo: "WEB-01",
                
                classId: 1 // আমরা আগেই Class 1 বানিয়েছিলাম Prisma Studio তে? যদি না বানিয়ে থাকেন তবে এটা কাজ করবে না।
            })
        });

        const data = await response.json();
        console.log("Status:", response.status);
        console.log("Response:", data);

    } catch (error) {
        console.error("Error:", error);
    }
};

testRegistration();