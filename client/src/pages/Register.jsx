import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { registerSchema } from 'shared';
import { zodResolver } from '@hookform/resolvers/zod';
import api from '../services/api';
import { Spinner } from '../components/ui/Spinner';
import { UserPlus } from 'lucide-react';

export const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema)
  });

  const password = watch('password');
  
  const getPasswordStrength = (pass) => {
    if (!pass) return 0;
    let strength = 0;
    if (pass.length >= 8) strength++;
    if (pass.match(/[a-z]+/)) strength++;
    if (pass.match(/[A-Z]+/)) strength++;
    if (pass.match(/[0-9]+/)) strength++;
    return strength;
  };

  const strength = getPasswordStrength(password);
  
  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const res = await api.post('/auth/register', data);
      login(res.data.token, res.data.user);
      showToast({ type: 'success', title: 'Account created!', message: 'Welcome to Feedbak.' });
      navigate('/dashboard');
    } catch (err) {
      showToast({ type: 'error', title: 'Registration Failed', message: err.response?.data?.error || 'Could not register.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50 flex-col justify-center sm:px-6 lg:px-8 py-12">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="text-3xl font-display font-bold text-primary-600 tracking-tight">Feedbak.</Link>
        <h2 className="mt-6 text-center text-3xl font-display font-bold text-gray-900">Create your account</h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div className="bg-white py-12 px-8 shadow-xl border border-gray-100 sm:rounded-2xl">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="block text-sm font-medium leading-6 text-gray-900">Full Name</label>
              <div className="mt-2">
                <input
                  {...register('name')}
                  type="text"
                  className={`block w-full rounded-lg border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ${errors.name ? 'ring-red-300 focus:ring-red-500' : 'ring-gray-300 focus:ring-primary-600'} placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 px-3 transition-shadow`}
                />
                {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium leading-6 text-gray-900">Email address</label>
              <div className="mt-2">
                <input
                  {...register('email')}
                  type="email"
                  className={`block w-full rounded-lg border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ${errors.email ? 'ring-red-300 focus:ring-red-500' : 'ring-gray-300 focus:ring-primary-600'} placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 px-3 transition-shadow`}
                />
                {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium leading-6 text-gray-900">Password</label>
              <div className="mt-2">
                <input
                  {...register('password')}
                  type="password"
                  className={`block w-full rounded-lg border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ${errors.password ? 'ring-red-300 focus:ring-red-500' : 'ring-gray-300 focus:ring-primary-600'} placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 px-3 transition-shadow`}
                />
                {password && (
                  <div className="mt-2 flex space-x-1">
                    {[1,2,3,4].map(i => (
                      <div key={i} className={`h-1.5 w-full rounded-full ${i <= strength ? (strength <= 2 ? 'bg-orange-400' : strength === 3 ? 'bg-yellow-400' : 'bg-green-500') : 'bg-gray-200'}`} />
                    ))}
                  </div>
                )}
                {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="flex w-full justify-center rounded-xl bg-primary-600 px-3 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading ? <Spinner size={20} className="text-white" /> : (
                  <>
                    <UserPlus className="w-5 h-5 mr-2" /> Register
                  </>
                )}
              </button>
            </div>
          </form>

          <p className="mt-8 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold leading-6 text-primary-600 hover:text-primary-500 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
