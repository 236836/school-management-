// frontend/src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster }       from 'react-hot-toast';
import { AuthProvider }  from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute    from './components/common/ProtectedRoute';
import DashboardLayout   from './layouts/DashboardLayout';

// ── Auth Pages ────────────────────────────────────────────
import RoleSelection  from './pages/RoleSelection';
import RoleLogin      from './pages/RoleLogin';
import Register       from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import NotFound       from './pages/NotFound';
import Unauthorized   from './pages/Unauthorized';
import ProfilePage    from './pages/ProfilePage';

// ── Admin Pages ───────────────────────────────────────────
import AdminDashboard    from './components/admin/AdminDashboard';
import StudentsPage      from './components/admin/StudentsPage';
import TeachersPage      from './components/admin/TeachersPage';
import ClassesPage       from './components/admin/ClassesPage';
import SubjectsPage      from './components/admin/SubjectsPage';
import FeesPage          from './components/admin/FeesPage';
import NoticesPage       from './components/admin/NoticesPage';
import AttendanceReports from './components/admin/AttendanceReports';
import ReportsPage       from './components/admin/ReportsPage';

// ── Teacher Pages ─────────────────────────────────────────
import TeacherDashboard   from './components/teacher/TeacherDashboard';
import TeacherAttendance  from './components/teacher/AttendancePage';
import TeacherAssignments from './components/teacher/AssignmentsPage';
import MyClassesPage      from './components/teacher/MyClassesPage';
import TeacherNoticesPage from './components/teacher/TeacherNoticesPage';

// ── Student Pages ─────────────────────────────────────────
import StudentDashboard   from './components/student/StudentDashboard';
import StudentAttendance  from './components/student/AttendancePage';
import StudentAssignments from './components/student/AssignmentsPage';
import StudentFees        from './components/student/FeesPage';
import StudentNotices     from './components/student/NoticesPage';

// ── Parent Pages ──────────────────────────────────────────
import ParentDashboard   from './components/parent/ParentDashboard';
import ChildrenPage      from './components/parent/ChildrenPage';
import ParentFeesPage    from './components/parent/ParentFeesPage';
import ParentNoticesPage from './components/parent/ParentNoticesPage';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                borderRadius: '12px',
                fontFamily:   'Plus Jakarta Sans, sans-serif',
                fontSize:     '14px',
                fontWeight:   '500',
              },
              success: {
                iconTheme: { primary: '#10B981', secondary: 'white' },
              },
              error: {
                iconTheme: { primary: '#EF4444', secondary: 'white' },
              },
            }}
          />

          <Routes>
            {/* ═══ PUBLIC ROUTES ══════════════════════════ */}

            {/* Landing page - Role Selection */}
            <Route path="/" element={<RoleSelection />} />

            {/* Role-specific login (dynamic) */}
            <Route path="/login/:roleId" element={<RoleLogin />} />

            {/* Register + Forgot Password */}
            <Route path="/register"        element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Unauthorized page */}
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* ═══ SHARED (any logged-in user) ═══════════ */}
            <Route element={
              <ProtectedRoute
                allowedRoles={['admin','teacher','student','parent']}
              />
            }>
              <Route element={<DashboardLayout />}>
                <Route path="/profile" element={<ProfilePage />} />
              </Route>
            </Route>

            {/* ═══ ADMIN ROUTES ═══════════════════════════ */}
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route element={<DashboardLayout />}>
                <Route path="/admin/dashboard"  element={<AdminDashboard />}    />
                <Route path="/admin/students"   element={<StudentsPage />}      />
                <Route path="/admin/teachers"   element={<TeachersPage />}      />
                <Route path="/admin/classes"    element={<ClassesPage />}       />
                <Route path="/admin/subjects"   element={<SubjectsPage />}      />
                <Route path="/admin/fees"       element={<FeesPage />}          />
                <Route path="/admin/notices"    element={<NoticesPage />}       />
                <Route path="/admin/attendance" element={<AttendanceReports />} />
                <Route path="/admin/reports"    element={<ReportsPage />}       />
              </Route>
            </Route>

            {/* ═══ TEACHER ROUTES ═════════════════════════ */}
            <Route element={<ProtectedRoute allowedRoles={['teacher']} />}>
              <Route element={<DashboardLayout />}>
                <Route path="/teacher/dashboard"   element={<TeacherDashboard />}   />
                <Route path="/teacher/attendance"  element={<TeacherAttendance />}  />
                <Route path="/teacher/assignments" element={<TeacherAssignments />} />
                <Route path="/teacher/classes"     element={<MyClassesPage />}      />
                <Route path="/teacher/notices"     element={<TeacherNoticesPage />} />
              </Route>
            </Route>

            {/* ═══ STUDENT ROUTES ═════════════════════════ */}
            <Route element={<ProtectedRoute allowedRoles={['student']} />}>
              <Route element={<DashboardLayout />}>
                <Route path="/student/dashboard"   element={<StudentDashboard />}   />
                <Route path="/student/attendance"  element={<StudentAttendance />}  />
                <Route path="/student/assignments" element={<StudentAssignments />} />
                <Route path="/student/fees"        element={<StudentFees />}        />
                <Route path="/student/notices"     element={<StudentNotices />}     />
              </Route>
            </Route>

            {/* ═══ PARENT ROUTES ══════════════════════════ */}
            <Route element={<ProtectedRoute allowedRoles={['parent']} />}>
              <Route element={<DashboardLayout />}>
                <Route path="/parent/dashboard" element={<ParentDashboard />}    />
                <Route path="/parent/children"  element={<ChildrenPage />}       />
                <Route path="/parent/fees"      element={<ParentFeesPage />}     />
                <Route path="/parent/notices"   element={<ParentNoticesPage />}  />
              </Route>
            </Route>

            {/* ═══ REDIRECTS ══════════════════════════════ */}
            {/* Old /login → redirect to role selection */}
            <Route path="/login" element={<Navigate to="/" replace />} />

            {/* ═══ 404 ════════════════════════════════════ */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;