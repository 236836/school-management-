// ── Import Images ──────────────────────────────────────
import superAdminImage from '../assets/auth/super-admin.jpg'
import teacherImage from '../assets/auth/teacher.jpg'
import studentImage from '../assets/auth/student.jpg'
import parentsImage from '../assets/auth/parents.jpg'
import schoolLogo from '../assets/auth/School-system.jpg'

// ── Import Icons ───────────────────────────────────────
import {
    ShieldCheck,
    GraduationCap,
    BookOpen,
    Users
} from 'lucide-react'

// ── School Info ────────────────────────────────────────
export const schoolInfo = {
    name: 'FAST School Management System',
    short: 'FAST School',
    logo: schoolLogo
}

// ── Role Configuration ─────────────────────────────────
export const roleConfig = {
    admin: {
        id: 'admin',
        title: 'Super Admin',
        description: 'Manage your entire school from one powerful dashboard.',
        image: superAdminImage,
        icon: ShieldCheck,
        gradient: 'from-purple-900/80 via-purple-700/50 to-transparent',
        accent: '#8B5CF6',
        accentLight: '#EDE9FE',
        heading: 'Welcome back, Admin!',
        subtitle: 'Manage your entire school with powerful tools and complete control.',
        button: 'Sign in as Admin',
        dashboardPath: '/admin/dashboard',
        demo: {
            email: 'admin@school.com',
            password: 'admin123'
        }
    },

    teacher: {
        id: 'teacher',
        title: 'Teacher',
        description: 'Manage your classes, attendance and assignments.',
        image: teacherImage,
        icon: GraduationCap,
        gradient: 'from-blue-900/80 via-blue-700/50 to-transparent',
        accent: '#0EA5E9',
        accentLight: '#E0F2FE',
        heading: 'Welcome back, Teacher!',
        subtitle: 'Manage your classes, mark attendance, and share knowledge.',
        button: 'Sign in as Teacher',
        dashboardPath: '/teacher/dashboard',
        demo: {
            email: 'teacher@school.com',
            password: 'teacher123'
        }
    },

    student: {
        id: 'student',
        title: 'Student',
        description: 'Track your classes, attendance and academic progress.',
        image: studentImage,
        icon: BookOpen,
        gradient: 'from-emerald-900/80 via-emerald-700/50 to-transparent',
        accent: '#10B981',
        accentLight: '#D1FAE5',
        heading: 'Welcome back, Student!',
        subtitle: 'Access your classes, assignments, and track your progress.',
        button: 'Sign in as Student',
        dashboardPath: '/student/dashboard',
        demo: {
            email: 'student@school.com',
            password: 'student123'
        }
    },

    parent: {
        id: 'parent',
        title: 'Parent',
        description: "Stay connected with your child's academic journey.",
        image: parentsImage,
        icon: Users,
        gradient: 'from-pink-900/80 via-pink-700/50 to-transparent',
        accent: '#EC4899',
        accentLight: '#FCE7F3',
        heading: 'Welcome back, Parent!',
        subtitle: "Stay updated with your child's academic progress and school activities.",
        button: 'Sign in as Parent',
        dashboardPath: '/parent/dashboard',
        demo: {
            email: 'parent@school.com',
            password: 'parent123'
        }
    }
}