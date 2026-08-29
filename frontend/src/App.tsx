import { Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import { AppDataProvider } from './context/AppDataContext'
import { RequireAuth } from './components/auth/RequireAuth'
import { AppShell } from './components/layout/AppShell'
import { LandingPage } from './pages/LandingPage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { OrganizationRegisterPage } from './pages/OrganizationRegisterPage'
import { DonorDashboard } from './pages/donor/DonorDashboard'
import { DonorAvailabilityPage } from './pages/donor/DonorAvailabilityPage'
import { DonorRequestsPage } from './pages/donor/DonorRequestsPage'
import { DonorRequestDetailPage } from './pages/donor/DonorRequestDetailPage'
import { DonorProfilePage } from './pages/donor/DonorProfilePage'
import { DonorNotificationsPage } from './pages/donor/DonorNotificationsPage'
import { DonorHistoryPage } from './pages/donor/DonorHistoryPage'
import { RecipientDashboard } from './pages/recipient/RecipientDashboard'
import { BloodRequestPage } from './pages/recipient/BloodRequestPage'
import { RecipientRequestsPage } from './pages/recipient/RecipientRequestsPage'
import { RecipientMatchesPage } from './pages/recipient/RecipientMatchesPage'
import { RecipientNotificationsPage } from './pages/recipient/RecipientNotificationsPage'
import { HospitalDashboard } from './pages/hospital/HospitalDashboard'
import { HospitalRequestsPage } from './pages/hospital/HospitalRequestsPage'
import { HospitalStockPage } from './pages/hospital/HospitalStockPage'
import { HospitalFindDonorsPage } from './pages/hospital/HospitalFindDonorsPage'
import { HospitalNotificationsPage } from './pages/hospital/HospitalNotificationsPage'
import { BloodBankDashboard } from './pages/bloodbank/BloodBankDashboard'
import { BloodBankStockPage } from './pages/bloodbank/BloodBankStockPage'
import { BloodBankRequestsPage } from './pages/bloodbank/BloodBankRequestsPage'
import { BloodBankDonationsPage } from './pages/bloodbank/BloodBankDonationsPage'
import { BloodBankReportsPage } from './pages/bloodbank/BloodBankReportsPage'
import { AdminDashboard } from './pages/admin/AdminDashboard'
import { AdminVerifyListPage } from './pages/admin/AdminVerifyListPage'
import { AdminVerifyDetailPage } from './pages/admin/AdminVerifyDetailPage'
import { AdminUsersPage } from './pages/admin/AdminUsersPage'
import { AdminReportsPage } from './pages/admin/AdminReportsPage'
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/organization/register" element={<OrganizationRegisterPage />} />

      <Route
        element={
          <RequireAuth roles={['DONOR']}>
            <AppShell />
          </RequireAuth>
        }
      >
        <Route path="/donor" element={<DonorDashboard />} />
        <Route path="/donor/profile" element={<DonorProfilePage />} />
        <Route path="/donor/availability" element={<DonorAvailabilityPage />} />
        <Route path="/donor/requests" element={<DonorRequestsPage />} />
        <Route path="/donor/requests/:id" element={<DonorRequestDetailPage />} />
        <Route path="/donor/notifications" element={<DonorNotificationsPage />} />
        <Route path="/donor/history" element={<DonorHistoryPage />} />
      </Route>

      <Route
        element={
          <RequireAuth roles={['RECIPIENT']}>
            <AppShell />
          </RequireAuth>
        }
      >
        <Route path="/recipient" element={<RecipientDashboard />} />
        <Route path="/recipient/request" element={<BloodRequestPage />} />
        <Route path="/recipient/requests" element={<RecipientRequestsPage />} />
        <Route path="/recipient/matches" element={<RecipientMatchesPage />} />
        <Route path="/recipient/notifications" element={<RecipientNotificationsPage />} />
      </Route>

      <Route
        element={
          <RequireAuth roles={['HOSPITAL']}>
            <AppShell />
          </RequireAuth>
        }
      >
        <Route path="/hospital" element={<HospitalDashboard />} />
        <Route path="/hospital/requests" element={<HospitalRequestsPage />} />
        <Route path="/hospital/stock" element={<HospitalStockPage />} />
        <Route path="/hospital/donors" element={<HospitalFindDonorsPage />} />
        <Route path="/hospital/notifications" element={<HospitalNotificationsPage />} />
      </Route>

      <Route
        element={
          <RequireAuth roles={['BLOOD_BANK']}>
            <AppShell />
          </RequireAuth>
        }
      >
        <Route path="/blood-bank" element={<BloodBankDashboard />} />
        <Route path="/blood-bank/stock" element={<BloodBankStockPage />} />
        <Route path="/blood-bank/requests" element={<BloodBankRequestsPage />} />
        <Route path="/blood-bank/donations" element={<BloodBankDonationsPage />} />
        <Route path="/blood-bank/reports" element={<BloodBankReportsPage />} />
      </Route>

      <Route
        element={
          <RequireAuth roles={['ADMIN']}>
            <AppShell />
          </RequireAuth>
        }
      >
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/verify" element={<AdminVerifyListPage />} />
        <Route path="/admin/verify/:id" element={<AdminVerifyDetailPage />} />
        <Route path="/admin/users" element={<AdminUsersPage />} />
        <Route path="/admin/reports" element={<AdminReportsPage />} />
        <Route path="/admin/settings" element={<AdminSettingsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppDataProvider>
        <ToastProvider>
          <AppRoutes />
        </ToastProvider>
      </AppDataProvider>
    </AuthProvider>
  )
}
