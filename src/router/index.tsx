import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';

// Layouts
import { StudentLayout } from '../components/layout/StudentLayout';
import { TeacherLayout } from '../components/layout/TeacherLayout';
import { AdminLayout } from '../components/layout/AdminLayout';

// Public Pages
import { LandingPage } from '../pages/public/LandingPage';
import { LoginPage } from '../pages/public/LoginPage';
import { RegisterPage } from '../pages/public/RegisterPage';

// Student Pages
import { StudentHomePage } from '../pages/student/StudentHomePage';
import { StudentCoursesPage } from '../pages/student/StudentCoursesPage';
import { CourseDetailPage } from '../pages/student/CourseDetailPage';
import { LessonPlayerPage } from '../pages/student/LessonPlayerPage';
import { SpecialtiesPage } from '../pages/student/SpecialtiesPage';
import { SpecialtyDetailPage } from '../pages/student/SpecialtyDetailPage';
import { StudentProgressPage } from '../pages/student/StudentProgressPage';
import { StudentProfilePage } from '../pages/student/StudentProfilePage';

// Teacher Pages
import { TeacherDashboardPage } from '../pages/teacher/TeacherDashboardPage';
import { TeacherLessonsPage } from '../pages/teacher/TeacherLessonsPage';
import { TeacherNewLessonPage } from '../pages/teacher/TeacherNewLessonPage';
import { TeacherCoursesPage } from '../pages/teacher/TeacherCoursesPage';
import { TeacherStudentsPage } from '../pages/teacher/TeacherStudentsPage';
import { TeacherProfilePage } from '../pages/teacher/TeacherProfilePage';

// Admin Pages
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage';
import { AdminStudentsPage } from '../pages/admin/AdminStudentsPage';
import { AdminTeachersPage } from '../pages/admin/AdminTeachersPage';
import { AdminCoursesPage } from '../pages/admin/AdminCoursesPage';
import { AdminLessonsPage } from '../pages/admin/AdminLessonsPage';
import { AdminCategoriesPage } from '../pages/admin/AdminCategoriesPage';
import { AdminReportsPage } from '../pages/admin/AdminReportsPage';
import { AdminSettingsPage } from '../pages/admin/AdminSettingsPage';

export const AppRouter: React.FC = () => {
  return (
    <Routes>
      {/* Rotas Públicas */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Portal do Aluno (Protegido para Aluno, mas acessível também para teste de outros perfis) */}
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <StudentLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<StudentHomePage />} />
        <Route path="cursos" element={<StudentCoursesPage />} />
        <Route path="cursos/:id" element={<CourseDetailPage />} />
        <Route path="aula/:id" element={<LessonPlayerPage />} />
        <Route path="especialidades" element={<SpecialtiesPage />} />
        <Route path="especialidades/:slug" element={<SpecialtyDetailPage />} />
        <Route path="progresso" element={<StudentProgressPage />} />
        <Route path="perfil" element={<StudentProfilePage />} />
      </Route>

      {/* Portal do Professor (Protegido para Professor e Admin) */}
      <Route
        path="/teacher"
        element={
          <ProtectedRoute allowedRoles={['teacher', 'admin']}>
            <TeacherLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<TeacherDashboardPage />} />
        <Route path="aulas" element={<TeacherLessonsPage />} />
        <Route path="aulas/nova" element={<TeacherNewLessonPage />} />
        <Route path="cursos" element={<TeacherCoursesPage />} />
        <Route path="alunos" element={<TeacherStudentsPage />} />
        <Route path="perfil" element={<TeacherProfilePage />} />
      </Route>

      {/* Portal do Super Administrador (Protegido para Admin) */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboardPage />} />
        <Route path="alunos" element={<AdminStudentsPage />} />
        <Route path="professores" element={<AdminTeachersPage />} />
        <Route path="cursos" element={<AdminCoursesPage />} />
        <Route path="aulas" element={<AdminLessonsPage />} />
        <Route path="categorias" element={<AdminCategoriesPage />} />
        <Route path="relatorios" element={<AdminReportsPage />} />
        <Route path="configuracoes" element={<AdminSettingsPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
