import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Shield, Mail } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { authService } from '../services/api';

export default function Dashboard() {
  const { user, logout, isAdmin } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const response = await authService.getProfile();
      // El usuario ya está en el store
      setLoading(false);
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Mi Plataforma</h1>
            </div>

            <div className="flex items-center gap-6">
              {isAdmin() && (
                <button
                  onClick={() => navigate('/admin')}
                  className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-2"
                >
                  <Shield className="w-5 h-5" />
                  Panel Admin
                </button>
              )}

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Welcome Card */}
          <div className="md:col-span-2 bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Bienvenido, {user?.firstName}! 👋
            </h2>
            <p className="text-gray-600 text-lg">
              Esta es tu área personal donde puedes gestionar tu perfil y acceder a todas tus funcionalidades.
            </p>
          </div>

          {/* User Card */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <User className="w-8 h-8" />
              <span className="px-3 py-1 bg-blue-400 rounded-full text-sm font-semibold capitalize">
                {user?.role}
              </span>
            </div>
            <h3 className="text-xl font-bold mb-2">
              {user?.firstName} {user?.lastName}
            </h3>
            <p className="flex items-center gap-2 text-blue-100">
              <Mail className="w-4 h-4" />
              {user?.email}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-blue-600">✓</div>
            <h3 className="text-gray-700 font-semibold mt-2">Email Verificado</h3>
            <p className="text-gray-500 text-sm mt-1">
              {user?.isEmailVerified ? 'Tu email está verificado' : 'Verifica tu email'}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-green-600">🔒</div>
            <h3 className="text-gray-700 font-semibold mt-2">Seguridad</h3>
            <p className="text-gray-500 text-sm mt-1">Tu cuenta está protegida con JWT</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-purple-600">⚡</div>
            <h3 className="text-gray-700 font-semibold mt-2">API Activa</h3>
            <p className="text-gray-500 text-sm mt-1">Conectado a MongoDB Atlas</p>
          </div>
        </div>
      </div>
    </div>
  );
}