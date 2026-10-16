import dotenv from 'dotenv'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import User from './models/User.js'

dotenv.config()

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log('✅ MongoDB Connected')
    } catch (error) {
        console.error('❌ Connection failed:', error.message)
        process.exit(1)
    }
}

const seedUsers = async () => {
    console.log('🌱 Starting seed...')

    await connectDB()

    // Delete existing users
    await User.deleteMany()
    console.log('🗑️  Cleared existing users')

    // Hash password
    const salt = await bcrypt.genSalt(12)
    const hashedPassword = await bcrypt.hash('admin123', salt)
    const teacherPass = await bcrypt.hash('teacher123', salt)
    const studentPass = await bcrypt.hash('student123', salt)
    const parentPass = await bcrypt.hash('parent123', salt)

    // Create demo users
    const users = await User.create([
        {
            name: 'Super Admin',
            email: 'admin@school.com',
            password: hashedPassword,
            role: 'admin'
        },
        {
            name: 'Demo Teacher',
            email: 'teacher@school.com',
            password: teacherPass,
            role: 'teacher'
        },
        {
            name: 'Demo Student',
            email: 'student@school.com',
            password: studentPass,
            role: 'student'
        },
        {
            name: 'Demo Parent',
            email: 'parent@school.com',
            password: parentPass,
            role: 'parent'
        }
    ])

    console.log('')
    console.log('✅ Users created successfully!')
    console.log('')
    console.log('═══════════════════════════════════════')
    console.log('📋 LOGIN CREDENTIALS')
    console.log('═══════════════════════════════════════')
    console.log('👑 ADMIN')
    console.log('   Email    : admin@school.com')
    console.log('   Password : admin123')
    console.log('')
    console.log('👨‍🏫 TEACHER')
    console.log('   Email    : teacher@school.com')
    console.log('   Password : teacher123')
    console.log('')
    console.log('🎓 STUDENT')
    console.log('   Email    : student@school.com')
    console.log('   Password : student123')
    console.log('')
    console.log('👪 PARENT')
    console.log('   Email    : parent@school.com')
    console.log('   Password : parent123')
    console.log('═══════════════════════════════════════')

    process.exit(0)
}

seedUsers().catch((error) => {
    console.error('❌ Seed failed:', error)
    process.exit(1)
})