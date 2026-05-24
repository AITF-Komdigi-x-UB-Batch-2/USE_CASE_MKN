import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, BarChart3, BrainCircuit, ChevronRight, Activity, Users, MapPin } from 'lucide-react';
import logoJatim from '../../assets/Lambang_Provinsi_Jawa_Timur.svg';
import './Landing.css';

const Landing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-200">

      {/* Navigation Header */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo Section */}
            <div className="flex items-center gap-3">
              <img src={logoJatim} alt="Logo Jatim" className="h-10 w-auto" />
              <div className="hidden sm:block">
                <h1 className="text-sm font-bold text-slate-800 leading-tight">Asisten Jatim Sosial</h1>
                <p className="text-xs text-slate-500 font-medium">DISKOMINFO JAWA TIMUR</p>
              </div>
            </div>

            {/* Login Action */}
            <button
              onClick={() => navigate('/login')}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-all hover:scale-105 active:scale-95 shadow-md"
            >
              <ShieldCheck size={18} />
              Portal Petugas
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main>
        <section className="relative px-4 pt-24 pb-32 sm:px-6 lg:px-8 lg:pt-32 lg:pb-40 overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
            <div className="hero-gradient-blob"></div>
          </div>

          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold tracking-wide uppercase mb-6 border border-blue-100">
              <Activity size={14} /> Sistem Beroperasi Aktif
            </span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 mb-8 leading-tight">
              Mewujudkan Jawa Timur Sejahtera dengan <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-600">Presisi Data AI</span>
            </h2>
            <p className="mt-4 max-w-2xl text-lg sm:text-xl text-slate-600 mx-auto mb-10 leading-relaxed">
              Platform terpadu untuk percepatan validasi dan pemetaan prioritas bantuan sosial berbasis Artificial Intelligence (AI) di seluruh wilayah Provinsi Jawa Timur.
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => navigate('/login')}
                className="group flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl text-base font-semibold transition-all hover:scale-105 shadow-lg hover:shadow-blue-500/30"
              >
                Masuk ke Dasbor AI
                <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20 bg-slate-900 text-white relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h3 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-4">Infrastruktur AI Pintar</h3>
              <p className="text-slate-400 max-w-2xl mx-auto">Kami mengintegrasikan teknologi machine learning terkini untuk mencegah tumpang tindih data penerima bantuan.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

              {/* Feature 1 */}
              <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700 transition-all hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-900/50">
                <div className="h-12 w-12 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400 mb-6">
                  <BarChart3 size={24} />
                </div>
                <h4 className="text-xl font-bold mb-3">Klasifikasi Desil</h4>
                <p className="text-slate-400 leading-relaxed">
                  Menentukan skor prioritas berdasarkan 14 kriteria makroekonomi rumah tangga dengan tingkat akurasi statistik sangat tinggi.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700 transition-all hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-900/50">
                <div className="h-12 w-12 bg-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400 mb-6">
                  <MapPin size={24} />
                </div>
                <h4 className="text-xl font-bold mb-3">Analisis Rutilahu</h4>
                <p className="text-slate-400 leading-relaxed">
                  Verifikasi visual otomatis menggunakan computer vision untuk menilai kelayakan fisik bangunan (Rumah Tidak Layak Huni).
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700 transition-all hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-900/50">
                <div className="h-12 w-12 bg-purple-500/20 rounded-xl flex items-center justify-center text-purple-400 mb-6">
                  <BrainCircuit size={24} />
                </div>
                <h4 className="text-xl font-bold mb-3">Rekomendasi Kebijakan</h4>
                <p className="text-slate-400 leading-relaxed">
                  Sistem AI generatif yang menyarankan alokasi bantuan sosial paling tepat sasaran (*PKH, BPNT, BLT*) untuk setiap rumah tangga.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* Public Stats Section */}
        <section className="py-20 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-3xl font-bold text-slate-900 mb-6">Kawal Intervensi Sosial Bersama</h3>
                <p className="text-slate-600 mb-8 leading-relaxed">
                  Platform ini telah merevolusi cara Pemerintah Provinsi Jawa Timur memilah data. Tingkat efisiensi penargetan (targeting accuracy) diproyeksikan terus meningkat setiap kuartal laporan.
                </p>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold text-slate-700">Progres Pemetaan Wilayah Kuartal II</span>
                      <span className="text-blue-600 font-bold">78%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2.5">
                      <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '78%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-sm text-center transform transition duration-300 hover:scale-105">
                  <Users className="mx-auto text-blue-600 mb-4" size={32} />
                  <div className="text-4xl font-extrabold text-slate-900 mb-2">84.2K</div>
                  <div className="text-sm font-medium text-slate-500 uppercase tracking-wide">Keluarga Terdata</div>
                </div>

                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-sm text-center transform transition duration-300 hover:scale-105">
                  <ShieldCheck className="mx-auto text-green-500 mb-4" size={32} />
                  <div className="text-4xl font-extrabold text-slate-900 mb-2">61.5K</div>
                  <div className="text-sm font-medium text-slate-500 uppercase tracking-wide">Validasi AI</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-50 py-10 text-center">
        <p className="text-slate-400 text-sm">
          &copy; {new Date().getFullYear()} Dinas Komunikasi dan Informatika Provinsi Jawa Timur.<br />
          Sistem Pendukung Keputusan.
        </p>
      </footer>
    </div>
  );
};

export default Landing;
